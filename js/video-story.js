const section = document.querySelector(".video-story");
const SwiperConstructor = window.Swiper;

if (section && SwiperConstructor) {
  const carouselElement = section.querySelector(".video-story__carousel");
  const storyTrack = section.querySelector("#video-story-track");
  const storyPagination = section.querySelector(".video-story__pagination");
  const status = section.querySelector(".video-story__status");

  fetch("data/yt-play.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("영상 목록을 불러오지 못했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const videos = Array.isArray(data.videos) ? data.videos : [];
      if (videos.length === 0) {
        throw new Error("표시할 영상이 없습니다.");
      }

      const createVideoLink = (video, className) => {
        const link = document.createElement("a");
        const image = document.createElement("img");

        link.className = className;
        link.href = video.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.draggable = false;
        link.setAttribute("aria-label", `${video.text} (새 창에서 열기)`);
        image.src = video.image;
        image.alt = video.alt;
        image.loading = "lazy";
        image.decoding = "async";
        image.draggable = false;
        link.append(image);
        return link;
      };

      videos.forEach((video) => {
        const slide = document.createElement("article");
        const link = createVideoLink(video, "video-story__card");
        const title = document.createElement("p");

        slide.className = "swiper-slide video-story__item";
        link.querySelector("img").className = "video-story__card-image";
        title.className = "video-story__card-title";
        title.textContent = video.text;
        link.append(title);
        slide.append(link);
        storyTrack.append(slide);
      });

      const AUTO_DELAY = 3000; // 자동 넘김 간격
      const RESUME_DELAY = 3000; // 직접 조작 후 재개까지 대기 시간
      let resumeTimer = null;

      const swiper = new SwiperConstructor(carouselElement, {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: true,
        loopAdditionalSlides: 2,
        speed: 500,
        grabCursor: true,
        allowTouchMove: true,
        simulateTouch: true,
        touchStartPreventDefault: false,
        threshold: 5,
        autoplay: {
          delay: AUTO_DELAY,
          disableOnInteraction: false,
        },
        pagination: {
          el: storyPagination,
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
        breakpoints: {
          769: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });

      // 직접 조작하면 자동 넘김을 멈추고, 3초간 움직임이 없으면 다시 시작
      const pauseAutoplay = () => {
        window.clearTimeout(resumeTimer);
        swiper.autoplay.stop();
      };

      const scheduleResume = () => {
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
          swiper.slideNext();
          swiper.autoplay.start();
        }, RESUME_DELAY);
      };

      swiper.on("touchStart", pauseAutoplay);
      swiper.on("touchEnd", scheduleResume);

      storyPagination.addEventListener("click", () => {
        pauseAutoplay();
        scheduleResume();
      });

      carouselElement.addEventListener("keydown", () => {
        pauseAutoplay();
        scheduleResume();
      });
    })
    .catch(() => {
      if (status) {
        status.textContent = "영상을 불러오지 못했습니다.";
      }
    });
}
