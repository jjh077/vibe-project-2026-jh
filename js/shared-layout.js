import {
  siteHeaderTemplate,
  siteOverlaysTemplate,
} from "./shared-shell-templates.js";

const pageIsNested = /\/pages\//.test(window.location.pathname);
const routes = {
  base: pageIsNested ? "../" : "",
  home: pageIsNested ? "../index.html" : "index.html",
  notice: pageIsNested ? "notice.html" : "pages/notice.html",
  qna: pageIsNested ? "qna.html" : "pages/qna.html",
  login: pageIsNested ? "login.html" : "pages/login.html",
  signup: pageIsNested ? "signup.html" : "pages/signup.html",
};

const applyRoutes = (html) =>
  html
    .replaceAll("{{base}}", routes.base)
    .replaceAll("{{home}}", routes.home)
    .replaceAll("{{notice}}", routes.notice)
    .replaceAll("{{qna}}", routes.qna)
    .replaceAll("{{login}}", routes.login)
    .replaceAll('href="#"', `href="${routes.home}"`);

const main = document.querySelector("main");

if (main) {
  main.insertAdjacentHTML("beforebegin", applyRoutes(siteHeaderTemplate));
  main.insertAdjacentHTML(
    "afterend",
    '<footer class="site-footer" id="site-footer" aria-label="사이트 정보"></footer>',
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    applyRoutes(siteOverlaysTemplate),
  );
}
