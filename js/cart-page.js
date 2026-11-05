/**
 * 장바구니 페이지
 * - localStorage 의 장바구니를 읽어 목록 / 합계 렌더링
 * - 수량 변경, 삭제, 선택삭제, 전체선택 지원
 * - 상품이 없으면 '선택한 상품이 없습니다' 표시
 */
import {
  FREE_SHIPPING_THRESHOLD,
  MAX_QTY,
  SHIPPING_FEE,
  calcTotals,
  formatPrice,
  getCart,
  productPageUrl,
  removeFromCart,
  resolveSrc,
  setAllChecked,
  siteUrl,
  updateCartItem,
} from "./cart.js";

const listEl = document.getElementById("cart-list");
const checkAll = document.getElementById("cart-check-all");
const deleteSelected = document.getElementById("cart-delete-selected");
const sumBar = document.getElementById("cart-sum-bar");
const sumProduct = document.getElementById("sum-product");
const sumShipping = document.getElementById("sum-shipping");
const sumPay = document.getElementById("sum-pay");
const sumCount = document.getElementById("sum-count");
const orderBtn = document.getElementById("cart-order");
const toast = document.getElementById("cart-toast");

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

let toastTimer = 0;
const showToast = (message) => {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
};

const createItem = (item) => {
  const li = el("li", "cart-item");

  const check = el("input", "cart-check");
  check.type = "checkbox";
  check.checked = item.checked;
  check.setAttribute("aria-label", `${item.name} 선택`);
  check.addEventListener("change", () =>
    updateCartItem(item.key, { checked: check.checked }),
  );

  const thumb = el("a", "cart-item__thumb");
  thumb.href = productPageUrl(item.id);
  const img = el("img");
  img.src = resolveSrc(item.image);
  img.alt = item.name;
  thumb.append(img);

  const body = el("div", "cart-item__body");
  const name = el("a", "cart-item__name", item.name);
  name.href = productPageUrl(item.id);
  const price = el("p", "cart-item__price", formatPrice(item.price));
  const ship = el(
    "p",
    "cart-item__ship",
    `배송 : ${formatPrice(SHIPPING_FEE)} [조건] / 기본배송`,
  );
  body.append(name, price, ship);
  if (item.option) {
    body.append(el("p", "cart-item__option", `[옵션: ${item.option}]`));
  }

  // 수량 (− / 입력 / +, 변경 버튼으로 확정)
  const qtyRow = el("div", "cart-item__qty");
  const stepper = el("div", "qty-stepper");
  const minus = el("button", "", "−");
  minus.type = "button";
  minus.setAttribute("aria-label", "수량 감소");
  const input = el("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.value = String(item.qty);
  input.setAttribute("aria-label", "수량");
  const plus = el("button", "", "+");
  plus.type = "button";
  plus.setAttribute("aria-label", "수량 증가");
  const clamp = (value) =>
    Math.min(MAX_QTY, Math.max(1, Number(value) || 1));
  minus.addEventListener("click", () => {
    input.value = String(clamp(Number(input.value) - 1));
  });
  plus.addEventListener("click", () => {
    input.value = String(clamp(Number(input.value) + 1));
  });
  stepper.append(minus, input, plus);

  const apply = el("button", "cart-btn cart-btn--small", "변경");
  apply.type = "button";
  const commit = () => {
    const next = clamp(input.value);
    if (next !== item.qty) updateCartItem(item.key, { qty: next });
    else input.value = String(next);
  };
  apply.addEventListener("click", commit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") commit();
  });
  qtyRow.append(stepper, apply);
  body.append(qtyRow);

  const lineTotal = el(
    "strong",
    "cart-item__total",
    formatPrice(item.price * item.qty),
  );

  const side = el("div", "cart-item__side");
  const remove = el("button", "cart-btn", "삭제하기");
  remove.type = "button";
  remove.addEventListener("click", () => removeFromCart([item.key]));
  const wish = el("button", "cart-btn", "관심상품");
  wish.type = "button";
  wish.disabled = true;
  const buy = el("button", "cart-btn cart-btn--primary", "바로구매");
  buy.type = "button";
  buy.disabled = true;
  side.append(remove, wish, buy);

  li.append(check, thumb, body, lineTotal, side);
  return li;
};

const render = () => {
  const items = getCart();
  const totals = calcTotals(items);

  listEl.textContent = "";

  if (items.length === 0) {
    const empty = el("li", "cart-empty", "선택한 상품이 없습니다");
    listEl.append(empty);
  } else {
    items.forEach((item) => listEl.append(createItem(item)));
  }

  // 전체선택 / 선택삭제
  checkAll.checked = items.length > 0 && items.every((i) => i.checked);
  checkAll.disabled = items.length === 0;
  deleteSelected.disabled = totals.selectedCount === 0;

  // 목록 하단 합계 바: 3,500 + 배송비 2,500 = 6,000원
  sumBar.textContent = "";
  sumBar.append(
    document.createTextNode(
      `${totals.productTotal.toLocaleString("ko-KR")} + 배송비 ${totals.shipping.toLocaleString("ko-KR")} = `,
    ),
    el("strong", "", formatPrice(totals.payTotal)),
  );

  // 오른쪽 박스
  sumProduct.textContent = formatPrice(totals.productTotal);
  sumShipping.textContent = formatPrice(totals.shipping);
  sumPay.textContent = formatPrice(totals.payTotal);
  sumCount.textContent = `총 ${totals.quantity}개`;
  orderBtn.textContent = `${formatPrice(totals.payTotal)} 주문하기`;
  orderBtn.disabled = totals.selectedCount === 0;
};

checkAll.addEventListener("change", () => setAllChecked(checkAll.checked));

deleteSelected.addEventListener("click", () => {
  const keys = getCart()
    .filter((item) => item.checked)
    .map((item) => item.key);
  if (keys.length) removeFromCart(keys);
});

orderBtn.addEventListener("click", () => {
  showToast("주문 기능은 준비 중입니다.");
});

document.querySelectorAll("[data-soon]").forEach((node) => {
  node.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("준비 중인 기능입니다.");
  });
});

window.addEventListener("cart:change", render);
render();

// 무료배송 기준 안내 (접근성용 설명)
document
  .getElementById("cart-free-note")
  ?.append(
    document.createTextNode(
      `${formatPrice(FREE_SHIPPING_THRESHOLD)} 이상 구매 시 배송비 무료`,
    ),
  );

// 쇼핑 계속하기 링크
const continueLink = document.getElementById("cart-continue");
if (continueLink) continueLink.href = siteUrl("index.html#best-products");
