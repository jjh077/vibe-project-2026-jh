import "./shared-layout.js";

const footer = document.getElementById("site-footer");

if (footer) {
  const FTC_URL = "https://www.ftc.go.kr/bizCommPop.do?wrkr_no=";

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // 라벨 + 값 한 쌍 (예: 상호 데이캣)
  const createInfoItem = (label, value, className = "") => {
    const item = el("li", `site-footer__item ${className}`.trim());
    item.append(
      el("span", "site-footer__label", label),
      el("span", "site-footer__value", value),
    );
    return item;
  };

  const createBreak = () => {
    const item = el("li", "site-footer__break");
    item.setAttribute("aria-hidden", "true");
    return item;
  };

  const createSeparator = () => {
    const sep = el("span", "site-footer__sep", "|");
    sep.setAttribute("aria-hidden", "true");
    return sep;
  };

  // "카카오톡 상담 (@그루밍데이)" -> "카카오톡상담 @그루밍데이"
  const formatKakaoLabel = (text = "") =>
    text.replace(/^(\S+)\s+(\S+)\s*\((.+)\)$/, "$1$2 $3");

  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.4" fill="currentColor"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="m10 9.2 5.2 2.8-5.2 2.8z" fill="#fff"/></svg>',
  };

  const SNS_LABELS = { instagram: "인스타그램", youtube: "유튜브" };

  const render = (data) => {
    const info = data.company_info || {};
    const center = data.customer_center || {};
    const links = Array.isArray(data.footer_links) ? data.footer_links : [];
    const sns = Array.isArray(data.sns) ? data.sns : [];
    const bizNumber = (info.business_registration_number || "").replace(/-/g, "");

    /* ---------- 상단: 회사 정보 + 고객만족센터 ---------- */
    const top = el("div", "site-footer__top");
    const company = el("div", "site-footer__company");

    const logo = el("a", "site-footer__logo", info.name);
    logo.href = "#";
    logo.setAttribute("aria-label", `${info.name} 홈`);

    // 모바일 전용 아코디언 토글
    const toggle = el("button", "site-footer__toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-controls", "site-footer-collapse");
    toggle.append(
      el("span", "site-footer__toggle-text", `${info.business_name} 사업자 정보`),
    );
    const arrow = el("span", "site-footer__toggle-arrow");
    arrow.setAttribute("aria-hidden", "true");
    toggle.append(arrow);

    const collapse = el("div", "site-footer__collapse");
    collapse.id = "site-footer-collapse";
    const collapseInner = el("div", "site-footer__collapse-inner");

    const list = el("ul", "site-footer__info");
    list.append(
      createInfoItem("상호", info.business_name),
      createInfoItem("대표", info.representative),
      createInfoItem("전화번호", info.customer_service_number, "is-mobile-only"),
      createInfoItem("개인정보보호책임자", info.privacy_officer),
      createInfoItem("통신판매신고번호", info.mail_order_sales_number),
    );

    const bizItem = createInfoItem(
      "사업자등록번호",
      info.business_registration_number,
    );
    const bizLink = el("a", "site-footer__biz-link", "[사업자정보확인]");
    bizLink.href = `${FTC_URL}${bizNumber}`;
    bizLink.target = "_blank";
    bizLink.rel = "noopener noreferrer";
    bizItem.append(bizLink);
    list.append(
      bizItem,
      createBreak(),
      createInfoItem("주소", info.address),
      createInfoItem("반품주소지", info.return_address),
    );

    // 데스크탑 전용 3번째 줄
    const copyLine = el("p", "site-footer__copyline");
    const copyText = el("span", "site-footer__copytext", data.copyright);
    const phone = el("span", "site-footer__contact");
    phone.append(
      el("span", "site-footer__label", "고객센터 전화번호"),
      el("span", "site-footer__value", info.customer_service_number),
    );
    const mail = el("a", "site-footer__mail", info.email);
    mail.href = `mailto:${info.email}`;
    copyLine.append(
      copyText,
      createSeparator(),
      phone,
      createSeparator(),
      mail,
      el("span", "site-footer__credit", "hosting by cafe24"),
      el("span", "site-footer__credit", "design by design102"),
    );

    const notice = el("p", "site-footer__notice");
    notice.append(
      "고객님은 안전거래를 위해 현금 등으로 결제시 저희 쇼핑몰에서 가입한 PG사의 구매안전 서비스를 이용하실 수 있습니다. ",
      el("span", "site-footer__notice-link", "[서비스 가입사실 확인]"),
    );

    collapseInner.append(list, copyLine);
    collapse.append(collapseInner);
    company.append(logo, toggle, collapse, notice);

    // 고객만족센터
    const service = el("div", "site-footer__service");
    const kakao = el("button", "site-footer__kakao", formatKakaoLabel(center.kakao_talk));
    kakao.type = "button";
    service.append(
      el("h2", "site-footer__service-title", center.title),
      kakao,
      el("p", "site-footer__hours", center.consulting_hours),
      el("p", "site-footer__hours", center.closed_days),
    );

    top.append(company, service);

    /* ---------- 하단: SNS + 링크 ---------- */
    const bottom = el("div", "site-footer__bottom");

    const snsList = el("ul", "site-footer__sns");
    sns.forEach((item) => {
      const li = el("li");
      const a = el("a", "site-footer__sns-link");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `${SNS_LABELS[item.platform] || item.platform} (새 창)`);
      a.innerHTML = ICONS[item.platform] || "";
      li.append(a);
      snsList.append(li);
    });

    const nav = el("nav", "site-footer__links");
    nav.setAttribute("aria-label", "푸터 메뉴");
    const linkList = el("ul");
    links.forEach((item) => {
      const li = el("li");
      const a = el("a", "", item.name);
      a.href = item.url;
      if (item.name === "개인정보처리방침") a.className = "is-strong";
      li.append(a);
      linkList.append(li);
    });
    nav.append(linkList);

    bottom.append(snsList, nav);

    // 모바일 전용 카피라이트
    const copyright = el("p", "site-footer__copyright", data.copyright);

    // 레이아웃용 래퍼(가운데 정렬 폭)로 감싸서 배치
    const wrap = (child) => {
      const box = el("div", "site-footer__inner");
      box.append(child);
      return box;
    };

    footer.replaceChildren(
      wrap(top),
      el("div", "site-footer__divider"),
      wrap(bottom),
      wrap(copyright),
    );

    // 모바일 아코디언 열기/닫기
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      footer.classList.toggle("is-collapsed", !open);
      collapse.toggleAttribute("inert", !open && window.matchMedia("(max-width: 768px)").matches);
    });
  };

  fetch(new URL("../data/footer.json", import.meta.url))
    .then((response) => {
      if (!response.ok) {
        throw new Error("푸터 정보를 불러오지 못했습니다.");
      }
      return response.json();
    })
    .then(render)
    .catch(() => {
      footer.append(el("p", "site-footer__status", "푸터 정보를 불러오지 못했습니다."));
    });
}
