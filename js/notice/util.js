/**
 * 공지사항 화면 공용 유틸
 * - DOM 은 textContent 로만 채워 XSS 를 원천 차단합니다. (사용자 입력에 innerHTML 금지)
 * - `html` 속성은 icons.js 의 정적 SVG 전용입니다.
 */

/** 작은 DOM 생성 헬퍼: h("div", { class: "a", text: "..." }, child1, child2) */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  const deferred = {};

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === "class") el.className = value;
    else if (key === "text") el.textContent = value;
    else if (key === "html") el.innerHTML = value; // 정적 아이콘 전용
    else if (key.startsWith("on")) el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "value" || key === "checked") deferred[key] = value; // select 는 option 추가 후 지정
    else el.setAttribute(key, value === true ? "" : String(value));
  }

  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  Object.assign(el, deferred);
  return el;
}

/* ---------- 포맷터 ---------- */

const pad = (n) => String(n).padStart(2, "0");

/** ISO 문자열 -> "2026.11.01" (사용자 로컬 날짜 기준) */
export const formatDate = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export const formatViews = (n) => Number(n || 0).toLocaleString("en-US");

/** 바이트 -> "1.2 MB" */
export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/** 3일 이내 작성 글 여부 */
export const isNew = (iso, now = Date.now()) => {
  const diff = now - new Date(iso).getTime();
  return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000;
};

/* ---------- 해시 라우팅 ---------- */

/** "#/view/abc?x=1" -> { path: ["view","abc"], query } */
export const parseHash = () => {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart = ""] = raw.split("?");
  const parts = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  return { path: parts, query: new URLSearchParams(queryPart) };
};

export const hrefs = {
  list: (state = {}) => {
    const q = new URLSearchParams();
    if (state.category && state.category !== "all") q.set("cat", state.category);
    if (state.keyword) q.set("q", state.keyword);
    if (state.keyword && state.searchType && state.searchType !== "all") q.set("type", state.searchType);
    if (state.page && state.page > 1) q.set("page", String(state.page));
    const s = q.toString();
    return `#/${s ? `?${s}` : ""}`;
  },
  view: (id) => `#/view/${encodeURIComponent(id)}`,
  write: () => "#/write",
  edit: (id) => `#/edit/${encodeURIComponent(id)}`,
};

/** 로딩 / 오류 / 빈 상태 공용 블록 */
export const statusBlock = (message, { retry } = {}) =>
  h(
    "div",
    { class: "notice-status", role: "status" },
    h("p", { text: message }),
    retry ? h("button", { class: "notice-btn", type: "button", onClick: retry, text: "다시 시도" }) : null,
  );
