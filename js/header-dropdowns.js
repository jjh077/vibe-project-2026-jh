const makeMenu = (className, label, entries) => {
  const menu = document.createElement("div");
  menu.className = `header-dropdown__menu ${className}`;
  menu.setAttribute("aria-label", label);
  entries.forEach(({ text, href, lang }) => {
    if (lang) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "header-dropdown__language";
      button.dataset.language = lang;
      button.setAttribute("aria-pressed", String(lang === "ko"));
      button.textContent = text;
      menu.append(button);
      return;
    }

    const item = href ? document.createElement("a") : document.createElement("span");
    item.className = "header-dropdown__link";
    item.textContent = text;
    if (href) item.href = href;
    menu.append(item);
  });
  return menu;
};

const wrapWithMenu = (target, menu, className) => {
  if (!target?.parentElement) return null;
  const wrapper = document.createElement("div");
  wrapper.className = `header-dropdown ${className}`;
  target.before(wrapper);
  wrapper.append(target, menu);
  return wrapper;
};

const isPagesDirectory = /\/pages\//.test(window.location.pathname);
const pageUrl = (path) =>
  isPagesDirectory ? path.replace(/^pages\//, "") : path;
const sectionUrl = (id) =>
  isPagesDirectory ? `../index.html#${id}` : `#${id}`;

document.querySelectorAll(".header__desktop").forEach((desktop) => {
  const menuNav = desktop.querySelector(".header__desktop-menu");
  const community = menuNav?.querySelector(".header__menu-label");
  if (community && !community.closest(".header-dropdown")) {
    community.tabIndex = 0;
    community.setAttribute("aria-haspopup", "true");
    community.setAttribute("aria-label", "커뮤니티 메뉴");
    const links = makeMenu("header-dropdown__menu--community", "커뮤니티 하위 메뉴", [
      { text: "Q&A" },
      { text: "REVIEW", href: sectionUrl("photo-review") },
      { text: "EVENT", href: sectionUrl("video-story") },
      { text: "자주묻는질문" },
    ]);
    wrapWithMenu(community, links, "header-dropdown--community");
  }

  const utilities = desktop.querySelector(".header__desktop-utilities");
  const buttons = [...(utilities?.querySelectorAll(":scope > .icon-button") || [])];
  const accountButton = buttons.find((button) => button.getAttribute("aria-label") === "마이페이지");
  if (accountButton && !accountButton.closest(".header-dropdown")) {
    const accountMenu = makeMenu("header-dropdown__menu--account", "회원 메뉴", [
      { text: "회원가입", href: pageUrl("pages/signup.html") },
      { text: "마이페이지" },
      { text: "주문조회" },
      { text: "최근 본 상품" },
      { text: "관심상품" },
      { text: "적립금" },
      { text: "쿠폰" },
      { text: "나의 게시글" },
    ]);
    wrapWithMenu(accountButton, accountMenu, "header-dropdown--account");
    const authMount = utilities.querySelector(".site-auth:not(.site-auth--mobile)");
    if (authMount) {
      accountMenu.prepend(authMount);
      const signupLink = accountMenu.querySelector('a[href$="signup.html"]');
      const updateSignupVisibility = () => {
        if (signupLink) {
          signupLink.hidden = Boolean(authMount.querySelector(".site-auth__logout"));
        }
      };
      new MutationObserver(updateSignupVisibility).observe(authMount, {
        childList: true,
        subtree: true,
      });
      updateSignupVisibility();
    }
  }

  const languageButton = buttons.find((button) => button.getAttribute("aria-label") === "언어 선택");
  if (languageButton && !languageButton.closest(".header-dropdown")) {
    const languageMenu = makeMenu("header-dropdown__menu--language", "언어 선택", [
      { text: "🇰🇷 한국어", lang: "ko" },
      { text: "🇺🇸 English", lang: "en" },
    ]);
    wrapWithMenu(languageButton, languageMenu, "header-dropdown--language");
  }
});

document.querySelectorAll(".header-dropdown__language").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".header-dropdown__language").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelectorAll(".mobile-menu__language").forEach((item) => {
      item.setAttribute("aria-pressed", String(item.dataset.language === button.dataset.language));
    });
  });
});
