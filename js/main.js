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
const header = document.querySelector(".outer-box--header");
const quickMenu = document.querySelector(".quick-menu");
const recentProductsButton = quickMenu?.querySelector('[data-action="recent"]');
const topButton = quickMenu?.querySelector('[data-action="top"]');

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
let previousScrollY = window.scrollY;

const updateScrollState = () => {
  if (!header || !hero || !quickMenu) return;

  const scrollY = window.scrollY;
  const isPastHero = scrollY >= hero.offsetTop + hero.offsetHeight;
  const isScrollingDown = scrollY > previousScrollY;
  const shouldShowQuickMenu = scrollY > 0 && (!mobileViewport.matches || isPastHero);

  header.classList.toggle("is-scrolled", scrollY > 2);
  header.classList.toggle(
    "is-category-hidden",
    mobileViewport.matches && isPastHero && isScrollingDown,
  );

  quickMenu.classList.toggle("is-visible", shouldShowQuickMenu);
  quickMenu.setAttribute("aria-hidden", String(!shouldShowQuickMenu));
  quickMenu.inert = !shouldShowQuickMenu;
  previousScrollY = scrollY;
};

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
mobileViewport.addEventListener("change", updateScrollState);
updateScrollState();

recentProductsButton?.addEventListener("click", () => setSearchOpen(true));
topButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
});

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

    if (typeof setSearchOpen === "function") setSearchOpen(false);
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


const bestProductsSection = document.getElementById("best-products");
const productCards = [...document.querySelectorAll(".product-card")];
const moreProductsBtn = document.getElementById("more-products-btn");
const moreProductsLabel = moreProductsBtn?.querySelector(".more-button__label");

if (!bestProductsSection || !moreProductsBtn || !moreProductsLabel) {
  throw new Error("베스트 상품 섹션을 찾을 수 없습니다.");
}

productCards.forEach((card) => {
  const imageButton = card.querySelector(".product-card__thumb");

  if (!imageButton) {
    throw new Error("상품 사진 버튼을 찾을 수 없습니다.");
  }

  imageButton.setAttribute("aria-pressed", "false");

  imageButton.addEventListener("click", () => {
    if (!mobileViewport.matches || card.dataset.noSwap === "true") {
      return;
    }

    const isToggled = card.classList.toggle("is-toggled");
    imageButton.setAttribute("aria-pressed", String(isToggled));
  });
});

bestProductsSection.querySelectorAll(".product-card__action-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("is-active");
    const actionLabel = button.getAttribute("aria-label") || "";
    const separatorIndex = actionLabel.indexOf(": ");
    const productName = actionLabel.slice(separatorIndex + 2);
    const isLikeButton = actionLabel.startsWith("좋아요");
    const activeLabel = isLikeButton ? "좋아요 취소" : "장바구니에서 빼기";
    const inactiveLabel = isLikeButton ? "좋아요" : "장바구니 담기";

    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute(
      "aria-label",
      `${isActive ? activeLabel : inactiveLabel}: ${productName}`,
    );
  });
});

moreProductsBtn.addEventListener("click", () => {
  const isExpanded = bestProductsSection.classList.toggle("is-expanded");
  moreProductsBtn.setAttribute("aria-expanded", String(isExpanded));
  moreProductsLabel.textContent = isExpanded ? "접기" : "더보기";
});


/* ==========================================================================
   검색 드로어 (Search Drawer)
   ========================================================================== */
const searchButtons = [...document.querySelectorAll(".header-search-btn")];
const searchDrawer = document.getElementById("search-drawer");
const searchClose = searchDrawer?.querySelector(".search-drawer__close");
const searchBackdrop = searchDrawer?.querySelector(".search-drawer__backdrop");
const searchInput = searchDrawer?.querySelector(".search-drawer__input");
const searchForm = searchDrawer?.querySelector(".search-drawer__form");

let searchLastFocused = null;
let searchCloseTimer = 0;

function setSearchOpen(isOpen) {
  if (!searchDrawer) return;
  window.clearTimeout(searchCloseTimer);

  if (isOpen) {
    if (typeof setMenuOpen === "function" && !mobileMenu.hidden) {
      setMenuOpen(false);
    }

    searchLastFocused = document.activeElement;
    searchDrawer.hidden = false;
    searchDrawer.inert = false;
    searchDrawer.setAttribute("aria-hidden", "false");
    searchButtons.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    document.body.classList.add("is-search-open");

    requestAnimationFrame(() => {
      searchDrawer.classList.add("is-open");
      if (searchInput) {
        searchInput.focus();
      } else if (searchClose) {
        searchClose.focus();
      }
    });
  } else {
    searchDrawer.classList.remove("is-open");
    searchDrawer.setAttribute("aria-hidden", "true");
    searchButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    document.body.classList.remove("is-search-open");

    searchCloseTimer = window.setTimeout(() => {
      searchDrawer.hidden = true;
      searchDrawer.inert = true;
    }, 300);

    if (searchLastFocused && typeof searchLastFocused.focus === "function") {
      searchLastFocused.focus();
    }
  }
};

searchButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setSearchOpen(true);
  });
});

searchClose?.addEventListener("click", () => {
  setSearchOpen(false);
});

searchBackdrop?.addEventListener("click", () => {
  setSearchOpen(false);
});

searchDrawer?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setSearchOpen(false);
  }
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchDrawer?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSearchOpen(false);
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableItems = [
    ...searchDrawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled])',
    ),
  ];
  if (focusableItems.length === 0) return;

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

const shortsSection = document.getElementById("youtube-shorts");
const shortsTitle = document.getElementById("shorts-title");
const shortsDescription = document.getElementById("shorts-description");
const shortsViewport = document.getElementById("shorts-viewport");
const shortsTrack = document.getElementById("shorts-track");
const shortsPagination = document.getElementById("shorts-pagination");
const shortsStatus = document.getElementById("shorts-status");

if (
  shortsSection &&
  shortsTitle &&
  shortsDescription &&
  shortsViewport &&
  shortsTrack &&
  shortsPagination &&
  shortsStatus
) {
  fetch("data/yt-shorts.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("쇼츠 데이터를 불러오지 못했습니다.");
      }

      return response.json();
    })
    .then((data) => {
      const shorts = Array.isArray(data.shorts) ? data.shorts : [];

      if (shorts.length === 0) {
        throw new Error("표시할 쇼츠가 없습니다.");
      }

      shortsTitle.textContent = data.title || "Youtube Shorts";
      shortsDescription.textContent = data.description || "";

      const cards = [];
      for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
        shorts.forEach((short, shortIndex) => {
          const item = document.createElement("li");
          const link = document.createElement("a");
          const image = document.createElement("img");

          item.className = "shorts-card";
          item.dataset.shortIndex = String(shortIndex);
          link.className = "shorts-card__link";
          link.href = short.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.draggable = false;
          link.setAttribute("aria-label", `${short.text} (새 창에서 열기)`);
          image.className = "shorts-card__image";
          image.src = short.image;
          image.alt = short.alt;
          image.draggable = false;
          image.loading = "lazy";
          image.decoding = "async";

          link.append(image);
          item.append(link);
          shortsTrack.append(item);
          cards.push(item);
        });
      }

      let activeIndex = shorts.length - 1;
      let activeCardIndex = shorts.length + activeIndex;
      let pointerStartX = null;
      let pointerMoved = false;
      let suppressCardClick = false;
      const paginationButtons = shorts.map((short, index) => {
        const button = document.createElement("button");
        button.className = "shorts-pagination__button";
        button.type = "button";
        button.setAttribute("aria-label", `${index + 1}번 쇼츠: ${short.text}`);
        button.setAttribute("aria-pressed", String(index === activeIndex));
        button.addEventListener("click", () => {
          goToShort(index);
        });
        shortsPagination.append(button);
        return button;
      });

      function updateShortsCarousel() {
        const activeCard = cards[activeCardIndex];
        const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
        const offset = shortsViewport.clientWidth / 2 - cardCenter;

        shortsTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
        cards.forEach((card, index) => {
          const distance = Math.abs(index - activeCardIndex);
          const isActive = distance === 0;

          card.classList.toggle("is-active", isActive);
          card.dataset.distance = String(distance);
          card.setAttribute("aria-hidden", String(distance > 2));
          card.inert = distance > 2;
        });
        paginationButtons.forEach((button, index) => {
          button.setAttribute("aria-pressed", String(index === activeIndex));
        });
      }

      function normalizeShortsCarousel() {
        if (activeCardIndex >= shorts.length * 2) {
          activeCardIndex -= shorts.length;
        } else if (activeCardIndex < shorts.length) {
          activeCardIndex += shorts.length;
        } else {
          return;
        }

        shortsTrack.style.transition = "none";
        updateShortsCarousel();
        shortsTrack.offsetHeight;
        shortsTrack.style.removeProperty("transition");
      }

      function goToShort(nextIndex) {
        const normalizedIndex = (nextIndex + shorts.length) % shorts.length;
        if (normalizedIndex === activeIndex) return;

        if (activeIndex === shorts.length - 1 && normalizedIndex === 0) {
          activeCardIndex = shorts.length * 2;
        } else if (activeIndex === 0 && normalizedIndex === shorts.length - 1) {
          activeCardIndex = shorts.length - 1;
        } else {
          activeCardIndex = shorts.length + normalizedIndex;
        }

        activeIndex = normalizedIndex;
        updateShortsCarousel();

        if (getComputedStyle(shortsTrack).transitionDuration === "0s") {
          normalizeShortsCarousel();
        }
      }

      shortsTrack.addEventListener("transitionend", (event) => {
        if (event.target === shortsTrack && event.propertyName === "transform") {
          normalizeShortsCarousel();
        }
      });

      shortsViewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          goToShort(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
        }
      });

      shortsViewport.addEventListener("pointerdown", (event) => {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
          return;
        }

        pointerStartX = event.clientX;
        pointerMoved = false;
      });

      shortsViewport.addEventListener("pointermove", (event) => {
        if (pointerStartX === null) return;

        if (Math.abs(event.clientX - pointerStartX) > 8) {
          pointerMoved = true;
          if (!shortsViewport.hasPointerCapture(event.pointerId)) {
            shortsViewport.setPointerCapture(event.pointerId);
          }
          shortsViewport.classList.add("is-dragging");
        }
      });

      shortsViewport.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;

        const swipeDistance = event.clientX - pointerStartX;
        pointerStartX = null;
        shortsViewport.classList.remove("is-dragging");

        if (!pointerMoved) return;

        suppressCardClick = true;
        window.setTimeout(() => {
          suppressCardClick = false;
        }, 0);

        if (Math.abs(swipeDistance) >= 40) {
          goToShort(activeIndex + (swipeDistance < 0 ? 1 : -1));
        }
      });

      shortsViewport.addEventListener("pointercancel", () => {
        pointerStartX = null;
        pointerMoved = false;
        shortsViewport.classList.remove("is-dragging");
      });

      shortsViewport.addEventListener(
        "click",
        (event) => {
          if (!suppressCardClick) return;

          event.preventDefault();
          event.stopPropagation();
        },
        true,
      );

      window.addEventListener("resize", updateShortsCarousel);
      updateShortsCarousel();
    })
    .catch(() => {
      shortsStatus.textContent = "쇼츠를 불러오지 못했습니다.";
    });
}

