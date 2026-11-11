/* =========================================================
   Firebase 설정 파일
   1) Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) 에서 firebaseConfig 를 복사해
      아래 값을 교체하세요. (README_FIREBASE.md 참고)
   2) apiKey 가 'YOUR_API_KEY' 인 동안은 "체험(데모) 모드"로 동작합니다.
      → 데이터가 이 브라우저(localStorage)에만 저장됩니다.
   ========================================================= */
window.SUNNY_FIREBASE = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
/* 체험 모드에서 이 이메일로 가입하면 관리자 권한이 부여됩니다. (Firebase 모드에서는 사용되지 않음) */
window.SUNNY_DEMO_ADMIN_EMAIL = "e_iiias@naver.com";
