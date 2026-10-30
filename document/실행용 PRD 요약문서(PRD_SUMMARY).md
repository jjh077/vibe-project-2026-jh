# [실행용 PRD 요약] DayAndHome 바이브 코딩 MVP 개발 요약본

## 1. 핵심 개발 목표 (Core MVP Scope)
빠른 바이브 코딩 및 고품질 프론트엔드 출력을 위해 MVP 기능에 집중함.
1. **Header/Footer & Navigation**: Sticky Header, 카테고리 햄버거 메뉴, 반응형 모바일 바텀 네비게이션
2. **Main Landing**: 메인 비주얼 슬라이더, Time Sale 타이머, 카테고리별 그리드(베스트, 신상품)
3. **Product Detail**: 이미지 갤러리, 커스텀 옵션 드롭다운, 실시간 합계 금액 반영
4. **Cart System**: 국내/해외배송 탭, 체크박스 선택 결제 금액 계산 UI

## 2. 모듈별 UI 구현 체크리스트

| 모듈 | 필수 구현 요소 | 상태 관리 요구사항 |
| :--- | :--- | :--- |
| **Header** | 검색 팝업, 장바구니 카운트 뱃지, 모바일 Drawer | `useCartStore` 카운터 연동 |
| **ProductCard** | 이미지 호버 효과, Wishlist 하트 버튼, Price Tag (할인율 표시) | `isLiked` local state |
| **ProductDetail**| 메인/썸네일 갤러리, 옵션 선택기, 수량 조절 (+/-) | `selectedOptions` array state |
| **Cart** | 선택 삭제, 수량 변동, 국내/해외 배송 구분 | Zustand 전역 스토어 동기화 |

## 3. 데이터 구조 사양 (Data Schema Type Snippet)

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