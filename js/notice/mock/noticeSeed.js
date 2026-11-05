/**
 * 초기 샘플 데이터 7건 (화면의 제목 / 작성일 / 조회수 기준)
 * - createdAt 은 ISO 8601 문자열 (한국시간 정오 기준으로 날짜 어긋남 방지)
 * - 번호(no)는 저장하지 않습니다. 조회 시 계산합니다.
 * - 첫 글의 조회수는 목록 기준 1,420 (상세 진입 시 +1 되어 1,421 로 표시)
 */
const AUTHOR = "그루밍데이";

export const NOTICE_SEED = [
  {
    id: "96645caf-6739-45ef-8e69-388132b0a136",
    category: "공지",
    isImportant: true,
    title: "그루밍데이 신규 회원 가입 혜택 & 적립금 안내",
    author: AUTHOR,
    content: [
      "안녕하세요, 따뜻한 마음을 전하는 **그루밍데이**입니다.",
      "",
      "그루밍데이를 찾아주신 모든 집사님들과 반려 아이들에게 감사의 말씀을 전합니다.",
      "신규 회원가입을 진행해주신 회원분들께 아래와 같이 특별한 혜택을 제공하오니 이용에 참고해주시기 바랍니다.",
      "",
      "🎁 신규 회원 가입 혜택",
      "• 신규 가입 즉시 사용할 수 있는 1,000P 적립금 지급",
      "• 첫 구매 시 무료배송 쿠폰 자동 발급",
      "• 구매 금액의 2% 기본 적립 혜택 제공",
      "",
      "항상 아이들의 건강과 행복을 생각하는 그루밍데이가 되겠습니다.",
      "감사합니다.",
    ].join("\n"),
    attachment: { name: "groomingday_notice_attachment.pdf", size: 1258291 },
    views: 1420,
    createdAt: "2026-11-01T03:00:00.000Z",
  },
  {
    id: "0c404989-b313-4406-85ed-15673005e58b",
    category: "공지",
    isImportant: true,
    title: "11월 배송 및 고객센터 휴무 일정 안내",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n11월 배송 및 고객센터 휴무 일정을 안내드립니다.\n휴무 기간 중 접수된 주문 및 문의는 영업일 기준 순차적으로 처리됩니다.\n\n이용에 참고해주시기 바랍니다. 감사합니다.",
    attachment: null,
    views: 980,
    createdAt: "2026-10-28T03:00:00.000Z",
  },
  {
    id: "8ef47f79-8381-4f66-8d9c-f4001c587337",
    category: "이벤트",
    isImportant: true,
    title: "가을 신상 APPAREL 라인업 전품목 10% 할인 프로모션",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n가을 신상 APPAREL 라인업 전품목을 10% 할인된 가격으로 만나보세요.\n\n- 대상: 가을 신상 APPAREL 전품목\n- 혜택: 10% 즉시 할인\n\n많은 관심 부탁드립니다. 감사합니다.",
    attachment: null,
    views: 2150,
    createdAt: "2026-10-15T03:00:00.000Z",
  },
  {
    id: "a82f7698-1c58-4daf-9d28-50d2dd09b79c",
    category: "공지",
    isImportant: false,
    title: "개인정보처리방침 개정 사전 안내",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n개인정보처리방침이 일부 개정될 예정이어서 사전 안내드립니다.\n개정 내용은 시행일 이전에 다시 공지하겠습니다.\n\n감사합니다.",
    attachment: null,
    views: 410,
    createdAt: "2026-10-02T03:00:00.000Z",
  },
  {
    id: "54fa72f7-69f0-4a29-82b7-b388ec8250a3",
    category: "공지",
    isImportant: false,
    title: "반려동물 의류 사이즈 측정 및 추천 가이드",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n우리 아이에게 꼭 맞는 사이즈를 고를 수 있도록 측정 방법과 추천 가이드를 안내드립니다.\n\n1. 목 둘레: 목 중간 부분을 느슨하게 측정\n2. 가슴 둘레: 앞다리 바로 뒤쪽의 가장 넓은 부분을 측정\n3. 등 길이: 목덜미에서 꼬리 시작점까지 측정\n\n자세한 내용은 첨부파일을 참고해주세요.",
    attachment: { name: "groomingday_size_guide.pdf", size: 2411724 },
    views: 3890,
    createdAt: "2026-09-20T03:00:00.000Z",
  },
  {
    id: "233513f8-2286-4432-b9ab-d9d7467f43bb",
    category: "공지",
    isImportant: false,
    title: "추석 연휴 배송 마감 및 상담 운영 안내",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n추석 연휴 기간의 배송 마감 및 상담 운영 일정을 안내드립니다.\n연휴 전 배송을 원하시는 경우 마감 시간 이전에 주문해주시기 바랍니다.\n\n감사합니다.",
    attachment: null,
    views: 1120,
    createdAt: "2026-09-10T03:00:00.000Z",
  },
  {
    id: "59a696ee-6583-43b6-a43a-5f068978d4af",
    category: "이벤트",
    isImportant: false,
    title: "그루밍데이 포토 후기 퀸 & 킹 이벤트 당첨자 발표",
    author: AUTHOR,
    content:
      "안녕하세요, 그루밍데이입니다.\n\n포토 후기 퀸 & 킹 이벤트에 참여해주신 모든 분들께 감사드립니다.\n당첨자분들께는 개별 안내를 드렸으니 확인 부탁드립니다.\n\n감사합니다.",
    attachment: null,
    views: 850,
    createdAt: "2026-09-01T03:00:00.000Z",
  },
];
