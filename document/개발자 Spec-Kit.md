# 💻 Developer Spec-Kit (Vanilla JS Architecture & Code Standard)

## 1. Directory & File Structure Standard

프레임워크 없이 바닐라 환경에서 모듈성과 가독성을 유지하기 위한 디렉터리 구조입니다.

```text
root/
├── index.html              # 메인 랜딩 페이지
├── pages/                  # 서브 페이지
│   ├── product-detail.html # 상품 상세 페이지
│   └── cart.html           # 장바구니 페이지
├── styles/                 # CSS 스타일시트
│   ├── variables.css       # Design Tokens / CSS 변수
│   ├── reset.css           # CSS Reset 표준
│   ├── components.css      # 공통 컴포넌트 (버튼, 카드, 모달 등)
│   └── main.css            # 페이지 레이아웃 및 메인 스타일
├── js/                     # JavaScript 스크립트 (ES6 Modules)
│   ├── app.js              # 엔트리 포인트 (페이지 공통 실행 로직)
│   ├── components/         # DOM 조작 컴포넌트 모듈
│   │   ├── Header.js
│   │   ├── ProductCard.js
│   │   └── CartDrawer.js
│   ├── store/              # 전역 상태 관리 (Pub/Sub pattern)
│   │   └── cartStore.js
│   └── utils/              # 유틸리티 함수 (포맷팅, Fetching)
│       ├── api.js
│       └── formatters.js
└── assets/                 # 이미지, 파비콘, 폰트 리소스
```

## 2. JavaScript Architectural Principles

### 2.1 ES6+ Module System
- 모든 JS 파일은 `<script type="module" src="...">`를 통해 ES6 모듈 방식으로 캡슐화합니다.
- 전역 변수 오염을 방지하고 `import` / `export` 명세만 사용합니다.

### 2.2 Lightweight State Management (Observer / Pub-Sub Pattern)
장바구니 상태 등 전역 데이터는 바닐라 Pub-Sub 구조를 작성하여 관리합니다.

```javascript
// js/store/cartStore.js
class CartStore {
  constructor() {
    this.state = JSON.parse(localStorage.getItem('cart_items')) || [];
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addItem(item) {
    const existingIndex = this.state.findIndex(i => i.id === item.id && i.option === item.option);
    if (existingIndex > -1) {
      this.state[existingIndex].quantity += item.quantity;
    } else {
      this.state.push(item);
    }
    this._notify();
  }

  removeItem(id) {
    this.state = this.state.filter(item => item.id !== id);
    this._notify();
  }

  _notify() {
    localStorage.setItem('cart_items', JSON.stringify(this.state));
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const cartStore = new CartStore();
```

### 2.3 Component Rendering Protocol
DOM 생성 및 이벤트 바인딩은 선언적 패턴으로 작성합니다.

```javascript
// js/components/ProductCard.js
import { formatCurrency } from '../utils/formatters.js';

export function renderProductCard(product) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'product-card';
  cardDiv.dataset.id = product.id;

  const discountedPrice = product.price * (1 - product.discountRate / 100);

  cardDiv.innerHTML = `
    <div class="card-image-wrapper">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="card-img" />
      <button type="button" class="btn-wishlist" aria-label="관심상품 추가">♥</button>
    </div>
    <div class="card-info">
      <span class="card-category">${product.category}</span>
      <h3 class="card-title">${product.name}</h3>
      <div class="card-price-group">
        <span class="discount-rate">${product.discountRate}%</span>
        <strong class="final-price">${formatCurrency(discountedPrice)}</strong>
      </div>
    </div>
  `;

  // Event Delegation or Direct Event Binding
  cardDiv.querySelector('.btn-wishlist').addEventListener('click', (e) => {
    e.stopPropagation();
    cardDiv.querySelector('.btn-wishlist').classList.toggle('active');
  });

  return cardDiv;
}
```

## 3. Performance & Quality Standards

1. **DOM Access Optimization**: `document.querySelector` 빈번한 호출을 지양하고, 부모 요소에 이벤트 위임(Event Delegation)을 적용합니다.
2. **SEO & Accessibility**: Semantic HTML 사용 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), 이미지 필수 `alt` 속성 부여.
3. **Responsive Testing**: CSS Grid / Flexbox 및 Media Queries를 기반으로 별도 JS 레벨의 Resize 렌더링을 최소화합니다.