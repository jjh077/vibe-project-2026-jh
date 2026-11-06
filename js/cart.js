import "./shared-layout.js";

/**
 * 장바구니 공통 모듈
 * - localStorage 에 장바구니 / 마지막 선택 상품을 저장
 * - 모든 페이지의 헤더 장바구니 아이콘에 갈색 원 + 흰 숫자 뱃지 표시
 * - 장바구니 아이콘 클릭 시 장바구니 페이지로 이동
 *
 * main.js 에서 import 되므로 index / notice / product / cart 모든 페이지에서 동작합니다.
 */

export const CART_KEY = "gd_cart";
export const LAST_PRODUCT_KEY = "gd_last_product";
export const SHIPPING_FEE = 2500;
export const FREE_SHIPPING_THRESHOLD = 50000;
export const MAX_QTY = 99;

/** 사이트 루트 URL (js/ 폴더의 상위) — index.html, pages/*.html 어디서든 경로 계산 가능 */
const SITE_ROOT = new URL("../", import.meta.url);

export const siteUrl = (path) => new URL(path, SITE_ROOT).href;

/** 이미지 경로 보정: "//host/.." → https, 상대경로 → 사이트 루트 기준 */
export const resolveSrc = (src = "") => {
  if (!src) return "";
  if (src.startsWith("//")) return `https:${src}`;
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  return siteUrl(src);
};

export const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;

/** "24,500원" → 24500 */
export const parsePrice = (value) =>
  typeof value === "number"
    ? value
    : Number(String(value ?? "").replace(/[^\d]/g, "")) || 0;

export const productPageUrl = (idOrName) =>
  siteUrl(`pages/product.html?id=${encodeURIComponent(idOrName)}`);

/* ---------- localStorage 안전 래퍼 ---------- */
const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/* ---------- 장바구니 데이터 ---------- */
const sanitize = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && item.id && item.name)
    .map((item) => ({
      key: item.key || makeKey(item.id, item.option),
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      image: item.image || "",
      option: item.option || "",
      qty: Math.min(MAX_QTY, Math.max(1, Number(item.qty) || 1)),
      checked: item.checked !== false,
    }));

export const makeKey = (id, option = "") => `${id}::${option}`;

export const getCart = () => sanitize(readJson(CART_KEY, []));

export const saveCart = (items) => {
  writeJson(CART_KEY, items);
  updateBadge();
  window.dispatchEvent(new CustomEvent("cart:change"));
};

/** 같은 상품+옵션이면 수량 합산, 아니면 새 줄 추가 */
export const addToCart = (entries) => {
  const cart = getCart();
  entries.forEach((entry) => {
    const key = makeKey(entry.id, entry.option);
    const found = cart.find((item) => item.key === key);
    if (found) {
      found.qty = Math.min(MAX_QTY, found.qty + entry.qty);
    } else {
      cart.push({ ...entry, key, checked: true });
    }
  });
  saveCart(sanitize(cart));
};

export const removeFromCart = (keys) => {
  const targets = new Set(keys);
  saveCart(getCart().filter((item) => !targets.has(item.key)));
};

export const updateCartItem = (key, patch) => {
  saveCart(
    sanitize(
      getCart().map((item) => (item.key === key ? { ...item, ...patch } : item)),
    ),
  );
};

export const setAllChecked = (checked) => {
  saveCart(getCart().map((item) => ({ ...item, checked })));
};

/** 선택된 상품 기준 금액 계산 */
export const calcTotals = (items) => {
  const selected = items.filter((item) => item.checked);
  const productTotal = selected.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const quantity = selected.reduce((sum, item) => sum + item.qty, 0);
  const shipping =
    productTotal === 0 || productTotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;
  return {
    selectedCount: selected.length,
    quantity,
    productTotal,
    shipping,
    payTotal: productTotal + shipping,
  };
};

/* ---------- 마지막으로 클릭한 상품 (메인 카드 → 상세 전달용) ---------- */
export const saveLastProduct = (product) =>
  writeJson(LAST_PRODUCT_KEY, product);
export const getLastProduct = () => readJson(LAST_PRODUCT_KEY, null);

/* ---------- 헤더 뱃지 ---------- */
export const updateBadge = () => {
  const count = getCart().length;
  const label = count > 99 ? "99+" : String(count);

  document.querySelectorAll(".cart-button").forEach((button) => {
    const badge = button.querySelector(".cart-count");
    if (badge) {
      badge.textContent = label;
      badge.hidden = count === 0;
    }
    button.setAttribute("aria-label", `장바구니, ${count}개`);
  });
};

const initHeaderCart = () => {
  document.querySelectorAll(".cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = siteUrl("pages/cart.html");
    });
  });
  updateBadge();
};

// 다른 탭에서 장바구니가 바뀌어도 뱃지 동기화
window.addEventListener("storage", (event) => {
  if (event.key === CART_KEY) {
    updateBadge();
    window.dispatchEvent(new CustomEvent("cart:change"));
  }
});

// 뒤로가기(bfcache) 복귀 시에도 최신 값 반영
window.addEventListener("pageshow", updateBadge);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderCart);
} else {
  initHeaderCart();
}
