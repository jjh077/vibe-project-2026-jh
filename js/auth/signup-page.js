import { authErrorMessage, createAccount, isUsernameAvailable } from "./authService.js";

const signupForm = document.querySelector("[data-signup-form]");
const usernameInput = signupForm?.elements.namedItem("username");
const usernameStatus = document.querySelector("[data-username-status]");
const usernameCheckButton = document.querySelector("[data-username-check]");
let checkedUsername = "";
let usernameAvailable = false;
let checkSequence = 0;

usernameInput?.addEventListener("input", () => {
  checkedUsername = "";
  usernameAvailable = false;
  checkSequence += 1;
  usernameCheckButton.disabled = false;
  usernameStatus.textContent = "아이디를 입력한 뒤 중복 확인을 눌러 주세요.";
  usernameStatus.dataset.state = "";
});

usernameCheckButton?.addEventListener("click", async () => {
  const username = usernameInput.value.trim().toLowerCase();
  checkedUsername = "";
  usernameAvailable = false;
  if (!/^[a-z0-9_]{4,20}$/.test(username)) {
    usernameStatus.textContent = "아이디는 영문 소문자, 숫자, 밑줄로 4~20자여야 합니다.";
    usernameStatus.dataset.state = "error";
    checkedUsername = "";
    usernameAvailable = false;
    return;
  }
  if (username === "admin") {
    usernameStatus.textContent = "관리자 전용 아이디입니다. 다른 아이디를 입력해 주세요.";
    usernameStatus.dataset.state = "error";
    checkedUsername = "";
    usernameAvailable = false;
    return;
  }

  const sequence = ++checkSequence;
  usernameCheckButton.disabled = true;
  usernameStatus.textContent = "아이디를 확인하고 있습니다.";
  usernameStatus.dataset.state = "";
  try {
    const available = await isUsernameAvailable(username);
    if (sequence !== checkSequence) return;
    checkedUsername = username;
    usernameAvailable = available;
    usernameStatus.textContent = available ? "사용할 수 있는 아이디입니다." : "이미 사용 중인 아이디입니다.";
    usernameStatus.dataset.state = available ? "success" : "error";
  } catch {
    if (sequence !== checkSequence) return;
    checkedUsername = "";
    usernameAvailable = false;
    usernameStatus.textContent = "아이디를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    usernameStatus.dataset.state = "error";
  } finally {
    if (sequence === checkSequence) usernameCheckButton.disabled = false;
  }
});

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;
  const username = usernameInput.value.trim().toLowerCase();
  if (!usernameAvailable || checkedUsername !== username) {
    usernameStatus.textContent = "회원가입 전에 아이디 중복 확인을 완료해 주세요.";
    usernameStatus.dataset.state = "error";
    usernameCheckButton.focus();
    return;
  }
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
