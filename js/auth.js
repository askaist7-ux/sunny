/* 로그인 / 회원가입 */
(function(){
  const S=window.SUNNY, $=S.$, mode=document.body.dataset.auth;
  const msg=(t,ok)=>{const m=$('#aMsg');m.className='msg '+(ok?'ok':'err');m.textContent=t};
  let next=new URLSearchParams(location.search).get('next')||'index.html';
  if(!/^[\w\-.]+\.html(\?[\w=&%\-.]*)?$/.test(next)) next='index.html';
  S.ready.then(()=>{ if(!S.live){const n=$('#modeNote');n.hidden=false;n.innerHTML='🧪 <b>체험 모드</b> — Firebase 연결 전이라 이 브라우저에만 저장돼요. 관리자 체험: <b>'+S.esc(window.SUNNY_DEMO_ADMIN_EMAIL)+'</b> 로 가입해 보세요.';} });
  const done=()=>{ S.toast(mode==='signup'?'🎉 가입을 환영해요!':'반가워요! 🍊'); setTimeout(()=>location.href=next,600); };
  $('#aForm').onsubmit=async e=>{
    e.preventDefault(); const f=Object.fromEntries(new FormData(e.target)); const btn=e.target.querySelector('[type=submit]'); btn.disabled=true;
    try{
      if(mode==='signup'){ if(f.pw!==f.pw2) throw new Error('비밀번호가 서로 달라요.'); await S.Auth.signup(f.email,f.pw,f.name.trim()); }
      else await S.Auth.login(f.email,f.pw);
      done();
    }catch(err){ msg(err.message); btn.disabled=false; }
  };
  $('#gBtn').onclick=async()=>{ try{ await S.Auth.google(); done(); }catch(err){ msg(err.message); } };
  const fg=$('#forgot'); if(fg) fg.onclick=async e=>{ e.preventDefault(); const em=$('#em').value; if(!em){msg('이메일을 먼저 입력해 주세요.');return} try{await S.Auth.reset(em);msg('비밀번호 재설정 메일을 보냈어요. 메일함을 확인해 주세요.',true)}catch(err){msg(err.message)} };
})();
