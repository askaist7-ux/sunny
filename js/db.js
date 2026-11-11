/* 데이터/인증 레이어 : Firebase(실서비스) ↔ localStorage(체험 모드) 자동 전환 */
(function(){
  const S = window.SUNNY = window.SUNNY || {};
  const cfg = window.SUNNY_FIREBASE || {};
  const live = !!(cfg.apiKey && !/^YOUR_/.test(cfg.apiKey));
  S.live = live;
  let fb = null;
  const V = '10.12.2';
  const loadScript = src => new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)});
  const ready = live
    ? ['app','auth','firestore','storage'].reduce((p,n)=>p.then(()=>loadScript(`https://www.gstatic.com/firebasejs/${V}/firebase-${n}-compat.js`)),Promise.resolve())
        .then(()=>{ firebase.initializeApp(cfg); fb={auth:firebase.auth(),db:firebase.firestore(),st:firebase.storage()}; })
        .catch(e=>{ console.error('Firebase 로드 실패 → 체험 모드', e); S.live=false; })
    : Promise.resolve();
  S.ready = ready;

  const ls = {
    get:(k,d)=>{try{const v=localStorage.getItem('sunny:'+k);return v?JSON.parse(v):d}catch(e){return d}},
    set:(k,v)=>{try{localStorage.setItem('sunny:'+k,JSON.stringify(v))}catch(e){console.warn(e)}}
  };
  const defaults = col => col==='products'?S.PRODUCTS.map(p=>({...p})) : col==='lectures'?S.sampleLectures() : [];

  /* ---------------- DB ---------------- */
  const DB = S.DB = {
    async list(col){
      await ready;
      if(col==='users'&&!S.live) return ls.get('users',[]).map(({pw,...u})=>u);
      if(S.live){
        const snap = await fb.db.collection(col).get();
        const arr = snap.docs.map(d=>({id:d.id,...d.data()}));
        if(!arr.length && (col==='products'||col==='lectures')) return defaults(col);
        return arr;
      }
      let a = ls.get('db:'+col, null);
      if(a===null){ a = defaults(col); if(col==='products'||col==='lectures') ls.set('db:'+col,a); }
      return a;
    },
    async get(col,id){ const a=await this.list(col); return a.find(x=>x.id===id)||null; },
    async set(col,id,data){
      await ready; data={...data}; delete data.id;
      if(S.live){ await fb.db.collection(col).doc(id).set(data,{merge:true}); return id; }
      const a = await this.list(col); const i=a.findIndex(x=>x.id===id);
      if(i>=0) a[i]={...a[i],...data,id}; else a.push({...data,id});
      ls.set('db:'+col,a); return id;
    },
    async add(col,data){
      await ready; data={...data}; delete data.id;
      if(S.live){ const r=await fb.db.collection(col).add(data); return r.id; }
      const id = col[0]+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
      const a = ls.get('db:'+col,[]); a.push({...data,id}); ls.set('db:'+col,a); return id;
    },
    async del(col,id){
      await ready;
      if(S.live){ await fb.db.collection(col).doc(id).delete(); return; }
      ls.set('db:'+col,(await this.list(col)).filter(x=>x.id!==id));
    },
    async settings(){
      await ready; let s={};
      try{
        if(S.live){ const d=await fb.db.collection('settings').doc('site').get(); s=d.exists?d.data():{}; }
        else s=ls.get('settings',{});
      }catch(e){}
      return {...S.SITE_DEFAULT,...s};
    },
    async saveSettings(s){ await ready; if(S.live) await fb.db.collection('settings').doc('site').set(s,{merge:true}); else ls.set('settings',{...ls.get('settings',{}),...s}); },
    async seed(){ // 기본 상품/일정을 DB에 저장
      for(const p of S.PRODUCTS) await this.set('products',p.id,p);
      for(const l of S.sampleLectures()) await this.set('lectures',l.id,l);
    },
    async upload(file){
      await ready;
      if(S.live){
        const ref = fb.st.ref('products/'+Date.now()+'-'+file.name.replace(/[^\w.\-]/g,'_'));
        await ref.put(file); return ref.getDownloadURL();
      }
      return new Promise((res,rej)=>{ // 체험 모드: 축소 후 dataURL
        const img=new Image(), r=new FileReader();
        r.onload=()=>{img.onload=()=>{const m=800,k=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=img.width*k;c.height=img.height*k;c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};img.onerror=rej;img.src=r.result};
        r.onerror=rej; r.readAsDataURL(file);
      });
    }
  };

  /* ---------------- Auth ---------------- */
  const listeners=[]; let current=null;
  const emit=()=>listeners.forEach(f=>{try{f(current)}catch(e){console.error(e)}});
  const hash = async s => { try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('sunny::'+s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(s)))} };
  const isDemoAdmin = e => (e||'').toLowerCase()===(window.SUNNY_DEMO_ADMIN_EMAIL||'').toLowerCase();
  const errMsg = e => {
    const m={ 'auth/email-already-in-use':'이미 가입된 이메일이에요.','auth/invalid-email':'이메일 형식을 확인해 주세요.','auth/weak-password':'비밀번호는 6자 이상이어야 해요.',
      'auth/invalid-credential':'이메일 또는 비밀번호가 맞지 않아요.','auth/wrong-password':'이메일 또는 비밀번호가 맞지 않아요.','auth/user-not-found':'이메일 또는 비밀번호가 맞지 않아요.',
      'auth/too-many-requests':'시도가 너무 많아요. 잠시 후 다시 해주세요.','auth/popup-closed-by-user':'로그인 창이 닫혔어요.','auth/network-request-failed':'네트워크 연결을 확인해 주세요.' };
    return m[e.code]||e.message||'문제가 생겼어요. 다시 시도해 주세요.';
  };
  const Auth = S.Auth = {
    get user(){return current},
    onChange(f){listeners.push(f); if(inited) f(current)},
    async signup(email,pw,name){
      await ready; email=email.trim().toLowerCase();
      if(S.live){
        try{
          const c=await fb.auth.createUserWithEmailAndPassword(email,pw);
          await c.user.updateProfile({displayName:name});
          await fb.db.collection('users').doc(c.user.uid).set({email,name,createdAt:Date.now()});
        }catch(e){ throw new Error(errMsg(e)); }
        return;
      }
      const users=ls.get('users',[]);
      if(users.some(u=>u.email===email)) throw new Error('이미 가입된 이메일이에요.');
      if(pw.length<6) throw new Error('비밀번호는 6자 이상이어야 해요.');
      const u={uid:'u'+Date.now().toString(36),email,name,pw:await hash(pw),createdAt:Date.now()};
      users.push(u); ls.set('users',users); ls.set('session',u.uid); setLocal(u);
    },
    async login(email,pw){
      await ready; email=email.trim().toLowerCase();
      if(S.live){ try{ await fb.auth.signInWithEmailAndPassword(email,pw);}catch(e){throw new Error(errMsg(e))} return; }
      const u=ls.get('users',[]).find(x=>x.email===email);
      if(!u||u.pw!==await hash(pw)) throw new Error('이메일 또는 비밀번호가 맞지 않아요.');
      ls.set('session',u.uid); setLocal(u);
    },
    async google(){
      await ready;
      if(!S.live) throw new Error('구글 로그인은 Firebase 연결 후 사용할 수 있어요. (체험 모드)');
      try{
        const c=await fb.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        await fb.db.collection('users').doc(c.user.uid).set({email:c.user.email,name:c.user.displayName||'',createdAt:Date.now()},{merge:true});
      }catch(e){ throw new Error(errMsg(e)); }
    },
    async reset(email){
      await ready;
      if(!S.live) throw new Error('비밀번호 재설정은 Firebase 연결 후 사용할 수 있어요. (체험 모드)');
      try{ await fb.auth.sendPasswordResetEmail(email.trim()); }catch(e){ throw new Error(errMsg(e)); }
    },
    async logout(){ await ready; if(S.live) await fb.auth.signOut(); else { ls.set('session',null); current=null; emit(); } }
  };
  let inited=false;
  function setLocal(u){ current={uid:u.uid,email:u.email,name:u.name,isAdmin:isDemoAdmin(u.email)}; emit(); }
  ready.then(async()=>{
    if(S.live){
      fb.auth.onAuthStateChanged(async u=>{
        if(!u){ current=null; inited=true; return emit(); }
        let isAdmin=false;
        try{ isAdmin=(await fb.db.collection('admins').doc(u.uid).get()).exists; }catch(e){}
        current={uid:u.uid,email:u.email,name:u.displayName||u.email.split('@')[0],isAdmin}; inited=true; emit();
      });
    }else{
      const sid=ls.get('session',null), u=ls.get('users',[]).find(x=>x.uid===sid);
      if(u) current={uid:u.uid,email:u.email,name:u.name,isAdmin:isDemoAdmin(u.email)};
      inited=true; emit();
    }
  });

  /* ---------------- 장바구니 (브라우저 저장) ---------------- */
  const Cart = S.Cart = {
    items(){return ls.get('cart',[])},
    save(a){ls.set('cart',a);document.dispatchEvent(new Event('cart:change'))},
    add(p,q=1){const a=this.items();const i=a.find(x=>x.id===p.id);if(i)i.qty+=q;else a.push({id:p.id,name:p.name,price:p.price,img:p.img||'',art:p.art||'',qty:q});this.save(a)},
    setQty(id,q){let a=this.items();a=a.map(x=>x.id===id?{...x,qty:q}:x).filter(x=>x.qty>0);this.save(a)},
    clear(){this.save([])},
    count(){return this.items().reduce((s,x)=>s+x.qty,0)},
    total(){return this.items().reduce((s,x)=>s+x.qty*x.price,0)}
  };
  S.won = n => Number(n||0).toLocaleString('ko-KR')+'원';
  S.esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
})();
