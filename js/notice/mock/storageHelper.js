/**
 * localStorage 유틸 (Mock DB 전용)
 * - Repository 구현체(mock) 안에서만 사용합니다. UI 코드에서 직접 import 금지.
 * - Firestore 와 동일하게 보이도록 모든 메서드는 async, 인위적 지연을 둡니다.
 */
const LATENCY_MS = 120;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const storageHelper = {
  async get(key, defaultValue) {
    await delay(LATENCY_MS);
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (error) {
      console.error(`[storageHelper] "${key}" 읽기 실패`, error);
      return defaultValue;
    }
  },

  async set(key, value) {
    await delay(LATENCY_MS);
    localStorage.setItem(key, JSON.stringify(value));
  },
};

/** Firestore doc.id 처럼 고유한 문자열 ID (crypto.randomUUID 우선) */
export const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // 비보안 컨텍스트(http, 비-localhost) 대비 폴백
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10).join(""),
  ].join("-");
};
