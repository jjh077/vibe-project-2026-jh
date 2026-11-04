const slider = document.querySelector(".review-slider");

if (slider) {
  const viewport = slider.querySelector(".review-slider__viewport");
  const track = slider.querySelector(".review-slider__track");
  const previousButton = slider.querySelector(".review-slider__arrow--previous");
  const nextButton = slider.querySelector(".review-slider__arrow--next");
  const pagination = slider.querySelector(".review-slider__pagination");
  const heading = document.querySelector(".photo-review__heading");

  // "//ecimg..." 처럼 프로토콜이 없는 주소는 https로 보정
  const normalizeSrc = (src = "") =>
    src.startsWith("//") ? `https:${src}` : src;

  // 리뷰 사진이 없는 후기는 상품 이미지를 더 큰 사이즈로 대체
  const getReviewImage = (review) => {
    const attachment = review.attachments?.[0];
    if (attachment) {
      return normalizeSrc(attachment);
    }
    return normalizeSrc(review.product_image).replace(
      "/product/tiny/",
      "/product/medium/",
    );
  };

  const createStars = (rating) => {
    const score = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    const stars = document.createElement("span");

    stars.className = "review-card__stars";
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", `별점 ${score}점`);
    stars.textContent = "★".repeat(score) + "☆".repeat(5 - score);
    return stars;
  };

  const createCard = (review) => {
    const card = document.createElement("li");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const text = document.createElement("p");
    const author = document.createElement("span");
    const product = document.createElement("a");
    const productImage = document.createElement("img");
    const productName = document.createElement("span");

    card.className = "review-card";

    image.className = "review-card__image";
    image.src = getReviewImage(review);
    image.alt = review.subject;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    // 보정한 이미지가 없으면 원래 상품 이미지로 되돌림
    image.addEventListener(
      "error",
      () => {
        image.src = normalizeSrc(review.product_image);
      },
      { once: true },
    );

    content.className = "review-card__content";
    title.className = "review-card__title";
    title.textContent = review.subject;
    text.className = "review-card__text";
    text.textContent = review.content;
    author.className = "review-card__author";
    author.textContent = review.writer;

    product.className = "review-card__product";
    product.href = review.product_url;
    productImage.src = normalizeSrc(review.product_image);
    productImage.alt = "";
    productImage.loading = "lazy";
    productName.textContent = review.product_name;
    product.append(productImage, productName);

    content.append(title, text, createStars(review.rating), author, product);
    card.append(image, content);
    return card;
  };

  const renderReviews = () =>
    fetch("data/bsrv.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰 정보를 불러오지 못했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        const reviews = Array.isArray(data.reviews) ? data.reviews : [];

        if (reviews.length === 0) {
          throw new Error("표시할 리뷰가 없습니다.");
        }

        if (heading && data.section) {
          const title = heading.querySelector(".photo-review__title");
          const description = heading.querySelector(".photo-review__description");
          if (title && data.section.title) title.textContent = data.section.title;
          if (description && data.section.description) {
            description.textContent = data.section.description;
          }
        }

        track.replaceChildren(...reviews.map(createCard));
      });

  const setupSlider = () => {
    const cards = [...track.querySelectorAll(".review-card")];

    cards.forEach((card) => {
      card.querySelectorAll("a, img").forEach((element) => {
        element.draggable = false;
      });
    });

    let activeIndex = 0;
    let slidesPerView = window.matchMedia("(max-width: 768px)").matches ? 3 : 4;
    let pointerStartX = null;
    let pointerStartIndex = 0;
    let pointerStartOffset = 0;
    let pointerMoved = false;
    let suppressClick = false;
    let paginationButtons = [];

    const getMaxIndex = () => Math.max(0, cards.length - slidesPerView);
    const getStepSize = () =>
      cards[0].getBoundingClientRect().width +
      (Number.parseFloat(getComputedStyle(track).columnGap) || 0);

    function updateSlider() {
      const maxIndex = getMaxIndex();
      const pageCount = maxIndex + 1;

      activeIndex = Math.max(0, Math.min(activeIndex, maxIndex));
      track.style.transform = `translate3d(-${activeIndex * getStepSize()}px, 0, 0)`;
      previousButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === maxIndex;

      if (paginationButtons.length !== pageCount) {
        pagination.replaceChildren();
        paginationButtons = Array.from({ length: pageCount }, (_, index) => {
          const button = document.createElement("button");
          button.className = "review-slider__dot";
          button.type = "button";
          button.setAttribute("aria-label", `${index + 1}페이지`);
          button.addEventListener("click", () => {
            activeIndex = index;
            updateSlider();
          });
          pagination.append(button);
          return button;
        });
      }

      paginationButtons.forEach((button, index) => {
        button.setAttribute("aria-current", String(index === activeIndex));
      });
    }

    previousButton.addEventListener("click", () => {
      activeIndex -= 1;
      updateSlider();
    });

    nextButton.addEventListener("click", () => {
      activeIndex += 1;
      updateSlider();
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      activeIndex += event.key === "ArrowRight" ? 1 : -1;
      updateSlider();
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }

      pointerStartX = event.clientX;
      pointerStartIndex = activeIndex;
      pointerStartOffset = -activeIndex * getStepSize();
      pointerMoved = false;
    });

    viewport.addEventListener("pointermove", (event) => {
      if (pointerStartX === null || Math.abs(event.clientX - pointerStartX) <= 8) {
        return;
      }

      pointerMoved = true;
      if (!viewport.hasPointerCapture(event.pointerId)) {
        viewport.setPointerCapture(event.pointerId);
      }
      slider.classList.add("is-dragging");
      track.style.transition = "none";

      const maxOffset = -getMaxIndex() * getStepSize();
      const draggedOffset = pointerStartOffset + event.clientX - pointerStartX;
      const boundedOffset = Math.max(maxOffset, Math.min(0, draggedOffset));
      track.style.transform = `translate3d(${boundedOffset}px, 0, 0)`;
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;

      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      slider.classList.remove("is-dragging");
      track.style.removeProperty("transition");
      if (!pointerMoved) return;

      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);

      if (Math.abs(distance) >= 40) {
        const slidesMoved = Math.max(1, Math.round(Math.abs(distance) / getStepSize()));
        activeIndex = pointerStartIndex + (distance < 0 ? slidesMoved : -slidesMoved);
      }
      updateSlider();
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
      pointerMoved = false;
      slider.classList.remove("is-dragging");
      track.style.removeProperty("transition");
      updateSlider();
    });

    viewport.addEventListener("click", (event) => {
      if (!suppressClick || !event.target.closest("a")) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    window.addEventListener("resize", () => {
      slidesPerView = window.matchMedia("(max-width: 768px)").matches ? 3 : 4;
      updateSlider();
    });

    updateSlider();
  };

  if (viewport && track && previousButton && nextButton && pagination) {
    renderReviews()
      .then(setupSlider)
      .catch(() => {
        previousButton.disabled = true;
        nextButton.disabled = true;
      });
  }
}
