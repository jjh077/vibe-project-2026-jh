import { authErrorMessage, createAccount, isUsernameAvailable } from "./authService.js";

const signupForm = document.querySelector("[data-signup-form]");
const usernameInput = signupForm?.elements.namedItem("username");
const usernameStatus = document.querySelector("[data-username-status]");

usernameInput?.addEventListener("blur", async () => {
  const username = usernameInput.value.trim().toLowerCase();
  if (!/^[a-z0-9_]{4,20}$/.test(username)) {
    usernameStatus.textContent = "아이디는 영문 소문자, 숫자, 밑줄로 4~20자여야 합니다.";
    usernameStatus.dataset.state = "error";
    return;
  }
  if (username === "admin") {
    usernameStatus.textContent = "관리자 전용 아이디입니다. 다른 아이디를 입력해 주세요.";
    usernameStatus.dataset.state = "error";
    return;
  }
  try {
    const available = await isUsernameAvailable(username);
    usernameStatus.textContent = available ? "사용할 수 있는 아이디입니다." : "이미 사용 중인 아이디입니다.";
    usernameStatus.dataset.state = available ? "success" : "error";
  } catch {
    usernameStatus.textContent = "아이디를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    usernameStatus.dataset.state = "error";
  }
});

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;
  const button = signupForm.querySelector('button[type="submit"]');
  const output = signupForm.querySelector("[data-form-message]");
  button.disabled = true;
  try {
    const values = Object.fromEntries(new FormData(signupForm));
    await createAccount(values);
    output.textContent = "회원가입이 완료되었습니다. 로그인 상태로 공지사항으로 이동합니다.";
    output.dataset.state = "success";
    window.setTimeout(() => window.location.assign("notice.html"), 700);
  } catch (error) {
    output.textContent = authErrorMessage(error);
    output.dataset.state = "error";
    button.disabled = false;
  }
});
