# [Designer Agent Guidelines] UI/UX & Design System Standard

## 1. Design Concept & Brand Identity
- **Tone & Mood**: Minimal, Warm Lifestyle, Clean & Cozy (북유럽 감성 + 정갈한 라이프스타일/반려동물 용품 숍)
- **Primary Design Goal**: 상품 비주얼(이미지)을 극대화하면서, 구매 전환(CTA)까지 노이즈 없는 간결한 동선 구축

## 2. Design System Tokens

### Colors
- **Primary**: `Zinc-900` (`#18181b`) - 텍스트, 주 타이틀
- **Secondary**: `Stone-600` (`#57534e`) - 서브 텍스트, 설명
- **Background Main**: `Stone-50` (`#fafaf9`) - 전체 배경
- **Surface / Card**: `White` (`#ffffff`) - 상품 카드를 비롯한 컨테이너
- **Accent / Point**: `Amber-700` (`#b45309`) 또는 `Rose-600` (`#e11d48`) - 타임세일, 할인율 표시

### Typography & Spacing
- **Font Family**: Sans-serif, Pretendard fallback system
- **Sizes**:
  - Hero Header: `text-3xl` ~ `text-5xl` (Bold)
  - Section Title: `text-xl` ~ `text-2xl` (Font SemiBold)
  - Body Text: `text-sm` ~ `text-base` (Regular)
  - Caption/Meta: `text-xs` (Text Stone-500)
- **Spacing**: Tailwind Grid System (`gap-4`, `gap-6`, `p-4`, `py-12`)

## 3. Layout & UI Rules
- **Product Card**:
  - Aspect Ratio: `aspect-[4/5]` 또는 `aspect-square`
  - Subtle Zoom-in Hover animation (`group-hover:scale-105 transition-transform`)
  - Sticky Cart / Quick Buy Bar on Mobile Product Detail Page
- **Navigation**:
  - Sticky Top Bar with `backdrop-blur-md bg-white/80`