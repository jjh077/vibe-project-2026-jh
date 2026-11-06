import { authErrorMessage, signIn } from "./authService.js";

const loginForm = document.querySelector("[data-login-form]");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector('button[type="submit"]');
  const output = loginForm.querySelector("[data-form-message]");
  button.disabled = true;
  try {
    await signIn(loginForm.elements.email.value, loginForm.elements.password.value);
    const next = new URLSearchParams(window.location.search).get("next");
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "notice.html";
    window.location.assign(safeNext);
  } catch (error) {
    output.textContent = authErrorMessage(error);
    output.dataset.state = "error";
    button.disabled = false;
  }
});
