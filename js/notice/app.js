/**
 * 공지사항 게시판 엔트리 (pages/notice.html): 해시 라우터
 * #/ (목록) · #/view/:id · #/write · #/edit/:id
 * 데이터는 오직 noticeService(Repository)를 통해서만 접근합니다.
 */
import { parseHash } from "./util.js";
import { renderListView } from "./views/listView.js";
import { renderDetailView } from "./views/detailView.js";
import { renderFormView } from "./views/formView.js";

import "../shared-layout.js";

const root = document.getElementById("notice-root");
const BASE_TITLE = "공지사항 | 그루밍데이";

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
  const { path, query } = parseHash();

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
