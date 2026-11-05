/**
 * 공지사항 게시판 엔트리 (index.html 안에 포함된 해시 라우터)
 * #/notice · #/notice/view/:id · #/notice/write · #/notice/edit/:id  → 게시판
 * 그 외 해시(또는 없음) → 메인 페이지
 * 데이터는 오직 noticeService(Repository)를 통해서만 접근합니다.
 */
import { parseHash } from "./util.js";
import { renderListView } from "./views/listView.js";
import { renderDetailView } from "./views/detailView.js";
import { renderFormView } from "./views/formView.js";

const root = document.getElementById("notice-root");
const noticePage = document.getElementById("notice-page");
const homePage = document.getElementById("home-page");
const HOME_TITLE = document.title;
const BASE_TITLE = "공지사항 | 그루밍데이";
let wasNotice = false;

/** 화면 간 공유 상태 (조회수 중복 증가 방지용) */
const ctx = { skipViewIncrementFor: null };

let routeToken = 0;

export const navigate = (hash) => {
  if (window.location.hash === hash) route();
  else window.location.hash = hash;
};

async function route() {
  if (!root) return;
  const token = ++routeToken;
  const isStale = () => token !== routeToken;
  const { isNotice, path, query } = parseHash();

  // 메인 <-> 공지사항 화면 전환
  if (noticePage) noticePage.hidden = !isNotice;
  if (homePage) homePage.hidden = isNotice;

  if (!isNotice) {
    document.title = HOME_TITLE;
    if (wasNotice && !window.location.hash.replace("#", "")) window.scrollTo({ top: 0, behavior: "auto" });
    wasNotice = false;
    return;
  }
  wasNotice = true;
  const [name, id] = path;
  const common = { ctx, navigate, isStale };

  root.setAttribute("aria-busy", "true");
  window.scrollTo({ top: 0, behavior: "auto" });

  if (name === "view" && id) {
    document.title = BASE_TITLE;
    await renderDetailView(root, { id, ...common });
  } else if (name === "write") {
    document.title = "공지사항 작성 | 그루밍데이";
    await renderFormView(root, { mode: "create", ...common });
  } else if (name === "edit" && id) {
    document.title = "공지사항 수정 | 그루밍데이";
    await renderFormView(root, { mode: "edit", id, ...common });
  } else {
    document.title = BASE_TITLE;
    await renderListView(root, { query, ...common });
  }

  if (!isStale()) root.removeAttribute("aria-busy");
}

window.addEventListener("hashchange", route);
route();
