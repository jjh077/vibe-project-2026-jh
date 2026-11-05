/**
 * 상단 공지 롤링 바 (index 전용)
 * - 공지사항 상위 3개를 한 줄로 순서대로 롤링 (중앙 정렬)
 * - 컨트롤(멈춤/재생, 닫기)은 오른쪽 정렬
 * - 열려 있는 동안 :root 의 --notice-bar-height 를 설정해 메뉴/히어로를 아래로 밀고,
 *   닫으면 0 으로 되돌려 메뉴가 최상단으로 올라가게 함
 *
 * 데이터는 noticeService(Repository) 만 사용하므로 Firebase 전환 시 수정 불필요.
 */
import { noticeService } from "./notice/noticeService.js";
import { h } from "./notice/util.js";

const ROLL_COUNT = 3;
const INTERVAL_MS = 4000;
const NOTICE_URL = "pages/notice.html";

const bar = document.getElementById("notice-bar");

const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-fill" x="6" y="5" width="4" height="14" rx="1"/><rect class="icon-fill" x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_PLAY =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-fill" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';

/** 바 높이를 CSS 변수로 반영 (헤더/히어로 위치 보정) */
const applyBarHeight = () => {
  document.documentElement.style.setProperty(
    "--notice-bar-height",
    `${bar.offsetHeight}px`,
  );
};

const closeBar = () => {
  bar.hidden = true;
  document.body.classList.remove("has-notice-bar");
  document.documentElement.style.setProperty("--notice-bar-height", "0px");
  window.dispatchEvent(new Event("resize"));
};

async function init() {
  if (!bar) return;

  let notices = [];
  try {
    const { items } = await noticeService.getList({ page: 1, pageSize: ROLL_COUNT });
    notices = items.slice(0, ROLL_COUNT);
  } catch (error) {
    console.error("[notice-bar] 공지사항을 불러오지 못했습니다.", error);
    return;
  }
  if (notices.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const multiple = notices.length > 1;

  /* ---------- DOM ---------- */
  const items = notices.map((notice) =>
    h(
      "a",
      {
        class: "notice-bar__item",
        href: `${NOTICE_URL}#/view/${encodeURIComponent(notice.id)}`,
      },
      h("span", { class: "notice-bar__category", text: `[${notice.category}]` }),
      h("span", { class: "notice-bar__title", text: notice.title }),
    ),
  );

  const toggleButton = h("button", {
    class: "notice-bar__button notice-bar__toggle",
    type: "button",
    hidden: !multiple,
  });
  const closeButton = h("button", {
    class: "notice-bar__button notice-bar__close",
    type: "button",
    "aria-label": "공지사항 닫기",
    html: ICON_CLOSE,
  });

  const viewport = h("div", { class: "notice-bar__viewport" }, items);
  const controls = h("div", { class: "notice-bar__controls" }, toggleButton, closeButton);

  bar.replaceChildren(h("div", { class: "notice-bar__inner" }, viewport, controls));

  /* ---------- 롤링 상태 ---------- */
  let activeIndex = 0;
  let timer = 0;
  let userPaused = reducedMotion.matches; // 동작 줄이기 설정이면 정지 상태로 시작
  let hoverPaused = false;

  const show = (nextIndex) => {
    const previous = items[activeIndex];
    activeIndex = (nextIndex + items.length) % items.length;
    const current = items[activeIndex];

    if (previous !== current) {
      previous.classList.remove("is-active");
      previous.classList.add("is-leaving");
      window.setTimeout(() => previous.classList.remove("is-leaving"), 350);
    }
    current.classList.remove("is-leaving");
    current.classList.add("is-active");

    items.forEach((item) => {
      const isCurrent = item === current;
      item.setAttribute("aria-hidden", String(!isCurrent));
      item.tabIndex = isCurrent ? 0 : -1;
    });
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const start = () => {
    stop();
    if (!multiple || userPaused || hoverPaused || document.hidden) return;
    timer = window.setInterval(() => show(activeIndex + 1), INTERVAL_MS);
  };

  const renderToggle = () => {
    toggleButton.innerHTML = userPaused ? ICON_PLAY : ICON_PAUSE;
    toggleButton.setAttribute("aria-label", userPaused ? "공지사항 재생" : "공지사항 멈춤");
    viewport.setAttribute("aria-live", userPaused ? "polite" : "off");
  };

  toggleButton.addEventListener("click", () => {
    userPaused = !userPaused;
    renderToggle();
    start();
  });

  closeButton.addEventListener("click", () => {
    stop();
    closeBar();
  });

  // 마우스를 올리거나 키보드 포커스가 있는 동안 일시 정지 (읽을 시간 확보)
  bar.addEventListener("mouseenter", () => {
    hoverPaused = true;
    start();
  });
  bar.addEventListener("mouseleave", () => {
    hoverPaused = false;
    start();
  });
  bar.addEventListener("focusin", () => {
    hoverPaused = true;
    start();
  });
  bar.addEventListener("focusout", () => {
    hoverPaused = false;
    start();
  });

  document.addEventListener("visibilitychange", start);
  window.addEventListener("resize", () => {
    if (!bar.hidden) applyBarHeight();
  });

  /* ---------- 표시 ---------- */
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "공지사항");
  bar.hidden = false;
  document.body.classList.add("has-notice-bar");
  applyBarHeight();

  renderToggle();
  show(0);
  start();
}

init();
