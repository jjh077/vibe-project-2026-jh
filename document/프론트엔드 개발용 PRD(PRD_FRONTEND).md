# [프론트엔드 PRD] DayAndHome 웹 애플리케이션 프론트엔드 명세서

## 1. 기술 스택 (Tech Stack)
- **Framework**: Next.js (App Router) / React 18+
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, Shadcn UI / Radix UI
- **State Management**: Zustand (전역 상태: 장바구니, 유저, 필터) & TanStack Query (v5)
- **Form & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

## 2. 컴포넌트 아키텍처 (Component Architecture)

```
src/
├── app/                  # Next.js App Router 페이지
│   ├── (auth)/           # 로그인, 회원가입
│   ├── products/         # 상품 목록 및 상세
│   ├── cart/             # 장바구니 페이지
│   └── page.tsx          # 메인 랜딩 페이지
├── components/
│   ├── ui/               # Button, Modal, Input 등 원자 단위 컴포넌트
│   ├── common/           # Header, Footer, Navigation Bar
│   ├── product/          # ProductCard, ProductGallery, OptionSelector
│   └── cart/             # CartItemList, PriceSummary
├── store/                # Zustand 전역 스토어 (useCartStore, useUserStore)
├── types/                # TypeScript 타입 정의 (product.ts, cart.ts)
└── hooks/                # Custom Hooks (useCart, useProductFilter)
```

## 3. 핵심 프론트엔드 기능 명세

### 3.1 메인 및 상품 목록
- **Responsive Layout**: CSS Grid / Flexbox 기반 4열 (Desktop), 2열 (Mobile) 레아아웃
- **Infinite Scroll or Pagination**: TanStack Query `useInfiniteQuery`를 활용한 상품 목록 로딩

### 3.2 상품 상세 및 옵션 UI
- **Option Selector**: 
  - 필수 옵션 / 선택 옵션 계층 구조 지원
  - 선택된 옵션의 조합에 따른 단가 계산 및 품절 상태 UI 처리
- **Image Zoom & Carousel**: Swiper.js 또는 Embla Carousel 기반 썸네일 동기화 slider

### 3.3 장바구니 (Cart State UI)
- **Tab Switching**: [국내배송 장바구니] <-> [해외배송 장바구니]
- **Optimistic Updates**: 장바구니 수량 변경 및 삭제 시 UI 즉시 반영 (실패 시 Rollback)
- **Calculated State**: 선택된 상품 금액, 배송비, 할인 금액 계산 로직 Hook 분리 (`useCartSummary`)

## 4. 디자인 시스템 기본 가이드 (Design Token)
- **Colors**:
  - Primary: `#222222` (Charcoal Black)
  - Secondary: `#8D7B68` (Warm Warm Beige/Wood)
  - Background: `#FAF9F6` (Off White)
  - Accent/Alert: `#E54D2E` (Sale / Point Color)
- **Typography**: Pretendard / Sans-serif (Line-height: 1.5, Headings: SemiBold~Bold)