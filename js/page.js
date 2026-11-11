/* 서브페이지 렌더러 (page.html?id=3-2) */
(function(){
  const S=window.SUNNY, $=S.$, esc=S.esc;
  const id=new URLSearchParams(location.search).get('id')||'1-1';
  const [m,i]=id.split('-').map(Number);
  const menu=S.MENU.find(x=>x.id===m), def=S.PAGES[id];
  const root=$('#pageRoot');
  if(!menu||!menu.items[i-1]||!def){ root.innerHTML=`<div class="page-body"><div class="wrap"><div class="soon"><img src="images/mascot.png" alt=""><h3>페이지를 찾을 수 없어요</h3><p><a class="btn" href="index.html">홈으로</a></p></div></div></div>`; return; }
  const title=menu.items[i-1];
  document.title=`${title} | Sunny`;
  const FIELDS={company:['회사·브랜드명','text'],org:['기관·단체명','text'],budget:['예산 범위','text','예) 300만 원 내외'],due:['희망 일정','text','예) 2026년 1분기'],people:['예상 인원','text'],order:['주문번호 (선택)','text']};

  const R={
    text:b=>`<div class="block"><h2>${esc(b.h)}</h2><p>${esc(b.p)}</p></div>`,
    cards:b=>`<div class="cards3">${b.items.map(([e,h,p])=>`<div class="info-card rv"><i>${e}</i><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join('')}</div>`,
    steps:b=>`<div class="steps">${b.items.map(([h,p])=>`<div class="step rv"><div><h4>${esc(h)}</h4><p>${esc(p)}</p></div></div>`).join('')}</div>`,
    faq:b=>`<div class="faq">${b.items.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`,
    gallery:b=>`<div class="gallery">${b.items.map(([s,c])=>`<figure class="rv"><img src="${s}" alt="${esc(c)}" loading="lazy"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>`,
    soon:b=>`<div class="soon rv"><img src="images/mascot.png" alt=""><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`,
    cta:b=>`<div class="cta-band rv"><h3>${esc(b.h)}</h3><a class="btn" href="${b.href}">${esc(b.btn)}</a></div>`,
    character:b=>`<div class="block" style="display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:center;background:#fff;border:2.5px solid var(--ink);border-radius:var(--r);padding:18px"><img src="${b.img}" alt="${esc(b.name)}" style="border-radius:18px;border:2.5px solid var(--ink);aspect-ratio:1;object-fit:cover;width:100%"><div><h2>${esc(b.name)}</h2><p>${esc(b.text)}</p></div></div>`,
    products:b=>`<div class="block"><h2>${esc(b.title)}</h2><div class="grid" data-prod></div></div>`,
    authorBio:()=>`<div class="block" style="background:#fff;border:2.5px solid var(--ink);border-radius:var(--r);padding:26px;display:grid;grid-template-columns:160px 1fr;gap:24px;align-items:center"><img src="images/mascot.png" alt="" style="width:100%;animation:bob 3s ease-in-out infinite"><div><h2>작가 Sunny</h2><p data-bio></p></div></div>`,
    contactInfo:()=>{const I=S.INFO;return `<div class="cards3"><a class="info-card rv" href="tel:${I.phone.replace(/-/g,'')}"><i>📞</i><h4>전화</h4><p>${I.phone}</p></a><a class="info-card rv" href="mailto:${I.email}"><i>✉️</i><h4>이메일</h4><p>${I.email}</p></a><div class="info-card rv"><i>📍</i><h4>위치</h4><p>${I.address}</p></div></div>`},
    form:b=>{
      const fld=k=>{const [l,t,ph]=FIELDS[k];return `<div class="field"><label>${l}</label><input name="${k}" type="${t}" ${ph?`placeholder="${ph}"`:''}></div>`};
      const first=(b.fields||[]).length?fld(b.fields[0]):'<div></div>';
      return `<form class="formbox" data-inq style="max-width:760px;margin:0 auto"><h3>${esc(b.title||'문의하기')}</h3><p>${esc(b.cat)}</p><div class="msg"></div>
        <div class="two"><div class="field"><label>이름 *</label><input name="name" required></div><div class="field"><label>이메일 *</label><input name="email" type="email" required></div></div>
        <div class="two"><div class="field"><label>연락처</label><input name="phone" inputmode="tel" placeholder="010-0000-0000"></div>${first}</div>
        ${(b.fields||[]).slice(1).map(fld).join('')}
        <div class="field"><label>문의 내용 *</label><textarea name="message" required></textarea></div>
        <button class="btn block" type="submit">보내기 💌</button><input type="hidden" name="type" value="${esc(b.cat)}"></form>`;
    },
    lectureApply:()=>`<form class="formbox" data-apply style="max-width:760px;margin:0 auto 30px"><h3>수강 신청</h3><p>일정을 선택하고 신청 정보를 남겨주세요. 확인 후 안내드려요.</p><div class="msg"></div>
      <div class="field"><label>수강할 일정 *</label><select name="lecture" required></select></div>
      <div class="two"><div class="field"><label>이름 *</label><input name="name" required></div><div class="field"><label>연락처 *</label><input name="phone" required inputmode="tel"></div></div>
      <div class="two"><div class="field"><label>이메일 *</label><input name="email" type="email" required></div><div class="field"><label>인원</label><input name="people" type="number" min="1" value="1"></div></div>
      <div class="field"><label>하고 싶은 말 (선택)</label><textarea name="message" style="min-height:70px"></textarea></div>
      <button class="btn block" type="submit">수강 신청하기</button></form>`
  };

  const sibs=menu.items.map((t,k)=>`<a href="page.html?id=${m}-${k+1}" class="${k+1===i?'on':''}">${m}-${k+1} ${esc(t)}</a>`).join('');
  root.innerHTML=`<section class="page-hero"><div class="wrap"><div class="crumb"><a href="index.html">홈</a> › <a href="${menu.href}">${menu.title}</a> › ${esc(title)}</div>
    <h1>${menu.emoji} ${esc(title)}</h1><p>${esc(def.lead)}</p></div>
    <img class="mascot" src="images/mascot.png" alt="" aria-hidden="true"></section>
    <section class="page-body"><div class="wrap"><nav class="side-nav" aria-label="${menu.title} 하위 메뉴">${sibs}</nav>
    <div class="blocks">${def.blocks.map(b=>(R[b.t]||(()=>''))(b)).join('')}</div></div></section>`;

  /* 동적 부분 */
  const grid=root.querySelector('[data-prod]');
  if(grid){ const b=def.blocks.find(x=>x.t==='products'); S.products().then(ps=>{const l=ps.filter(b.filter);grid.innerHTML=l.length?l.map(S.card).join(''):`<div class="empty"><img src="images/mascot.png" alt=""><p>곧 준비될 예정이에요 🍊</p></div>`;S.reveal(root)}); }
  const bio=root.querySelector('[data-bio]'); if(bio) S.DB.settings().then(s=>bio.textContent=s.authorBio);
  root.querySelectorAll('form[data-inq]').forEach(f=>S.bindInquiry(f,f.querySelector('.msg'),{source:id}));
  const ap=root.querySelector('form[data-apply]');
  if(ap){
    const sel=ap.querySelector('select'), pre=new URLSearchParams(location.search).get('l');
    S.DB.list('lectures').then(ls=>{
      const t=new Date().toISOString().slice(0,10); const up=ls.filter(l=>l.open!==false&&l.date>=t).sort((a,b)=>a.date.localeCompare(b.date));
      sel.innerHTML=up.length?up.map(l=>`<option value="${esc(l.id)}" ${l.id===pre?'selected':''}>${l.date} · ${esc(l.title)}</option>`).join(''):'<option value="">예정된 일정이 없어요 (아래 출강 문의를 이용해주세요)</option>';
      const u=S.Auth.user; if(u){ap.name.value=u.name||'';ap.email.value=u.email||''}
      S.Auth.onChange(u=>{if(u&&!ap.name.value){ap.name.value=u.name||'';ap.email.value=u.email||''}});
      ap.onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(ap));const msg=ap.querySelector('.msg'),btn=ap.querySelector('[type=submit]');if(!f.lecture){msg.className='msg err';msg.textContent='신청 가능한 일정이 없어요.';return}
        btn.disabled=true;const lec=up.find(l=>l.id===f.lecture);
        try{await S.DB.add('applications',{...f,lectureTitle:lec?.title||'',uid:S.Auth.user?.uid||'',status:'접수',createdAt:Date.now()});msg.className='msg ok';msg.textContent='🎉 신청이 접수되었어요! 확인 후 안내드릴게요.';ap.reset();}
        catch(err){msg.className='msg err';msg.textContent='신청 중 문제가 생겼어요: '+err.message}btn.disabled=false};
    });
  }
  S.reveal(root);
  document.addEventListener('DOMContentLoaded',()=>S.reveal(root));
})();
