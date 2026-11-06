import { noticeService } from "../noticeService.js";
import { icons } from "../icons.js";
import { h, formatDate, formatViews, formatSize, hrefs, statusBlock } from "../util.js";
import { getCurrentProfile } from "../../auth/authService.js";

export async function renderDetailView(root, { id, ctx, navigate, isStale }) {
  root.replaceChildren(statusBlock("게시글을 불러오는 중입니다..."));

  let notice;
  try {
    // 진입 시 조회수 +1 (수정/작성 후 복귀하는 경우는 제외)
    if (ctx.skipViewIncrementFor === id) {
      ctx.skipViewIncrementFor = null;
    } else {
      await noticeService.increaseViews(id);
    }
    notice = await noticeService.getById(id);
  } catch (error) {
    if (isStale()) return;
    // increaseViews 가 "없는 글" 로 throw 한 경우도 동일하게 처리
    if (/not found/i.test(error.message)) {
      root.replaceChildren(notFound());
    } else {
      console.error("공지사항 상세 로드 실패", error);
      root.replaceChildren(
        statusBlock("게시글을 불러오지 못했습니다.", {
          retry: () => renderDetailView(root, { id, ctx, navigate, isStale }),
        }),
      );
    }
    return;
  }
  if (isStale()) return;

  if (!notice) {
    root.replaceChildren(notFound());
    return;
  }

  let isAdmin = false;
  try {
    isAdmin = (await getCurrentProfile())?.role === "admin";
  } catch (error) {
    console.error("회원 권한 확인 실패", error);
  }
  if (isStale()) return;

  root.replaceChildren(
    h(
      "article",
      { class: "notice-detail" },
      buildPost(notice),
      buildActions(notice, navigate, isAdmin),
      buildAdjacent(notice),
    ),
  );
}

function notFound() {
  return h(
    "div",
    { class: "notice-status", role: "status" },
    h("p", { text: "존재하지 않거나 삭제된 게시글입니다." }),
    h("a", { class: "notice-btn", href: hrefs.list() }, "목록으로"),
  );
}

function buildPost(notice) {
  const head = h(
    "header",
    { class: "post-head" },
    h(
      "div",
      { class: "post-badges" },
      h("span", { class: "badge-cat", text: notice.category }),
      notice.isImportant ? h("span", { class: "tag-must", text: "필독" }) : null,
    ),
    h("h2", { class: "post-title", text: notice.title }),
    h(
      "div",
      { class: "post-meta" },
      h(
        "div",
        { class: "post-meta__left" },
        h("span", {}, "작성자: ", h("b", { text: notice.author })),
        h("span", {}, "작성일: ", h("b", { class: "mono", text: formatDate(notice.createdAt) })),
      ),
      h("span", {}, "조회수: ", h("b", { class: "mono", text: formatViews(notice.views) })),
    ),
  );

  const attachment = notice.attachment
    ? h(
        "div",
        { class: "post-attach" },
        h("span", { class: "post-attach__icon", html: icons.clip }),
        h("span", { class: "post-attach__label", text: "첨부파일:" }),
        h("span", { class: "post-attach__name", text: notice.attachment.name }),
        h("span", { class: "post-attach__size", text: `(${formatSize(notice.attachment.size)})` }),
      )
    : null;

  // 본문: textContent + white-space: pre-wrap → HTML 이스케이프 + 줄바꿈만 반영 (마크다운 미지원)
  const body = h("div", { class: "post-body", text: notice.content });

  return h("div", { class: "post-card" }, head, attachment, body);
}

function buildActions(notice, navigate, isAdmin) {
  const onDelete = async (event) => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.")) return;
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await noticeService.delete(notice.id);
      navigate(hrefs.list());
    } catch (error) {
      console.error("공지사항 삭제 실패", error);
      window.alert("삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      button.disabled = false;
    }
  };

  return h(
    "div",
    { class: "post-actions" },
    h("a", { class: "notice-btn", href: hrefs.list() }, h("span", { html: icons.list }), "목록으로"),
    isAdmin ? h(
      "div",
      { class: "post-actions__right" },
      h("a", { class: "notice-btn notice-btn--primary", href: hrefs.edit(notice.id) }, h("span", { html: icons.editBox.replace(/width="22" height="22"/, 'width="15" height="15"') }), "수정"),
      h("button", { class: "notice-btn notice-btn--danger", type: "button", onClick: onDelete }, h("span", { html: icons.trash }), "삭제"),
    ) : null,
  );
}

function buildAdjacent(notice) {
  const row = (kind, icon, target) =>
    h(
      "li",
      { class: "adjacent__row" },
      h("span", { class: "adjacent__label" }, h("span", { html: icon }), kind === "prev" ? "이전글" : "다음글"),
      target
        ? h("a", { class: "adjacent__title", href: hrefs.view(target.id), text: target.title })
        : h("span", {
            class: "adjacent__title is-none",
            text: kind === "prev" ? "이전 게시물이 없습니다." : "다음 게시물이 없습니다.",
          }),
    );

  return h(
    "ul",
    { class: "adjacent", "aria-label": "이전글 다음글" },
    row("prev", icons.chevronUp, notice.prev),
    row("next", icons.chevronDown, notice.next),
  );
}
