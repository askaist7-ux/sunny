/* 관리자 페이지 : 판매(상품·주문) · 브랜드/작가 소개 · 강연/교육 · 문의 · 회원 */
(function(){
  const S=window.SUNNY, $=S.$, $$=S.$$, esc=S.esc, won=S.won, root=$('#adminRoot');
  const TABS=[['dash','📊 대시보드'],['products','🛍️ 상품 관리'],['orders','📦 주문 관리'],['site','🍊 브랜드·작가 소개'],['lectures','🎤 강연·교육'],['inquiries','💌 문의'],['users','👥 회원']];
  let tab=location.hash.slice(1)||'dash';
  const fmt=t=>t?new Date(t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
  const lock=(t,p)=>root.innerHTML=`<div class="lock"><div><img src="images/mascot.png" alt=""><h2>${t}</h2><p style="color:var(--muted);margin:8px 0 18px">${p}</p><a class="btn" href="login.html?next=admin.html">로그인</a> <a class="btn white" href="index.html">홈으로</a></div></div>`;
  function shell(){
    root.innerHTML=`<div class="admin"><aside class="adm-side"><h2>🍊 Sunny Admin</h2>${TABS.map(([k,l])=>`<button data-t="${k}" class="${k===tab?'on':''}">${l}</button>`).join('')}</aside><section class="adm-main" id="admMain"></section></div>`;
    $$('.adm-side button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;location.hash=tab;$$('.adm-side button').forEach(x=>x.classList.toggle('on',x===b));render()});
    render();
  }
  const main=()=>$('#admMain');
  const R={dash,products,orders,site,lectures,inquiries,users};
  function render(){ main().innerHTML='<p class="dim">불러오는 중…</p>'; R[tab]().catch(e=>{main().innerHTML=`<div class="msg err">불러오지 못했어요: ${esc(e.message)}</div>`}); }
  const flash=t=>S.toast(t);
  const stSel=(opts,val,attr)=>`<select ${attr}>${opts.map(o=>`<option ${o===val?'selected':''}>${o}</option>`).join('')}</select>`;

  /* ---- 대시보드 ---- */
  async function dash(){
    const [pr,or,iq,us,ap]=await Promise.all(['products','orders','inquiries','users','applications'].map(c=>S.DB.list(c).catch(()=>[])));
    const sales=or.filter(o=>o.status!=='취소').reduce((s,o)=>s+(o.amount||0),0);
    main().innerHTML=`<h1>대시보드</h1>
    ${S.live?'':'<p class="mode-note">🧪 체험 모드: 데이터가 이 브라우저에만 저장돼요. Firebase 연결 방법은 README_FIREBASE.md를 보세요.</p>'}
    <div class="stats"><div class="stat"><b>${pr.length}</b><span>등록 상품</span></div><div class="stat"><b>${or.length}</b><span>전체 주문</span></div><div class="stat"><b>${or.filter(o=>o.status==='접수').length}</b><span>신규 주문</span></div><div class="stat"><b>${won(sales)}</b><span>누적 주문금액</span></div><div class="stat"><b>${iq.filter(i=>i.status==='새 문의').length}</b><span>새 문의</span></div><div class="stat"><b>${ap.length}</b><span>수강 신청</span></div><div class="stat"><b>${us.length}</b><span>회원</span></div></div>
    <div class="panel"><h3 style="margin-bottom:10px">최근 주문</h3>${or.length?`<table class="tbl"><tr><th>일시</th><th>주문자</th><th>금액</th><th>상태</th></tr>${or.sort((a,b)=>b.createdAt-a.createdAt).slice(0,6).map(o=>`<tr><td>${fmt(o.createdAt)}</td><td>${esc(o.name)}</td><td>${won(o.amount)}</td><td><span class="status">${esc(o.status)}</span></td></tr>`).join('')}</table>`:'<p class="dim">아직 주문이 없어요.</p>'}</div>
    <div class="panel"><h3 style="margin-bottom:10px">최근 문의</h3>${iq.length?`<table class="tbl"><tr><th>일시</th><th>종류</th><th>이름</th><th>상태</th></tr>${iq.sort((a,b)=>b.createdAt-a.createdAt).slice(0,6).map(o=>`<tr><td>${fmt(o.createdAt)}</td><td>${esc(o.type)}</td><td>${esc(o.name)}</td><td><span class="status">${esc(o.status)}</span></td></tr>`).join('')}</table>`:'<p class="dim">아직 문의가 없어요.</p>'}</div>`;
  }

  /* ---- 상품 ---- */
  async function products(){
    const ps=(await S.DB.list('products')).sort((a,b)=>(a.order||99)-(b.order||99));
    main().innerHTML=`<h1>상품 관리</h1><div class="toolbar"><button class="btn sm" id="pNew">＋ 새 상품</button><button class="btn sm white" id="pSeed">기본 상품 불러오기</button><span class="dim">총 ${ps.length}개 · 노출 순서는 숫자가 작을수록 앞</span></div>
    <div class="panel" id="pForm" hidden></div>
    <div class="panel"><table class="tbl"><tr><th></th><th>상품명</th><th>분류</th><th>가격</th><th>재고</th><th>노출</th><th></th></tr>
    ${ps.map(p=>`<tr><td>${p.img?`<img src="${esc(p.img)}" alt="">`:'🍊'}</td><td>${esc(p.name)}${p.tag?` <span class="pill">${esc(p.tag)}</span>`:''}</td><td>${esc((S.CATS.find(c=>c.key===p.cat)||{}).label||'')}</td><td>${won(p.price)}</td><td>${p.stock??'-'}</td><td>${p.hidden?'숨김':'노출'}${p.featured?' ⭐':''}</td><td style="white-space:nowrap"><button class="btn sm white" data-e="${esc(p.id)}">수정</button> <button class="btn sm peach" data-d="${esc(p.id)}">삭제</button></td></tr>`).join('')}</table></div>`;
    $('#pNew').onclick=()=>pForm({});
    $('#pSeed').onclick=async()=>{ if(!confirm('기본 상품과 예시 일정을 DB에 저장할까요? (같은 ID는 덮어써요)'))return; await S.DB.seed(); flash('기본 데이터를 저장했어요'); render(); };
    $$('[data-e]').forEach(b=>b.onclick=()=>pForm(ps.find(p=>p.id===b.dataset.e)));
    $$('[data-d]').forEach(b=>b.onclick=async()=>{ if(!confirm('이 상품을 삭제할까요?'))return; await S.DB.del('products',b.dataset.d); flash('삭제했어요'); render(); });
  }
  function pForm(p){
    const f=$('#pForm'); f.hidden=false; f.scrollIntoView({behavior:'smooth',block:'nearest'});
    f.innerHTML=`<h3 style="margin-bottom:12px">${p.id?'상품 수정':'새 상품 등록'}</h3><form id="pf"><div class="form-grid">
    <div class="field full"><label>상품명 *</label><input name="name" required value="${esc(p.name||'')}"></div>
    <div class="field"><label>분류</label><select name="cat">${S.CATS.filter(c=>c.key!=='all').map(c=>`<option value="${c.key}" ${p.cat===c.key?'selected':''}>${c.label}</option>`).join('')}</select></div>
    <div class="field"><label>뱃지 (예: NEW, BEST, SET)</label><input name="tag" value="${esc(p.tag||'')}"></div>
    <div class="field"><label>판매가 (원) *</label><input name="price" type="number" min="0" required value="${p.price??''}"></div>
    <div class="field"><label>정가 (할인 표시용)</label><input name="orig" type="number" min="0" value="${p.orig??''}"></div>
    <div class="field"><label>재고</label><input name="stock" type="number" min="0" value="${p.stock??50}"></div>
    <div class="field"><label>노출 순서</label><input name="order" type="number" value="${p.order??99}"></div>
    <div class="field full"><label>대표 이미지 (경로/URL 입력 또는 파일 업로드)</label><input name="img" value="${esc(p.img||'')}" placeholder="images/products/xxx.jpg"><input type="file" id="pFile" accept="image/*" style="margin-top:8px;border:0;background:none;padding:0"></div>
    <div class="field full"><label>설명</label><textarea name="desc">${esc(p.desc||'')}</textarea></div></div>
    <div class="chk"><label><input type="checkbox" name="featured" ${p.featured?'checked':''}> 메인 슬라이드 추천 ⭐</label><label><input type="checkbox" name="digital" ${p.digital?'checked':''}> 디지털 상품</label><label><input type="checkbox" name="hidden" ${p.hidden?'checked':''}> 숨김</label></div>
    <div class="msg" id="pMsg"></div><button class="btn" type="submit">저장</button> <button class="btn white" type="button" id="pCancel">닫기</button></form>`;
    $('#pCancel').onclick=()=>f.hidden=true;
    $('#pFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{flash('이미지 올리는 중…');$('#pf').img.value=await S.DB.upload(file);flash('이미지 준비 완료!')}catch(err){$('#pMsg').className='msg err';$('#pMsg').textContent='업로드 실패: '+err.message}};
    $('#pf').onsubmit=async e=>{
      e.preventDefault(); const v=Object.fromEntries(new FormData(e.target)); const id=p.id||('p-'+Date.now().toString(36));
      const data={...p,name:v.name.trim(),cat:v.cat,tag:v.tag.trim(),price:+v.price,orig:v.orig?+v.orig:null,stock:+v.stock,order:+v.order,img:v.img.trim(),desc:v.desc,featured:!!v.featured,digital:!!v.digital,hidden:!!v.hidden};
      if(!data.orig) delete data.orig; if(!data.img) delete data.img;
      try{ await S.DB.set('products',id,data); flash('저장했어요 ✔'); render(); }catch(err){ $('#pMsg').className='msg err'; $('#pMsg').textContent='저장 실패: '+err.message; }
    };
  }

  /* ---- 주문 ---- */
  const OST=['접수','입금확인','발송','완료','취소'];
  async function orders(){
    const os=(await S.DB.list('orders')).sort((a,b)=>b.createdAt-a.createdAt);
    main().innerHTML=`<h1>주문 관리</h1><div class="panel">${os.length?`<table class="tbl"><tr><th>일시</th><th>주문자 / 연락처</th><th>상품</th><th>금액</th><th>상태</th></tr>${os.map(o=>`<tr><td>${fmt(o.createdAt)}</td><td>${esc(o.name)}<br><span class="dim">${esc(o.phone)}<br>${esc(o.addr||'')}</span></td><td>${(o.items||[]).map(i=>`${esc(i.name)} × ${i.qty}`).join('<br>')}${o.memo?`<br><span class="dim">📝 ${esc(o.memo)}</span>`:''}</td><td>${won(o.amount)}</td><td>${stSel(OST,o.status,`data-o="${esc(o.id)}"`)}</td></tr>`).join('')}</table>`:'<p class="dim">아직 주문이 없어요.</p>'}</div>`;
    $$('[data-o]').forEach(s=>s.onchange=async()=>{await S.DB.set('orders',s.dataset.o,{status:s.value});flash('상태를 바꿨어요')});
  }

  /* ---- 브랜드·작가 소개 ---- */
  async function site(){
    const s=await S.DB.settings();
    main().innerHTML=`<h1>브랜드·작가 소개 관리</h1><div class="panel"><form id="sf"><div class="field"><label>브랜드 소개 제목 (메인 2번째 섹션)</label><input name="brandTitle" value="${esc(s.brandTitle)}"></div>
    <div class="field"><label>브랜드 소개 본문 (줄바꿈=문단)</label><textarea name="brandBody" style="min-height:170px">${esc(s.brandBody)}</textarea></div>
    <div class="field"><label>작가 소개 (작가소개 4-1 페이지)</label><textarea name="authorBio" style="min-height:120px">${esc(s.authorBio)}</textarea></div>
    <p class="dim" style="margin-bottom:12px">푸터의 작가명·연락처는 js/data.js 의 SUNNY.INFO 에서 수정해요.</p><div class="msg" id="sMsg"></div><button class="btn" type="submit">저장</button></form></div>`;
    $('#sf').onsubmit=async e=>{e.preventDefault();try{await S.DB.saveSettings(Object.fromEntries(new FormData(e.target)));flash('저장했어요 ✔')}catch(err){$('#sMsg').className='msg err';$('#sMsg').textContent=err.message}};
  }

  /* ---- 강연·교육 ---- */
  async function lectures(){
    const [ls,ap]=await Promise.all([S.DB.list('lectures'),S.DB.list('applications').catch(()=>[])]);
    ls.sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    main().innerHTML=`<h1>강연·교육 관리</h1><div class="toolbar"><button class="btn sm" id="lNew">＋ 새 일정</button><span class="dim">예시 일정은 수정/삭제해서 실제 일정으로 바꿔주세요</span></div>
    <div class="panel" id="lForm" hidden></div>
    <div class="panel"><table class="tbl"><tr><th>날짜</th><th>제목</th><th>유형</th><th>장소</th><th>정원</th><th>공개</th><th></th></tr>${ls.map(l=>`<tr><td>${esc(l.date)}</td><td>${esc(l.title)}${l.sample?' <span class="pill">예시</span>':''}</td><td>${esc(l.type)}</td><td>${esc(l.place)}</td><td>${l.cap||'-'}</td><td>${l.open===false?'비공개':'공개'}</td><td style="white-space:nowrap"><button class="btn sm white" data-e="${esc(l.id)}">수정</button> <button class="btn sm peach" data-d="${esc(l.id)}">삭제</button></td></tr>`).join('')}</table></div>
    <div class="panel"><h3 style="margin-bottom:10px">수강 신청 내역</h3>${ap.length?`<table class="tbl"><tr><th>일시</th><th>일정</th><th>신청자</th><th>연락처</th><th>인원</th><th>상태</th></tr>${ap.sort((a,b)=>b.createdAt-a.createdAt).map(a=>`<tr><td>${fmt(a.createdAt)}</td><td>${esc(a.lectureTitle)}</td><td>${esc(a.name)}<br><span class="dim">${esc(a.email)}</span></td><td>${esc(a.phone)}</td><td>${esc(a.people||1)}</td><td>${stSel(['접수','확정','대기','취소'],a.status,`data-a="${esc(a.id)}"`)}</td></tr>`).join('')}</table>`:'<p class="dim">아직 신청이 없어요.</p>'}</div>`;
    $('#lNew').onclick=()=>lForm({open:true});
    $$('[data-e]').forEach(b=>b.onclick=()=>lForm(ls.find(l=>l.id===b.dataset.e)));
    $$('[data-d]').forEach(b=>b.onclick=async()=>{if(!confirm('이 일정을 삭제할까요?'))return;await S.DB.del('lectures',b.dataset.d);flash('삭제했어요');render()});
    $$('[data-a]').forEach(s=>s.onchange=async()=>{await S.DB.set('applications',s.dataset.a,{status:s.value});flash('상태를 바꿨어요')});
  }
  function lForm(l){
    const f=$('#lForm');f.hidden=false;f.scrollIntoView({behavior:'smooth',block:'nearest'});
    f.innerHTML=`<h3 style="margin-bottom:12px">${l.id?'일정 수정':'새 일정'}</h3><form id="lf"><div class="form-grid"><div class="field full"><label>제목 *</label><input name="title" required value="${esc(l.title||'')}"></div>
    <div class="field"><label>유형</label><select name="type">${['작가 클래스','기업·기관 특강','온라인','지역 클래스','공동 강의'].map(t=>`<option ${l.type===t?'selected':''}>${t}</option>`).join('')}</select></div>
    <div class="field"><label>날짜 *</label><input name="date" type="date" required value="${esc(l.date||'')}"></div>
    <div class="field"><label>장소</label><input name="place" value="${esc(l.place||'')}"></div><div class="field"><label>정원 (0=제한 없음)</label><input name="cap" type="number" min="0" value="${l.cap??0}"></div>
    <div class="field full"><label>소개</label><textarea name="desc">${esc(l.desc||'')}</textarea></div></div>
    <div class="chk"><label><input type="checkbox" name="open" ${l.open!==false?'checked':''}> 공개</label></div><button class="btn" type="submit">저장</button> <button class="btn white" type="button" id="lc">닫기</button></form>`;
    $('#lc').onclick=()=>f.hidden=true;
    $('#lf').onsubmit=async e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));const id=l.id||('l'+Date.now().toString(36));
      await S.DB.set('lectures',id,{title:v.title.trim(),type:v.type,date:v.date,place:v.place,cap:+v.cap,desc:v.desc,open:!!v.open,sample:false});flash('저장했어요 ✔');render()};
  }

  /* ---- 문의 ---- */
  async function inquiries(){
    const is=(await S.DB.list('inquiries')).sort((a,b)=>b.createdAt-a.createdAt);
    main().innerHTML=`<h1>문의</h1><div class="panel">${is.length?`<table class="tbl"><tr><th>일시</th><th>종류</th><th>보낸 사람</th><th>내용</th><th>상태</th></tr>${is.map(i=>`<tr><td>${fmt(i.createdAt)}</td><td>${esc(i.type)}</td><td>${esc(i.name)}<br><span class="dim">${esc(i.email)}${i.phone?'<br>'+esc(i.phone):''}</span></td><td style="max-width:360px;white-space:pre-wrap">${esc(i.message)}${['company','org','budget','due','people','order'].filter(k=>i[k]).map(k=>`<br><span class="dim">${k}: ${esc(i[k])}</span>`).join('')}</td><td>${stSel(['새 문의','확인중','답변완료'],i.status,`data-i="${esc(i.id)}"`)}</td></tr>`).join('')}</table>`:'<p class="dim">아직 문의가 없어요.</p>'}</div>`;
    $$('[data-i]').forEach(s=>s.onchange=async()=>{await S.DB.set('inquiries',s.dataset.i,{status:s.value});flash('상태를 바꿨어요')});
  }

  /* ---- 회원 ---- */
  async function users(){
    const us=(await S.DB.list('users')).sort((a,b)=>b.createdAt-a.createdAt);
    main().innerHTML=`<h1>회원</h1><div class="panel">${us.length?`<table class="tbl"><tr><th>가입일</th><th>이름</th><th>이메일</th></tr>${us.map(u=>`<tr><td>${fmt(u.createdAt)}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td></tr>`).join('')}</table>`:'<p class="dim">아직 가입한 회원이 없어요.</p>'}</div>`;
  }
  S.Auth.onChange(u=>{
    if(!u) return lock('관리자 로그인이 필요해요','로그인 후 이용해 주세요.');
    if(!u.isAdmin) return lock('관리자만 들어올 수 있어요',S.live?'Firebase 콘솔에서 admins 컬렉션에 이 계정의 UID 문서를 만들어 주세요. (README_FIREBASE.md)':`체험 모드에서는 ${esc(window.SUNNY_DEMO_ADMIN_EMAIL)} 계정이 관리자예요.`);
    shell();
  });
})();
