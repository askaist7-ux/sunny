# Sunny 홈페이지 · Firebase 연결 가이드

지금은 **체험(데모) 모드**로 동작합니다 (데이터가 브라우저에만 저장).
아래 순서대로 Firebase를 연결하면 실서비스 모드로 바뀝니다. 코드 수정은 `js/firebase-config.js` 한 곳뿐이에요.

## 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com → 프로젝트 추가
2. **Authentication** → 시작하기 → 로그인 방법: `이메일/비밀번호`, `Google` 사용 설정
3. **Firestore Database** → 데이터베이스 만들기 (프로덕션 모드, 서울 `asia-northeast3` 권장)
4. **Storage** → 시작하기 (상품 이미지 업로드용)
5. 프로젝트 설정 → 내 앱 → 웹 앱(</>) 등록 → 나오는 `firebaseConfig` 값을 `js/firebase-config.js` 에 붙여넣기

## 2. 보안 규칙 배포
```bash
npm i -g firebase-tools
firebase login
# .firebaserc 의 YOUR_PROJECT_ID 를 실제 프로젝트 ID로 교체
firebase deploy --only firestore:rules,storage
```

## 3. 관리자 계정 만들기
1. 사이트에서 `e_iiias@naver.com` 등 관리자로 쓸 계정으로 **회원가입**
2. Firebase 콘솔 → Authentication → 해당 사용자의 **UID** 복사
3. Firestore → 컬렉션 `admins` → 문서 ID = 그 UID (필드는 `role: "admin"` 아무거나) 생성
4. 로그아웃 후 다시 로그인 → 상단에 `관리자` 버튼 표시
5. 관리자 페이지 → 상품 관리 → **기본 상품 불러오기** 로 샘플 상품/일정 등록

## 4. Firebase MCP 서버 (Claude에서 Firebase 다루기)
이 폴더의 `.mcp.json` 에 공식 Firebase MCP 서버가 설정되어 있어요.
이 폴더에서 Claude Code를 열면 자동 인식되고, 수동 등록은:
```bash
claude mcp add firebase -- npx -y firebase-tools@latest mcp --dir .
```
Claude Desktop 은 설정 파일의 `mcpServers` 에 `.mcp.json` 내용을 그대로 추가하세요.
MCP를 쓰려면 먼저 `firebase login` 이 되어 있어야 합니다.

## 5. 배포 (Firebase Hosting)
```bash
firebase deploy --only hosting
```
`굿즈/`, `소스/`, `KakaoTalk_*` 같은 원본 폴더는 `firebase.json` 에서 배포 제외돼 있어요.

## 컬렉션 구조
| 컬렉션 | 내용 | 쓰기 권한 |
|---|---|---|
| products | 상품 | 관리자 |
| orders | 주문 | 회원(본인 생성) / 관리자(상태) |
| lectures | 강연·교육 일정 | 관리자 |
| applications | 수강 신청 | 누구나 접수 |
| inquiries | 문의 | 누구나 접수 |
| settings/site | 브랜드·작가 소개 문구 | 관리자 |
| users | 회원 정보 | 본인 |
| admins | 관리자 UID 목록 | 콘솔에서만 |

## 참고 / 주의
- **결제(PG)는 아직 연결되지 않았습니다.** 현재는 "주문 접수 → 연락처로 결제 안내" 방식이에요. 실결제를 붙일 때는 금액 검증을 서버(Cloud Functions)에서 하세요.
- 상품 가격은 샘플입니다. 관리자 페이지에서 실제 가격으로 바꿔 주세요.
