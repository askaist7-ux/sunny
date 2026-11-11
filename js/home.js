/* 메인 페이지 동작 : 히어로 · 스토어 쇼케이스 · 일정 · 문의 */
(function(){
  const S=window.SUNNY, $=S.$, esc=S.esc, won=S.won;

  /* ---------- 히어로 슬라이드 ---------- */
  const SLIDES=[
   {img:'set-green',bg:'#fff1c4',fg:'#211f1d',tag:'귀여움으로 마음을 잇는 이모티콘 브랜드',h:'작은 캐릭터 하나가,<br><em>오늘을 맑게</em> 합니다',p:'구름 같은 토끼와 귤 친구가 전하는 귀여움. 이모티콘에서 굿즈까지, Sunny가 일상에 햇살 한 스푼을 더해요.',b:[['스토어 구경하기','#store',''],['브랜드 이야기','#brand','white']]},
   {img:'bags',bg:'#1f6b3a',fg:'#fff',hl:'#f5c75b',tag:'NEW 파우치 · 가방 컬렉션',h:'귤 향기 나는 귀여움,<br><em style="color:#211f1d">매일 들고 다니기</em>',p:'복주머니, 투명 크로스백, 에코백까지. 그린과 옐로가 만나 더 싱그러운 서니 가방 시리즈.',b:[['굿즈 보러가기','page.html?id=3-2',''],['기획전 3-7','page.html?id=3-7','white']]},
   {img:'desk-set',bg:'#f8cfaa',fg:'#211f1d',hl:'#fff1c4',tag:'BEST 데스크 소품',h:'내 책상에도<br><em>구름토끼</em> 한 마리',p:'폭신한 인형부터 스탠드, 달력, 스티커까지. 서니로 책상을 꾸며 보세요.',b:[['소품 세트 보기','#store',''],['장바구니 열기','#cart','white']]},
   {img:'tote-plush',bg:'#dff1e4',fg:'#211f1d',hl:'#f5c75b',tag:'강연·교육협업',h:'그려서 나누고,<br>나눠서 <em>커지는 행복</em>',p:'기업·기관 특강, 이모티콘 작가 클래스, 지역 클래스까지. Sunny와 함께 그리는 시간.',b:[['교육 일정 보기','#lecture',''],['협업 제안하기','page.html?id=2-4','white']]},
   {img:'keyrings',bg:'#f5c75b',fg:'#211f1d',hl:'#fff',tag:'브랜드 이모티콘 제작',h:'브랜드에 마음을 입히는<br><em>이모티콘</em>',p:'우리 브랜드를 닮은 캐릭터와 이모티콘, 키링·파우치 같은 굿즈로 확장까지 한 번에 도와드려요.',b:[['제작 상담·견적','page.html?id=1-7',''],['제작 서비스 소개','page.html?id=1-1','white']]},
   {img:'mug',bg:'#fde9d7',fg:'#211f1d',hl:'#f5c75b',tag:'SUNNY MUG',h:'한 잔의 여유에도<br><em>Sunny</em> 한 스푼',p:'안쪽은 옐로, 손잡이는 그린. 아침이 조금 더 맑아지는 서니 머그컵을 만나보세요.',b:[['머그 구경하기','#store',''],['작가 이야기','page.html?id=4-1','white']]}
  ];
  const track=$('#heroTrack'), dots=$('#heroDots');
  track.innerHTML=SLIDES.map((s,i)=>`<div class="slide ${i?'':'on'}" style="--bg:${s.bg};--fg:${s.fg};--hl:${s.hl||'#f5c75b'}" aria-roledescription="slide" aria-label="${i+1} / ${SLIDES.length}">
    <div class="txt"><span class="tag">${s.tag}</span>${i===0?'<h1>':'<h2 class="h1like" style="font-size:clamp(34px,4.6vw,68px);line-height:1.18;margin-bottom:16px;word-break:keep-all">'}${s.h}${i===0?'</h1>':'</h2>'}<p>${s.p}</p>
    <div class="btns">${s.b.map(([t,h,c])=>`<a class="btn ${c}" href="${h}" ${h==='#cart'?'data-opencart':''}>${t}</a>`).join('')}</div></div>
    <div class="pic"><img src="images/hero/${s.img}.jpg" alt="" ${i?'loading="lazy"':'fetchpriority="high"'}></div></div>`).join('');
  dots.innerHTML=SLIDES.map((_,i)=>`<button aria-label="${i+1}번 슬라이드"${i?'':' class="on"'}></button>`).join('');
  let hi=0, ht;
  const hs=[...track.children], hd=[...dots.children];
  function hgo(n){hi=(n+hs.length)%hs.length;hs.forEach((s,i)=>s.classList.toggle('on',i===hi));hd.forEach((d,i)=>d.classList.toggle('on',i===hi));$('#heroCount').textContent=`${hi+1} / ${hs.length}`;hauto()}
  const hauto=()=>{clearTimeout(ht);ht=setTimeout(()=>hgo(hi+1),6500)};
  $('#hPrev').onclick=()=>hgo(hi-1);$('#hNext').onclick=()=>hgo(hi+1);hd.forEach((d,i)=>d.onclick=()=>hgo(i));
  const hero=$('#top'); hero.addEventListener('mouseenter',()=>clearTimeout(ht)); hero.addEventListener('mouseleave',hauto);
  let sx=null; hero.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  hero.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)hgo(hi+(dx<0?1:-1));sx=null});
  document.addEventListener('visibilitychange',()=>document.hidden?clearTimeout(ht):hauto());
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');if(h==='#cart'){e.preventDefault();S.openCart();return}
    if(h.length>1){const t=document.querySelector(h);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});history.replaceState(null,'',h)}}});
  hauto();

  /* ---------- 브랜드 소개 문구 (관리자 수정 반영) ---------- */
  S.DB.settings().then(s=>{
    $('#brandTitle').textContent=s.brandTitle;
    $('#brandBody').innerHTML=String(s.brandBody).split('\n').filter(Boolean).map(t=>`<p>${esc(t)}</p>`).join('');
  });

  /* ---------- 스토어 ---------- */
  let ALL=[], cat='all', sc={i:0,n:0,t:null}, DUR=5200;
  const tabs=$('#catTabs');
  tabs.innerHTML=S.CATS.map(c=>`<button role="tab" data-c="${c.key}" class="${c.key==='all'?'on':''}">${c.label}</button>`).join('');
  tabs.onclick=e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;[...tabs.children].forEach(x=>x.classList.toggle('on',x===b));renderStore()};
  function showSlide(i){
    const slides=[...$('#scTrack').children]; if(!slides.length)return;
    sc.i=(i+slides.length)%slides.length;
    $('#scTrack').style.transform=`translateX(-${sc.i*100}%)`;
    slides.forEach((s,k)=>s.classList.toggle('on',k===sc.i));
    $('#scCount').textContent=`${sc.i+1} / ${slides.length}`;
    const bar=$('#scBar'); bar.classList.remove('run'); void bar.offsetWidth; bar.style.setProperty('--dur',DUR+'ms'); bar.classList.add('run');
    clearTimeout(sc.t); sc.t=setTimeout(()=>showSlide(sc.i+1),DUR);
  }
  function renderStore(){
    const list=ALL.filter(p=>cat==='all'||p.cat===cat);
    let feat=list.filter(p=>p.featured); if(feat.length<3) feat=list.slice(0,8);
    $('#scTrack').innerHTML=feat.length?feat.map((p,k)=>`<div class="sc-slide ${k?'':'on'}" style="--sbg:${esc(p.bg||p.art||'#fff1c4')}">
      <div class="pic">${p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}">`:`<div class="placeholder-art" style="--bgc:${esc(p.art||'#fde9d7')};width:min(360px,80%);aspect-ratio:1;border-radius:20px;border:3px solid var(--ink)"><img src="${S.mascot}" alt=""></div>`}</div>
      <div class="info"><span class="cat">${esc((S.CATS.find(c=>c.key===p.cat)||{}).label||'')}${p.tag?' · '+esc(p.tag):''}</span><h3>${esc(p.name)}</h3><p class="desc">${esc(p.desc||'')}</p>
      <div class="price">${won(p.price)}${p.orig?`<s>${won(p.orig)}</s><span class="off">${Math.round((1-p.price/p.orig)*100)}%</span>`:''}</div>
      <div class="sc-btns"><button class="btn" data-add="${esc(p.id)}">담기 🛒</button><button class="btn white" data-open="${esc(p.id)}">자세히 보기</button></div></div></div>`).join('')
      :`<div class="empty" style="padding:80px 20px"><img src="${S.mascot}" alt=""><p>이 카테고리는 곧 채워질 예정이에요!</p></div>`;
    $('#showcase').style.display='';
    $('#rail').innerHTML=list.length?list.map(S.card).join(''):`<div class="empty"><img src="${S.mascot}" alt=""><p>준비 중이에요. 조금만 기다려 주세요 🍊</p></div>`;
    sc.i=0; if(feat.length) showSlide(0);
  }
  $('#sPrev').onclick=()=>showSlide(sc.i-1); $('#sNext').onclick=()=>showSlide(sc.i+1);
  const shw=$('#showcase'); shw.addEventListener('mouseenter',()=>{clearTimeout(sc.t);$('#scBar').style.animationPlayState='paused'}); shw.addEventListener('mouseleave',()=>{$('#scBar').style.animationPlayState='';showSlide(sc.i)});
  let sx2=null; shw.addEventListener('touchstart',e=>sx2=e.touches[0].clientX,{passive:true}); shw.addEventListener('touchend',e=>{if(sx2==null)return;const dx=e.changedTouches[0].clientX-sx2;if(Math.abs(dx)>50)showSlide(sc.i+(dx<0?1:-1));sx2=null});
  // 상품 레일 자동 스크롤
  const rail=$('#rail'); let rp=false;
  rail.addEventListener('mouseenter',()=>rp=true); rail.addEventListener('mouseleave',()=>rp=false); rail.addEventListener('touchstart',()=>rp=true,{passive:true}); rail.addEventListener('focusin',()=>rp=true);
  setInterval(()=>{ if(rp||document.hidden) return; const max=rail.scrollWidth-rail.clientWidth; if(max<=0)return; const w=rail.firstElementChild?.offsetWidth+18||270; rail.scrollTo({left:rail.scrollLeft+w>=max-4?0:rail.scrollLeft+w,behavior:'smooth'}); },3200);
  S.products().then(p=>{ALL=p;renderStore();S.reveal()});

  /* ---------- 교육 일정 ---------- */
  S.DB.list('lectures').then(ls=>{
    const today=new Date().toISOString().slice(0,10);
    const up=ls.filter(l=>l.open!==false&&(l.date||'')>=today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    $('#schedList').innerHTML=up.length?up.map(l=>{const d=new Date(l.date+'T00:00');return `<div class="sch"><div class="d"><b>${d.getDate()}</b><span>${d.getMonth()+1}월 · ${'일월화수목금토'[d.getDay()]}</span></div>
      <div><h4>${esc(l.title)}</h4><small><span class="pill">${esc(l.type||'교육')}</span>${l.sample?'<span class="pill" style="background:#fff1c4;border-color:#f5c75b">예시</span>':''}📍 ${esc(l.place||'')}${l.cap?` · 정원 ${l.cap}명`:''}</small></div>
      <a class="btn sm white" href="page.html?id=2-7&l=${esc(l.id)}">신청</a></div>`}).join('')
      :`<div class="empty"><img src="${S.mascot}" alt=""><p>예정된 일정이 아직 없어요. 출강·협업은 언제든 문의해 주세요!</p></div>`;
  });

  S.bindInquiry($('#quickForm'),$('#qMsg'),{source:'home'});
})();
