# 📘 DayAndHome 벤치마킹 기반 프론트엔드 통합 PRD & AI 에이전트 가이드

---

## 1. 전체 PRD (Product Requirement Document - Full)

### 1.1 프로젝트 개요
- **프로젝트명**: DayAndHome Next-Gen E-Commerce Platform
- **목적**: 반려동물 및 라이프스타일 용품 커머스 사이트(`dayandhome.com`) 역추적 분석을 통한 고성능, High-UX 쇼핑몰 플랫폼 구축
- **주요 타겟**: 2040 반려동물 가구 및 인테리어/라이프스타일 관심 고객
- **핵심 가치**: 직관적인 상품 탐색, 신속한 주문 및 장바구니/옵션 처리, 감성적인 비주얼 중심 UX, 높은 모바일 호환성

### 1.2 주요 기능 명세 (Feature Specifications)

#### 메인 페이지 & 레이아웃 (Main & Layout)
- **GNB/Header**:
  - 스티키(Sticky) 또는 프로그레시브 헤더 적용
  - 글로벌 메인 메뉴 (ALL, SHOP, BRAND, COMMUNITY 등)
  - 검색창, 마이페이지, 장바구니 (장바구니 담긴 수량 뱃지 표시)
- **메인 배너 스위퍼 (Hero Banner Slider)**: 프로모션 및 시즌 신상품 비주얼 강조
- **상품 큐레이션 섹션**: Time Sale / Best Item / New Arrival / MD Pick 카테고리별 그리드 배치
- **Footer**: 사업자 정보, 고객센터, 약관 링크, 해외/국내 배송 안내

#### 상품 리스트 및 상세 (Catalog & Product Detail)
- **상품 카테고리 필터링**: 카테고리별/가격별/신상품순/인기순 정렬
- **상품 상세 페이지**:
  - 갤러리형 메인/서브 이미지 뷰어
  - 옵션 선택기 (색상, 사이즈, 추가 구성 등)
  - 수량 변경 및 실시간 합계 금액 계산
  - 바로 구매하기 / 장바구니 담기 / 관심상품(Wishlist) 등록
  - 상세 정보 탭 (상세설명, 구매후기/리뷰, Q&A, 배송/반품안내)

#### 장바구니 및 결제 (Cart & Checkout)
- **장바구니 (Basket)**:
  - 국내배송 / 해외배송 탭 분리 UI
  - 옵션 변경, 수량 변경, 개별/전체 삭제
  - 배송비 실시간 계산 로직
- **주문/결제 (Checkout)**:
  - 배송지 정보 입력 / 기존 배송지 불러오기
  - 쿠폰 및 포인트 적용
  - PG 연동 결제 수단 선택

#### 사용자 시스템 (User System)
- **회원가입/로그인**: 일반 회원가입 및 소셜 로그인 (카카오, 네이버, Google)
- **마이페이지**: 주문/배송 조회, 관심상품, 쿠폰/포인트 관리, 작성한 리뷰 관리

### 1.3 비기능적 요구사항
- **성능**: FCP 1.2초 이내, Lighthouse Performance Score 90점 이상
- **반응형**: Mobile First 접근법 (Mobile < 640px, Tablet < 1024px, Desktop >= 1024px)
- **접근성 및 SEO**: Semantic HTML 사용, Open Graph 태그 적용

---

## 2. 프론트엔드 개발용 PRD (Frontend PRD)

### 2.1 기술 스택 (Tech Stack)
- **Framework**: Next.js (App Router) / React 18+
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, Shadcn UI / Radix UI
- **State Management**: Zustand (전역 상태: 장바구니, 유저, 필터) & TanStack Query (v5)
- **Form & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

### 2.2 컴포넌트 아키텍처
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
├── types/                # TypeScript 타입 정의
└── hooks/                # Custom Hooks
```

### 2.3 핵심 프론트엔드 기능 명세
- **Responsive Layout**: CSS Grid / Flexbox 기반 4열 (Desktop), 2열 (Mobile) 레이아웃
- **Infinite Scroll / Pagination**: TanStack Query `useInfiniteQuery`를 활용한 상품 목록 로딩
- **Option Selector**: 필수/선택 옵션 계층 구조 지원, 단가 계산 및 품절 상태 UI 처리
- **Cart State UI**: 국내/해외배송 탭 전환, Optimistic Updates 적용, `useCartSummary` Hook 분리

---

## 3. 실행용 PRD 요약문서 (Execution Summary)

### 3.1 핵심 개발 목표 (Core MVP Scope)
1. **Header/Footer & Navigation**: Sticky Header, 카테고리 햄버거 메뉴, 반응형 모바일 바텀 네비게이션
2. **Main Landing**: 메인 비주얼 슬라이더, Time Sale 타이머, 카테고리별 그리드
3. **Product Detail**: 이미지 갤러리, 커스텀 옵션 드롭다운, 실시간 합계 금액 반영
4. **Cart System**: 국내/해외배송 탭, 체크박스 선택 결제 금액 계산 UI

### 3.2 모듈별 UI 구현 체크리스트
| 모듈 | 필수 구현 요소 | 상태 관리 요구사항 |
| :--- | :--- | :--- |
| **Header** | 검색 팝업, 장바구니 카운트 뱃지, 모바일 Drawer | `useCartStore` 카운터 연동 |
| **ProductCard** | 이미지 호버 효과, Wishlist 하트 버튼, Price Tag | `isLiked` local state |
| **ProductDetail** | 메인/썸네일 갤러리, 옵션 선택기, 수량 조절 (+/-) | `selectedOptions` array state |
| **Cart** | 선택 삭제, 수량 변동, 국내/해외 배송 구분 | Zustand 전역 스토어 동기화 |

### 3.3 타입 정의 (TypeScript Schema Snippet)
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  discountRate: number;
  category: string;
  images: string[];
  options: ProductOption[];
  isTimeSale?: boolean;
}

export interface ProductOption {
  id: string;
  name: string; // 예: "색상", "사이즈"
  values: { label: string; extraPrice: number; stock: number }[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  selectedOption: string;
  quantity: number;
  price: number;
  isShippingOverseas: boolean;
}
```

---

## 4. 개발용 AI Agent 가이드 (AI Developer Agent Rules)

### 4.1 역할 및 컨텍스트
- 당신은 **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** 전문 라이프스타일 커머스 웹 개발 AI 에이전트입니다.
- 목표: `dayandhome.com` 스타일의 완성도 높은 반응형 이커머스 앱을 구현하는 것입니다.

### 4.2 기본 실행 원칙
- **Strict TypeScript**: `any` 타입을 엄격히 금지합니다. 모든 데이터 구조에 explicit interface를 정의하세요.
- **Component Design**: 
  - 기본적으로 Server Component를 활용하고, 상태나 브라우저 API가 필요한 경우에만 `'use client'`를 선언하세요.
  - 컴포넌트는 단일 책임 원칙에 따라 작고 모듈화된 상태로 유지하세요.
- **Styling**: Tailwind CSS만 사용하며, 하드코딩된 스타일이나 외부 `.css` 파일 작성을 지양하세요.

---

## 5. 디자이너 에이전트 가이드 (Designer Agent Guidelines)

### 5.1 디자인 컨셉 & 브랜드 아이덴티티
- **Tone & Mood**: Minimal, Warm Lifestyle, Clean & Cozy (북유럽 감성 + 정갈한 라이프스타일/반려동물 용품 숍)
- **Primary Goal**: 상품 비주얼(이미지)을 강조하고 구매 전환(CTA)까지 노이즈 없는 간결한 동선 제공

### 5.2 디자인 시스템 토큰
- **Colors**:
  - Primary: `Zinc-900` (`#18181b`) - 텍스트, 주 타이틀
  - Secondary: `Stone-600` (`#57534e`) - 서브 텍스트, 설명
  - Background Main: `Stone-50` (`#fafaf9`) - 전체 배경
  - Surface / Card: `White` (`#ffffff`) - 카테고리 및 상품 카드
  - Accent / Point: `Amber-700` (`#b45309`) 또는 `Rose-600` (`#e11d48`) - 타임세일, 할인율
- **Typography**:
  - Headings: `text-xl` ~ `text-3xl` (Font SemiBold/Bold)
  - Body: `text-sm` ~ `text-base`
  - Caption: `text-xs` (`Stone-500`)

---

## 6. 개발자용 에이전트 가이드 (Developer Agent Guidelines)

### 6.1 코드 작성 표준
- 인터랙션 요소(버튼, 수량 카운터, 폼 입출력)는 `'use client'` 클라이언트 컴포넌트로 분리합니다.
- 상태 관리는 Zustand 스토어를 이용하며, `persist` 미들웨어로 장바구니 데이터를 로컬에 유지합니다.

### 6.2 Zustand Cart Store 구현 표준 스니펫
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOption?: string;
  isOverseas?: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);