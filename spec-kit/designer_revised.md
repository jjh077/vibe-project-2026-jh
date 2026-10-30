# UI/UX Designer Spec-Kit

> 목적: 바이브 코딩 및 AI 에이전트가 사이트의 정보 구조, 시각 디자인, 반응형 레이아웃, 인터랙션, 접근성을 일관되게 설계·구현하도록 돕는 실무 기준.
>
> 적용 범위: HTML5, CSS3, JavaScript 기반 웹사이트. 프레임워크 사용 여부와 관계없이 적용할 수 있으며, 실제 프로젝트의 기술 스택과 기존 코드 구조를 우선한다.

---

## 1. 기본 원칙

1. **요구사항 우선**: 디자인 토큰이나 예시값을 사이트의 브랜드 가이드보다 우선하지 않는다. 브랜드 가이드, 제공된 시안, 기존 사이트, 사용자 요구사항이 있으면 이를 먼저 분석한다.
2. **일관성**: 색상, 타이포그래피, 간격, 모서리, 그림자, 컴포넌트 상태를 공통 규칙으로 관리한다.
3. **사용성 우선**: 시각적 완성도뿐 아니라 정보 우선순위, 가독성, 탐색 편의성, 입력 편의성을 고려한다.
4. **반응형 우선**: 특정 기기 화면을 축소하는 방식이 아니라 콘텐츠가 자연스럽게 재배치되도록 설계한다.
5. **필요한 만큼만 설계**: 요구사항에 없는 복잡한 애니메이션, 컴포넌트, 장식 요소를 임의로 추가하지 않는다.
6. **기존 프로젝트 존중**: 기존 디자인 시스템과 구현 방식이 있다면 먼저 파악하고, 합리적인 이유 없이 전면 교체하지 않는다.

## 2. 디자인 시스템 및 토큰

### 2.1 토큰 관리 원칙

- 색상, 글꼴, 글자 크기, 간격, 테두리, 그림자, 모션 값은 가능한 한 CSS Custom Properties로 관리한다.
- 컴포넌트에서 반복되는 값을 임의의 하드코딩 값으로 계속 추가하지 않는다.
- 아래 값은 **초기 기본값 예시**이며, 프로젝트의 브랜드 컬러·시안·콘텐츠에 맞게 조정한다.
- 의미 기반 토큰(`--color-text-primary`)을 우선 사용하고, 원시 팔레트 값은 토큰 정의 영역에서 관리한다.
- 한 번 정한 토큰의 이름과 의미를 프로젝트 전체에서 일관되게 사용한다.

### 2.2 토큰 예시

```css
:root {
  /* Color primitives: 프로젝트 브랜드에 맞게 조정 */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-500: #71717a;
  --color-neutral-700: #3f3f46;
  --color-neutral-900: #18181b;

  /* Semantic colors */
  --color-primary: #18181b;
  --color-primary-hover: #3f3f46;
  --color-accent: #b45309;
  --color-danger: #dc2626;
  --color-success: #15803d;
  --color-warning: #a16207;

  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-surface-muted: #fafafa;
  --color-text-primary: #18181b;
  --color-text-secondary: #52525b;
  --color-text-muted: #71717a;
  --color-border: #e4e4e7;
  --color-focus: #2563eb;

  /* Typography */
  --font-family-base: Pretendard, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-family-mono: "JetBrains Mono", monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-heading: 1.2;
  --line-height-body: 1.6;

  /* Spacing: 4px 기반 */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Shape and elevation */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.08);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / 0.12);

  /* Motion */
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Layout */
  --container-max: 1200px;
  --page-gutter: 1rem;
}

@media (min-width: 768px) {
  :root {
    --page-gutter: 1.5rem;
  }
}
```

## 3. 레이아웃 및 반응형 규칙

### 3.1 공통 레이아웃

- 전역 `box-sizing: border-box`를 적용한다.
- 주요 콘텐츠는 일관된 컨테이너 폭과 좌우 여백을 사용한다.
- 컨테이너 중앙 정렬이 필요한 경우 `max-width`와 좌우 `auto` margin을 사용한다.
- `overflow-x: hidden`을 전역 또는 모든 부모 요소에 무조건 적용하지 않는다. 가로 넘침의 원인을 찾아 수정하고, 캐러셀 등 의도된 가로 스크롤은 유지한다.
- 고정 헤더·푸터·플로팅 버튼은 콘텐츠를 가리지 않는지 확인하고, 필요한 경우 스크롤 여백을 제공한다.
- 이미지와 미디어는 컨테이너를 벗어나지 않도록 크기와 비율을 관리한다.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
  background: var(--color-bg);
}

img,
svg,
video {
  max-width: 100%;
}

.container {
  width: min(100% - (var(--page-gutter) * 2), var(--container-max));
  margin-inline: auto;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3.2 Breakpoint 가이드

브레이크포인트는 기기 이름에 고정하기보다 콘텐츠가 더 이상 자연스럽게 배치되지 않는 지점을 기준으로 선택한다. 다음 값은 시작점 예시다.

- Small: `0–639px` — 모바일 기본 단일 열, 필요 시 작은 카드 그리드
- Medium: `640–1023px` — 태블릿 및 좁은 창, 2열 중심
- Large: `1024–1279px` — 데스크톱 레이아웃
- Extra Large: `1280px 이상` — 넓은 화면, 최대 콘텐츠 폭 제한

모바일 우선으로 기본 스타일을 작성하고 `min-width` 미디어쿼리로 확장한다. 카드 열 수, 내비게이션 표시 방식, 여백은 실제 콘텐츠와 시안에 따라 조정한다. 320px 너비에서도 핵심 기능이 잘리지 않는지 확인한다.

### 3.3 반응형 검증

최소한 다음 화면 폭에서 확인한다.

- 320px / 360px / 390px
- 768px
- 1024px
- 1280px / 1440px

검증 항목: 가로 스크롤, 텍스트 잘림, 이미지 비율, 카드 열 수, 메뉴 전환, 버튼 터치 영역, 고정 요소의 콘텐츠 가림.

## 4. 타이포그래피 및 콘텐츠

- 제목과 본문 사이에 명확한 위계가 있어야 한다.
- 본문은 충분한 글자 크기와 줄 간격을 확보하고, 한 줄 길이가 지나치게 길어지지 않게 한다.
- 긴 제목이나 실제 운영 콘텐츠가 들어와도 레이아웃이 깨지지 않도록 한다.
- 텍스트를 이미지로 대체하지 않는다. 꼭 필요한 경우를 제외하면 실제 텍스트와 시맨틱 마크업을 사용한다.
- 숫자, 가격, 날짜, 단위 등은 콘텐츠 성격에 맞게 정렬과 표기 형식을 통일한다.

## 5. 컴포넌트 및 인터랙션

### 5.1 공통 상태

인터랙티브 컴포넌트는 해당 요소에 필요한 상태를 구현한다. 모든 요소에 모든 상태를 기계적으로 적용하지 않는다.

- Default: 기본 상태
- Hover: 마우스 호버가 가능한 환경에서만 제공
- Focus-visible: 키보드 탐색 시 식별 가능한 포커스 표시
- Active/Pressed: 클릭 또는 누름에 대한 피드백
- Disabled: 사용 불가 상태와 이유가 시각적으로 구분되는 상태
- Loading: 비동기 처리 중인 경우
- Error/Success: 입력 및 처리 결과를 알려야 하는 경우
- Empty: 목록이나 검색 결과가 없는 경우

```css
:where(button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    /* 프로젝트 토큰에 맞는 hover 스타일 */
  }
}

.button:active {
  /* 눌림 피드백은 과도하지 않게 적용 */
}

.button:disabled,
.button[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.55;
}
```

- `pointer-events: none`을 disabled 처리의 유일한 수단으로 사용하지 않는다. 실제 `<button disabled>` 등 의미에 맞는 HTML 속성도 함께 사용한다.
- 링크는 이동, 버튼은 동작에 사용한다.
- 메뉴, 모달, 탭, 아코디언, 드롭다운 등은 열림/닫힘, 선택, 포커스 이동, 바깥 클릭 및 Escape 처리 등 필요한 동작을 명확히 정의한다.
- 터치 환경에서는 hover만으로 중요한 정보나 기능을 제공하지 않는다.

## 6. 접근성(A11y)

목표 기준은 WCAG 2.2 AA를 참고한다. 프로젝트의 법적·서비스상 요구사항이 더 엄격하면 해당 기준을 우선한다.

1. 일반 텍스트 대비는 최소 4.5:1, 큰 텍스트는 최소 3:1을 확보한다.
2. 의미가 있는 UI 구성요소 및 그래픽의 대비는 관련 WCAG 기준을 확인한다. 장식용 아이콘까지 일률적으로 판단하지 않는다.
3. 색상만으로 오류, 선택, 상태를 전달하지 않는다.
4. 아이콘 단독 버튼에는 목적을 설명하는 접근 가능한 이름을 제공한다(`aria-label` 등).
5. 이미지에는 목적에 맞는 대체 텍스트를 제공한다. 장식 이미지는 빈 alt(`alt=""`)를 사용한다.
6. 폼 입력에는 연결된 `<label>`을 제공하고, 오류 메시지를 해당 입력과 연결한다.
7. 키보드만으로 모든 주요 기능을 사용할 수 있어야 하며 포커스 순서가 논리적이어야 한다.
8. 모달이 열리면 포커스를 내부로 이동시키고, 닫힐 때 호출 요소로 돌려보낸다. 필요한 경우 포커스 트랩을 구현한다.
9. 제목 태그는 문서 구조에 맞게 사용하고, 랜드마크(`<header>`, `<nav>`, `<main>`, `<footer>`)를 적절히 구성한다.
10. 자동 재생, 깜박임, 과도한 모션을 피하고 `prefers-reduced-motion`을 존중한다.
11. 터치 타깃은 가능하면 44×44 CSS px 이상을 권장한다. 공간 제약이 있는 경우 WCAG 기준과 인접 타깃 간격을 함께 확인한다.

## 7. 이미지 및 미디어

- 실제 제공된 이미지와 브랜드 에셋을 우선 사용한다. 임의로 다른 브랜드 이미지나 출처가 불명확한 이미지를 사용하지 않는다.
- 이미지 비율이 중요하면 `aspect-ratio`와 `object-fit`을 명시한다.
- 콘텐츠 이미지와 장식 이미지를 구분해 alt를 작성한다.
- 지연 로딩(`loading="lazy"`)은 초기 화면 밖의 이미지에 적용하고, 주요 LCP 이미지에는 무조건 적용하지 않는다.
- 이미지가 없거나 로드에 실패하는 경우 레이아웃이 무너지지 않도록 대체 상태를 마련한다.

## 8. 디자인 완료 체크리스트

- [ ] 제공된 시안·브랜드 가이드·요구사항을 우선 반영했는가?
- [ ] 색상·타이포그래피·간격·컴포넌트 규칙이 일관적인가?
- [ ] 모바일·태블릿·데스크톱에서 콘텐츠가 자연스럽게 재배치되는가?
- [ ] 가로 넘침, 잘림, 겹침, 이미지 왜곡이 없는가?
- [ ] 버튼·링크·폼·메뉴의 상태와 피드백이 명확한가?
- [ ] 키보드 포커스와 접근성 이름이 제공되는가?
- [ ] 대비, 대체 텍스트, 폼 레이블, 모션 감소를 확인했는가?
- [ ] 로딩·빈 화면·오류 등 필요한 상태가 설계되어 있는가?
- [ ] 불필요한 장식이나 요구사항에 없는 기능을 추가하지 않았는가?
