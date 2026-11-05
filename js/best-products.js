import {
  parsePrice,
  productPageUrl,
  resolveSrc,
  saveLastProduct,
} from "./cart.js";

const section = document.getElementById("best-products");

if (section) {
  const MAX_ITEMS = 17; // bitem.json 앞에서부터 17개만 사용
  const DESKTOP_VISIBLE = 12; // 데스크탑 기본 노출: 4열 3행
  const MOBILE_VISIBLE = 10; // 모바일 기본 노출: 2열 5행

  const titleElement = section.querySelector(".best-products__title");
  const descriptionElement = section.querySelector(".best-products__description");
  const mainGrid = section.querySelector("#best-products-grid");
  const extraGrid = section.querySelector("#best-products-extra-grid");
  const extra = section.querySelector("#best-products-extra");
  const status = section.querySelector("#best-products-status");
  const moreButton = section.querySelector("#more-products-btn");
  const moreLabel = moreButton?.querySelector(".more-button__label");
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  // "//ecimg..." 처럼 프로토콜이 없는 주소는 https로 보정
  const normalizeSrc = (src = "") =>
    src.startsWith("//") ? `https:${src}` : src;

  const SVG_NS = "http://www.w3.org/2000/svg";

  const createIcon = (...shapes) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    shapes.forEach(({ tag, attrs }) => {
      const node = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([key, value]) =>
        node.setAttribute(key, value),
      );
      svg.append(node);
    });
    return svg;
  };

  const createActionButton = (kind, name) => {
    const button = document.createElement("button");
    const isLike = kind === "like";

    button.className = "product-card__action-btn";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute(
      "aria-label",
      `${isLike ? "좋아요" : "장바구니 담기"}: ${name}`,
    );
    button.append(
      isLike
        ? createIcon({
            tag: "path",
            attrs: {
              d: "M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z",
            },
          })
        : createIcon(
            {
              tag: "path",
              attrs: {
                d: "M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6",
              },
            },
            { tag: "circle", attrs: { cx: "10", cy: "20", r: "1" } },
            { tag: "circle", attrs: { cx: "18", cy: "20", r: "1" } },
          ),
    );

    // 좋아요 / 장바구니 토글
    button.addEventListener("click", () => {
      const isActive = button.classList.toggle("is-active");
      const active = isLike ? "좋아요 취소" : "장바구니에서 빼기";
      const inactive = isLike ? "좋아요" : "장바구니 담기";

      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute(
        "aria-label",
        `${isActive ? active : inactive}: ${name}`,
      );
    });

    return button;
  };

  const createCard = (product) => {
    const card = document.createElement("li");
    const thumb = document.createElement("button");
    const defaultImg = document.createElement("img");
    const hoverImg = document.createElement("img");
    const actions = document.createElement("div");
    const info = document.createElement("div");
    const name = document.createElement("h2");
    const link = document.createElement("a");
    const price = document.createElement("span");

    card.className = "product-card";

    // 이미지 영역: 기본 이미지 + 호버/클릭 시 전환 이미지
    thumb.className = "product-card__thumb";
    thumb.type = "button";
    thumb.setAttribute("aria-label", `상품 상세 보기: ${product.name}`);

    defaultImg.className = "product-card__img product-card__img--default";
    defaultImg.src = normalizeSrc(product.thumbnail);
    defaultImg.alt = product.name;
    defaultImg.loading = "lazy";
    defaultImg.decoding = "async";

    hoverImg.className = "product-card__img product-card__img--hover";
    hoverImg.src = normalizeSrc(product.hover_image);
    hoverImg.alt = "";
    hoverImg.loading = "lazy";
    hoverImg.decoding = "async";
    hoverImg.setAttribute("aria-hidden", "true");

    thumb.append(defaultImg, hoverImg);


    // 아이콘 (좋아요, 장바구니)
    actions.className = "product-card__actions";
    actions.append(
      createActionButton("like", product.name),
      createActionButton("cart", product.name),
    );

    // 정보 영역: (색상칩) + 상품명 + 가격
    info.className = "product-card__info";

    if (Array.isArray(product.colors) && product.colors.length > 0) {
      const chips = document.createElement("div");
      chips.className = "product-card__color-chips";
      chips.setAttribute("role", "img");
      chips.setAttribute("aria-label", `색상 ${product.colors.length}종`);
      product.colors.forEach((color) => {
        const chip = document.createElement("span");
        chip.className = "color-chip";
        chip.style.backgroundColor = color;
        chips.append(chip);
      });
      info.append(chips);
    }

    name.className = "product-card__name";
    const productKey = product.id || product.name;
    link.href = productPageUrl(productKey);
    link.textContent = product.name;
    name.append(link);

    price.className = "product-card__price";
    price.textContent = product.price;

    info.append(name, price);
    card.append(thumb, actions, info);

    // 카드 클릭 → 상품 상세 페이지 (이미지/상품명/가격 전달)
    card.classList.add("is-clickable");
    card.addEventListener("click", (event) => {
      if (event.target.closest(".product-card__actions")) return;
      if (event.target.closest("a")) event.preventDefault();

      saveLastProduct({
        id: productKey,
        name: product.name,
        price: parsePrice(product.price),
        image: resolveSrc(product.thumbnail),
        hoverImage: resolveSrc(product.hover_image),
      });
      window.location.href = productPageUrl(productKey);
    });
    return card;
  };

  let cards = [];

  // 화면 크기에 맞게 기본 노출 개수만 위쪽 그리드에, 나머지는 더보기 영역에 배치
  const distribute = () => {
    const visible = mobileQuery.matches ? MOBILE_VISIBLE : DESKTOP_VISIBLE;

    cards.forEach((card, index) => {
      (index < visible ? mainGrid : extraGrid).append(card);
    });

    const hasExtra = cards.length > visible;
    moreButton.parentElement.hidden = !hasExtra;

    if (!hasExtra) {
      setExpanded(false);
    }
  };

  const setExpanded = (expanded) => {
    section.classList.toggle("is-expanded", expanded);
    moreButton.setAttribute("aria-expanded", String(expanded));
    moreLabel.textContent = expanded ? "접기" : "더보기";
    extra.toggleAttribute("inert", !expanded);
  };

  moreButton.setAttribute("aria-controls", "best-products-extra");
  setExpanded(false);

  moreButton.addEventListener("click", () => {
    const willExpand = !section.classList.contains("is-expanded");
    setExpanded(willExpand);

    // 접을 때, 열려 있던 영역이 화면 위로 밀려나 있으면 목록 시작 위치로 부드럽게 이동
    if (!willExpand) {
      const top = mainGrid.getBoundingClientRect().top;
      if (top < 0) {
        mainGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  fetch("data/bitem.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("상품 정보를 불러오지 못했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const products = Array.isArray(data.products)
        ? data.products.slice(0, MAX_ITEMS)
        : [];

      if (products.length === 0) {
        throw new Error("표시할 상품이 없습니다.");
      }

      if (data.section?.title) {
        titleElement.textContent = data.section.title;
      }
      if (data.section?.description) {
        descriptionElement.textContent = data.section.description;
      }

      cards = products.map(createCard);
      distribute();
      mobileQuery.addEventListener("change", distribute);
    })
    .catch(() => {
      moreButton.parentElement.hidden = true;
      if (status) {
        status.textContent = "상품을 불러오지 못했습니다.";
      }
    });
}
