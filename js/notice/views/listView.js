import { noticeService } from "../noticeService.js";
import { icons } from "../icons.js";
import { h, formatDate, formatViews, isNew, hrefs, statusBlock } from "../util.js";

const TABS = [
  { value: "all", label: "전체보기" },
  { value: "공지", label: "공지사항" },
  { value: "이벤트", label: "이벤트" },
];

const SEARCH_TYPES = [
  { value: "all", label: "제목+내용" },
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
];

const PAGE_WINDOW = 5;

export async function renderListView(root, { query, navigate, isStale }) {
  const state = {
    category: ["공지", "이벤트"].includes(query.get("cat")) ? query.get("cat") : "all",
    keyword: query.get("q") || "",
    searchType: ["title", "content"].includes(query.get("type")) ? query.get("type") : "all",
    page: Math.max(1, parseInt(query.get("page"), 10) || 1),
  };

  root.replaceChildren(statusBlock("목록을 불러오는 중입니다..."));

  let result;
  try {
    result = await noticeService.getList(state);
  } catch (error) {
    console.error("공지사항 목록 로드 실패", error);
    if (isStale()) return;
    root.replaceChildren(
      statusBlock("목록을 불러오지 못했습니다.", {
        retry: () => renderListView(root, { query, navigate, isStale }),
      }),
    );
    return;
  }
  if (isStale()) return;

  state.page = result.page; // 범위를 벗어난 page 보정값 반영

  root.replaceChildren(
    h(
      "section",
      { class: "notice-list", "aria-label": "공지사항 목록" },
      buildToolbar(state, result),
      buildTable(result.items, state),
      buildFooter(state, result),
      buildSearch(state, navigate),
    ),
  );
}

/* ---------- 상단: 전체 N건 + 탭 ---------- */
function buildToolbar(state, result) {
  return h(
    "div",
    { class: "notice-toolbar" },
    h("p", { class: "notice-count" }, "전체 ", h("strong", { text: formatViews(result.total) }), "건"),
    h(
      "nav",
      { class: "notice-tabs", "aria-label": "공지 구분" },
      TABS.map((tab) =>
        h("a", {
          class: `notice-tab${state.category === tab.value ? " is-active" : ""}`,
          href: hrefs.list({ ...state, category: tab.value, page: 1 }),
          "aria-current": state.category === tab.value ? "page" : null,
          text: tab.label,
        }),
      ),
    ),
  );
}

/* ---------- 목록 테이블 ---------- */
function buildTable(items, state) {
  const head = h(
    "thead",
    {},
    h(
      "tr",
      {},
      h("th", { class: "col-no", scope: "col", text: "번호" }),
      h("th", { class: "col-title", scope: "col", text: "제목" }),
      h("th", { class: "col-author", scope: "col", text: "작성자" }),
      h("th", { class: "col-date", scope: "col", text: "작성일" }),
      h("th", { class: "col-views", scope: "col", text: "조회" }),
    ),
  );

  const body = h("tbody", {});
  if (items.length === 0) {
    const message = state.keyword ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다.";
    body.append(h("tr", { class: "is-empty" }, h("td", { colspan: 5, text: message })));
  } else {
    items.forEach((item) => body.append(buildRow(item)));
  }

  return h("div", { class: "notice-card" }, h("table", { class: "notice-table" }, head, body));
}

function buildRow(item) {
  const noCell = item.isImportant
    ? h("span", { class: "badge-pin", text: "공지" })
    : h("span", { class: "row-no", text: item.no });

  const titleLink = h(
    "a",
    { class: "row-link", href: hrefs.view(item.id) },
    item.isImportant ? h("span", { class: "tag-must", text: "필독" }) : null,
    h("span", { class: "row-title", text: item.title }),
    isNew(item.createdAt) ? h("span", { class: "tag-new", text: "[NEW]" }) : null,
    item.attachment
      ? h("span", { class: "row-clip", html: icons.clip, role: "img", "aria-label": "첨부파일 있음" })
      : null,
  );

  return h(
    "tr",
    { class: item.isImportant ? "is-pinned" : null },
    h("td", { class: "col-no" }, noCell),
    h("td", { class: "col-title" }, titleLink),
    h("td", { class: "col-author", text: item.author }),
    h("td", { class: "col-date mono", text: formatDate(item.createdAt) }),
    h("td", { class: "col-views mono", text: formatViews(item.views) }),
  );
}

/* ---------- 페이지네이션 + 글쓰기 ---------- */
function buildFooter(state, result) {
  const { page, totalPages } = result;
  const first = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const last = Math.min(first + PAGE_WINDOW - 1, totalPages);

  const pageLink = (target, content, { label, disabled, current } = {}) =>
    h("a", {
      class: `page-btn${current ? " is-current" : ""}${disabled ? " is-disabled" : ""}`,
      href: disabled ? null : hrefs.list({ ...state, page: target }),
      "aria-label": label,
      "aria-current": current ? "page" : null,
      "aria-disabled": disabled ? "true" : null,
      ...(typeof content === "string" && content.startsWith("<svg") ? { html: content } : { text: String(content) }),
    });

  const pages = [];
  for (let p = first; p <= last; p += 1) pages.push(pageLink(p, p, { label: `${p}페이지`, current: p === page }));

  return h(
    "div",
    { class: "notice-footer" },
    h("span", { class: "notice-footer__spacer", "aria-hidden": "true" }),
    h(
      "nav",
      { class: "notice-pagination", "aria-label": "페이지 이동" },
      pageLink(page - 1, icons.chevronLeft, { label: "이전 페이지", disabled: page <= 1 }),
      pages,
      pageLink(page + 1, icons.chevronRight, { label: "다음 페이지", disabled: page >= totalPages }),
    ),
    h("a", { class: "notice-btn notice-btn--primary", href: hrefs.write() }, h("span", { html: icons.pen }), "글쓰기"),
  );
}

/* ---------- 검색 ---------- */
function buildSearch(state, navigate) {
  const select = h(
    "select",
    { class: "notice-select", name: "type", "aria-label": "검색 구분", value: state.searchType },
    SEARCH_TYPES.map((t) => h("option", { value: t.value, text: t.label })),
  );
  const input = h("input", {
    class: "notice-input",
    type: "search",
    name: "q",
    placeholder: "검색어를 입력해 주세요",
    "aria-label": "검색어",
    value: state.keyword,
    maxlength: 50,
  });

  return h(
    "form",
    {
      class: "notice-search",
      role: "search",
      onSubmit: (event) => {
        event.preventDefault();
        navigate(
          hrefs.list({
            category: state.category,
            keyword: input.value.trim(),
            searchType: select.value,
            page: 1,
          }),
        );
      },
    },
    select,
    input,
    h("button", { class: "notice-btn notice-btn--primary", type: "submit" }, h("span", { html: icons.search }), "검색"),
  );
}
