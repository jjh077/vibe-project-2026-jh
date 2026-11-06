const pageIsNested = /\/pages\//.test(window.location.pathname);
const routes = {
  base: pageIsNested ? "../" : "",
  home: pageIsNested ? "../index.html" : "index.html",
  notice: pageIsNested ? "notice.html" : "pages/notice.html",
  login: pageIsNested ? "login.html" : "pages/login.html",
  signup: pageIsNested ? "signup.html" : "pages/signup.html",
};

const applyRoutes = (html) =>
  html
    .replaceAll("{{base}}", routes.base)
    .replaceAll("{{home}}", routes.home)
    .replaceAll("{{notice}}", routes.notice)
    .replaceAll("{{login}}", routes.login)
    .replaceAll('href="#"', `href="${routes.home}"`);

const loadTemplate = async (path) => {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`공통 화면을 불러오지 못했습니다: ${path}`);
  return applyRoutes(await response.text());
};

const main = document.querySelector("main");

const [headerHtml, overlaysHtml] = await Promise.all([
  loadTemplate("../components/site-header.html"),
  loadTemplate("../components/site-overlays.html"),
]);

if (main) {
  main.insertAdjacentHTML("beforebegin", headerHtml);
  main.insertAdjacentHTML(
    "afterend",
    '<footer class="site-footer" id="site-footer" aria-label="사이트 정보"></footer>',
  );
  document.body.insertAdjacentHTML("beforeend", overlaysHtml);
}
