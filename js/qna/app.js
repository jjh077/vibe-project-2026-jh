import "../shared-layout.js";
import { getCurrentProfile, getCurrentUser } from "../auth/authService.js";
import { h, formatDate, formatViews, parseHash, statusBlock } from "../notice/util.js";
import { QNA_CATEGORIES, qnaService } from "./qnaService.js";

const root = document.getElementById("qna-root");
const PAGE_SIZE = 10;
let routeToken = 0;
const href = (path = "") => `#/${path}`;
const link = (label, path = "", className = "notice-btn") => h("a", { class: className, href: href(path), text: label });

async function route() {
  if (!root) return;
  const token = ++routeToken;
  const stale = () => token !== routeToken;
  const { path, query: params } = parseHash();
  root.setAttribute("aria-busy", "true");
  root.replaceChildren(statusBlock("게시판을 불러오는 중입니다..."));
  try {
    const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
    if (path[0] === "write" || path[0] === "edit") await renderForm(path[0], path[1], user, profile, stale);
    else if (path[0] === "view" && path[1]) await renderDetail(path[1], user, profile, stale);
    else await renderList(params, user, stale);
  } catch (error) {
    console.error("묻고답하기 로드 실패", error);
    if (!stale()) root.replaceChildren(statusBlock("게시판을 불러오지 못했습니다. 로그인 상태와 Firebase 설정을 확인해 주세요."));
  } finally {
    if (!stale()) root.removeAttribute("aria-busy");
  }
}

async function renderList(params, user, stale) {
  const state = { page: Math.max(1, Number(params.get("page")) || 1), keyword: params.get("q") || "" };
  const result = await qnaService.getList({ ...state, pageSize: PAGE_SIZE });
  if (stale()) return;
  const rows = result.items.length ? result.items.map((item, i) => h("tr", {},
    h("td", { class: "col-no", text: String(result.total - ((result.page - 1) * PAGE_SIZE + i)) }),
    h("td", { class: "col-title" },
      h("a", { class: "row-link qna-row-link", href: href(`view/${encodeURIComponent(item.id)}`) },
        item.answerCount > 0 ? h("span", { class: "qna-answered", text: "답변완료" }) : null,
        h("span", { class: "badge-cat", text: item.category }), h("span", { class: "row-title", text: item.title })),
      item.isPrivate ? h("span", { class: "qna-private", text: "비공개", "aria-label": "비공개 게시글" }) : null),
    h("td", { class: "col-author", text: item.authorName || "회원" }),
    h("td", { class: "col-date mono", text: formatDate(item.createdAt) }),
  )) : [h("tr", { class: "is-empty" }, h("td", { colspan: 4, text: state.keyword ? "검색 결과가 없습니다." : "등록된 질문이 없습니다." }))];
  const table = h("div", { class: "notice-card" }, h("table", { class: "notice-table qna-table" },
    h("thead", {}, h("tr", {}, h("th", { class: "col-no", text: "번호" }), h("th", { class: "col-title", text: "제목" }), h("th", { class: "col-author", text: "작성자" }), h("th", { class: "col-date", text: "작성일" }))), h("tbody", {}, rows)));
  const search = h("form", { class: "notice-search", role: "search", onSubmit: (event) => { event.preventDefault(); location.hash = href(`?q=${encodeURIComponent(input.value.trim())}`); } });
  const input = h("input", { class: "notice-input", type: "search", placeholder: "제목 또는 유형 검색", "aria-label": "검색어", value: state.keyword, maxlength: 50 });
  search.append(input, h("button", { class: "notice-btn notice-btn--primary", type: "submit", text: "검색" }));
  const pagination = h("nav", { class: "notice-pagination", "aria-label": "페이지 이동" });
  for (let page = 1; page <= result.totalPages; page++) pagination.append(h("a", { class: `page-btn${page === result.page ? " is-current" : ""}`, href: href(`?${state.keyword ? `q=${encodeURIComponent(state.keyword)}&` : ""}page=${page}`), text: String(page), "aria-current": page === result.page ? "page" : null }));
  root.replaceChildren(h("section", { class: "notice-list", "aria-label": "묻고답하기 목록" },
    h("div", { class: "notice-toolbar" }, h("p", { class: "notice-count" }, "전체 ", h("strong", { text: formatViews(result.total) }), "건"), h("span", { class: "qna-help", text: "회원 로그인 후 질문을 작성할 수 있습니다." })),
    table, h("div", { class: "notice-footer" }, h("span", { class: "notice-footer__spacer" }), pagination, user ? link("질문하기", "write", "notice-btn notice-btn--primary") : h("a", { class: "notice-btn notice-btn--primary", href: "login.html", text: "로그인 후 질문하기" })), search));
}

async function renderDetail(id, user, profile, stale) {
  const item = await qnaService.getById(id);
  if (stale()) return;
  if (!item) { root.replaceChildren(statusBlock("존재하지 않거나 삭제된 질문입니다."), link("목록으로")); return; }
  const isOwner = user?.uid === item.authorUid;
  const isAdmin = profile?.role === "admin";
  const post = h("article", { class: "post-card" }, h("header", { class: "post-head" },
    h("div", { class: "post-badges" }, h("span", { class: "badge-cat", text: item.category }), item.isPrivate ? h("span", { class: "qna-private-tag", text: "비공개" }) : null),
    h("h2", { class: "post-title", text: item.title }), h("div", { class: "post-meta" }, h("span", {}, "작성자: ", h("b", { text: item.authorName || "회원" })), h("span", {}, "작성일: ", h("b", { class: "mono", text: formatDate(item.createdAt) })))));
  if (item.isPrivate && !isOwner && !isAdmin) {
    root.replaceChildren(h("section", { class: "notice-detail" }, post, h("div", { class: "notice-status" }, h("p", { text: "비공개 질문입니다. 작성자와 관리자만 내용을 확인할 수 있습니다." }), link("목록으로"))));
    return;
  }
  const content = await qnaService.getContent(id);
  if (stale()) return;
  if (!content) throw new Error("질문 내용을 찾을 수 없습니다.");
  post.append(h("div", { class: "post-body", text: content.body }));
  const answers = await qnaService.getAnswers(id);
  if (stale()) return;
  const answerSection = h("section", { class: "qna-answers", "aria-label": "답변" }, h("h3", { text: `답변 ${answers.length}개` }));
  answers.forEach((answer) => answerSection.append(h("article", { class: "qna-answer" }, h("div", { class: "qna-answer__meta" }, h("strong", { text: answer.adminName || "관리자" }), h("time", { class: "mono", text: formatDate(answer.createdAt) })), h("p", { text: answer.body }))));
  if (isAdmin) answerSection.append(buildAnswerForm(id, profile));
  const actions = h("div", { class: "post-actions" }, link("목록으로"));
  if (isOwner) actions.append(h("div", { class: "post-actions__right" }, link("수정", `edit/${encodeURIComponent(id)}`, "notice-btn notice-btn--primary"), h("button", { class: "notice-btn notice-btn--danger", type: "button", text: "삭제", onClick: async () => { if (!confirm("질문을 삭제할까요?")) return; try { await qnaService.delete(id); location.hash = href(); } catch (error) { console.error(error); alert("삭제하지 못했습니다. 다시 시도해 주세요."); } } })));
  root.replaceChildren(h("section", { class: "notice-detail" }, post, answerSection, actions));
}

function buildAnswerForm(id, profile) {
  const textarea = h("textarea", { class: "notice-textarea", rows: 5, maxlength: 5000, required: true, placeholder: "답변 내용을 입력해 주세요." });
  const button = h("button", { class: "notice-btn notice-btn--primary", type: "submit", text: "답변 등록" });
  return h("form", { class: "qna-answer-form", onSubmit: async (event) => { event.preventDefault(); if (!textarea.value.trim()) return; button.disabled = true; try { await qnaService.addAnswer(id, { body: textarea.value.trim(), adminUid: profile.uid, adminName: profile.name || "관리자" }); await route(); } catch (error) { console.error(error); alert("답변을 저장하지 못했습니다."); button.disabled = false; } } }, textarea, button);
}

async function renderForm(mode, id, user, profile, stale) {
  const editing = mode === "edit";
  if (!user) { root.replaceChildren(statusBlock("질문 작성은 로그인한 회원만 이용할 수 있습니다."), h("a", { class: "notice-btn notice-btn--primary", href: "login.html", text: "로그인" }), link("목록으로")); return; }
  let existing = null;
  if (editing) {
    existing = await qnaService.getById(id);
    if (!existing || existing.authorUid !== user.uid) { root.replaceChildren(statusBlock("본인이 작성한 질문만 수정할 수 있습니다."), link("목록으로")); return; }
  }
  const currentContent = editing ? await qnaService.getContent(id) : null;
  if (stale()) return;
  const category = h("select", { class: "notice-select notice-select--block", required: true, value: existing?.category || "" },
    h("option", { value: "", disabled: true, text: "질문 유형을 선택해 주세요." }),
    QNA_CATEGORIES.map((value) => h("option", { value, text: value })));
  const title = h("input", { class: "notice-input notice-input--block", required: true, maxlength: 100, value: existing?.title || "", placeholder: "질문 제목을 입력하세요." });
  const body = h("textarea", { class: "notice-textarea", required: true, maxlength: 5000, rows: 14, placeholder: "질문 내용을 작성해 주세요.", value: currentContent?.body || "" });
  const privacy = h("input", { type: "checkbox", checked: existing?.isPrivate || false });
  const submit = h("button", { class: "notice-btn notice-btn--primary", type: "submit", text: editing ? "수정 완료" : "질문 등록" });
  const field = (label, control) => h("label", { class: "form-field" }, h("span", { class: "form-label", text: label }), control);
  const form = h("form", { class: "notice-form", onSubmit: async (event) => { event.preventDefault(); if (!title.value.trim() || !body.value.trim()) return; submit.disabled = true; try { const data = { title: title.value.trim(), category: category.value, body: body.value.trim(), isPrivate: privacy.checked }; const saved = editing ? (await qnaService.update(id, data), { id }) : await qnaService.create({ ...data, authorUid: user.uid, authorName: profile?.name || user.displayName || "회원" }); location.hash = href(`view/${encodeURIComponent(saved.id)}`); } catch (error) { console.error(error); alert("질문을 저장하지 못했습니다."); submit.disabled = false; } } },
    field("질문 유형", category), field("제목", title), h("div", { class: "form-field" }, h("span", { class: "form-label", text: "공개 설정" }), h("label", { class: "check-line" }, privacy, h("span", { text: "비공개 질문으로 등록" }))), field("내용", body), h("div", { class: "form-actions" }, link("취소", editing ? `view/${encodeURIComponent(id)}` : ""), submit));
  root.replaceChildren(h("section", { class: "notice-form-card", "aria-label": editing ? "질문 수정" : "질문 작성" }, h("div", { class: "form-head" }, h("h2", { class: "form-title", text: editing ? "질문 수정" : "새 질문 작성" }), h("p", { class: "form-hint", text: "질문 유형과 내용을 입력해 주세요." })), form));
}

window.addEventListener("hashchange", route);
route();
