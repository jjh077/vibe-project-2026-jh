const hero = document.querySelector(".hero");
const track = document.querySelector(".hero-track");
const slides = [...document.querySelectorAll(".hero-slide")];
const indicators = [...document.querySelectorAll(".hero-pagination__item")];
const previousButton = document.querySelector(".hero-arrow--previous");
const nextButton = document.querySelector(".hero-arrow--next");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".mobile-menu__close");
const categoryToggle = document.querySelector(".category-toggle");
const extraCategory = document.querySelector(".header__mobile-extra");
const communityToggle = document.querySelector(".mobile-menu__community-toggle");
const communityLinks = document.querySelector(".mobile-menu__community-links");
const languageButtons = [...document.querySelectorAll(".mobile-menu__language")];

if (
  !hero ||
  !track ||
  !previousButton ||
  !nextButton ||
  !menuToggle ||
  !mobileMenu ||
  !menuClose ||
  !categoryToggle ||
  !extraCategory ||
  !communityToggle ||
  !communityLinks ||
  languageButtons.length !== 2
) {
  throw new Error("필수 페이지 요소를 찾을 수 없습니다.");
}

if (slides.length !== 4 || indicators.length !== slides.length) {
  throw new Error("히어로 배너는 4개 슬라이드와 인디케이터가 필요합니다.");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeIndex = 0;
let autoplayTimer = 0;
let menuCloseTimer = 0;
let pointerStartX = null;
let wasMenuToggleFocused = false;
let heroIsVisible = true;
const mobileViewport = window.matchMedia("(max-width: 768px)");

const updateSlide = (nextIndex) => {
  activeIndex = (nextIndex + slides.length) % slides.length;
  track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;

  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  });

  indicators.forEach((indicator, index) => {
    indicator.setAttribute("aria-pressed", String(index === activeIndex));
  });
};

const stopAutoplay = () => {
  window.clearInterval(autoplayTimer);
  autoplayTimer = 0;
};

const startAutoplay = () => {
  stopAutoplay();

  if (
    reducedMotion.matches ||
    document.hidden ||
    !heroIsVisible
  ) {
    return;
  }

  autoplayTimer = window.setInterval(() => {
    updateSlide(activeIndex + 1);
  }, 4000);
};

const showPrevious = () => updateSlide(activeIndex - 1);
const showNext = () => updateSlide(activeIndex + 1);

previousButton.addEventListener("click", () => {
  showPrevious();
  startAutoplay();
});

nextButton.addEventListener("click", () => {
  showNext();
  startAutoplay();
});

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    updateSlide(index);
    startAutoplay();
  });
});

hero.addEventListener("keydown", (event) => {
  if (event.target.closest("button, a")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    showPrevious();
    startAutoplay();
  }

  if (event.key === "ArrowRight") {
    showNext();
    startAutoplay();
  }
});

track.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary) {
    return;
  }

  pointerStartX = event.clientX;
  track.setPointerCapture(event.pointerId);
});

track.addEventListener("pointerup", (event) => {
  if (pointerStartX === null) {
    return;
  }

  const swipeDistance = event.clientX - pointerStartX;
  pointerStartX = null;

  if (Math.abs(swipeDistance) < 40) {
    return;
  }

  if (swipeDistance < 0) {
    showNext();
  } else {
    showPrevious();
  }

  startAutoplay();
});

track.addEventListener("pointercancel", () => {
  pointerStartX = null;
});

document.addEventListener("visibilitychange", startAutoplay);
reducedMotion.addEventListener("change", () => {
  startAutoplay();
});

if ("IntersectionObserver" in window) {
  heroIsVisible = false;
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroIsVisible = entry.isIntersecting;

    if (heroIsVisible) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  });

  heroObserver.observe(hero);
} else {
  startAutoplay();
}

const setMenuOpen = (isOpen) => {
  window.clearTimeout(menuCloseTimer);

  if (isOpen) {
    if (!mobileViewport.matches) {
      return;
    }

    mobileMenu.hidden = false;
    mobileMenu.inert = false;
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-menu-open");
    wasMenuToggleFocused = document.activeElement === menuToggle;
    requestAnimationFrame(() => {
      mobileMenu.classList.add("is-open");
      menuClose.focus();
    });
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "메뉴 닫기");
    return;
  }

  mobileMenu.classList.remove("is-open");
  mobileMenu.inert = true;
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
  menuCloseTimer = window.setTimeout(() => {
    mobileMenu.hidden = true;
  }, 300);

  if (wasMenuToggleFocused && mobileViewport.matches) {
    menuToggle.focus();
  }
};

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
menuClose.addEventListener("click", () => setMenuOpen(false));

mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

mobileMenu.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableItems = [
    ...mobileMenu.querySelectorAll("a, button:not([disabled])"),
  ];
  const firstItem = focusableItems[0];
  const lastItem = focusableItems[focusableItems.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

categoryToggle.addEventListener("click", () => {
  const isExpanded = categoryToggle.getAttribute("aria-expanded") === "true";
  categoryToggle.setAttribute("aria-expanded", String(!isExpanded));
  categoryToggle.setAttribute(
    "aria-label",
    isExpanded ? "카테고리 더 보기" : "카테고리 접기",
  );
  extraCategory.hidden = isExpanded;
});

communityToggle.addEventListener("click", () => {
  const isExpanded = communityToggle.getAttribute("aria-expanded") === "true";
  communityToggle.setAttribute("aria-expanded", String(!isExpanded));
  communityLinks.hidden = isExpanded;
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    languageButtons.forEach((languageButton) => {
      languageButton.setAttribute(
        "aria-pressed",
        String(languageButton === button),
      );
    });
  });
});

mobileViewport.addEventListener("change", (event) => {
  if (!event.matches && !mobileMenu.hidden) {
    setMenuOpen(false);
  }
});

updateSlide(0);
startAutoplay();
