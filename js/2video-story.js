const section = document.querySelector(".video-story");
const SwiperConstructor = window.Swiper;

if (section && SwiperConstructor) {
  const featureElement = section.querySelector(".video-story__feature");
  const featureTrack = section.querySelector("#video-feature-track");
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

      videos.slice(0, 2).forEach((video) => {
        const slide = document.createElement("div");
        const link = createVideoLink(video, "video-story__feature-slide");
        const title = document.createElement("p");

        slide.className = "swiper-slide";
        link.querySelector("img").className = "video-story__card-image";
        title.className = "video-story__card-title";
        title.textContent = video.text;
        link.append(title);
        slide.append(link);
        featureTrack.append(slide);
      });

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

      new SwiperConstructor(featureElement, {
        slidesPerView: 1,
        loop: true,
        speed: 500,
        grabCursor: true,
        allowTouchMove: true,
        simulateTouch: true,
        touchStartPreventDefault: false,
        threshold: 5,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        keyboard: {
          enabled: true,
        },
      });

      new SwiperConstructor(carouselElement, {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: false,
        speed: 500,
        grabCursor: true,
        allowTouchMove: true,
        simulateTouch: true,
        touchStartPreventDefault: false,
        threshold: 5,
        pagination: {
          el: storyPagination,
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
        breakpoints: {
          769: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      });
    })
    .catch(() => {
      if (status) {
        status.textContent = "영상을 불러오지 못했습니다.";
      }
    });
}
