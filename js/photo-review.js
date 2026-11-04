const slider = document.querySelector(".review-slider");

if (slider) {
  const viewport = slider.querySelector(".review-slider__viewport");
  const track = slider.querySelector(".review-slider__track");
  const firstCard = track?.querySelector(".review-card");
  const previousButton = slider.querySelector(".review-slider__arrow--previous");
  const nextButton = slider.querySelector(".review-slider__arrow--next");
  const pagination = slider.querySelector(".review-slider__pagination");

  if (viewport && track && firstCard && previousButton && nextButton && pagination) {
    track.replaceChildren(
      ...Array.from({ length: 20 }, () => firstCard.cloneNode(true)),
    );
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
  }
}
