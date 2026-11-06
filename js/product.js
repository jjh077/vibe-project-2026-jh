/**
 * 상품 상세 페이지
 * - URL ?id= 값으로 data/products.json 에서 상품(이미지/상품명/가격)을 찾아 세팅
 * - JSON 에 없는 상품은 메인 카드 클릭 시 저장된 정보(localStorage)로 보완
 * - 활성 버튼: 장바구니 (나머지 버튼은 비활성)
 */
import {
  FREE_SHIPPING_THRESHOLD,
  MAX_QTY,
  SHIPPING_FEE,
  addToCart,
  formatPrice,
  getLastProduct,
  resolveSrc,
  siteUrl,
} from "./cart.js";

const root = document.getElementById("product-root");

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const squash = (v) => String(v || "").replace(/\s+/g, "");

/** 의류(사이즈 옵션이 필요한 상품) 판별 */
const APPAREL_RE = /(티셔츠|팬츠|잠옷|셔츠|후드|맨투맨|원피스)/;

const fetchJson = async (path) => {
  try {
    const response = await fetch(siteUrl(path));
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

const loadProduct = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return null;

  const [productsData, bitemData] = await Promise.all([
    fetchJson("data/products.json"),
    fetchJson("data/bitem.json"),
  ]);

  const jsonProduct =
    productsData?.products?.find(
      (p) => p.id === id || squash(p.name) === squash(id),
    ) || null;

  // 메인 카드에서 넘어온 정보 (JSON 에 없거나 이미지가 비어 있을 때 보완)
  const last = getLastProduct();
  const snapshot = last && (last.id === id || last.name === id) ? last : null;

  if (!jsonProduct && !snapshot) return null;

  const merged = { ...(snapshot || {}), ...(jsonProduct || {}) };

  // 베스트 상품 데이터(bitem.json)에서 큰 이미지 + 추가 이미지 가져오기
  const bitem = bitemData?.products?.find(
    (p) => squash(p.name) === squash(merged.name) || squash(p.name) === squash(id),
  );
  const gallery = bitem
    ? [bitem.thumbnail, bitem.hover_image, ...(bitem.additional_images || [])]
    : [merged.image, snapshot?.hoverImage];
  if (!merged.image && snapshot?.image) merged.image = snapshot.image;
  merged.images = gallery
    .filter(Boolean)
    .filter((src, index, list) => list.indexOf(src) === index)
    .slice(0, 5); // 큰 이미지 1 + 작은 이미지 박스 5개(= 총 5장 노출)
  if (merged.images.length === 0 && merged.image) merged.images = [merged.image];

  if (!merged.category) {
    merged.category = APPAREL_RE.test(merged.name) ? "APPAREL" : "굿즈";
  }
  return merged;
};

/** 옵션 종류 판별: variants(의류 드롭다운) / options(2종 버튼) / none(단일 상품) */
const getOptionType = (product) => {
  if (Array.isArray(product.variants) && product.variants.length > 0)
    return "variants";
  if (Array.isArray(product.options) && product.options.length > 0)
    return "buttons";
  if (APPAREL_RE.test(product.name || "")) {
    // 상품별 옵션 데이터가 없는 의류는 기본 사이즈 옵션을 자동 생성
    product.variants = ["S", "M", "L", "XL", "2XL"].map((size) => ({
      label: size,
      price: product.price,
    }));
    return "variants";
  }
  return "none";
};

/** 오늘 12시 이전이면 오늘, 이후면 다음 영업일(주말 제외) 발송 */
const getShippingNotice = () => {
  const now = new Date();
  const isBusinessDay = (d) => d.getDay() !== 0 && d.getDay() !== 6;
  const beforeCutoff = now.getHours() < 12 && isBusinessDay(now);

  const ship = new Date(now);
  if (!beforeCutoff) {
    do {
      ship.setDate(ship.getDate() + 1);
    } while (!isBusinessDay(ship));
  } else if (!isBusinessDay(ship)) {
    while (!isBusinessDay(ship)) ship.setDate(ship.getDate() + 1);
  }

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dateText = `${ship.getMonth() + 1}월${ship.getDate()}일(${days[ship.getDay()]})`;

  return {
    title: beforeCutoff
      ? "오늘 출발 배송 시간(오후 12시) 전입니다."
      : "오늘 출발 배송 시간이 (오후 12시) 마감 되었습니다.",
    desc: `지금 주문 시 ${dateText}에 발송됩니다.`,
  };
};

const render = (product) => {
  const optionType = getOptionType(product);
  const hasOptions = optionType !== "none";
  // 선택된 항목: [{ option, price, qty, sameDay }]  (옵션별 가격이 다를 수 있음)
  let selected = hasOptions
    ? []
    : [{ option: "", price: product.price, qty: 1 }];

  root.textContent = "";

  /* ---------- 좌: 이미지 ---------- */
  const gallery = el("div", "product-gallery");
  const mainFrame = el("div", "product-gallery__main");
  const mainImg = el("img", "product-gallery__img");
  mainImg.src = resolveSrc(product.images[0] || product.image);
  mainImg.alt = product.name;
  mainFrame.append(mainImg);
  gallery.append(mainFrame);

  if (product.images.length > 1) {
    const thumbs = el("ul", "product-gallery__thumbs");
    product.images.forEach((src, index) => {
      const li = el("li");
      const btn = el("button", "product-gallery__thumb");
      btn.type = "button";
      btn.setAttribute("aria-label", `상품 이미지 ${index + 1}`);
      btn.setAttribute("aria-pressed", String(index === 0));
      const img = el("img");
      img.src = resolveSrc(src);
      img.alt = "";
      btn.append(img);
      btn.addEventListener("click", () => {
        mainImg.src = resolveSrc(src);
        thumbs
          .querySelectorAll("button")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      });
      li.append(btn);
      thumbs.append(li);
    });
    gallery.append(thumbs);
  }

  /* ---------- 우: 정보 ---------- */
  const info = el("div", "product-info");

  const topRow = el("div", "product-info__top");
  if (product.badge) {
    topRow.append(
      el("span", `badge badge--${product.badge.toLowerCase()}`, product.badge),
    );
  }
  const icons = el("div", "product-info__icons");
  ["공유하기", "찜하기"].forEach((label, index) => {
    const btn = el("button", "product-info__icon");
    btn.type = "button";
    btn.disabled = true;
    btn.setAttribute("aria-label", `${label} (준비 중)`);
    btn.innerHTML =
      index === 0
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/></svg>';
    icons.append(btn);
  });
  topRow.append(icons);

  /* 별점 | 리뷰 (평점 데이터가 있는 상품만) */
  let ratingRow = null;
  if (product.rating && product.reviewCount) {
    ratingRow = el("div", "product-rating");
    ratingRow.innerHTML =
      '<svg class="product-rating__star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
    ratingRow.append(
      el("span", "product-rating__score", String(product.rating)),
      el("span", "product-rating__divider"),
      el("span", "product-rating__review", `리뷰 ${product.reviewCount}건`),
    );
    ratingRow.setAttribute(
      "aria-label",
      `별점 ${product.rating}, 리뷰 ${product.reviewCount}건`,
    );
  }

  /* 현재 N명이 함께 보고 있어요 */
  const presence = el("p", "product-presence");
  presence.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>';
  const presenceCount = el("em", "product-presence__count");
  let viewers = 20 + Math.floor(Math.random() * 11); // 20~30명
  presenceCount.textContent = `현재 ${viewers}명`;
  const presenceText = el("span", "product-presence__text");
  presenceText.append(presenceCount, document.createTextNode("이 함께 보고 있어요."));
  presence.append(presenceText);
  window.setInterval(() => {
    viewers = Math.min(32, Math.max(18, viewers + (Math.random() < 0.5 ? -1 : 1)));
    presenceCount.textContent = `현재 ${viewers}명`;
  }, 6000);

  const title = el("h1", "product-info__name", product.name);
  const price = el("p", "product-info__price", formatPrice(product.price));

  const table = el("dl", "product-info__table");
  const addRow = (label, value) => {
    table.append(el("dt", "", label), el("dd", "", value));
  };
  addRow("국내·해외배송", "국내배송");
  addRow("배송방법", "택배");
  addRow(
    "배송비",
    `${formatPrice(SHIPPING_FEE)} (${formatPrice(FREE_SHIPPING_THRESHOLD)} 이상 구매 시 무료)`,
  );
  addRow("무이자 할부", "카드사별 무이자 혜택");

  /* 옵션 */
  let optionHint = null;
  const selectedList = el("ul", "product-selected");

  const addSelected = (entry) => {
    if (!selected.some((s) => s.option === entry.option)) {
      selected.push({ qty: 1, ...entry });
    }
    optionHint?.classList.remove("is-error");
    selectToggle?.classList.remove("is-error");
    if (optionHint) optionHint.textContent = `[필수] ${entry.option}`;
    const selectLabel = selectToggle?.querySelector(".product-select__label");
    if (selectLabel) selectLabel.textContent = entry.option;
    renderSelected();
  };

  let selectToggle = null;

  if (optionType === "buttons") {
    /* 2종 상품: 버튼형 옵션 (품절 옵션은 사선 표시 + 선택 불가) */
    const optionBox = el("div", "product-option");
    const optionButtons = el("div", "product-option__buttons");
    product.options.forEach((opt) => {
      const name = typeof opt === "string" ? opt : opt.name;
      const soldOut = typeof opt === "object" && opt.soldOut;
      const btn = el("button", "product-option__btn", name);
      btn.type = "button";
      if (soldOut) {
        btn.disabled = true;
        btn.classList.add("is-soldout");
        btn.setAttribute("aria-label", `${name} (품절)`);
      } else {
        btn.addEventListener("click", () => {
          addSelected({ option: name, price: product.price });
          optionButtons
            .querySelectorAll(".product-option__btn")
            .forEach((b) => b.classList.toggle("is-selected", b === btn));
        });
      }
      optionButtons.append(btn);
    });
    optionHint = el("p", "product-option__hint", "[필수] 옵션을 선택해 주세요");
    optionBox.append(optionButtons, optionHint);
    const dd = el("dd");
    dd.append(optionBox);
    table.append(el("dt", "", "옵션"), dd);
  }

  if (optionType === "variants") {
    /* 의류: 드롭다운 (색상 - 사이즈 + 당일배송 표시 + 옵션별 가격) */
    const select = el("div", "product-select");
    selectToggle = el("button", "product-select__toggle");
    selectToggle.type = "button";
    selectToggle.setAttribute("aria-haspopup", "listbox");
    selectToggle.setAttribute("aria-expanded", "false");
    selectToggle.append(
      el("span", "product-select__label", "- [필수] 옵션을 선택해 주세요 -"),
    );
    selectToggle.insertAdjacentHTML(
      "beforeend",
      '<svg class="product-select__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    );

    const list = el("ul", "product-select__list");
    list.setAttribute("role", "listbox");
    list.hidden = true;

    const closeList = () => {
      list.hidden = true;
      selectToggle.setAttribute("aria-expanded", "false");
    };
    const openList = () => {
      list.hidden = false;
      selectToggle.setAttribute("aria-expanded", "true");
    };

    product.variants.forEach((variant) => {
      const li = el("li");
      li.setAttribute("role", "option");
      const btn = el("button", "product-select__item");
      btn.type = "button";
      if (variant.dim) btn.classList.add("is-dim");
      const label = el("span", "product-select__name", variant.label);
      if (variant.sameDay) {
        label.append(document.createTextNode(" (★당일배송)"));
      }
      btn.append(label, el("span", "product-select__price", formatPrice(variant.price)));
      btn.addEventListener("click", () => {
        addSelected({
          option: variant.label,
          price: variant.price,
          sameDay: Boolean(variant.sameDay),
        });
        closeList();
      });
      li.append(btn);
      list.append(li);
    });

    selectToggle.addEventListener("click", () =>
      list.hidden ? openList() : closeList(),
    );
    select.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeList();
        selectToggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!select.contains(event.target)) closeList();
    });

    select.append(selectToggle, list);
    const dd = el("dd");
    optionHint = el("p", "product-option__hint", "[필수] 옵션을 선택해 주세요");
    dd.append(select, optionHint);
    table.append(el("dt", "", "옵션"), dd);
  }

  /* 배송 안내 */
  const notice = getShippingNotice();
  const shipBox = el("div", "product-ship");
  shipBox.innerHTML =
    '<span class="product-ship__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg></span>';
  const shipText = el("div");
  shipText.append(
    el("strong", "", notice.title),
    el("span", "", notice.desc),
  );
  shipBox.append(shipText);

  /* 무료배송 진행바 */
  const freeBox = el("div", "product-free");
  const freeLabels = el("div", "product-free__labels");
  freeLabels.append(
    el("span", "", "0원"),
    el("span", "", formatPrice(FREE_SHIPPING_THRESHOLD)),
  );
  const bar = el("div", "product-free__bar");
  const barFill = el("span", "product-free__fill");
  bar.append(barFill);
  const freeMsg = el("p", "product-free__msg");
  freeBox.append(freeLabels, bar, freeMsg);

  /* 합계 */
  const totalRow = el("div", "product-total");
  totalRow.append(el("span", "product-total__label", "총 상품금액"));
  const totalValue = el("span", "product-total__value");
  totalRow.append(totalValue);

  /* 버튼 (장바구니만 활성) */
  const actions = el("div", "product-actions");
  const cartBtn = el("button", "product-actions__btn product-actions__btn--cart", "장바구니");
  cartBtn.type = "button";
  const buyBtn = el("button", "product-actions__btn product-actions__btn--buy", "바로구매");
  buyBtn.type = "button";
  buyBtn.disabled = true;
  actions.append(cartBtn, buyBtn);

  /* 네이버페이: 상단 검정 라인 + 초록 구매 버튼 + 찜 + Npay 커넥트 안내 */
  const pay = el("div", "npay");
  pay.innerHTML = `
    <div class="npay__box">
      <p class="npay__brand"><strong>NAVER</strong><span>네이버ID로 간편구매<br />네이버페이</span></p>
      <button class="npay__buy" type="button" aria-disabled="true">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M6.6 5.4h2.9l3 4.4V5.4h2.9v9.2h-2.9l-3-4.4v4.4H6.6z"/></svg>
        <b>pay</b><span>구매</span>
      </button>
      <button class="npay__wish" type="button" aria-disabled="true">찜</button>
    </div>
    <p class="npay__connect">
      <strong>Npay 커넥트</strong>
      <span class="npay__connect-text">사장님, 진짜 리뷰가 쌓이는 방법</span>
      <span class="npay__connect-nav" aria-hidden="true"><i>‹</i><i>›</i></span>
    </p>`;
  pay.querySelectorAll("button").forEach((btn) =>
    btn.addEventListener("click", (event) => event.preventDefault()),
  );

  info.append(
    topRow,
    ...(ratingRow ? [ratingRow] : []),
    presence,
    title,
    price,
    table,
    shipBox,
    freeBox,
    totalRow,
    actions,
    pay,
  );

  /* ---------- 선택 항목 렌더 ---------- */
  function renderSelected() {
    selectedList.textContent = "";

    selected.forEach((item) => {
      const li = el("li", "product-selected__item");
      const name = el(
        "span",
        "product-selected__name",
        item.option ? `${product.name} - ${item.option}` : product.name,
      );

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

      const setQty = (value) => {
        item.qty = Math.min(MAX_QTY, Math.max(1, Number(value) || 1));
        input.value = String(item.qty);
        price2.textContent = formatPrice(item.price * item.qty);
        updateTotals();
      };
      minus.addEventListener("click", () => setQty(item.qty - 1));
      plus.addEventListener("click", () => setQty(item.qty + 1));
      input.addEventListener("change", () => setQty(input.value));
      stepper.append(minus, input, plus);

      const price2 = el(
        "span",
        "product-selected__price",
        formatPrice(item.price * item.qty),
      );

      const heading = el("div", "product-selected__heading");
      heading.append(name);

      if (selected.length > 1) {
        const remove = el("button", "product-selected__remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${item.option} 옵션 삭제`);
        remove.addEventListener("click", () => {
          selected = selected.filter((s) => s !== item);
          if (optionHint) {
            optionHint.textContent = selected.length
              ? `[필수] ${selected[selected.length - 1].option || "옵션"}`
              : "[필수] 옵션을 선택해 주세요";
          }
          if (selectToggle) {
            selectToggle.querySelector(".product-select__label").textContent =
              selected.length
                ? selected[selected.length - 1].option
                : "- [필수] 옵션을 선택해 주세요 -";
          }
          document.querySelectorAll(".product-option__btn").forEach((button) => {
            button.classList.toggle(
              "is-selected",
              selected.some((entry) => entry.option === button.textContent),
            );
          });
          renderSelected();
        });
        heading.append(remove);
      }

      if (hasOptions) name.textContent = item.option || product.name;
      const details = el("div", "product-selected__details");
      details.append(stepper, price2);
      li.append(heading, details);
      selectedList.append(li);
    });

    updateTotals();
  }

  function updateTotals() {
    const quantity = selected.reduce((sum, s) => sum + s.qty, 0);
    const total = selected.reduce((sum, s) => sum + s.qty * s.price, 0);

    totalValue.textContent = "";
    totalValue.append(
      el("strong", "", total.toLocaleString("ko-KR")),
      el("span", "", ` (${quantity}개)`),
    );

    const ratio = Math.min(1, total / FREE_SHIPPING_THRESHOLD);
    barFill.style.width = `${ratio * 100}%`;
    freeMsg.textContent =
      total >= FREE_SHIPPING_THRESHOLD
        ? "배송비가 무료입니다 😊"
        : `${formatPrice(FREE_SHIPPING_THRESHOLD - total)}만 더 구매하면 배송비가 무료 😊`;
  }

  // 선택 목록은 배송 안내 위 (옵션 아래)에 배치
  info.insertBefore(selectedList, shipBox);
  renderSelected();

  /* ---------- 장바구니 담기 ---------- */
  cartBtn.addEventListener("click", () => {
    if (selected.length === 0) {
      optionHint?.classList.add("is-error");
      selectToggle?.classList.add("is-error");
      (optionHint || selectToggle)?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return;
    }

    addToCart(
      selected.map((s) => ({
        id: product.id || product.name,
        name: product.name,
        price: s.price,
        image: product.images[0] || product.image || "",
        option: s.option,
        qty: s.qty,
      })),
    );
    openCartDialog();
  });

  const layout = el("div", "product-layout");
  layout.append(gallery, info);
  root.append(layout);

  /* 이동 확인 다이얼로그 */
  function openCartDialog() {
    const dialog = el("dialog", "cart-dialog");
    const message = el("p", "cart-dialog__msg", "장바구니에 상품을 담았습니다.");
    const buttons = el("div", "cart-dialog__buttons");
    const keep = el("button", "cart-dialog__btn", "쇼핑 계속하기");
    keep.type = "button";
    const go = el("button", "cart-dialog__btn cart-dialog__btn--primary", "장바구니 이동");
    go.type = "button";
    keep.addEventListener("click", () => {
      dialog.close();
      dialog.remove();
    });
    go.addEventListener("click", () => {
      window.location.href = siteUrl("pages/cart.html");
    });
    dialog.addEventListener("cancel", () => dialog.remove());
    buttons.append(keep, go);
    dialog.append(message, buttons);
    document.body.append(dialog);
    dialog.showModal();
    go.focus();
  }
};

const renderNotFound = () => {
  root.textContent = "";
  const box = el("div", "shop-empty");
  box.append(
    el("p", "shop-empty__text", "상품 정보를 찾을 수 없습니다."),
  );
  const back = el("a", "shop-empty__link", "쇼핑 계속하기");
  back.href = siteUrl("index.html#best-products");
  box.append(back);
  root.append(box);
};

loadProduct().then((product) => {
  if (!product) {
    renderNotFound();
    return;
  }
  document.title = `${product.name} | 그루밍데이`;
  const crumb = document.getElementById("breadcrumb-current");
  if (crumb && product.category) crumb.textContent = product.category;
  render(product);
});
