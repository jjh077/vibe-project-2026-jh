import { noticeService } from "../noticeService.js";
import { icons } from "../icons.js";
import { h, formatDate, hrefs, statusBlock } from "../util.js";

const CATEGORIES = ["공지", "이벤트"];
const DEFAULT_AUTHOR = "그루밍데이";
const TITLE_MAX = 100;
const CONTENT_MAX = 5000;

/**
 * 작성(mode="create") / 수정(mode="edit") 공용 폼
 */
export async function renderFormView(root, { mode, id, ctx, navigate, isStale }) {
  const isEdit = mode === "edit";
  let existing = null;

  if (isEdit) {
    root.replaceChildren(statusBlock("게시글을 불러오는 중입니다..."));
    try {
      existing = await noticeService.getById(id);
    } catch (error) {
      console.error("수정 대상 로드 실패", error);
      if (isStale()) return;
      root.replaceChildren(
        statusBlock("게시글을 불러오지 못했습니다.", {
          retry: () => renderFormView(root, { mode, id, ctx, navigate, isStale }),
        }),
      );
      return;
    }
    if (isStale()) return;
    if (!existing) {
      root.replaceChildren(
        h(
          "div",
          { class: "notice-status", role: "status" },
          h("p", { text: "존재하지 않거나 삭제된 게시글입니다." }),
          h("a", { class: "notice-btn", href: hrefs.list() }, "목록으로"),
        ),
      );
      return;
    }
  }

  /* ----- 필드 ----- */
  const category = h(
    "select",
    { class: "notice-select notice-select--block", id: "f-category", name: "category", required: true, value: existing?.category ?? CATEGORIES[0] },
    CATEGORIES.map((c) => h("option", { value: c, text: c })),
  );
  const important = h("input", { type: "checkbox", id: "f-important", name: "isImportant", checked: existing?.isImportant ?? false });
  const title = h("input", {
    class: "notice-input notice-input--block",
    id: "f-title",
    name: "title",
    type: "text",
    placeholder: "공지사항 제목을 입력하세요",
    maxlength: TITLE_MAX,
    required: true,
    autocomplete: "off",
    value: existing?.title ?? "",
  });
  const content = h("textarea", {
    class: "notice-textarea",
    id: "f-content",
    name: "content",
    placeholder: "공지사항 내용을 작성해주세요.",
    maxlength: CONTENT_MAX,
    required: true,
    rows: 14,
    value: existing?.content ?? "",
  });

  const author = existing?.author ?? DEFAULT_AUTHOR;
  const createdDate = existing ? formatDate(existing.createdAt) : formatDate(new Date().toISOString());

  const errors = {
    category: h("p", { class: "field-error", id: "e-category", hidden: true }),
    title: h("p", { class: "field-error", id: "e-title", hidden: true }),
    content: h("p", { class: "field-error", id: "e-content", hidden: true }),
  };

  const setError = (name, input, message) => {
    errors[name].textContent = message || "";
    errors[name].hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) input.setAttribute("aria-describedby", errors[name].id);
    else input.removeAttribute("aria-describedby");
  };

  const validate = () => {
    const problems = [];
    if (!CATEGORIES.includes(category.value)) problems.push(["category", category, "구분 태그를 선택해 주세요."]);
    else setError("category", category, "");

    if (!title.value.trim()) problems.push(["title", title, "제목을 입력해 주세요."]);
    else setError("title", title, "");

    if (!content.value.trim()) problems.push(["content", content, "내용을 입력해 주세요."]);
    else setError("content", content, "");

    problems.forEach(([name, input, message]) => setError(name, input, message));
    problems[0]?.[1].focus();
    return problems.length === 0;
  };

  [[title, "title"], [content, "content"], [category, "category"]].forEach(([input, name]) =>
    input.addEventListener("input", () => input.value.trim() && setError(name, input, "")),
  );

  /* ----- 제출 / 취소 ----- */
  const submitLabel = isEdit ? "수정 완료" : "작성 완료";
  const submitBtn = h("button", { class: "notice-btn notice-btn--primary", type: "submit" }, h("span", { html: icons.check }), submitLabel);

  const cancelHref = isEdit ? hrefs.view(id) : hrefs.list();
  const cancelLink = h("a", {
    class: "notice-btn",
    href: cancelHref,
    text: "취소",
    onClick: () => {
      if (isEdit) ctx.skipViewIncrementFor = id; // 복귀 시 조회수 증가 방지
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.lastChild.textContent = "저장 중...";

    const dto = {
      category: category.value,
      isImportant: important.checked,
      title: title.value.trim(),
      author,
      content: content.value.replace(/\r\n/g, "\n").trim(),
    };

    try {
      const saved = isEdit ? await noticeService.update(id, dto) : await noticeService.create(dto);
      ctx.skipViewIncrementFor = saved.id; // 방금 저장한 글 상세로 이동: 조회수 증가 제외
      navigate(hrefs.view(saved.id));
    } catch (error) {
      console.error("공지사항 저장 실패", error);
      window.alert("저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      submitBtn.disabled = false;
      submitBtn.lastChild.textContent = submitLabel;
    }
  };

  /* ----- 레이아웃 ----- */
  const field = (labelText, forId, control, errorEl, required) =>
    h(
      "div",
      { class: "form-field" },
      h("label", { class: "form-label", for: forId }, labelText, required ? h("span", { class: "req", "aria-hidden": "true", text: " *" }) : null),
      control,
      errorEl,
    );

  const readonlyBox = (labelText, value, mono) =>
    h(
      "div",
      { class: "form-field" },
      h("label", { class: "form-label form-label--sub", text: labelText }),
      h("input", { class: `notice-input notice-input--block${mono ? " mono" : ""}`, type: "text", value, readonly: true, tabindex: -1 }),
    );

  const form = h(
    "form",
    { class: "notice-form", novalidate: true, onSubmit },
    h(
      "div",
      { class: "form-row" },
      field("구분 태그", "f-category", category, errors.category, true),
      h(
        "div",
        { class: "form-field" },
        h("span", { class: "form-label", text: "중요 표시" }),
        h("label", { class: "check-line", for: "f-important" }, important, h("span", { text: "[필독] 태그 노출 및 상단 고정" })),
      ),
    ),
    field("제목", "f-title", title, errors.title, true),
    h("div", { class: "form-meta" }, readonlyBox("작성자", author), readonlyBox("작성일", createdDate, true)),
    field("내용", "f-content", content, errors.content, true),
    h("div", { class: "form-actions" }, cancelLink, submitBtn),
  );

  root.replaceChildren(
    h(
      "section",
      { class: "notice-form-card", "aria-label": isEdit ? "공지사항 수정" : "새 공지사항 작성" },
      h(
        "div",
        { class: "form-head" },
        h("h2", { class: "form-title" }, h("span", { html: icons.editBox }), isEdit ? "공지사항 수정" : "새 공지사항 작성"),
        h("p", { class: "form-hint", text: "* 필수 입력 항목입니다." }),
      ),
      form,
    ),
  );
}
