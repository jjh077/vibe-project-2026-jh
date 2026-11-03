# 그루밍데이(데이캣) 클론 프로젝트

그루밍데이 · 데이캣 공식몰(https://dayandhome.com/) 메인 페이지를 타깃으로 한 UI/UX 설계 및 프론트엔드 구현 프로젝트입니다.
기본 스택은 **HTML5 / CSS3 / Vanilla JavaScript (ES2022+)** 이며, **기존 코드에 이미 프레임워크·빌드 도구가 있으면 그것을 유지**합니다.

---

## 🚨 작업 시작 전 필독 (Agent & Developer Notice)

> **모든 작업(코드 작성·수정·리팩토링)을 시작하기 전에 아래 규약 문서를 정독하고 착수합니다.**

* 📖 **핵심 규약**: 이 문서 아래쪽 「AGENTS.md — 웹 프로젝트 디자인·개발 규약」 전체
  - UI/UX Designer · Frontend Developer 역할, 디자인 기준, 개발 규칙, 반응형, 접근성, 코드 관리·검수 기준이 통합되어 있습니다.
  - **PART 3(그루밍데이 실측 값)** 이 일반 규칙과 충돌하면 우선합니다. 단, 접근성·보안·개인정보 규칙은 PART 3보다 상위입니다.
* 문서의 **MUST / MUST NOT은 예외 없이** 지킵니다.
* 충돌 시 우선순위:

  `접근성·보안` > `사용자가 현재 작업에서 명시한 요구` > `PART 3 (사이트 실측)` > `PART 1·2 (일반 규약)` > `기존 프로젝트 구조` > `성능` > `개인 취향`

---

## 📌 핵심 작업 규칙 요약

### 1. 박스 구조 엄수 (최대 4단계)

동의어 클래스(`container`, `wrapper`, `inner`, `frame`, `row`, `col`)를 쓰지 않습니다.

```text
겉박스 (.outer-box)           ← header / main > section / footer (100% 폭, 배경·세로 여백)
 └─ 속박스 (.inner-box)        ← max-width 1920px + 중앙 정렬 + 좌우 패딩(10 / 20 / 80px)
     └─ 파티션 박스 (.part-box) ← display: flex (페이지 골격에 Grid 금지, 간격은 gap)
         └─ 내용 박스           ← 컴포넌트 단위 (필요 시 내부 Grid 허용)
```

### 2. 값의 신뢰 등급 (원본 분석 결과를 사실처럼 쓰지 않기)

| 표기 | 의미 |
|---|---|
| ✅ 실측 | 원본 CSS/HTML에서 직접 확인한 값 |
| 🧮 계산·추정 | 실측값 조합이나 속성명으로 추정한 값 |
| 🔶 임시 | 제공 자료로 확정 불가. §S7에서 확인 후 교체 |

* 🔶 값을 "사이트의 실제 값"이라고 보고하지 않습니다. 코드에는 `/* 🔶 S7-n */`로 표시합니다.
* 확인하지 못한 값을 추정해 만들어내지 않습니다.

### 3. 디자인 토큰 기반 구현 (하드코딩 금지)

* 색·글자·간격·반경·z-index는 `/css/tokens.css` 변수만 참조합니다.
* **PART 3의 ✅ 실측값이 일반 8pt·타입 스케일보다 우선**합니다 (`15px`, `35px`, `70px`, `160px` 등을 반올림하지 않음).
* 브레이크포인트는 **768px / 1025px** 두 지점만 사용합니다 (`min-width` 방향, 모바일 우선).
* 포인트 색은 갈색(선택 메뉴), 빨강(할인율)으로 한정하고 임의의 유채색을 추가하지 않습니다.

### 4. 클린 & 시맨틱 코드

* 승인되지 않은 외부 라이브러리·CDN·폰트를 추가하지 않습니다.
* `main` 1개, `h1` 1개, 클릭 요소는 `<button>`/`<a>`, 아이콘 버튼에는 `aria-label`.
* 인라인 스타일·`!important`·`id` 선택자·`javascript:` 링크·서술형 AI 주석 금지.

### 5. 원본에서 가져오지 않는 것

* 추적·마케팅 스크립트(Meta Pixel, 네이버 공통, GA 등), jQuery, Slick, Kakao SDK
* Cafe24 클래스(`xans-*`, `ec-*`, `d1-*`)와 viewport의 확대 제한 설정
* **실제 사업자 정보·연락처·계좌 (플레이스홀더로 대체)**, 타사 이미지는 목업용이며 배포 전 교체

---

## 🔄 작업 진행 순서

1. 요청사항 및 관련 문서 확인
2. 기존 소스 코드와 구조 분석
3. 작업 범위·수정 대상 파악
4. 설계 및 개발 (최소 변경)
5. 기능·반응형 화면 검증
6. 변경 사항과 테스트 결과 보고 — **수정한 파일, 핵심 변경, 테스트 결과, 미확인 사항**

> 실행·화면 검증을 하지 못한 항목은 완료로 표시하지 말고 미확인으로 명시합니다.
> 지침 간 충돌이 발생하면 기존 기능을 임의로 훼손하지 말고 충돌 내용을 설명합니다.

---

## 📁 디렉터리 구조 (신규 작성 시 기본값, 기존 구조가 있으면 그쪽 우선)

```text
/
├─ AGENTS.md               # 본 문서 (프로젝트 안내 + 통합 코딩 규약)
├─ index.html              # 메인 진입점
├─ pages/                  # 서브 페이지 (kebab-case.html)
├─ assets/
│  ├─ images/              # webp / avif 우선 (원본은 assets/src/)
│  ├─ icons/               # SVG only
│  └─ fonts/               # woff2 only (Pretendard Variable)
├─ css/
│  ├─ tokens.css           # 디자인 토큰
│  ├─ base.css             # reset + 기본 요소
│  ├─ layout.css           # 겉박스·속박스·파티션 박스
│  ├─ components/          # 컴포넌트 단위 스타일
│  ├─ utilities.css        # .visually-hidden 등 최소 유틸리티
│  └─ main.css             # @layer 순서 + 로드 관리
└─ js/
   ├─ main.js              # 엔트리 (type="module")
   ├─ modules/             # carousel, drawer, popup 등 기능 모듈
   ├─ utils/               # 순수 헬퍼
   └─ config.js            # 상수·셀렉터·설정
```

---

## 📋 완료 전 체크리스트

작업 완료·커밋 전 아래 **AGENTS 규약(PART 0~4)**의 **PART 4 체크리스트**를 자체 검수합니다.

- [ ] 레이아웃: `.outer-box` > `.inner-box` > `.part-box` 구조, 골격에 Grid 없음
- [ ] 토큰 하드코딩 없음, 🔶 값을 실측값으로 단정하지 않음
- [ ] 섹션 종류·세로 순서 유지 (헤더 → 메인 비주얼 → 베스트 상품 → PHOTO REVIEW → 영상 → 스토리 → Shorts → INSTAGRAM → 푸터)
- [ ] 키보드 접근성·시맨틱 마크업, 아이콘 버튼 접근 가능한 이름
- [ ] 슬라이더·팝업: 터치·키보드·자동재생 일시정지·포커스 복귀
- [ ] 추적 스크립트·실제 사업자 정보·`console.log`·`TODO` 없음

---

# AGENTS.md — 웹 프로젝트 디자인·개발 규약 (그루밍데이 / 데이캣)

> **대상**: 이 프로젝트에서 코드를 작성·수정하는 모든 AI 에이전트
> **스택**: HTML5 / CSS3 / Vanilla JavaScript (ES2022+) 기본. **기존 코드에 프레임워크·빌드 도구가 이미 있으면 그것을 유지**한다.
> **페르소나**: Designer = 15년차 시니어 UI/UX 웹디자이너 / Developer = 15년차 시니어 프론트엔드 개발자
> **효력**: `MUST` / `MUST NOT`은 예외 없이 지킨다. `SHOULD`는 합당한 이유를 주석이나 보고에 남기면 벗어날 수 있다.
> **타깃 사이트**: https://dayandhome.com/ (그루밍데이 · 데이캣, Cafe24 + design102 스킨) — **PART 3(SITE SPECIFIC)** 이 PART 1·2의 일반 규칙과 충돌하면 PART 3이 우선한다 (단, 접근성·보안 제외).

---

## 0. 공통 원칙 (Designer·Developer 공통)

### 0.1 작업 순서

1. **읽기** — 작업 전 이 문서, `/css/tokens.css`, 기존 컴포넌트·코드를 먼저 읽는다.
2. **재사용 우선** — 이미 있는 토큰·컴포넌트·유틸리티를 쓴다. 비슷한 것을 새로 만들지 않는다.
3. **최소 변경** — 요청받은 범위만 수정한다. 관련 없는 파일을 "정리"하지 않는다. 동작 중인 코드를 이유 없이 전면 재작성하지 않는다.
4. **자체 검수** — 완료 전 문서 끝의 **PART 4 체크리스트**를 통과시킨다.
5. **불확실하면 질문** — 브랜드·문구·동작이 명세에 없으면 임의로 정하지 말고 가정을 명시하거나 질문한다. 잘못 고르면 영향이 큰 경우에만 묻고, 합리적으로 정할 수 있는 세부사항은 일관된 기본값을 쓰고 보고에 기록한다.
6. **검증 없는 완료 선언 금지** — 실행·화면·테스트를 하지 못했다면 "확인하지 못한 항목"으로 명시한다.

### 0.2 우선순위 (충돌 시)

```
접근성·보안  >  사용자가 현재 작업에서 명시한 요구  >  PART 3(사이트 실측)  >  PART 1·2(일반 규약)  >  기존 프로젝트 구조  >  성능  >  개인 취향
```

- 규약과 사용자 요구가 충돌하면 임의로 판단하지 말고, **규약을 지킨 대안을 제시**한 뒤 사용자가 원하면 위반 사유를 주석·보고에 기록하고 진행한다.
- 기존 동작이 있는 코드는 충돌 내용을 설명하기 전에 훼손하지 않는다.

### 0.3 프로젝트 구조 (신규 작성 시 MUST, 기존 구조가 있으면 그쪽 우선)

```
/
├─ index.html
├─ pages/                  # 하위 페이지 (kebab-case.html)
├─ assets/
│  ├─ images/              # webp/avif 우선, 원본은 /assets/src/
│  ├─ icons/               # SVG only (currentColor)
│  └─ fonts/               # woff2 only
├─ css/
│  ├─ tokens.css           # 디자인 토큰 (색·타입·간격·그림자·모션·z-index)
│  ├─ base.css             # reset + 요소 기본 스타일
│  ├─ layout.css           # 겉박스·속박스(.inner-box)·파티션 박스 (PART 3 §S2)
│  ├─ components/          # 컴포넌트별 1파일 (product-card.css, section-head.css …)
│  ├─ utilities.css        # 최소 유틸리티 (.visually-hidden 등)
│  └─ main.css             # @layer 순서 + @import
└─ js/
   ├─ main.js              # 진입점 (type="module")
   ├─ modules/             # 기능 단위 (nav.js, carousel.js, drawer.js …)
   ├─ utils/               # 순수 함수
   └─ config.js            # 상수·셀렉터·설정
```

- 파일·폴더명은 **kebab-case**, 한글·공백·대문자 금지.
- CSS 적용 순서는 **tokens → base → layout → components → utilities**.

### 0.4 금지 사항 (공통)

- 요청하지 않은 라이브러리·CDN·폰트 추가 금지 (필요하면 이유와 함께 **먼저 제안**). 새 패키지는 필요성·번들 크기·유지보수·보안 영향을 따진다.
- `TODO`, `lorem ipsum`, `asdf`, `test123` 등 임시 값을 완성 산출물에 남기지 않는다.
- 서술형 AI 주석(`// 이 함수는 …`) 금지. 주석은 **왜**를 설명할 때만.
- `console.log`를 남긴 채 완료 금지.
- 실제 API·백엔드가 없으면 임의의 성공 응답을 실제 연동처럼 표현하지 않는다. 목업 데이터는 목업임을 구분해 표시한다.

---

# PART 1. DESIGNER 규약

> **15년차 웹디자이너의 기준**: 장식이 아니라 **정보 위계·일관성·접근성·구현 가능성**으로 판단한다. "예쁜가?"보다 "이유가 있는가?"를 먼저 묻는다.

## 1. 디자인 시작 전 (MUST)

1. **주제·대상·핵심 행동(Primary Job)** 을 한 문장씩 정의한다. 이 사이트: *반려묘 보호자 / 그루밍 상품 탐색 → 상품 상세·구매*.
2. 제공된 시안·브랜드 가이드·참고 사이트가 있으면 **구조·간격·타이포·이미지 비율·반응형 차이를 먼저 분석**한다. 섹션을 임의로 합치거나 누락하거나 순서를 바꾸지 않는다.
3. 새 화면(타깃 사이트에 없는 화면)을 만들 때만 **디자인 계획**(Color 4~6개 / Type 역할 / Layout 한 문장 + ASCII 와이어프레임 / 원칙 1~3개)을 먼저 쓴다. 타깃 사이트에 있는 화면은 PART 3 값을 따른다.
4. **한 곳에만 대담해진다.** 기억에 남는 요소는 하나로 하고 나머지는 조용하게 둔다.

## 2. 디자인 토큰 (MUST)

모든 시각 값은 `/css/tokens.css`의 CSS 변수로만 정의하고, 컴포넌트에서는 **변수만 참조**한다. 하드코딩 값(`#333`, `13px`, `margin: 17px`) 금지.

### 2.1 색상

- **역할 기반 네이밍**(`--color-text`)을 쓰고, 값 기반 네이밍(`--color-gray-500`)은 팔레트 원천에만 사용한다.
- 의미 토큰을 우선하고, 한 번 정한 토큰의 이름·의미는 프로젝트 전체에서 일관되게 쓴다.
- **대비비(WCAG 2.2 AA)**: 본문 텍스트 ≥ **4.5:1**, 큰 텍스트(24px↑ 또는 18.66px↑ bold)와 UI 경계 ≥ **3:1**.
- 상태(성공·경고·오류)는 아이콘·텍스트와 함께 쓰고 **색만으로 전달하지 않는다**.
- 다크 모드는 이 사이트에 없으므로 **만들지 않는다**(요청 시에만).

### 2.2 타이포그래피

- 서체는 **최대 2종**. 한글 기본은 Pretendard + 폴백 스택 필수. *(이 사이트: PART 3 §S4.1 — Pretendard Variable 단일)*
- **타입 스케일은 토큰화**하고 임의 크기를 만들지 않는다. *(이 사이트: PART 3 §S4.2의 실측 크기만 사용)*
- 행간: 한글 본문 **1.6~1.8**, 제목 **1.2~1.35**. *(이 사이트의 UI 텍스트는 §S4.2 값 우선)*
- `word-break: keep-all; overflow-wrap: anywhere;` 로 한글 단어 단위 줄바꿈.
- 폰트 굵기는 **토큰화된 단계만**(이 사이트 400/500/600/700 — §S4.1).
- "생성형 티" 타이포 금지: 제목의 한 단어만 색/이탤릭 강조, 모든 라벨 대문자+자간 확대, 모든 섹션 위 임의 eyebrow.

### 2.3 간격·레이아웃

- 간격은 토큰으로만. 일반 규칙은 4·8pt 계열이지만 **이 사이트는 PART 3의 ✅ 실측값(10px, 15px, 35px, 70px, 80px, 160px 등)이 우선**한다. 임의로 8pt에 반올림하지 않는다.
- **근접성 원칙**: 관련 요소는 가깝게, 무관한 요소는 멀게.
- 페이지 박스 구조(폭·패딩·정렬)는 **PART 3 §S2**를 따른다 (겉박스 > `.inner-box` > 파티션 박스).
- 페이지 골격에 CSS Grid를 쓰지 않는다. 파티션은 Flex, Grid는 **내용 박스 내부에서만** 허용한다.
- 섹션 수직 리듬은 **한 가지 방식**(겉박스 `padding-block`)으로만 정의한다.

### 2.4 형태·깊이·모션

- `border-radius`·그림자는 토큰 단계 이내. *(이 사이트: 3 / 5 / 8 / 14px, 원형 — §S3.2)*
- 구분선·테두리·번호는 **정보를 전달할 때만** 쓴다.
- 모션 토큰: `--duration-fast: 120ms; --duration-base: 200ms; --duration-slow: 350ms; --ease-standard: cubic-bezier(.2,0,0,1);` *(원본의 사이드 패널은 0.35s ease-in-out — §S6)*
- **사용자 행동에 반응하는 모션**(열림·닫힘·피드백)을 우선한다. 행동과 무관한 모션은 원본에 있는 것(섹션 제목 fade-in-up, 메인 슬라이드)만 허용한다.
- `transform`, `opacity`만 애니메이션한다. **`prefers-reduced-motion: reduce` 대응 필수**.

## 3. 컴포넌트 디자인 규칙

### 3.1 공통 상태 (해당 요소에 필요한 상태만 구현)

`default · hover · focus-visible · active · disabled` + (해당 시) `loading · error · selected · empty`

- **포커스 링은 반드시 보여야 한다.** `outline: none` 단독 금지.
  ```css
  :where(a, button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])):focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
  ```
- 터치 타깃 **최소 44×44px** 권장(WCAG 2.2 AA 최소 24×24). 공간 제약이 있으면 인접 타깃 간격과 함께 확인.
- hover만으로 정보·기능을 제공하지 않는다. hover 스타일은 `@media (hover: hover) and (pointer: fine)` 안에서만.
- `disabled`는 `pointer-events: none` 단독이 아니라 실제 `<button disabled>` / `aria-disabled`를 함께 쓴다.

### 3.2 버튼·폼·내비게이션

- 버튼 위계: Primary → Secondary → Tertiary(텍스트). 라벨은 행동을 설명하는 능동형("장바구니 담기" ✕ "확인").
- 폼은 **항상 보이는 `<label>`**, 오류 메시지는 **무엇이 왜 잘못됐고 어떻게 고치는지** 안내하고 `aria-describedby`로 연결.
- 내비게이션은 현재 위치를 시각 + `aria-current`로 표시. 모바일 메뉴는 포커스 이동·ESC 닫기·열림 상태 표시 포함. 스킵 링크(`본문 바로가기`) 제공.
- 메뉴·모달·탭·아코디언·드롭다운은 **열림/닫힘, 선택, 포커스 이동, 바깥 클릭, Escape** 동작을 정의한다.

### 3.3 이미지·아이콘

- 아이콘은 **하나의 세트**에서만(이 사이트 원본은 Xeicon). 신규 구현은 **SVG + `currentColor`** 로 대체하고, 의미 있는 아이콘 버튼엔 접근 가능한 이름을 준다.
- 의미 있는 이미지는 `alt` 필수, 장식 이미지는 `alt=""`. 텍스트를 이미지에 구워 넣지 않는다.
- 이미지 위 텍스트는 오버레이 또는 배치로 대비를 확보한다.
- `aspect-ratio`를 고정해 CLS를 방지한다. 이미지 로드 실패 시에도 레이아웃이 무너지지 않게 대체 상태를 둔다.
- 실제 제공된 이미지·브랜드 에셋을 우선 사용하고, 출처가 불명확한 이미지를 임의로 쓰지 않는다.

## 4. 반응형 디자인 규칙

- **모바일 퍼스트**로 작성하고 `min-width` 미디어쿼리로 확장한다. 새 브레이크포인트를 임의로 추가하지 않는다.
- *(이 사이트는 **PART 3 §S3.1의 768 / 1025px** 두 지점만 사용한다. 일반 480/1024/1280 표를 쓰지 않는다.)*
- 필수 검수 뷰포트: **320 / 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920px**. 가로 스크롤 발생 금지.
- `overflow-x: hidden`으로 문제를 숨기지 않는다. 넘침의 원인을 고친다(의도된 캐러셀 가로 스크롤은 유지).
- 고정 헤더·플로팅 버튼·사이드 패널이 콘텐츠와 주요 버튼을 가리지 않는지 확인한다.
- 데스크톱 헤더와 모바일 헤더가 **별도 구조**인 사이트다. 데스크톱 메뉴를 단순 축소하지 않는다(§S6.2).

## 5. 콘텐츠·카피 규칙

- 문구는 사용 편의를 위한 설계 요소. 사용자 관점의 쉬운 말로 쓴다.
- 한국어 UI는 **해요체/합쇼체 중 하나로 통일**. 숫자·날짜·가격 형식을 통일한다(`1,000원` 형태 등 §S4.3).
- 빈 화면은 다음 행동을 안내하고, 오류는 **원인 + 해결 방법**을 말한다.
- 더미 콘텐츠는 주제(반려묘 그루밍 용품)에 맞는 현실적인 문구를 쓴다. **실제 사업자 정보·연락처·계좌는 복제하지 않는다**(§S1.4).

## 6. "범용 AI 디자인" 회피 (SHOULD → 위반 시 사유 기재)

- 크림 배경 + 세리프 + 테라코타 포인트 / 검정 배경 + 형광 포인트 / 신문 스타일 헤어라인 / 동일 카드 N개 + 동일 그림자 + 그라디언트 / 모든 섹션 상단 대문자 라벨은 기본값으로 선택하지 않는다.
- 단, **타깃 사이트에 실제로 있는 패턴은 허용**한다(예: `PHOTO REVIEW`, `INSTAGRAM` 영문 섹션 제목). 원본에 없는 곳에 새로 만들지 않는다.

---

# PART 2. DEVELOPER 규약

> **15년차 프론트엔드 개발자의 기준**: 동작하는 코드가 아니라 **읽기 쉽고, 깨지지 않고, 바꾸기 쉬운** 코드를 쓴다. 단순함을 선택하고, 추상화는 반복이 증명된 뒤에만 한다.

## 1. HTML

### 1.1 문서 기본 (MUST)

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지명 | 그루밍데이</title>
  <meta name="description" content="80~120자 내외의 페이지 요약">
  <link rel="canonical" href="https://example.com/">
  <meta property="og:title" content="…">
  <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/css/main.css">
  <script type="module" src="/js/main.js"></script>
</head>
```

- `<html lang>` 필수, 페이지마다 **고유한 `<title>`/`description`**.
- viewport에 `maximum-scale`, `user-scalable=no`를 넣지 않는다(원본은 `maximum-scale=1.0, minimum-scale=1.0, user-scalable=yes`를 쓰지만 **복제 금지**).
- 스크립트는 `type="module"` 또는 `defer`. 인라인 `style`·`onclick` 등 **인라인 이벤트 핸들러 금지**.

### 1.2 시맨틱 (MUST)

- 랜드마크 `<header> <nav> <main> <aside> <footer>`. **`<main>`은 페이지당 1개**, **`h1`도 1개**, 제목 레벨은 건너뛰지 않는다(크기는 CSS로).
- 클릭 동작은 `<button>`, 이동은 `<a href>`. **`<div>`/`<span>`에 클릭 이벤트 금지.** `href="javascript:;"` 금지.
- 목록은 `ul/ol/dl`, 표 데이터는 `table`. 폼은 `label[for]` + `id`, 의미 있는 `type`/`autocomplete`/`inputmode`.
- `<img>`에 `width`/`height`, `alt`, `decoding="async"`, 첫 화면 밖은 `loading="lazy"`. **LCP 이미지는 lazy 금지, `fetchpriority="high"`**.
- 반응형 이미지는 `srcset`/`sizes`/`<picture>`. 외부 링크 `target="_blank"`에는 `rel="noopener noreferrer"`.

### 1.3 접근성 (WCAG 2.2 AA, MUST)

- 키보드만으로 모든 기능 사용 가능, 탭 순서는 시각 순서와 일치. `tabindex`는 `0`/`-1`만.
- ARIA는 시맨틱 HTML로 불가능할 때만. 동적 변경은 `aria-live`/포커스 이동. 모달은 `<dialog>` 우선, 포커스 트랩·ESC·복귀 포커스.
- **아이콘 단독 버튼은 접근 가능한 이름 필수**(`aria-label`). 원본은 아이콘 `<img>`에 `alt=""`/무 alt를 쓰는 곳이 있어 그대로 옮기면 안 된다.
- 닫힌 패널(사이드바·검색)은 `hidden`/`inert`로 **탭 이동 대상에서 제외**한다.
- 시각적 숨김은 `.visually-hidden` (`display:none` 아님).

### 1.4 네이밍·포맷

- 들여쓰기 2칸, 속성 큰따옴표. 속성 순서 `id → class → data-* → 기타 → aria-*`.
- `id`는 JS 훅·앵커·`label` 연결에만. 스타일링에 쓰지 않는다. JS 훅은 `data-js="…"`.

## 2. CSS

### 2.1 아키텍처 (MUST)

- **BEM 변형**: `.block`, `.block__element`, `.block--modifier`. 상태는 `.is-open`, `.is-active`, `[aria-expanded="true"]`.
- 선택자 구체성 최소화: 클래스 하나 기준. **`id` 선택자 금지, `!important` 금지**, 3단계 이상 중첩 금지. 요소 선택자로 컴포넌트 스타일링 금지.
- `@layer`로 우선순위 제어: `@layer reset, tokens, base, layout, components, utilities;`
- 컴포넌트는 **자체 완결**(상태·반응형·변형을 한 파일에).
- 원본 CSS가 쓰는 `!important`(상품명·가격 등), `-webkit-/-ms-/-khtml-` 접두 중복 선언은 **복제하지 않는다**.

### 2.2 작성 규칙

- **값은 토큰만**(색·간격·글자·그림자·라운드·모션·z-index).
- **논리 속성 우선**(`margin-inline`, `padding-block`). 간격은 `gap`. `float`·`position:absolute`로 레이아웃 잡기 금지.
- 단위: 폰트 `rem`, 간격 토큰, 테두리 `px`, 뷰포트 `dvh/svh`.
- `z-index`는 토큰 스케일만(§S6.8). 임의 `9999` 금지.
- reset 최소화: `box-sizing: border-box`, 마진 제거, `img { max-width:100%; display:block }`, 폼 요소 `font: inherit`.
- 고정 높이 남용 금지. 텍스트 확대·긴 상품명에도 레이아웃이 유지되어야 한다.
- 모션 감소:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; scroll-behavior: auto; }
  }
  ```
  > 주의: 시작 상태가 `opacity: 0`인 애니메이션(원본의 섹션 제목 fade-in-up)은 모션 감소 시 **`opacity: 1`로 명시**해야 글자가 사라지지 않는다.

### 2.3 성능

- 폰트 `woff2`, `font-display: swap`, 필요한 서브셋만. 핵심 폰트·LCP 이미지 `preload`.
- `will-change` 남용 금지. 사용하지 않는 규칙을 남기지 않는다.

## 3. JavaScript

### 3.1 기본 규칙 (MUST)

- **ES Modules**, 전역 변수·함수 금지. `const` 기본, `let`, **`var` 금지**, `===`만.
- 함수는 하나의 일, **40줄 이내**, 인자 **3개 이하**, 중첩 **3단계 이내**.
- 매직 넘버·문자열은 `config.js` 상수로(슬라이드 간격·딜레이·브레이크포인트 등).
- 네이밍: 변수·함수 `camelCase`(동사 시작), 상수 `UPPER_SNAKE_CASE`, 불리언 `is/has/can`.
- DOM 요소가 있다고 가정하지 않는다(`if (!el) return;`).

### 3.2 DOM·이벤트

- 셀렉터는 `data-js` 속성 기준. 쿼리는 한 번만 하고 캐시, 루프 안 DOM 접근·`innerHTML +=` 금지.
- **이벤트 위임**은 필요한 곳에만(`event.target instanceof Element` 확인 → `closest()` → 부모 영역 `contains` 확인). 모든 이벤트를 무조건 위임하지 않는다.
- 리스너는 `AbortController`의 `signal` 또는 동일 함수 참조로 해제 가능하게.
- 스크롤·리사이즈는 `{ passive: true }` + throttle. 스크롤 감지는 `IntersectionObserver`, 크기 감지는 `ResizeObserver`.
- 스타일 변경은 클래스/데이터 속성 토글. 동적 값만 CSS 변수로.
- `innerHTML`로 DOM을 교체하면 포커스·입력값·이벤트 연결이 사라진다. 작은 변경에 전체 재렌더링을 하지 않는다.
- **초기화 패턴**: `export function initNav(root = document) { const el = root.querySelector('[data-js="nav"]'); if (!el) return; … }` — `main.js`는 `DOMContentLoaded` 후 `init*`만 호출.

### 3.3 컴포넌트 생명주기

- 타이머·Observer·`requestAnimationFrame`·구독·진행 중 요청을 쓰면 **`destroy()` 또는 동등한 정리 함수**에서 해제한다.
- 공통 Base Component 클래스를 강제하지 않는다. 필요가 증명될 때만 클래스를 쓴다.

### 3.4 비동기·저장소

- `fetch`는 래퍼로 감싸 `response.ok`, `AbortSignal.timeout`, 에러 처리를 일원화. **fetch는 HTTP 오류에서 자동 reject되지 않는다.**
- 로딩·성공·실패·빈 상태 **4가지 UI 상태**를 구현. 빈 `catch` 금지.
- `localStorage`는 `try/catch` + 네임스페이스 키(`groomingday:feature:key`), **민감 정보 저장 금지**, 파싱 실패·만료 처리.
- 최근 본 상품·"오늘 하루 보지 않기" 팝업은 저장 방식(키·만료)을 명시해 구현한다.

## 4. 보안 (MUST)

- **`innerHTML`에 사용자 입력·외부 데이터 삽입 금지** → `textContent` / `createElement` / `<template>`.
- `eval`, `new Function`, `document.write`, `javascript:` URL 금지. 사용자 제공 URL은 허용 프로토콜 검증.
- 외부 스크립트는 **SRI + `crossorigin` + 정확한 버전 고정**.
- 비밀키·토큰·API 키를 클라이언트에 두지 않는다. 인증·권한은 서버에서도 검증한다.
- **추적·마케팅 스크립트**(Meta Pixel, 네이버 공통 스크립트 `wcslog`, Google Analytics, `inflowbeacon`, `alphapush` 등)는 원본에 있어도 **기능 코드로 복사하지 않는다.** 필요하면 목적·동의 흐름을 먼저 협의한다.
- 서드파티 임베드(`iframe`)는 `title`, `loading="lazy"`, 가능하면 `sandbox`.

## 5. 성능 (목표: Lighthouse 모바일 ≥ 90)

| 지표 | 목표 |
|---|---|
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| 총 JS (gzip) | ≤ 100KB |
| 총 CSS (gzip) | ≤ 50KB |
| 이미지 1장 | ≤ 200KB (히어로 ≤ 300KB) |

- 이미지는 AVIF/WebP + 적절한 크기 + `srcset`. **원본 자료에는 800KB급 JPG·1MB GIF가 있으므로 그대로 쓰지 않고 변환·리사이즈한다.**
- 외부 SDK(YouTube IFrame API 등)는 필요한 시점에 **지연 로드**하고 로드 실패 대체 UI를 둔다.
- 한 섹션에 여러 자동재생 요소를 두지 않는다. 화면 밖 캐러셀은 재생을 멈춘다.

## 6. SEO·메타

- 페이지당 고유 `title`·`description`·`canonical`, OG 카드. `h1`은 페이지 핵심 주제. 링크 텍스트는 목적지를 설명("여기 클릭" 금지).
- `robots.txt`, `sitemap.xml`, 구조화 데이터(Product JSON-LD)는 해당 시 추가. 404 페이지 별도 제공.

## 7. 브라우저 지원

- 최근 2개 메이저 버전의 Chrome, Edge, Safari(iOS 포함), Firefox, Samsung Internet. IE 미지원.
- 신규 CSS/JS는 `@supports`·기능 감지로 점진적 향상. UA 스니핑 금지. JS가 꺼져도 핵심 콘텐츠와 링크는 접근 가능해야 한다.

## 8. 품질·협업

- 데드 코드·주석 처리된 코드·미사용 CSS 제거. 복잡한 우회에는 **이유와 제거 조건**을 주석으로.
- Git: Conventional Commits(`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`), 하나의 논리적 변경 단위. 토큰 변경과 기능 변경을 한 커밋에 섞지 않는다.

### 8.1 작업 결과 보고 형식 (에이전트 → 사용자)

1. **변경한 파일**과 핵심 내용
2. **적용한 가정**과 결정 이유 (🔶 값을 썼다면 명시)
3. **확인 방법·실행한 테스트와 결과** (어느 뷰포트/브라우저에서 무엇을 볼지)
4. **미구현·미검증 항목, 필요한 후속 작업** (있을 때만)

---

# PART 3. SITE SPECIFIC — dayandhome.com (그루밍데이 · 데이캣)

> **타깃**: https://dayandhome.com/ (Cafe24 쇼핑몰, design102 스킨). 메인 페이지 기준.
> **원칙**: 시각 디자인(박스 값·글자·색상)은 원본과 **동일**하게, 내부 레이아웃은 **§S2 박스 규칙**으로 재구성한다.
> **효력**: PART 1·2와 충돌 시 PART 3 우선. 단, §S1.4(접근성·보안·개인정보)는 PART 3보다 상위다.
> **근거**: 제공된 메인 HTML 스냅샷, `optimizer_user.php`(사이트 사용자 CSS 318KB), `optimizer.php`(Cafe24 공통 CSS), `pretendardvariable-dynamic-subset.css`, `xeicon.css`, `font.css`, `front.css`, `smart-popup.slick.css`와 번들 JS(Swiper 8.4.5 · jQuery 3.6.0 · Flatpickr 4.5.0)를 분석한 결과다.

## S1. 적용 원칙

### S1.1 값의 신뢰 등급 (MUST)

| 표기 | 의미 | 기존 문서의 용어 |
|---|---|---|
| ✅ 실측 | 원본 CSS/HTML에서 **직접 읽은 값** | 확인됨 |
| 🧮 계산·추정 | 실측값을 조합·역산했거나, 속성명(`data-caros` 등)에서 의미를 추정한 값 | 추정 / 부분 확인 |
| 🔶 임시 | 제공 자료로 확정 불가(JS 계산·누락 파일·렌더링 의존). §S7에서 확인 후 교체 | 미확인 (`추가 확인 필요`) |

- 에이전트는 🔶 값을 "사이트의 실제 값"이라고 보고하지 않는다. 🔶는 코드에 `/* 🔶 S7-n */` 주석으로 표시한다.
- 값 교체는 `tokens.css`에서만 하며 **토큰 이름은 바꾸지 않는다.**
- **원본과 동일한 디자인이 목표이므로 PART 1의 8pt 그리드·타입 스케일보다 ✅ 실측값이 우선한다.** (`10px`, `15px`, `35px`, `70px`, `160px` 등을 8pt에 맞춰 반올림하지 않는다.)
- `:root` 변수가 구간별로 **중복 정의·재정의**된다(§S3.2). 최종 적용값은 "선언 순서 + 미디어쿼리"로 결정하며, 이 문서의 표가 그 결과를 정리한 것이다.

### S1.2 원본 기술 구성 (참고용 — 복제 대상 아님)

| 항목 | 내용 |
|---|---|
| 플랫폼 | **Cafe24** 쇼핑몰 + design102 스킨. 모듈 클래스 `xans-*`, `ec-*`, 테마 클래스 `d1-*` |
| 라이브러리 | **Swiper 8.4.5**(메인 배너·리뷰·상품·숏츠 캐러셀), **jQuery 3.6.0** + Migrate 3.3.2, Flatpickr 4.5.0, Slick(스마트 팝업 전용, `smart-popup.slick.*`), YouTube IFrame API, Kakao SDK |
| 폰트·아이콘 | **Pretendard Variable**(dynamic subset), **Xeicon**(`xi-*`, 937개 선언) |
| 서드파티 | Meta Pixel(`fbevents`), 네이버 공통(`wcslog`), Google Analytics, `inflowbeacon`, `alphapush`, `alpha-apps-workflow`, `cid.generate` 등 — **전부 기능과 무관한 추적·마케팅** |
| 마크업 | `header#header` · `main#contents` · `footer#footer` **시맨틱 태그는 존재**한다. 단, 내부는 `div`+`javascript:;` 링크 중심 |
| 분석 제외 | `i18n.php`(1.7MB 번역 테이블), `jet.js`, `synchronizer.js`, `session-handler.html`, `scriptTagContent` 등 플랫폼 내부 파일은 디자인 근거로 쓰지 않는다 |
| 주의 | `froala_style_ec.min.css`는 에디터 콘텐츠용, `smart-popup.slick.css`는 팝업용이다. **사이트 전체 토큰의 근거로 쓰지 않는다.** |
| 반응형 | 데스크톱·모바일 **DOM이 분리**(`D1W` = 데스크톱, `D1TMB` = 태블릿·모바일)되어 있고 브레이크포인트는 **767 / 768–1024 / 1025**(§S3.1) |

> `optimizer*.php` 번들은 병합 결과물이라 **원본 파일 경계와 페이지별 Swiper 초기화 옵션**은 확정할 수 없다. HTML `data-*` 속성(✅)과 CSS(✅)로 확인된 것만 쓴다.

### S1.3 원본 메인 페이지 구성 (✅ 순서 / 🔶 세부)

| 순서 | 영역 | 내용 | 원본 근거 |
|---|---|---|---|
| 1 | 헤더 | 데스크톱·모바일 **별도 구조**. 로고, 카테고리 메뉴, 마이페이지·검색·장바구니 등 아이콘, 모바일 햄버거 사이드바 | `header#header`, `.h01box`, `.mheader.D1TMB` |
| 2 | 메인 비주얼 | 데스크톱용(`D1W`)·모바일용(`D1TMB`) **배너 2벌**, 슬라이드 자동재생 | Swiper, `data-loop="true"` `data-autoplay="true"` `data-effect="slide"` `data-delay="4000"` `data-autoheight="true"` |
| 3 | `베스트 상품` | 타이틀 `베스트 상품` + 서브카피 `가장 사랑받은 아이템들`, 상품 목록 | `.mainTitle`, `xans-product-listmore-1` |
| 4 | `PHOTO REVIEW` | 포토리뷰 캐러셀, `BEST` 배지 | `.d1-photoreview-list[data-type="mgallery"]` `data-slidesperview="4"` `data-spacebetween="20"` `data-loop="false"` |
| 5 | 영상 + 상품 슬라이더 | 좌측 16:9 영상, 우측 상품 슬라이더(2열) 🧮 | `.exsection001`, `xans-product-listmain-7` |
| 6 | `새로운 코비,베리의 이야기` | 앨범/스토리 배너 캐러셀 (4개 보기, 자동재생 500ms 전환) | `data-slidesperview="4"` `data-speed="500"` `data-caros="2"` `data-carom="3"` `data-carol="4"` |
| 7 | `Youtube Shorts` | 세로형 숏폼 캐러셀(6.2개 보기, 가운데 정렬) | `-framefull`, `data-slidesperview="6.2"` `data-centeredslides="true"`, 제목 흰색(`.shortsbanner`) |
| 8 | `INSTAGRAM` | 소셜 피드 영역 | `.mainTitle` + 모듈 영역 |
| 9 | 푸터 | 회사 정보, 고객센터, 결제·안전거래 안내, 정책 링크 | `footer#footer` |
| 10 | 고정 UI | 퀵메뉴(`#sidefixedwrap`), **최근 본 상품** 팝업(`#recentasidepopup`), 모바일 좌측 사이드바(`.d1sidebar.left`), 우측 검색 패널(`.mrightasidebtn`) | |

- 섹션을 **합치거나 순서를 바꾸지 않는다.** (🔶 5·6번 섹션의 정확한 경계는 §S7 항목 8)
- 모든 슬라이드 수·상품 수·문구는 **실제 데이터가 아니라 목업 데이터**로 둔다(원본 HTML에서 확인된 슬라이드 DOM 17개는 루프 복제본을 포함한 값이라 실제 장수가 아니다 🔶).

### S1.4 원본을 그대로 복제하지 않는 것 (접근성·보안·개인정보 우선)

- viewport의 `maximum-scale=1.0, minimum-scale=1.0`은 **복제 금지**(확대 제한).
- 아이콘 전용 링크(마이페이지·검색·장바구니·햄버거·뒤로가기)는 **`<button>`/`<a>` + `aria-label`** 필수. 원본은 `alt=""`/무 alt, `href="javascript:;"`, `onclick="history.go(-1)"`을 쓴다.
- 로고를 `h1`로 쓰는 원본 방식은 따르지 않는다. **`h1`은 페이지당 1개**이며, 로고는 홈 링크(`<a>`)로 두고 메인의 `h1`은 `.visually-hidden`으로 `그루밍데이`를 제공한다.
- 클래스명 계열(`xans-*`, `ec-*`, `d1-*`, `D1W/D1TMB`, `-flex`, `-frame`, `swiper-*`, `mainTitle`)은 가져오지 않는다. 대응표는 §S8.
- **개인정보·사업자 정보 복제 금지**: 원본 푸터의 대표자명, 전화번호, 사업자등록번호, 통신판매신고번호, 계좌, 이메일, 카카오 채널은 **실제 값을 코드에 넣지 않고** `홍길동`·`000-00-00000` 같은 명확한 플레이스홀더를 쓴다.
- 원본 이미지·영상·상품 사진은 타사 저작물이다. **작업용 목업**으로만 쓰고, 배포 전 교체 대상임을 `assets/images/README`에 기록한다.
- 추적·마케팅 스크립트와 `jQuery`, `Slick`, `Kakao SDK`는 가져오지 않는다. (캐러셀은 §S6.3의 기본 구현 사용)
- 고정 높이 텍스트 박스는 `min-height` + `line-clamp`로 바꾼다.

---

## S2. 레이아웃 규칙 — 박스 구조 (MUST, 최우선)

### S2.1 계층

```
겉박스 (.outer-box)          ← header / main > section / footer
 └─ 속박스 (.inner-box)       ← max-width + 중앙 정렬 + 좌우 패딩
     └─ 파티션 박스 (.part-box) ← display:flex
         └─ 내용 박스          ← 컴포넌트 (필요 시 grid 허용)
```

- **박스 깊이는 최대 4단계.** 래퍼 `div`를 더 만들지 않는다.
- 클래스명은 `.outer-box` / `.inner-box` / `.part-box`로 **고정**. `.container`, `.wrapper`, `.inner`, `.frame`, `.row`, `.col` 등 **동의어 클래스 금지**.

> **원본과의 대응 (✅)**: 원본 `.-frame`이 곧 속박스다 — `width:100%; max-width:1920px; margin-left/right:auto; padding-left/right: var(--size-frame-padding)`.
> 따라서 **`max-width: 1920px`는 원본 값**이다. 기존 일반 규약의 `--container-max: 1200px`는 **이 사이트에서 사용하지 않는다.**
> 헤더·히어로 문구 영역 등 일부가 쓰는 `--size-maxframe-width: 1520px`, 화살표 영역 `--size-maxframe-width-r: 1360px`은 **내용 박스 수준의 보조 폭**이다(§S3.2).

### S2.2 겉박스 전체 구조

```html
<body>
  <header class="outer-box outer-box--header">…</header>

  <main id="contents">
    <section class="outer-box">…</section>
    <section class="outer-box">…</section>
  </main>

  <footer class="outer-box outer-box--footer">…</footer>

  <!-- 고정 UI는 겉박스가 아니다 (§S2.6) -->
  <aside class="recent-popup">…</aside>
</body>
```

- 겉박스는 **`header`, `main > section`, `footer`** 로만 구성한다. `main`은 박스가 아닌 래퍼(패딩·배경·max-width 금지).
- 겉박스는 **전체 폭(100%)** 이며 **배경·테두리·세로 패딩·sticky/fixed 위치**만 담당한다.

### S2.3 속박스 `.inner-box`

```css
.inner-box {
  width: 100%;
  max-width: var(--inner-max);     /* 1920px ✅ */
  margin-inline: auto;
  padding-inline: var(--gutter);   /* 10 / 20 / 80px ✅ */
}
```

- 모든 겉박스의 **직계 자식 1개**. 변형 클래스를 만들지 않고, 폭이 다른 구간은 **부모 겉박스에서 `--inner-max`/`--gutter`를 재정의**한다.
- `background`, `padding-block`, `border`는 속박스에 주지 않는다.
- **풀블리드 예외**: 원본은 ≤1024px에서 `.mainscrollbanner`, `.mainbanner002/003`, `.mainbwp001`, `.mainTimesale`, 포토리뷰 래퍼의 `.-frame` 좌우 패딩을 `0`으로 만든다(✅). 우리는 겉박스 modifier `.outer-box--bleed`로 `--gutter: 0px`을 재정의하되, **섹션 제목 파티션은 gutter를 유지**한다.

### S2.4 파티션 박스 `.part-box`

- `.inner-box`의 직계 자식, **`display: flex`**. 줄바꿈이 필요한 내용엔 `flex-wrap: wrap`. **Grid 금지**(필요하면 안쪽 내용 박스에 grid).
- 간격은 **`gap`** 으로만. 파티션에 `margin`을 쓰지 않는다. 파티션 안에 파티션을 중첩하지 않는다.
- **가로 스크롤 캐러셀·칩 예외**: `flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory;`
- 영상 + 상품 슬라이더 2열(§S6.7)처럼 **원본이 grid를 쓰는 곳**은 파티션이 아닌 **내용 박스 내부 grid**로 구현한다.

```css
.part-box { display: flex; flex-wrap: wrap; gap: var(--part-gap); }
```

### S2.5 박스별 속성 분담표 (MUST)

| 속성 | 겉박스 | 속박스 | 파티션 박스 | 내용 박스 |
|---|:-:|:-:|:-:|:-:|
| `width: 100%` | ✅ | ✅ | — | — |
| `max-width` + `margin-inline:auto` | ❌ | ✅ | ❌ | ❌ |
| `padding-inline` (좌우 여백) | ❌ | ✅ | ❌ | 컴포넌트 내부만 |
| `padding-block` (섹션 세로 여백) | ✅ | ❌ | ❌ | ❌ |
| `background` / `border` | ✅ | ❌ | ❌ | 컴포넌트 내부만 |
| `position: sticky/fixed` | ✅ (header) | ❌ | ❌ | 플로팅 UI만 |
| `display: flex` / `gap` / `flex-wrap` | ❌ | ❌ | ✅ | 필요 시 |
| `display: grid` | ❌ | ❌ | ❌ **금지** | ✅ 허용 |
| `margin` (그 외) | ❌ | ❌ | ❌ | 최소화 (간격은 `gap`) |

### S2.6 고정 UI·반응형 처리

- 모바일 → PC로 확장(`min-width`)하며 **박스 구조는 바꾸지 않고 토큰 값만 바꾼다**(`--gutter`, `--section-pb`, `--part-gap`, `--header-h`).
- **퀵메뉴·최근 본 상품 팝업·모바일 사이드바·검색 패널은 겉박스가 아니다.** `body` 마지막에 `<aside>`/`<nav>`로 두고 `position: fixed` + `--z-*` 토큰을 쓴다.
- 데스크톱 헤더와 모바일 헤더는 **같은 `<header>` 안에서 CSS(`min-width: 1025px`)로 전환**하는 것을 기본으로 한다. 두 구조의 **접근성 상태와 이벤트는 독립 관리**한다(숨겨진 쪽은 `hidden`/`inert`). 콘텐츠가 실제로 다른 경우에만 DOM을 분리한다.

### S2.7 `layout.css` 기준 코드

```css
@layer layout {
  .outer-box { width: 100%; padding-block: var(--section-pt) var(--section-pb); background: var(--color-bg); }
  .outer-box--bleed { --gutter: 0px; }

  .outer-box--header { padding-block: 0; position: fixed; inset: 0 0 auto 0; z-index: var(--z-header); background: var(--header-bg); } /* 🔶 S7-6 고정/투명 전환 */
  .outer-box--footer { --section-pt: 0px; --section-pb: 0px; border-top: 1px solid var(--color-border-light); }

  .inner-box { width: 100%; max-width: var(--inner-max); margin-inline: auto; padding-inline: var(--gutter); }

  .part-box { display: flex; flex-wrap: wrap; gap: var(--part-gap); }
  .part-box--nowrap  { flex-wrap: nowrap; }
  .part-box--column  { flex-direction: column; }
  .part-box--between { justify-content: space-between; }
}
```

### S2.8 레이아웃 체크 (위반 시 재작업)

- [ ] `body > header + main + footer` 구조, `main`의 직계 자식은 `section`뿐
- [ ] 모든 `.outer-box`의 직계 자식이 `.inner-box` **하나**
- [ ] `.inner-box`에만 `max-width`·`margin-inline:auto`
- [ ] `.part-box`가 `display:flex`, `grid` 없음, `margin` 없음(`gap`)
- [ ] 동의어 클래스(`container`/`wrapper`/`inner`/`frame`/`row`/`col`) 없음

---

## S3. 박스 관련 값 (토큰)

### S3.1 브레이크포인트 (✅)

| 이름 | 원본 조건 | 우리 구현 (`min-width`만) | 용도 |
|---|---|---|---|
| 모바일 | `max-width: 767px` | **기본값** | 단일 열, 햄버거 헤더 |
| 태블릿 | `768px ~ 1024px` | `@media (min-width: 768px)` | 여백 20px, 마진 100/80 |
| 모바일+태블릿 공통 | `max-width: 1024px` | **기본값(768 쿼리가 덮어쓰지 않는 값)** | 모바일 헤더(60px), `--grid-gap: 5px`, 제목 18px |
| 데스크톱 | `min-width: 1025px` | `@media (min-width: 1025px)` | 데스크톱 헤더(100px), 여백 80px |

- 원본의 `max-width` 쿼리를 **그대로 옮기지 않는다.** `≤1024` 값을 기본값으로 두고, `768`에서 태블릿 값, `1025`에서 데스크톱 값으로 덮어쓴다.
- 이 외 브레이크포인트(480, 640, 1280, 1536 등)를 새로 만들지 않는다. 캐러셀 보기 개수 전환도 **같은 두 지점**을 쓴다.
- `D1W`·`D1T`·`D1M` 표시 제어 클래스는 가져오지 않고 위 쿼리로 대체한다.

### S3.2 박스 토큰

```css
:root {
  /* 속박스 */
  --inner-max: 1920px;                 /* ✅ .-frame max-width */
  --gutter: 10px;                      /* ✅ --size-frame-padding (≤767px) */
  --part-gap: 20px;                    /* 🧮 캐러셀 spaceBetween 20 기준. 컴포넌트별 값은 §S6 */

  /* 겉박스: 섹션 세로 여백 (원본은 margin-bottom, 우리는 padding-block-end) */
  --section-pt: 0px;                   /* ✅ 원본 섹션은 상단 여백 없이 하단 마진만 사용 */
  --section-pb: 60px;                  /* ✅ --size-margin-bottom (.mainSection) */
  --section-pb-alt: 50px;              /* ✅ --size-margin-bottom2 (.mainSection2) */

  /* 그리드·카드 */
  --grid-gap: 5px;                     /* ✅ ≤1024px */
  --card-row-gap: 40px;                /* ✅ --size-margin-prd-bottom (.prdList > li) */
  --carousel-gap: 10px;                /* ✅ data-caros-spacebetween (모바일) */

  /* 고정 UI */
  --header-h: 60px;                    /* ✅ --size-header-height (≤1024px) */
  --logo-h: 24px;                      /* ✅ 모바일 로고 max-height */
  --btn-h: 40px;                       /* ✅ --size-button-default */
  --btn-h-lg: 80px;                    /* ✅ --size-button-large (글자 50px) */
  --swiper-nav-size: 44px;             /* ✅ --swiper-navigation-size */

  /* 모서리 */
  --radius-thumb-min: 3px;             /* ✅ --border-radius-min-thumb */
  --radius-box: 5px;                   /* ✅ --border-radius-box */
  --radius-thumb: 8px;                 /* ✅ --border-radius-thumb */
  --radius-popup: 8px;                 /* ✅ --border-radius-popup */
  --radius-shorts: 14px;               /* ✅ --border-radius-shorts */
  --radius-round: 50%;

  /* 선 */
  --line: 1px;
}

@media (min-width: 768px) {            /* 태블릿 (768–1024) ✅ */
  :root {
    --gutter: 20px;
    --section-pb: 100px;
    --section-pb-alt: 80px;
  }
}

@media (min-width: 1025px) {           /* 데스크톱 ✅ */
  :root {
    --gutter: 80px;
    --section-pb: 160px;
    --section-pb-alt: 120px;
    --grid-gap: 10px;
    --carousel-gap: 20px;
    --header-h: 100px;
    --logo-h: 30px;
  }
}
```

- 보조 폭 `--size-maxframe-width: 1520px`(헤더 문구 영역), `--size-maxframe-width-r: 1360px`(캐러셀 좌우 화살표 위치)는 **컴포넌트 내부 토큰**(`--content-max`, `--arrow-max`)으로만 쓴다. (적용 요소 ✅ `.mainslide .bannerwrap .textwrap`, `.swiper-button-prev/next.-hfull`)
- `--size-gnb-height: 70px`, `--size-nav-height: 60px`은 **선언만 있고 사용처가 없다**(✅ 0건). 토큰으로 만들지 않는다.
- 두 섹션 여백(`--section-pb` / `--section-pb-alt`)을 **어느 섹션에 적용하는지**는 🔶 §S7 항목 7.

### S3.3 캐러셀 보기 개수 (✅ 속성 / 🧮 구간 매핑)

원본 `data-caros / data-carom / data-carol`은 **s / m / l** 구간이다. 구간 경계는 🧮 **s ≤767 · m 768–1024 · l ≥1025**로 추정한다(🔶 S7-5).

| 캐러셀 | 모바일(s) | 태블릿(m) | 데스크톱(l) | 간격 s / m / l | 기타 |
|---|---|---|---|---|---|
| 포토리뷰 (`mgallery`) | 🔶 | 🔶 | **4** (`data-slidesperview`) | 20px (기본) | `loop:false`, 화살표 바깥(`navposouter`) |
| 스토리 배너 | **2** | **3** | **4** | **10 / 10 / 20px** | `loop:true`, `autoplay`, `speed:500` |
| 숏츠 | **1.6** | **2.6** | **5.2** | 20 / 20 / 20px | `centeredSlides`, `loop:true`, `delay:500000`(사실상 자동 넘김 없음) |
| 메인 배너 | 1 | 1 | 1 | — | `effect:slide`, `loop`, `autoplay delay 4000`, `autoheight` |

- 소수점 보기(1.6, 2.6, 5.2)는 **다음 카드가 잘려 보이는 peek**을 의도한다. CSS는 `flex: 0 0 calc((100% - gap × (n-1)) / n)`, `scroll-snap-align`으로 구현한다.
- 자동재생은 **일시정지 버튼**을 제공하고 `prefers-reduced-motion` 또는 화면 밖에서는 멈춘다.

### S3.4 박스 규칙 (MUST)

- `box-sizing: border-box` 전역 상속. 가로 스크롤 금지(`overflow-x: hidden` 임시 방편 금지).
- 섹션 사이 간격은 **겉박스의 `padding-block`** 하나로만. 섹션 간 `margin` 금지.
- 상품 썸네일은 `aspect-ratio` + `border-radius: var(--radius-thumb)` + `overflow: hidden`. **비율은 🔶 S7-3 확인 전까지 변수(`--card-ratio`)로 두고 임의로 1:1로 통일하지 않는다.**

---

## S4. 글자 관련 값

### S4.1 서체 (✅)

```css
:root {
  --font-sans: "Pretendard Variable", "Pretendard", "맑은 고딕", "Malgun Gothic", "돋움", Dotum,
               Helvetica, Arial, AppleGothic, sans-serif;
  --font-icon: "xeicon";   /* 신규 구현은 SVG로 대체 (§3.3) */
}
body, label, td, input, textarea, select, button, code { font-family: var(--font-sans); font-weight: 500; letter-spacing: -0.3px; }
```

- 원본 기본 굵기는 **500**, 기본 자간은 **`-0.3px`** (✅ `body, label, td, input, textarea, select, button, code, .mainTitle, .titleArea`). 제목(`.mainTitle h2`, `p`)은 `letter-spacing: 0`. 일반 규약의 "자간 0"보다 **이 값이 우선**한다.
- 굵기는 **400 / 500 / 600 / 700**만 쓴다(원본 사용 빈도 600 > 500 > 400 > 700, `bold`=700).
- Pretendard는 제공된 `pretendardvariable-dynamic-subset.css`(woff2 서브셋)를 기준으로 하되 **자체 호스팅 + `font-display: swap` + 폰트 preload**로 구성한다. Xeicon 폰트 파일은 원본 CDN을 가리키므로 **참조하지 않는다.**

### S4.2 글자 토큰 (✅ 실측, 원본 빈도순)

원본 CSS 글자 크기 사용 빈도: `14px`(76) > `13px`(61) > `12px`(51) > `15px`(37) > `18px`(22) > `11px`(19) > `16px`(17) > `20px`(11) > `24px`(9) > `22px`(6) > 그 외(10, 17, 25, 26, 27, 28, 35px).

| 용도 | 모바일·태블릿(≤1024) | 데스크톱(≥1025) | 굵기 | 색 | 근거 |
|---|---|---|---|---|---|
| 섹션 타이틀 (`.mainTitle h2`) | **18px** | **22px** | 700 | `--color-text` | ✅ `letter-spacing:0` |
| 섹션 서브카피 (`.mainTitle p`) | **14px** | **15px** | 400 | `--color-text-sub` | ✅ `margin-top:10px` |
| 카테고리 메뉴 | — | **16px** | 500 / 선택 700 | 선택 `--color-accent` | ✅ |
| 상품명 | **16px** | 16px | 600 | `--color-text` | ✅ (원본 `!important`) |
| 판매가 | **18px** | 18px | 600 | `--color-text` | ✅ |
| 할인율 | 18px (`%`는 13px) | 18px | 600 | `--color-sale` | ✅ `.discountrate.on` |
| 사용후기 수 | 13px | 13px | 500 | `--color-text-faint` | ✅ |
| 포토리뷰 `BEST` 배지 | 12px | 12px | 600 | `#fff` on `rgba(0,0,0,.8)` | ✅ `padding:8px 10px`, `border-radius: 8px 0` |
| 푸터 소제목 (`h3`) | 15px | 15px | 600 | `--color-text` | ✅ `margin-bottom:10px` |
| 푸터 고객센터 번호 | 26px | 26px | 700 | `--color-text` | ✅ `line-height:1` |
| 푸터 본문 | 🔶 | 🔶 | 🔶 | 🔶 | `footer { line-height:1.8 }` ✅만 확인 |
| 가입 포인트 툴팁 | 11px | 11px | — | `#fff` on `--color-accent` | ✅ `letter-spacing:-0.5px` |
| 상품 상세 제목 (참고) | 17px (≤767) | 24px | 600 | `--color-text` | ✅ 상세 페이지는 이번 범위 밖 |

```css
:root {
  --fs-11: 0.6875rem; --fs-12: 0.75rem;  --fs-13: 0.8125rem; --fs-14: 0.875rem; --fs-15: 0.9375rem;
  --fs-16: 1rem;      --fs-18: 1.125rem; --fs-20: 1.25rem;   --fs-22: 1.375rem; --fs-24: 1.5rem;
  --fs-26: 1.625rem;
  --lh-footer: 1.8;
}
```

- ✅ 확인된 값만 위 토큰으로 만든다. **히어로 문구·푸터 모바일·메뉴 사이드바 글자 크기는 🔶**(S7)이며, 임의 크기를 새로 만들지 않는다.

### S4.3 글자 규칙 (MUST)

- 본문 최소 16px 규칙은 문단 본문에만 적용한다. 이 사이트의 UI 텍스트는 위 표(11~16px)를 따른다. **11px는 가입 포인트 툴팁에만**, 그 외 12px 미만 신규 사용 금지.
- 한글 `word-break: keep-all; overflow-wrap: anywhere;`
- 상품명은 **2줄 말줄임** (`-webkit-line-clamp: 2`, `min-height: calc(2 × 줄높이)`). 원본의 고정 높이는 복제하지 않는다.
- 가격은 `Intl.NumberFormat('ko-KR')` 포맷. 스크린리더용 `<span class="visually-hidden">원</span>`. 정가/할인가는 `<del>`/`<ins>`로 마크업하고, **할인율만 `--color-sale`, 600**으로 표시한다(✅). 정가의 취소선 스타일은 🔶 S7-2.
- 섹션 타이틀 `fade-in-up` 연출(원본: `1.0s ease`, `animation-delay: .4s`, 시작 `opacity:0`)은 **섹션 제목에만** 허용한다. `prefers-reduced-motion`에서는 `opacity:1`로 즉시 표시한다.

---

## S5. 색상 관련 값

### S5.1 원본 팔레트 (✅) — 흑·백·회색 + **갈색 포인트 + 빨강 할인색**

`optimizer_user.php`의 `:root`에서 확인된 값이다. 직접 사용 빈도는 `#fff`(109) > `#000`(88) > `#e8e8e8`(56) > `#a0a0a0`(30) > `#f4f4f4`(15) > `#eee`(12) > `#f8f8f8`/`#f0f0f0`(10).

```css
:root {
  /* 배경 */
  --color-bg:           #ffffff;
  --color-surface:      #f8f8f8;   /* ✅ 영상 섹션(.exsection001) 배경 */
  --color-surface-2:    #f4f4f4;   /* ✅ 포토리뷰 gallery 타입 배경 */

  /* 글자 (--font-color-*) */
  --color-text:         #010101;   /* ✅ base */
  --color-text-heavy:   #505050;   /* ✅ heavygray */
  --color-text-sub:     #757575;   /* ✅ gray */
  --color-text-faint:   #9a9a9a;   /* ✅ lightgray */
  --color-text-inverse: #ffffff;

  /* 선 */
  --color-border:       #e8e8e8;   /* ✅ 56회 사용 */
  --color-border-light: #eeeeee;   /* ✅ 푸터 상단선 */

  /* 포인트·상태 */
  --color-accent:       #71442c;   /* ✅ --font-color-sp: 선택된 메뉴, 가입 포인트 툴팁 배경 */
  --color-on-accent:    #ffffff;   /* ✅ --font-color-sp-rev */
  --color-sale:         #f5200f;   /* ✅ --font-color-sp-sale: 할인율 */
  --color-warn:         #ff0000;   /* ✅ --font-color-warn */
  --color-info:         #008bff;   /* ✅ --font-color-success (이름과 달리 파랑 정보색) */
  --color-primary-80:   #f5200fcc; /* ✅ --font-color-primary/secondary (8자리 hex, 알파 80%) */

  /* Swiper */
  --swiper-theme-color: #000;      /* ✅ 사이트가 #007aff → #000으로 덮어씀 */
  --swiper-dot-inactive: rgba(0,0,0,.2); /* ✅ #000, opacity .2, 크기 8px, 가로 간격 4px */

  --color-focus:        #000000;   /* 🔶 원본에 포커스 링 정의 없음 → S7-6 */
  --header-bg:          #ffffff;   /* ✅ 모바일 .mheaderbox 배경 / 🔶 데스크톱·메인 투명 전환 */
}
```

- `#a0a0a0`(30회)는 **용도가 확인되지 않았다**(🔶). 만들기 전 어느 컴포넌트에서 쓰는지 확인한다.
- `--font-color-success: #008bff`처럼 **변수명과 실제 색의 의미가 다른** 항목은 우리 토큰에서 역할명(`--color-info`)으로 바꿔 쓴다.
- 상품 색상 칩·이미지 색은 **데이터 색**이며 UI 토큰이 아니다.

### S5.2 색상 규칙 (MUST)

- UI에는 위 팔레트만 쓴다. **임의의 유채색을 추가하지 않는다.** 유채색은 `--color-accent`(갈색), `--color-sale`(빨강), `--color-info`(파랑)로 한정한다.
- `--color-accent`는 **선택된 메뉴·가입 포인트 툴팁**에만, `--color-sale`은 **할인율**에만 쓴다. 다른 곳으로 확산하지 않는다.
- 선택/활성 상태는 색만으로 표현하지 않고 **굵기(700) 또는 밑줄**을 함께 쓴다(원본 선택 메뉴는 `font-weight: bold` 병행 ✅).
- 구분선은 `1px solid var(--color-border)`, 푸터 상단 `1px solid var(--color-border-light)`.
- **대비 주의 (🧮 계산)**:

  | 조합 | 대비 | 판정 |
  |---|---|---|
  | `#9a9a9a` / `#fff` (후기 수 13px) | 약 **2.8:1** | ❌ AA 미달 |
  | `#a0a0a0` / `#fff` | 약 **2.6:1** | ❌ |
  | `#757575` / `#fff` (서브카피) | 약 **4.6:1** | ✅ |
  | `#757575` / `#f8f8f8` | 약 **4.3:1** | ❌ 근소 미달 |
  | `#f5200f` / `#fff` (할인율 18px/600) | 약 **4.1:1** | ❌ 일반 텍스트 기준 미달 |
  | `#71442c` / `#fff` | 약 **8.2:1** | ✅ |

  원본 동일 디자인을 우선해 값은 유지한다. 다만 **가격·재고·배송·정책 같은 필수 정보에 `#9a9a9a`/`#a0a0a0`를 쓰면 보고에 대비 미달을 기록**하고, 사용자가 승인하면 `#757575` 이상(흰 배경 4.5:1)으로 조정한다. 값은 렌더링 도구로 재검증한다.
- 포커스 링은 원본에 없으므로 **반드시 추가**한다(`outline: 2px solid`, 어두운 배경 위는 흰색).

---

## S6. 컴포넌트 값 & 박스 매핑

### S6.1 영역별 박스 구성

| 영역 | 겉박스 | 파티션 박스 구성 | 내용 박스 |
|---|---|---|---|
| 헤더 | `header.outer-box--header` | ① 카테고리 메뉴 ② 로고 ③ 아이콘 묶음 (모바일: 햄버거·로고·아이콘) | `nav`, `.icon-btn` |
| 메인 비주얼 | `section.outer-box--bleed` | 슬라이드 트랙 1개 | `.hero-slide` (이미지 + 텍스트) |
| 베스트 상품 | `section.outer-box` | ① 섹션 헤더 ② 상품 목록 | `.section-head`, `.product-card` |
| PHOTO REVIEW | `section.outer-box` | ① 섹션 헤더 ② 리뷰 트랙 | `.review-card` |
| 영상 + 상품 슬라이더 | `section.outer-box` (배경 `--color-surface`) | 영상·슬라이더 2열 | grid 내용 박스 (§S6.7) |
| 스토리 배너 | `section.outer-box` | ① 섹션 헤더 ② 배너 트랙 | `.story-card` |
| YouTube Shorts | `section.outer-box--bleed` | ① 섹션 헤더 ② 숏츠 트랙 | `.shorts-card` |
| INSTAGRAM | `section.outer-box` | ① 섹션 헤더 ② 피드 | `.feed-item` |
| 푸터 | `footer.outer-box--footer` | ① 회사 정보 ② 고객센터 | `.company-info`, `.cs-info` |
| 모바일 사이드바 · 검색 패널 | (겉박스 밖, fixed) | — | `.drawer`, `.search-panel` |
| 퀵메뉴 · 최근 본 상품 | (겉박스 밖, fixed) | — | `.quick-menu`, `.recent-popup` |

### S6.2 헤더 (✅ 구조 / 🔶 동작)

| 구분 | 모바일·태블릿 (≤1024) | 데스크톱 (≥1025) |
|---|---|---|
| 높이 | `60px` ✅ | `100px` ✅ |
| 배경 | `#fff` ✅ (`.mheaderbox`), 메인 페이지 스크롤 시 `background-color .4s` 전환 🔶 | 🔶 (메인 투명 전환 여부 S7-6) |
| 구성 | 좌측 **햄버거(3줄 `.bar`) + 마이페이지**, 중앙 로고, 우측 **검색 등 아이콘** ✅ | `.h01box` `justify-content: space-between; align-items:center` ✅ — 메뉴 / 로고 / 우측 🔶 |
| 좌우 패딩 | `15px` ✅ | `.inner` 속박스 gutter |
| 로고 | `max-height: 24px` ✅ | `max-height: 30px`, 영역 `width: 30%`, 중앙 정렬 ✅ |
| 카테고리 메뉴 | 햄버거 사이드바 안(§S6.9) | 폭 `max-width: 35%`, 메뉴 간격 `gap: 35px`, 항목 높이 = 헤더 높이, 글자 16px/500 ✅ |
| 선택 메뉴 | — | 색 `--color-accent` + 700 ✅ |
| 호버 영역 | — | 각 항목 좌우 **15px 투명 영역** 확장 ✅ (`:before/:after`) — 우리는 `padding-inline`으로 구현 |
| 넘침 처리 | — | 메뉴가 넘치면 가로 스크롤 + 좌우 **흰색 페이드 그라디언트**(`rgba(255,255,255,.3→1)`) ✅ |

- 메가 메뉴·서브메뉴 패널(`.headermenubg`)의 폭·글자는 **🔶 S7-4**. 확인 전에는 서브메뉴 패널을 만들지 않고 1차 메뉴만 구현한다.
- 가입 포인트 말풍선(`joinpoint`): `11px`, 갈색 배경 + 흰 글자, 아래 화살표, 무한 바운스 `1.5s` ✅. **장식 요소이므로 구현은 선택**이며 만들면 `prefers-reduced-motion`에서 정지한다.
- 햄버거 버튼: `aria-expanded`, `aria-controls`, `aria-label="메뉴 열기"`. 검색 버튼도 동일. **메뉴 패널과 검색 패널이 동시에 열릴 수 있는지는 🔶 S7-9** — 확인 전에는 한쪽을 열면 다른 쪽을 닫는다.
- 뒤로가기 버튼(원본 `history.go(-1)`)은 서브페이지 전용이다. 메인에는 만들지 않는다.

### S6.3 메인 비주얼 · 캐러셀 (✅ 설정 / 🔶 크기)

- 원본: Swiper, `effect: slide`, `loop: true`, `autoplay delay: 4000ms`, `autoHeight: true`. 데스크톱·모바일 **이미지가 서로 다른 배너 2벌**이다.
- 우리 구현: **하나의 DOM + `<picture><source media="(min-width: 1025px)">`** 로 아트 디렉션한다. `autoHeight`는 이미지 `aspect-ratio`로 대체한다.
- 데스크톱 화살표(`prev/next`)는 **호버 환경에서만** 노출(원본 클래스명 `-hmos -ahide`에서 추정 🧮), 모바일은 **스와이프 + 페이지네이션 불릿**. 불릿은 `8px`, 가로 간격 `4px`, 비활성 `rgba(0,0,0,.2)`, 활성 `#000` ✅.
- 배너 위 텍스트 블록: 하단 기준 + `calc(-50% + 50px)` 이동, 높이 `calc(100% - 100px)` ✅(🔶 실제 정렬은 S7). 대비 확보를 위해 오버레이가 필요하면 **토큰으로 추가하고 보고**한다.
- **기본 구현은 Swiper 없이 `scroll-snap` + 작은 JS 모듈**이다. 루프·자동재생·peek이 필요하다. 기존 코드가 이미 Swiper를 쓰면 **같은 버전(8.4.5)을 중복 로드하지 않고** 그대로 쓴다. 새로 도입하려면 **먼저 제안하고 SRI·버전 고정**을 적용한다.
- 모든 자동재생에 **일시정지/재생 버튼**(접근 가능한 이름), 키보드 조작, 화면 밖 정지, `prefers-reduced-motion` 정지를 제공한다. 터치 드래그와 세로 스크롤이 충돌하지 않게 `touch-action: pan-y`를 확인한다.

### S6.4 섹션 헤더 (✅)

```html
<div class="part-box part-box--column section-head">
  <h2 class="section-head__title">베스트 상품</h2>
  <p class="section-head__desc">가장 사랑받은 아이템들</p>
</div>
```

| 속성 | 모바일·태블릿 (≤1024) | 데스크톱 (≥1025) |
|---|---|---|
| 정렬 | `text-align: center` ✅ | 동일 |
| 아래 간격 | **20px** ✅ | **40px** ✅ |
| 타이틀 | 18px / 700 | 22px / 700 |
| 서브카피 | 14px / 400 `#757575`, 위 간격 10px | 15px |
| 연출 | `d1FadeInUp` 1.0s ease, delay .4s ✅ | 동일 |

- 영문 섹션 제목(`PHOTO REVIEW`, `Youtube Shorts`, `INSTAGRAM`)은 **원본 표기 그대로** 쓴다(대소문자 포함).
- 숏츠 섹션은 제목이 **흰색**(`.shortsbanner .mainTitle h2 { color:#fff }` ✅)이며 제목 영역이 `display:flex; gap:10px; justify-content:center; align-items:center`로 **제목 외 요소(아이콘 등)를 함께 배치할 수 있게** 되어 있다 🧮. **배경색은 🔶 S7-5**.

### S6.5 상품 카드 (✅ 텍스트 / 🔶 이미지 비율·열 수)

```html
<li class="product-card">
  <a class="product-card__media" href="…">
    <img src="…" width="…" height="…" loading="lazy" alt="">
  </a>
  <div class="product-card__info">
    <a class="product-card__name" href="…">상품명</a>
    <p class="product-card__price"><ins>19,900</ins><span class="visually-hidden">원</span></p>
    <p class="product-card__review">후기 <span>12</span></p>
  </div>
</li>
```

| 요소 | 값 |
|---|---|
| 카드 행 간격 | `margin-bottom: 40px` → 우리는 목록 `row-gap: var(--card-row-gap)` ✅ |
| 썸네일 | `border-radius: 8px`(작은 변형 3px), `overflow:hidden`, 배경 `#fff` ✅ / 비율 🔶 S7-3 |
| 썸네일 호버·슬라이드 | 이미지가 여러 장이면 **내부 Swiper + 5px 점 페이지네이션**(하단 15px, 비활성 `#757575` .2, 활성 `#010101`) ✅. 터치 환경에서는 호버 교체를 하지 않는다 |
| 상품명 | 16px / 600, 2줄 말줄임 ✅ |
| 판매가 | 18px / 600 ✅ |
| 할인율 | 18px / 600 `--color-sale`, `%`는 13px ✅ |
| 후기 수 | 13px / 500 `--color-text-faint` ✅ (대비 주의 §S5.2) |
| 정렬 | 기본 좌측. `.-center` 변형(가운데 정렬) 존재 ✅ — 메인에서 쓰는지 🔶 |
| 정보 영역 | 컬러칩, 아이콘(신상·품절 등), 담기/관심 액션이 **데이터에 따라** 붙는다 ✅ — 없는 데이터는 요소를 만들지 않는다 |

- 카드 열 수: 베스트 상품 목록·영상 옆 슬라이더 모두 🔶 S7-1.
- 품절·할인·옵션 상태는 **실제 데이터 필드**(품절 여부, 정가, 판매가) 기준으로 구성한다. 이미지를 정사각형으로 통일하지 않는다.

### S6.6 포토리뷰 카드 (✅ 배지 / 🔶 카드 내부)

- `BEST` 배지: 카드 좌상단 `top:1px; left:1px`, `padding:8px 10px`, 12px/600, 배경 `rgba(0,0,0,.8)`, 흰 글자, `border-radius: 8px 0`(좌상·우하 라운드) ✅.
- 카드 박스 배경 `#fff`, 목록 좌우 여백 `--grid-gap` ✅. 리스트 하단 `padding-bottom: 50px`, `margin: 0 0 30px` ✅.
- 보기 개수·간격은 §S3.3. 카드 내부(리뷰 이미지·평점·작성자·본문)는 **확인된 필드만** 구성하고 나머지는 🔶로 둔다. 리뷰는 상품 카드와 **별도 컴포넌트**다.
- `gallery`(큰 박스) 타입은 배경 `#f4f4f4`, 패딩 `80px 180px 50px`, `베스트 리뷰` 라벨(90×32, 12px, 테두리 `#e8e8e8`)이 정의돼 있으나 **메인은 `mgallery` 타입**이다. 메인에서는 쓰지 않는다.

### S6.7 영상 · 숏츠 · 인스타그램 (✅ 일부)

- **영상 + 슬라이더(`.exsection001`)**: 배경 `#f8f8f8`, `padding: 35px 0`, 내용 박스를 **grid**로 `grid-template-columns: 1fr clamp(320px, 32%, 520px); gap: 24px; align-items: stretch` ✅. 영상은 `aspect-ratio: 16/9`, `max-height: min(72vh, 720px)`, `border-radius: 14px`, `overflow:hidden` ✅. 좁은 화면 전환(1열)은 🔶.
- **숏츠**: 카드 `border-radius: 14px` ✅, 보기 개수는 §S3.3. `data-youtube-id` 기반 임베드 → **썸네일 + 클릭 시 iframe 지연 로드**(`title` 필수), 로드 실패 시 대체 이미지와 외부 링크를 보여 섹션 높이를 유지한다.
- **INSTAGRAM**: 원본은 외부 모듈 출력이다. 신규 구현은 **이미지 그리드 목업 + 외부 링크**로 만들고 SDK를 넣지 않는다.
- 브랜드 스토리·영상·숏츠·SNS는 **상품 카드로 통합하지 않는다.** 각각 콘텐츠 비율·제목 구조를 유지한다.

### S6.8 푸터 · z-index (✅)

- 푸터: `border-top: 1px solid #eee`, `line-height: 1.8`. 속박스 `padding-block: 80px`, 블록 `gap: 70px`, `justify-content: space-between` ✅. 좌(`.f01`)·우(`.f02`) 블록 내부 `gap: 60px`.
- 회사 정보 블록: 로고(`max-height: 25px`, 아래 간격 40px / ≤1024 20px), 상호·대표·연락처·사업자번호·주소·반품주소 → **플레이스홀더**(§S1.4).
- 고객센터 블록: `h3` 15/600, **전화번호 26px/700**, 상담시간·휴무 안내, 무통장 계좌, 정책 링크, 결제 안전거래 안내. 링크 호버 색 `--color-text-sub` ✅.
- ≤1024px 푸터의 **세로 재배치·글자 크기는 🔶 S7-10**. 확인 전엔 `flex-direction: column`, 글자 `--fs-13`을 임시값으로 쓰고 주석한다.
- z-index 스케일: 원본 확인값은 **좌측 사이드바 `9999`**(✅ `.d1sidebar`)뿐이다. 나머지는 토큰으로 정의한다.
  ```css
  :root { --z-card: 2; --z-header: 100; --z-popup: 1000; --z-drawer: 9999; }  /* header·popup은 🔶 */
  ```

### S6.9 모바일 사이드바 · 검색 · 최근 본 상품 (✅ 일부 / 🔶 동작)

| 요소 | 값 |
|---|---|
| 좌측 사이드바 `.d1sidebar.left` | `position:fixed; top:0; left:0; bottom:0; width:90%; height:100%; background:#fff; z-index:9999`, 닫힘 `transform: translate(-200%)`, 전환 `transform .35s ease-in-out` ✅ |
| 우측 검색 패널 `.mrightaside` | 구조·크기 🔶 S7-9 |
| 최근 본 상품 `#recentasidepopup` | `h2 최근 본 상품`, 상태 3종 `loading / empty / inner(type1)` ✅ → 우리도 **로딩·빈 상태·목록** 3상태를 구현 (`<aside>`, 제목 `h2`가 문서 구조를 깨지 않도록 `aria-label` 사용 검토) |
| 퀵메뉴 `#sidefixedwrap` | 우하단 고정 추정 🔶 |

- 사이드바: 열림 시 **포커스를 패널 안으로 이동**, `Escape`/바깥 클릭/닫기 버튼으로 닫고 **호출 버튼으로 포커스 복귀**, 본문 스크롤 잠금, 닫힌 상태는 `inert`.
- 닫힌 패널의 모든 링크가 탭 순서에 남지 않게 한다.

---

## S7. 남은 확인 항목 (🔶 → ✅)

제공 자료로 확정되지 않은 값만 DevTools로 확인한다. 뷰포트 **390px / 768px / 1024px / 1440px / 1920px**에서 실행한다.

| # | 확인 항목 | 이유 |
|---|---|---|
| 1 | **상품 목록 열 수**(PC/태블릿/모바일), 상품 이미지 간격 | 목록이 Swiper인지 그리드인지, 구간별 개수가 CSS에서 확정되지 않음 |
| 2 | **정가/할인가 스타일**(취소선·색), 품절·신상 아이콘 | 할인율만 확인됨 |
| 3 | **상품 썸네일 비율** | 이미지 규격 의존. 임의로 1:1 금지 |
| 4 | **PC 메가 메뉴 / `.headermenubg`** 패널 | 닫힌 스냅샷만 있음 |
| 5 | **캐러셀 구간 경계**(s/m/l)와 숏츠 섹션 **배경색**, 포토리뷰 모바일·태블릿 보기 개수 | `data-caros` 의미는 추정(🧮) |
| 6 | **헤더 고정 여부·메인 투명 전환(`body#main.mto`)**, **포커스 링** 존재 | 스크롤 상태·JS 의존 |
| 7 | **`--size-margin-bottom` / `bottom2`가 적용되는 섹션**(`.mainSection` vs `.mainSection2`) | 변수 정의만 확정 |
| 8 | **5·6번 섹션 경계**(영상 옆 슬라이더가 어느 섹션 제목 아래인지) | HTML 구조 해석 필요 |
| 9 | **검색 패널 구조**, 메뉴·검색 패널 **동시 열림 가능 여부** | 이벤트 흐름 미확인 |
| 10 | **푸터 ≤1024 레이아웃·글자 크기** | CSS 미확정 |

```js
(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const root = getComputedStyle(document.documentElement);
  const v = (n) => root.getPropertyValue(n).trim();
  console.table(['--size-frame-padding','--size-margin-bottom','--size-margin-bottom2','--size-header-height','--grid-gap']
    .map((n) => ({ var: n, value: v(n) })));                                        // 구간별 최종 변수값
  // 7) 섹션 여백이 실제로 붙은 요소
  console.table(q('.mainSection, .mainSection2').map((e) => ({ cls: e.className.slice(0, 40), mb: getComputedStyle(e).marginBottom, h: e.offsetHeight })));
  // 1·3) 상품 카드 폭·썸네일 비율
  console.table(q('.ec-base-product .prdList > li').slice(0, 6).map((e) => { const t = e.querySelector('.thumbnail'); const r = t && t.getBoundingClientRect();
    return { w: Math.round(e.getBoundingClientRect().width), thumb: r ? `${Math.round(r.width)}×${Math.round(r.height)}` : '-' }; }));
  // 5) 숏츠 섹션 배경
  const s = document.querySelector('.shortsbanner'); console.log('shorts bg', s && getComputedStyle(s).backgroundColor);
  // 6) 헤더 위치·포커스 링
  const h = document.querySelector('#header'); console.log('header', h && getComputedStyle(h).position, h && h.offsetHeight);
  const a = document.querySelector('a, button'); a && a.focus(); console.log('focus outline', a && getComputedStyle(a).outline);
})();
```

실측 결과를 에이전트에 전달하면 해당 🔶 항목을 ✅로 교체하고 변경 이력에 기록한다.

---

## S8. 원본(Cafe24) → 우리 구현 대응

원본 클래스는 **기능 단서일 뿐 복제 대상이 아니다.** 신규 구현에서는 아래처럼 대응한다.

| 원본 | 의미 | 우리 구현 |
|---|---|---|
| `.-frame` / `.-framefull` | 속박스 / 풀블리드 | `.inner-box` / `.outer-box--bleed` |
| `.-flex`, `.-flex.column` | flex 유틸 | `.part-box`, `.part-box--column` |
| `.mainTitle` | 섹션 제목 | `.section-head` |
| `.mainSection`, `.mainSection2` | 섹션 하단 마진 160/120 | 겉박스 `--section-pb` / `--section-pb-alt` |
| `.bannerwrap.swiper-container` | 캐러셀 | `.carousel` (`data-js="carousel"`) |
| `D1W` / `D1TMB` | 데스크톱 / 태블릿·모바일 표시 | `@media (min-width: 1025px)` + `<picture>` |
| `.d1-product-list.ec-base-product .prdList` | 상품 목록 | `.product-list` > `.product-card` |
| `.d1-photoreview-list[data-type="mgallery"]` | 포토리뷰 | `.review-list` > `.review-card` |
| `.exsection001` | 영상 + 슬라이더 | `.feature-video` 내용 박스(grid) |
| `.d1sidebar.left`, `.mrightaside` | 모바일 메뉴·검색 | `.drawer`, `.search-panel` |
| `.recentasidepopup`, `#sidefixedwrap` | 최근 본 상품·퀵메뉴 | `.recent-popup`, `.quick-menu` |
| `xi-*` (Xeicon) | 아이콘 폰트 | SVG 스프라이트 + `currentColor` |
| `javascript:;`, `onclick` | 인라인 동작 | `<button data-js="…">` + 모듈 이벤트 |

- **실제 Cafe24 스킨을 수정하는 작업**(기존 플랫폼 소스 편집)으로 요청이 바뀌면 이 표는 적용하지 않는다. 그때는 `xans-*`, `ec-*`, `d1-*` 클래스, ID, `data-*`, 폼 `name/action/hidden`, 상품 식별자를 **역할 확인 전 삭제·변경하지 않고**, 플랫폼 스크립트가 참조하는 선택자를 검색한 뒤 수정하며, 상품·장바구니·검색·회원·리뷰 연동을 재검증한다. jQuery·Swiper·Cafe24 모듈을 임의로 대체·중복 로드하지 않는다. (요청 범위가 불명확하면 먼저 확인한다)

---

# PART 4. 최종 체크리스트 (완료 전 필수 통과)

## Designer 체크

- [ ] 모든 색·글자·간격·그림자·라운드가 **토큰**을 사용한다 (하드코딩 0건)
- [ ] 텍스트 대비 4.5:1 / UI 3:1 이상이다 (미달은 §S5.2 표에 따라 **보고에 기록**)
- [ ] 모든 인터랙티브 요소에 필요한 상태(hover·focus-visible·active·disabled·loading·empty)가 정의돼 있다
- [ ] 터치 타깃이 44px 이상이다(불가하면 인접 간격 확인)
- [ ] 320 / 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920px에서 깨지지 않는다 (가로 스크롤·잘림·겹침·이미지 왜곡 없음)
- [ ] 모션은 의미가 있고 `prefers-reduced-motion`을 지원한다 (`opacity:0` 시작 애니메이션이 사라지지 않는다)
- [ ] 문구가 능동형·일관된 어체이고 오류 메시지는 해결 방법을 안내한다
- [ ] **섹션 종류와 세로 순서**를 유지했다 (§S1.3), 상품·리뷰·스토리·영상·SNS를 콘텐츠 유형별로 구분했다
- [ ] 색·글자·박스 값이 **PART 3 토큰**과 일치한다 (🔶 항목을 실측값으로 단정하지 않았다)
- [ ] UI 색이 팔레트(흑·백·회색 + 갈색 포인트 + 빨강 할인색) 안에 있고, 갈색·빨강을 지정 용도 밖에 쓰지 않았다
- [ ] 데스크톱·모바일 헤더의 구조 차이와 메뉴·검색 패널의 열림/닫힘을 정의했다

## Developer 체크

- [ ] HTML: `lang`, 단일 `h1`, 단일 `main`, 제목 레벨 순서, `alt`, `label` 확인
- [ ] 클릭 가능한 모든 요소가 `button`/`a`이고 **키보드만으로 조작**된다 (`javascript:;`·인라인 이벤트 없음)
- [ ] 아이콘 단독 버튼에 접근 가능한 이름이 있고, 닫힌 패널은 탭 이동에서 제외된다
- [ ] 인라인 스타일·`id` 선택자·`!important`·`var` 없음, `innerHTML`에 외부 입력 삽입 없음
- [ ] 로딩·성공·오류·빈 상태가 모두 구현되었고 외부 임베드(YouTube 등) 실패 시 레이아웃이 유지된다
- [ ] 슬라이더·팝업: 터치·키보드·자동재생 일시정지·닫기·포커스 복귀가 동작한다
- [ ] 사용한 타이머·Observer·리스너·요청을 정리(destroy)한다
- [ ] 콘솔 에러/경고 0건, `console.log` 제거
- [ ] 이미지에 `width/height`가 있고 CLS가 발생하지 않으며, 원본 대용량 이미지를 변환·리사이즈했다
- [ ] 추적·마케팅 스크립트, jQuery, Slick, Kakao SDK, 실제 사업자 정보가 **들어가지 않았다**
- [ ] Lighthouse(모바일) Performance / Accessibility / Best Practices / SEO **90+**
- [ ] 페이지가 **겉박스 > `.inner-box` > 파티션 박스** 구조이고 골격에 Grid가 없다 (§S2.8 통과)
- [ ] 프로젝트 구조·네이밍을 따랐고 불필요한 파일 변경이 없다, 기존 기능에 회귀가 없다
- [ ] 변경 보고(§8.1)를 작성했고, **검증하지 못한 항목을 완료로 표시하지 않았다**

---

## 부록: 규약 위반·불확실 상황에서 에이전트의 행동

1. 사용자의 요청이 이 규약과 **충돌**하면 → 규약을 지킨 대안을 제시하고, 사용자가 명시적으로 원하면 **위반 사유를 코드 주석과 보고에 기록**한 뒤 진행한다.
2. 규약에 **없는 상황**이면 → 기존 코드의 패턴을 따르고, 새 패턴을 만들었다면 이 문서에 추가할 항목을 제안한다.
3. 원본에서 **확인하지 못한 값**은 만들어내지 않는다. 🔶로 표시하고 §S7 항목으로 남긴다.
4. 이 문서는 **살아있는 문서**다. 합의된 변경은 즉시 반영하고 아래 변경 이력에 기록한다.

| 날짜 | 변경 내용 | 작성자 |
|---|---|---|
| (기존) | UI/UX Designer·Frontend Developer Spec-Kit 통합, 그루밍데이 소스 분석(§9·§11) 및 Cafe24 최적화 리소스 부록 | — |
| 2026-11-03 | 구조 재편: 공통 원칙(§0)·박스 구조(겉박스/속박스/파티션)·우선순위·신뢰 등급(✅/🧮/🔶) 도입 | — |
| 2026-11-03 | PART 3 신설: 기존 부록 A~F를 실측 토큰으로 치환 (브레이크포인트 767/768/1025, `.-frame` 1920px, 여백 10/20/80px, 섹션 마진 60/100/160px, 팔레트·글자·컴포넌트 값, 캐러셀 설정) | — |
| 2026-11-03 | 일반 규약의 `--container-max: 1200px`, 정사각 이미지 기본값, 가로 `overflow` 처리 등 타깃과 충돌하는 항목을 사이트 우선 주석으로 정리, 접근성·개인정보 복제 금지 규칙(§S1.4) 추가 | — |
