# [전체 PRD] dayandhome 기반 E-Commerce 플랫폼

## 1. 프로젝트 개요 (Overview)
- **프로젝트명**: DayAndHome Next-Gen E-Commerce Platform
- **목적**: 반려동물 및 라이프스타일 용품 커머스 사이트(dayandhome.com)의 역추적 분석을 통한 고성능, High-UX 쇼핑몰 플랫폼 구축
- **주요 타겟**: 2040 반려동물 가구 및 인테리어/라이프스타일 관심 고객
- **핵심 가치**: 직관적인 상품 탐색, 신속한 주문 및 장바구니/옵션 처리, 감성적인 비주얼 중심 UX, 높은 모바일 호환성

## 2. 주요 기능 명세 (Feature Specifications)

### 2.1 메인 페이지 & 레이아웃 (Main & Layout)
- **GNB/Header**:
  - 스티키(Sticky) 또는 프로그레시브 헤더 적용
  - 글로벌 메인 메뉴 (ALL, SHOP, BRAND, COMMUNITY 등)
  - 검색창, 마이페이지, 장바구니 (장바구니 담긴 수량 뱃지 표시)
- **메인 배너 스위퍼 (Hero Banner Slider)**:
  - 프로모션 및 시즌 신상품 비주얼 강조
- **상품 큐레이션 섹션**:
  - Time Sale / Best Item / New Arrival / MD Pick 카테고리별 그리드 배치
- **Footer**:
  - 푸터 사업자 정보, 고객센터, 약관 링크, 해외/국내 배송 및 장바구니 처리 안내 안내문구 포함

### 2.2 상품 리스트 및 상세 (Catalog & Product Detail)
- **상품 카테고리 필터링**: 카테고리별/가격별/신상품순/인기순 정렬 기능
- **상품 상세 페이지**:
  - 갤러리형 메인/서브 이미지 뷰어
  - 옵션 선택기 (색상, 사이즈, 파일첨부 옵션 등)
  - 수량 변경 및 실시간 합계 금액 계산
  - 바로 구매하기 / 장바구니 담기 / 관심상품(Wishlist) 등록
  - 상품 상세 정보 탭 (상세설명, 구매후기/리뷰, Q&A, 배송/반품안내)

### 2.3 장바구니 및 결제 (Cart & Checkout)
- **장바구니 (Basket)**:
  - 국내배송 / 해외배송 탭 분리 UI
  - 옵션 변경, 수량 변경, 개별/전체 삭제
  - 무이자할부 안내 및 배송비 실시간 계산 로직
- **주문/결제 (Checkout)**:
  - 배송지 정보 입력 / 기존 배송지 불러오기
  - 쿠폰 및 포인트 적용
  - PG 연동 결제 수단 선택 (신용카드, 간편결제 등)

### 2.4 사용자 시스템 (User System)
- **회원가입/로그인**: 일반 회원가입 및 소셜 로그인 (카카오, 네이버, Google)
- **마이페이지**: 주문/배송 조회, 관심상품, 쿠폰/포인트 관리, 작성한 리뷰 관리

## 3. 비기능적 요구사항 (Non-Functional Requirements)
- **성능 (Performance)**: First Contentful Paint (FCP) 1.2초 이내, Lighthouse Performance Score 90점 이상
- **반응형 (Responsiveness)**: Mobile First 접근법, Breakpoints (Mobile < 640px, Tablet < 1024px, Desktop >= 1024px)
- **접근성 및 SEO**: Semantic HTML 사용, Open Graph 태그 적용