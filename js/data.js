/* 사이트 기본 데이터 : 메뉴 / 상품 / 일정 / 기본 문구 */
window.SUNNY = window.SUNNY || {};
SUNNY.INFO = { author:"Sunny", phone:"010-2627-3771", email:"e_iiias@naver.com", address:"서울시 마포구 망원동" };

SUNNY.MENU = [
 { id:1, key:"brand", title:"브랜드 이모티콘", emoji:"🍊", href:"index.html#brand", items:[
  "제작 서비스 소개","브랜드 맞춤 패키지","제작 사례·포트폴리오","캐릭터 개발·리뉴얼","제작 과정·이용 안내","함께한 브랜드·고객 후기","제작 상담·견적 신청"]},
 { id:2, key:"lecture", title:"강연·교육협업", emoji:"🎤", href:"index.html#lecture", items:[
  "강연자·교육 소개","기업·기관 맞춤 특강","이모티콘 작가 클래스","공동 강의·협업 제안","교육 위탁·지역 클래스","수강생 작품·교육 후기","교육 일정·수강·출강 신청"]},
 { id:3, key:"store", title:"스토어", emoji:"🛍️", href:"index.html#store", items:[
  "이모티콘 구매","캐릭터 굿즈","디지털 스티커·배경화면","창작 소스·템플릿","전자책·제작 가이드","VOD·온라인 강좌","기획전·구매 안내"]},
 { id:4, key:"artist", title:"작가소개", emoji:"🎨", href:"page.html?id=4-1", items:[
  "작가 이야기·프로필","대표 캐릭터·세계관","작품 포트폴리오","활동·전시 이력","수상·인증 이력","언론·인터뷰","신작 소식·작업 노트"]},
 { id:5, key:"contact", title:"연락하기", emoji:"💌", href:"index.html#contact", items:[
  "브랜드·콘텐츠 협업","캐릭터 라이선싱","행사·전시·팝업 제안","언론 취재·인터뷰 요청","자주 묻는 질문","상품·수강 고객지원","통합 문의·연락처"]}
];

SUNNY.CATS = [
 {key:"all",label:"전체"},{key:"goods",label:"캐릭터 굿즈"},{key:"stationery",label:"문구·스티커"},
 {key:"digital",label:"디지털"},{key:"emoticon",label:"이모티콘"},{key:"edu",label:"전자책·강좌"}
];

/* img: images/ 폴더 기준. art: 사진이 없는 디지털 상품의 배경색 */
SUNNY.PRODUCTS = [
 {id:"p-plush",name:"서니 구름토끼 쿠션 인형",cat:"goods",price:32000,orig:36000,tag:"BEST",img:"images/products/plush.jpg",desc:"몽글몽글 구름 같은 촉감의 서니 쿠션 인형. 안고 있으면 마음까지 폭신해져요.",stock:30,featured:true,order:1,bg:"#dff1e4"},
 {id:"p-keyring",name:"서니 미니 인형 키링",cat:"goods",price:12000,tag:"NEW",img:"images/products/keyring.jpg",desc:"가방 끝에 매달면 하루가 맑아지는 손바닥 크기 인형 키링.",stock:80,featured:true,order:2,bg:"#dff1e4"},
 {id:"p-tote-green",name:"서니 캔버스 에코백 (그린)",cat:"goods",price:18000,img:"images/products/tote-green.jpg",desc:"단단한 캔버스에 포레스트 그린 손잡이. 매일 들고 싶은 데일리 에코백.",stock:50,featured:true,order:3,bg:"#dff1e4"},
 {id:"p-clearbag",name:"서니 투명 미니 크로스백",cat:"goods",price:24000,tag:"NEW",img:"images/products/clear-bag.jpg",desc:"옐로 파이핑이 포인트인 투명 크로스백. 소지품도 귀엽게 보여줘요.",stock:40,featured:true,order:4,bg:"#fff1c4"},
 {id:"p-drawstring",name:"서니 복주머니 파우치",cat:"goods",price:15000,img:"images/products/drawstring.jpg",desc:"그린 매듭 끈과 옐로 구슬이 달린 복주머니 파우치.",stock:60,featured:true,order:5,bg:"#fff1c4"},
 {id:"p-greenpouch",name:"서니 그린 반달 파우치",cat:"goods",price:14000,img:"images/products/green-pouch.jpg",desc:"새싹 일러스트가 올라간 반달 지퍼 파우치.",stock:45,order:6,bg:"#dff1e4"},
 {id:"p-minipouch",name:"서니 미니 지퍼 파우치 + 귤 참",cat:"goods",price:13000,img:"images/products/mini-pouch.jpg",desc:"카드와 립밤이 쏙 들어가는 미니 파우치. 귤 모양 참이 달려 있어요.",stock:60,order:7,bg:"#fde9d7"},
 {id:"p-yellowpouch",name:"서니 옐로 스퀘어 파우치",cat:"goods",price:14000,img:"images/products/yellow-pouch.jpg",desc:"톡 튀는 옐로 컬러의 스퀘어 파우치. 이어폰·케이블 정리에 딱!",stock:40,order:8,bg:"#fff1c4"},
 {id:"p-wallet",name:"서니 스냅 카드지갑",cat:"goods",price:19000,img:"images/products/wallet.jpg",desc:"옐로 단추 포인트의 그린 스냅 카드지갑.",stock:35,order:9,bg:"#dff1e4"},
 {id:"p-keyrings",name:"서니 파우치 키링 컬렉션",cat:"goods",price:16000,tag:"SET",img:"images/products/keyrings.jpg",desc:"젤리 파우치·자수 키링·복주머니까지, 한 번에 만나는 키링 컬렉션.",stock:50,featured:true,order:10,bg:"#f4fbe9"},
 {id:"p-mug",name:"서니 머그컵",cat:"goods",price:13000,tag:"NEW",img:"images/products/mug.jpg",desc:"안쪽은 옐로, 손잡이는 그린. 아침 커피가 더 맛있어지는 서니 머그.",stock:70,featured:true,order:11,bg:"#fff1c4"},
 {id:"p-notebook",name:"서니 하드커버 노트",cat:"stationery",price:9000,img:"images/products/notebook.jpg",desc:"귤 친구가 올라탄 서니 하드커버 노트. 낙서하기 좋은 미색 속지.",stock:90,order:12,bg:"#dff1e4"},
 {id:"p-pen",name:"서니 노크 젤펜",cat:"stationery",price:3500,img:"images/products/pen.jpg",desc:"부드럽게 써지는 0.5mm 젤펜. 서니 로고 클립이 달려 있어요.",stock:150,order:13,bg:"#dff1e4"},
 {id:"p-sticker",name:"서니 데코 스티커 팩",cat:"stationery",price:4500,tag:"BEST",img:"images/products/stickers.jpg",desc:"서니·귤·구름·새싹이 가득한 방수 스티커 2장 세트.",stock:200,featured:true,order:14,bg:"#fff1c4"},
 {id:"p-standee",name:"서니 데스크 스탠드",cat:"goods",price:7000,img:"images/products/standee.jpg",desc:"책상 위에 올려두는 아크릴 감성 데스크 스탠드.",stock:40,order:15,bg:"#dff1e4"},
 {id:"p-diy",name:"서니 펠트 벽걸이 파우치 DIY 키트",cat:"goods",price:22000,tag:"DIY",img:"images/products/diy-pouch.jpg",desc:"재단된 펠트와 바늘·실이 한 상자에! 손바느질로 만드는 벽걸이 파우치.",stock:25,order:16,bg:"#fff1c4"},
 {id:"p-deskset",name:"서니 데스크 소품 풀세트",cat:"goods",price:48000,orig:56000,tag:"SET",img:"images/products/desk-set.jpg",desc:"인형·스탠드·달력·스티커까지 서니로 책상을 꾸미는 풀세트.",stock:15,featured:true,order:17,bg:"#fde9d7"},
 {id:"p-collection",name:"서니 파우치 아카이브 세트",cat:"goods",price:39000,img:"images/products/pouch-collection.jpg",desc:"파우치·키링·복주머니 8종을 모은 올인원 세트.",stock:20,order:18,bg:"#f4fbe9"},
 {id:"d-sticker",name:"서니 디지털 스티커 팩 (굿노트·노션용)",cat:"digital",price:3900,tag:"NEW",desc:"PNG 낱장 스티커 120종 + 굿노트 스티커북 파일.",stock:999,featured:true,order:19,art:"#fff1c4",digital:true},
 {id:"d-wall",name:"서니 폰 배경화면 세트 (12종)",cat:"digital",price:2900,desc:"사계절 서니 배경화면 12장. 아이폰·갤럭시 비율 모두 제공.",stock:999,order:20,art:"#dff1e4",digital:true},
 {id:"e-emo",name:"서니 카카오 이모티콘 (32종)",cat:"emoticon",price:2500,tag:"NEW",desc:"대화 속에서 톡톡 튀는 서니 이모티콘. 구매 링크로 연결됩니다.",stock:999,order:21,art:"#fde9d7",digital:true},
 {id:"e-src",name:"크리에이터 소스 팩 (브러시·템플릿)",cat:"edu",price:9900,desc:"이모티콘 시트 템플릿과 서니 라인 브러시 모음.",stock:999,order:22,art:"#dff1e4",digital:true},
 {id:"e-book",name:"전자책 · 이모티콘 작가 입문 가이드",cat:"edu",price:12000,desc:"기획부터 제안, 출시까지. 처음 도전하는 분을 위한 PDF 가이드.",stock:999,order:23,art:"#fff1c4",digital:true},
 {id:"e-vod",name:"VOD · 나만의 캐릭터 그리기 클래스",cat:"edu",price:39000,tag:"VOD",desc:"스케치부터 컬러링까지 따라 그리는 온라인 강좌.",stock:999,order:24,art:"#fde9d7",digital:true}
];

/* 예시 일정 (관리자 페이지에서 수정/삭제) */
SUNNY.sampleLectures = function(){
  const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
  return [
   {id:"l1",title:"이모티콘 작가 클래스 · 첫걸음",type:"작가 클래스",date:d(14),place:"서울 마포구 (오프라인)",cap:12,desc:"캐릭터 기획부터 시트 구성까지 하루 만에 배우는 입문 클래스.",open:true,sample:true},
   {id:"l2",title:"우리 기업 캐릭터 만들기 특강",type:"기업·기관 특강",date:d(28),place:"출강 · 협의",cap:0,desc:"브랜드 가치를 캐릭터와 이모티콘으로 풀어내는 맞춤 특강.",open:true,sample:true},
   {id:"l3",title:"온라인 라이브 · 굿즈 기획 입문",type:"온라인",date:d(40),place:"Zoom 라이브",cap:30,desc:"내 캐릭터를 굿즈로 확장하는 방법을 소개합니다.",open:true,sample:true}
  ];
};

SUNNY.SITE_DEFAULT = {
  brandTitle:"귀여움 한 스푼으로, 오늘을 맑게",
  brandBody:"Sunny는 구름처럼 폭신한 토끼와 머리 위에 앉은 귤 친구가 만드는 이모티콘 브랜드예요. 작은 캐릭터 하나가 대화를 따뜻하게 만들고, 하루를 조금 더 맑게 바꿔줄 수 있다고 믿어요.\n이모티콘에서 시작해 굿즈, 강연, 브랜드 협업까지 — 귀여움이 일상 곳곳에 닿도록 천천히, 정성스럽게 만들어 갑니다.",
  authorBio:"이모티콘과 캐릭터를 그리는 작가 Sunny. 일상의 작은 순간을 귀엽게 바라보는 시선으로 작업하고, 그 즐거움을 강연과 클래스로 나눕니다.",
  heroNote:"",
  shipping:"3만 원 이상 구매 시 무료배송 (기본 배송비 3,000원)"
};
