import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import {
  doc,
  getDoc,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { auth, db } from "../notice/firebase/firebaseConfig.js";

let activeUser = auth.currentUser;
let resolveAuthReady;
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});
let authInitialized = false;

onAuthStateChanged(auth, (user) => {
  activeUser = user;
  if (!authInitialized) {
    authInitialized = true;
    resolveAuthReady();
  }
});

export const getCurrentUser = async () => {
  await authReady;
  return activeUser;
};

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const snapshot = await getDoc(doc(db, "users", user.uid));
  return snapshot.exists() ? { uid: user.uid, ...snapshot.data() } : null;
}

export async function isUsernameAvailable(username) {
  const normalized = username.trim().toLowerCase();
  if (!/^[a-z0-9_]{4,20}$/.test(normalized) || normalized === "admin") return false;
  const snapshot = await getDoc(doc(db, "usernames", normalized));
  return !snapshot.exists();
}

export async function createAccount({ name, username, email, password }) {
  const normalizedUsername = username.trim().toLowerCase();
  if (normalizedUsername === "admin") {
    throw new Error("auth/username-reserved");
  }
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  try {
    await updateProfile(credential.user, { displayName: name.trim() });
    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, "usernames", normalizedUsername);
      const usernameSnapshot = await transaction.get(usernameRef);
      if (usernameSnapshot.exists()) {
        throw new Error("auth/username-already-in-use");
      }

      transaction.set(usernameRef, { uid: credential.user.uid });
      transaction.set(doc(db, "users", credential.user.uid), {
        name: name.trim(),
        username: normalizedUsername,
        email: email.trim().toLowerCase(),
        role: "user",
        createdAt: new Date().toISOString(),
      });
    });
    return credential.user;
  } catch (error) {
    await deleteUser(credential.user).catch(() => {});
    throw error;
  }
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  activeUser = credential.user;
  return credential.user;
}

export async function signOutCurrentUser() {
  await signOut(auth);
  activeUser = null;
}

export const authErrors = {
  "auth/email-already-in-use": "이메일이 이미 사용 중입니다.",
  "auth/invalid-email": "이메일 주소를 확인해 주세요.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/weak-password": "비밀번호는 6자 이상으로 입력해 주세요.",
  "auth/username-already-in-use": "이미 사용 중인 아이디입니다.",
  "auth/username-reserved": "관리자 전용 아이디입니다. 다른 아이디를 입력해 주세요.",
  "auth/network-request-failed": "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
};

export function authErrorMessage(error) {
  return authErrors[error?.message] || authErrors[error?.code] || "요청을 처리하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
}
