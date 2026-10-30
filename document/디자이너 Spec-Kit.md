# 🎨 Designer Spec-Kit (Vanilla Web Standards)

## 1. Design Tokens & CSS Variables (`styles/variables.css`)

프로젝트 전체에서 일관되게 사용해야 하는 표준 CSS 변수 정의입니다.

```css
:root {
  /* Color Palette - Warm Lifestyle & Modern */
  --color-primary: #18181b;       /* Zinc-900 (주 타이틀, 메인 텍스트) */
  --color-secondary: #57534e;     /* Stone-600 (서브 텍스트, 설명) */
  --color-accent: #b45309;        /* Amber-700 (할인율, 뱃지, 강조) */
  --color-accent-hover: #92400e;  /* Amber-800 */
  --color-bg-main: #fafaf9;       /* Stone-50 (메인 배경) */
  --color-surface: #ffffff;       /* White (카드, 모달, 상단바) */
  --color-border: #e7e5e4;        /* Stone-200 (선, 테두리) */
  --color-disabled: #d6d3d1;      /* Stone-300 */

  /* Typography System */
  --font-family-base: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;

  /* Spacing System (8pt Grid Standard) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */

  /* Elevation & Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transition Standard */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 2. Layout & Grid Rules

### Breakpoints
- **Mobile**: `< 640px` (기본 스타일, Mobile First)
- **Tablet**: `640px ~ 1023px`
- **Desktop**: `>= 1024px` (최대 레이아웃 폭: `1200px`)

### Container Specs
- 메인 컨테이너 최대 너비: `max-width: 1200px; margin: 0 auto; padding: 0 var(--space-4);`
- 모바일 카드 그리드: `grid-template-columns: repeat(2, 1fr); gap: var(--space-3);`
- 데스크톱 카드 그리드: `grid-template-columns: repeat(4, 1fr); gap: var(--space-6);`

## 3. UI Element Visual Standards

1. **상품 카드 (Product Card)**:
   - Aspect Ratio: `1:1` 또는 `4:5`
   - Image Hover State: 이미지 `transform: scale(1.03)` 부드러운 스케일 변환 적용.
   - Badge: 할인율은 `--color-accent` 강조, 품절은 배경 `--color-disabled` 적용.

2. **버튼 (Button Component)**:
   - Primary: Background `--color-primary`, Text `#FFFFFF`, Hover `--color-secondary`.
   - Outline: Border `1px solid --color-border`, Text `--color-primary`, Background Transparent.
   - Active/Press State: `transform: scale(0.98)`의 시각적 피드백 제공.

3. **모달 및 드로어 (Modal & Drawer)**:
   - Overlay: `background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);`
   - Entry Animation: Fade-in 및 Slide-up (`300ms`).