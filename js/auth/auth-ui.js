import { getCurrentProfile, signOutCurrentUser } from "./authService.js";
import { auth } from "../notice/firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

const mounts = [...document.querySelectorAll("[data-auth-ui]")];

function makeLink(href, label, className) {
  const link = document.createElement("a");
  link.href = href;
  link.className = className;
  link.textContent = label;
  return link;
}

function makeLogout(className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = "로그아웃";
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await signOutCurrentUser();
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 실패", error);
      button.disabled = false;
    }
  });
  return button;
}

onAuthStateChanged(auth, async (user) => {
  let profile = null;
  if (user) {
    try {
      profile = await getCurrentProfile();
    } catch (error) {
      console.error("회원 정보를 불러오지 못했습니다.", error);
    }
  }

  mounts.forEach((mount) => {
    mount.replaceChildren();
    const loginUrl = mount.dataset.loginUrl || "login.html";
    if (!user) {
      mount.append(makeLink(loginUrl, "로그인", "site-auth__link mobile-menu__action"));
      return;
    }

    const welcome = document.createElement("span");
    welcome.className = "site-auth__welcome";
    welcome.textContent = `${profile?.name || user.displayName || "사용자"}님 환영합니다`;
    mount.append(welcome, makeLogout("site-auth__logout mobile-menu__action"));
  });
});
