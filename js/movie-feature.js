const section = document.querySelector(".movie-feature");

if (section) {
  const videoBox = section.querySelector(".movie-feature__video");
  const list = section.querySelector(".movie-feature__list");
  const status = section.querySelector(".movie-feature__status");

  // "//ecimg..." 처럼 프로토콜이 없는 주소는 https로 보정
  const normalizeSrc = (src = "") =>
    src.startsWith("//") ? `https:${src}` : src;

  fetch("data/yt-movie.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("영상 정보를 불러오지 못했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const background = data.background_video;
      const items = Array.isArray(data.items) ? data.items : [];

      if (!background || !background.src || items.length === 0) {
        throw new Error("표시할 콘텐츠가 없습니다.");
      }

      // 왼쪽 큰 영상
      const iframe = document.createElement("iframe");
      iframe.src = background.src;
      iframe.title = background.title || "코비, 베리 영상";
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.setAttribute("allowfullscreen", "");
      videoBox.append(iframe);

      // 오른쪽(모바일은 아래) 이미지 리스트
      items.forEach((item) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        const thumb = document.createElement("span");
        const image = document.createElement("img");
        const body = document.createElement("span");
        const title = document.createElement("strong");
        const comment = document.createElement("span");

        li.className = "movie-feature__item";
        link.className = "movie-feature__link";
        link.href = item.url;
        thumb.className = "movie-feature__thumb";
        image.src = normalizeSrc(item.image);
        image.alt = item.subject;
        image.loading = "lazy";
        image.decoding = "async";
        body.className = "movie-feature__body";
        title.className = "movie-feature__subject";
        title.textContent = item.subject;
        comment.className = "movie-feature__comment";
        comment.textContent = item.comment;

        thumb.append(image);
        body.append(title, comment);
        link.append(thumb, body);
        li.append(link);
        list.append(li);
      });
    })
    .catch(() => {
      if (status) {
        status.textContent = "콘텐츠를 불러오지 못했습니다.";
      }
    });
}
