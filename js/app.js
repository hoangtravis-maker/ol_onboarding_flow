(function () {
  'use strict';

  const D = window.DATA;
  const app = document.getElementById('app');
  const byId = Object.fromEntries(D.products.map((p) => [p.id, p]));

  // ---------- helpers ----------
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const icon = (name, size = 24, cls = '') =>
    `<svg class="ic ${cls}" width="${size}" height="${size}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  // ---------- state (giữ trong sessionStorage để F5 không mất giỏ) ----------
  const KEY = 'ol-proto-v1';
  const fresh = () => ({ cart: {}, homeTipSeen: false, coachDone: false, payment: D.user.olCardBalance > 0 ? 'olcard' : 'cash', slot: D.pickup.selectedSlot, deli: 'pickup', usePoints: false, posAt: Date.now() });
  let S;
  try { S = JSON.parse(sessionStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
  if (!S.posAt) S.posAt = Date.now();
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // trạng thái tạm thời theo màn (không lưu)
  let coachStep = 0;      // bước coachmark ở checkout
  let toast = null;       // thông báo ngắn hiện 1 lần sau lần render kế tiếp
  let guide = null;       // { tab, step } khi đang mở hướng dẫn chuyển khoản

  const cartItems = () => Object.entries(S.cart).filter(([, q]) => q > 0).map(([id, q]) => ({ p: byId[id], q }));
  const cartCount = () => cartItems().reduce((s, i) => s + i.q, 0);
  const cartLines = () => cartItems().length;
  const subtotal = () => cartItems().reduce((s, i) => s + i.p.price * i.q, 0);
  const listTotal = () => cartItems().reduce((s, i) => s + i.p.oldPrice * i.q, 0);
  // "Xem lại hướng dẫn": khách mới / churn online, trong N phút sau khi tích điểm ở POS
  const replayLeft = () => (['new', 'churned'].includes(D.user.segment) ? S.posAt + D.replayMinutes * 60000 - Date.now() : 0);
  // siêu thị đang chọn (mặc định: siêu thị đầu tiên trong data)
  const store = () => D.stores.find((x) => x.id === S.storeId) || D.stores[0];
  const isShip = () => S.deli === 'ship';
  // ngày / khung giờ theo phương thức giao
  const timeCfg = () => (isShip() ? D.delivery : D.pickup);
  const shipFee = () => (isShip() ? D.delivery.fee : 0);
  const vById = Object.fromEntries(D.vouchers.map((v) => [v.id, v]));
  // lý do voucher chưa dùng được (null = dùng được)
  const voucherBlock = (v, sum) => {
    if (v.ship && !isShip()) return 'Không áp dụng cho đơn nhận tại siêu thị';
    if (v.productIds && !v.productIds.some((id) => S.cart[id])) return 'Đơn hàng chưa có sản phẩm thuộc chương trình ưu đãi';
    if (sum < v.min) return `Mua thêm ${fmt(v.min - sum)}đ để sử dụng được voucher`;
    return null;
  };
  const voucherAmount = (v, sum) => (v.ship ? Math.min(v.off, shipFee()) : v.pct ? Math.min(Math.round(sum * v.pct / 100 / 1000) * 1000, v.max) : v.off);
  // voucher đang áp dụng; tự gỡ nếu đơn không còn đủ điều kiện
  const appliedVoucher = (sum) => {
    const v = vById[S.voucher];
    return v && !voucherBlock(v, sum) ? v : null;
  };

  // ---------- shared components ----------
  const qtyStepper = (p, cls = '') => `
    <div class="qty ${cls}">
      <button class="qty-btn qty-dec" data-action="dec" data-id="${p.id}" aria-label="Giảm">${icon('subtract-line')}</button>
      <div class="qty-val">${S.cart[p.id]}</div>
      <button class="qty-btn qty-inc" data-action="inc" data-id="${p.id}" aria-label="Tăng">${icon('add-line')}</button>
    </div>`;

  const discountLabel = (pct) => `
    <div class="disc"><div class="disc-shape"></div>
      <span class="disc-t">Giảm</span><span class="disc-line"></span>
      <span class="disc-n">${pct}<small>%</small></span>
    </div>`;

  // icon giỏ có dấu "+" (xuất từ Figma, tách 2 lớp để chạy motion)
  const BUY_ICON = (size = 16) => `<svg class="buy-ic" width="${size}" height="${size}" viewBox="0 0 16 16" aria-hidden="true">
    <path class="bi-cart" transform="translate(1 1)" fill="currentColor" d="M3.16309 12.166C3.42832 12.166 3.68254 12.2715 3.87012 12.459C4.05765 12.6465 4.16301 12.9008 4.16309 13.166C4.16309 13.4313 4.05771 13.6864 3.87012 13.874C3.68256 14.0614 3.42822 14.167 3.16309 14.167C2.89796 14.167 2.64362 14.0614 2.45605 13.874C2.26846 13.6864 2.16309 13.4313 2.16309 13.166C2.16316 12.9008 2.26852 12.6465 2.45605 12.459C2.64364 12.2715 2.89786 12.166 3.16309 12.166ZM11.166 12.166C11.4312 12.1661 11.6855 12.2715 11.873 12.459C12.0605 12.6465 12.1659 12.9008 12.166 13.166C12.166 13.4313 12.0606 13.6864 11.873 13.874C11.6856 14.0614 11.4311 14.1669 11.166 14.167C10.9007 14.167 10.6456 14.0616 10.458 13.874C10.2704 13.6864 10.165 13.4313 10.165 13.166C10.1651 12.9009 10.2706 12.6465 10.458 12.459C10.6456 12.2714 10.9007 12.166 11.166 12.166ZM3.10547 2.16309H3.11523L3.50586 3.49609H3.49609V7.49805H11.1738L12.374 3.49609H12.3701L12.8145 2.16309H13.2705C13.3743 2.16311 13.4766 2.18689 13.5693 2.2334C13.6622 2.28005 13.7436 2.34826 13.8057 2.43164C13.8676 2.51493 13.9087 2.61166 13.9268 2.71387C13.9448 2.81609 13.9389 2.92106 13.9092 3.02051L12.3086 8.35645C12.2674 8.49355 12.1831 8.61366 12.0684 8.69922C11.9533 8.78485 11.8133 8.83104 11.6699 8.83105H3.49609V10.165H10.832V11.499H2.8291C2.65249 11.4989 2.48333 11.4286 2.3584 11.3037C2.23333 11.1786 2.16309 11.0089 2.16309 10.832V3.10547L0 0.943359L0.943359 0L3.10547 2.16309Z"/>
    <path class="bi-add" transform="translate(7.4 1.2)" fill="currentColor" d="M1.6875 1.68758V0H2.77232V1.68758H4.5V2.7724H2.77232V4.50008H1.6875V2.7724H0V1.68758H1.6875Z"/></svg>`;

  // motion: chỉ chạy ở sản phẩm đầu tiên (Welcome + Home) theo design
  const dealCard = (p, { tall = true, motion = false } = {}) => `
    <div class="deal ${tall ? '' : 'deal-home'}">
      <div class="deal-tile" data-action="pdp" data-id="${p.id}">
        <img class="deal-img" src="${p.img}" width="151" height="151" alt="${p.name}">
        ${discountLabel(p.discount)}
        <div class="deal-price">
          <div class="dp-now">${fmt(p.price)}<sup>đ</sup></div>
          <div class="dp-old">${fmt(p.oldPrice)} đ</div>
        </div>
        ${S.cart[p.id] ? qtyStepper(p, 'deal-qty') : `<button class="btn-buy ${motion ? 'anim-buy' : ''}" data-action="add" data-id="${p.id}">${BUY_ICON()}Mua</button>`}
      </div>
      <p class="deal-name" data-action="pdp" data-id="${p.id}">${p.name}</p>
    </div>`;

  // card.product.normal.sm — "Thường được mua kèm"
  // grid = card.product.normal 2 cột (Search > Đặt lại sản phẩm, kết quả tìm kiếm)
  const recCard = (p, grid = false) => `
    <div class="rcard ${grid ? 'pcard' : ''}">
      <div class="rcard-img" data-action="pdp" data-id="${p.id}"><img src="${p.img}" width="132" height="132" alt="${p.name}"><span class="rcard-disc">-${p.discount}%</span>${grid ? '<span class="pcard-badge b-blue">Ưu đãi online</span>' : ''}</div>
      <p class="rcard-price">${fmt(p.price)}<small> đ</small></p>
      <p class="rcard-old"><s>${fmt(p.oldPrice)} đ</s> <b class="c-safe2">Tiết kiệm ${fmt((p.oldPrice - p.price) / 1000)}k</b></p>
      <p class="rcard-name" data-action="pdp" data-id="${p.id}">${p.name}</p>
      ${S.cart[p.id] ? qtyStepper(p, 'qty-wide') : `<button class="rcard-buy" data-action="add" data-id="${p.id}">${BUY_ICON()}Mua</button>`}
    </div>`;

  // to: bấm vào tooltip thì chuyển màn
  const tooltip = (text, cls, to) => `<div class="tt ${cls} ${to ? 'tt-tap' : ''}" ${to ? `data-action="go" data-to="${to}"` : ''}>${text}</div>`;

  const titleCheckout = (idx, label, right = '') => `
    <div class="co-title"><span class="co-idx">${idx}</span><span class="co-label">${label}</span>${right}</div>`;

  // ---------- screens ----------
  const screens = {};

  let dealsJump = false;  // vừa bấm "Xem tất cả deal" ở Welcome → cuộn tới khu deal khi vào Home
  let wlFootIn = false;   // giỏ đã có món ở lần render trước — sticky bar Welcome chỉ trượt lên khi giỏ đi từ 0 lên 1
  // 1. Welcome screen — sau khi tích điểm ở POS
  screens.welcome = () => {
    const n = cartCount();
    return `
    <div class="scr scr-welcome">
      <div class="appbar"><button class="appbar-l" data-action="go" data-to="#/home" aria-label="Đóng">${icon('close-line')}</button></div>
      <div class="body">
        <div class="wl-banner">${D.copy.welcomeBanner}</div>
        <img class="wl-headline ${n ? 'is-a2c' : ''}" src="assets/img/headline.webp" width="245" height="76" alt="Deal online dành riêng cho bạn — Chỉ trong 24h">
        <div class="deal-grid">${D.dealIds.map((id, i) => dealCard(byId[id], { motion: i === 0 })).join('')}</div>
        <button class="wl-all" data-action="all-deals">${D.copy.welcomeAllDeals}${icon('arrow-right-s-line', 16)}</button>
      </div>
      ${n ? `
      <div class="foot wl-foot ${wlFootIn ? '' : 'slide-up'}">
        <div class="wl-note">${icon('walk-line', 20, 'c-brand')}<p><b>${D.copy.welcomeBar.text}</b>, <b class="c-safe">${D.copy.welcomeBar.highlight}</b></p></div>
        <button class="btn-l anim-cart anim-strong" data-action="go" data-to="#/cart">${BUY_ICON(20)}${D.copy.welcomeCta} · ${n} món</button>
      </div>` : ''}
    </div>`;
  };

  // 2. Home
  screens.home = () => {
    const n = cartCount();
    const u = D.user;
    return `
    <div class="scr scr-home">
      <div class="home-hd">
        <button class="hd-circle" data-action="noop" data-hold="reset" aria-label="Menu">${icon('menu-line', 20)}</button>
        <div class="hd-search" data-action="go" data-to="#/search"><span>Meatcool giảm giá 30%</span>${icon('search-line', 20, 'c-brand')}</div>
        <button class="hd-btn" data-action="noop" aria-label="Voucher"><img src="assets/img/hdr-coupon.webp" width="19" height="19" alt=""><span class="badge">${u.voucherCount}</span></button>
        <button class="hd-glass" data-action="noop" aria-label="Thông báo">${icon('notification-3-line', 20)}<i class="dot"></i></button>
      </div>
      <div class="body">
        <div class="deli">
          <div class="deli-seg"><span>Giao trong 2h</span><span class="on">Đến nhận</span></div>
          <div class="deli-store" data-action="go" data-to="#/stores"><span>tại</span><span class="ell">${store().name}, ${store().address}</span>${icon('arrow-down-s-line', 16)}</div>
        </div>
        <div class="member">
          <img class="member-bg" src="assets/img/member-bg.webp" width="360" height="133" alt="">
          <div class="member-ov"></div>
          <div class="member-in">
            <div class="member-name" data-action="noop"><b>${u.fullName}</b><span>Member · Thành viên từ ${u.memberSince}</span>${icon('arrow-right-s-line', 16)}</div>
            <div class="member-row">
              <div class="m-points">
                <div class="m-pt-top"><span>Điểm</span><b>${u.points}</b><small>${u.pointsValue}</small></div>
                <button class="m-pt-btn" data-action="noop">Sử dụng điểm ${icon('arrow-right-s-line', 12)}</button>
              </div>
              <div class="m-right">
                <div class="m-util" data-action="noop"><div><span>Thẻ OneLife</span><a>Tặng đến 90k ${icon('arrow-right-s-line', 12)}</a></div><b>${fmt(u.olCardBalance)} đ</b></div>
                <div class="m-util" data-action="noop"><div><span>Phiếu giảm giá</span><a>Giảm 50k cho đơn từ 500k ... ${icon('arrow-right-s-line', 12)}</a></div><i class="m-count">${u.voucherCount}</i></div>
              </div>
            </div>
          </div>
        </div>
        <div class="promo-strip">
          <div class="promo-in">
            <img src="assets/img/kiwi.webp" width="48" height="48" alt="">
            <div class="promo-txt"><b>Chỉ còn 2h mua Kiwi giá 88k</b><p>Hộp Kiwi vàng chín Zespri chỉ 88k /4 hộp. Rủ bạn mua chung 4 hộp ngay!</p></div>
            <button class="btn-s" data-action="noop">Mua ngay</button>
          </div>
        </div>
        <div class="cates">${D.categories.map((c) => `
          <div class="cate ${c.active ? 'on' : ''} ${c.partial ? 'partial' : ''}" data-action="noop"><img src="${c.img}" width="${c.partial ? 39 : 48}" height="48" alt=""><span>${c.label}</span></div>`).join('')}
        </div>
        <div class="deal-tabs" id="deal-tabs">${D.dealTabs.map((t, i) => `<div class="dtab dtab-${i}" data-action="noop"><span>${t}</span></div>`).join('')}</div>
        <div class="deal-grid deal-grid-home">
          <div class="deal deal-home"><img class="beef" src="assets/img/beef-banner.webp" width="174" height="223" alt="Thịt bò mát nhập khẩu chuẩn Úc" data-action="noop"></div>
          ${D.homeDeals.map((id, i) => dealCard(byId[id], { tall: false, motion: i === 0 })).join('')}
        </div>
      </div>
      <div class="tabbar-wrap">
        <nav class="tabbar">
          <a class="tab on" data-action="noop"><img src="assets/img/tab-home.webp" width="24" height="24" alt=""><span>Trang chủ</span></a>
          <a class="tab" data-action="noop">${icon('price-tag-3-line', 24)}<span>Khuyến mãi</span></a>
          <a class="tab-qr" data-action="noop"><img src="assets/img/tab-qr.webp" width="52" height="52" alt="Quét mã"></a>
          <a class="tab dim" data-action="go" data-to="#/cart"><i class="tab-cart ${S.cartTip && n ? 'cart-hint' : ''}">${icon('shopping-cart-2-line', 24)}${n ? `<span class="badge badge-dk">${n}</span>` : ''}</i><span>Giỏ hàng</span></a>
          <a class="tab dim" data-action="noop" data-hold="reset"><img src="assets/img/tab-avatar.webp" width="44" height="44" alt="Tài khoản"></a>
        </nav>
      </div>
      ${replayLeft() > 0 ? `<a class="replay" data-action="replay">${icon('restart-line', 18)}<span>${D.copy.replay}</span></a>` : ''}
      ${S.cartTip && n ? tooltip(D.copy.cartAdded, 'tt-down tt-home-cart', '#/cart') : ''}
    </div>`;
  };

  // 3. Product detail
  screens.pdp = (id) => {
    const p = byId[id] || D.products[0];
    const n = cartCount();
    const saved = p.oldPrice - p.price;
    const soldPct = Math.round((p.sold / p.stock) * 100);
    return `
    <div class="scr scr-pdp">
      <div class="pdp-hd">
        <button class="appbar-icon" data-action="back" aria-label="Quay lại">${icon('arrow-left-s-line')}</button>
        <div class="pdp-search" data-action="noop">${icon('search-line', 20, 'c-sec')}<span>Tìm kiếm</span></div>
        <button class="pdp-cart ${S.cartTip && n ? 'cart-hint' : ''}" data-action="go" data-to="#/cart" aria-label="Giỏ hàng">${icon('shopping-cart-2-line', 20)}${n ? `<span class="badge">${n}</span>` : ''}</button>
      </div>
      <div class="body">
        <div class="pdp-img">
          <img src="${p.img}" width="151" height="151" alt="${p.name}">
          <div class="pdp-gift">${icon('gift-2-fill', 20)}Quà tặng</div>
          <div class="pdp-badges"><span class="b-blue">Ưu đãi online</span></div>
          <div class="pdp-ind">1/1</div>
        </div>
        <div class="pdp-sec">
          <div class="pdp-key">
            <div class="pdp-price">
              <p class="pp-now">${fmt(p.price)} <small>đ</small></p>
              <p class="pp-sub"><s>${fmt(p.oldPrice)} đ</s> <b class="c-safe">Tiết kiệm ${fmt(saved / 1000)}k</b></p>
              <p class="pp-name">${p.name}</p>
            </div>
            <button class="pdp-link" data-action="noop" aria-label="Chia sẻ">${icon('link-m', 16)}</button>
          </div>
          <div class="pdp-b2b" data-action="noop">${icon('stack-line', 20, 'c-brand')}<u>Mua số lượng sỉ, bạn vui lòng liên hệ để được giá tốt</u>${icon('arrow-right-s-line', 12, 'c-brand')}</div>
          <p class="pdp-left">Chỉ còn ${p.stockLeft} sản phẩm</p>
          <p class="pdp-end">Kết thúc <b>23:59 · hôm nay</b>, nhận tại siêu thị <u>Xem điều khoản</u></p>
          <div class="pbar"><i style="width:${soldPct}%"></i><span>Đã bán ${fmt(p.sold)}/${fmt(p.stock)}</span></div>
          <div class="pdp-pol">
            <div data-action="noop">${icon('e-bike-line', 20)}<span>Ưu đãi phí giao hàng thành viên</span>${icon('arrow-right-s-line', 20)}</div>
            <div data-action="noop">${icon('arrow-left-right-line', 20)}<span>Đổi trả trong 24h</span>${icon('arrow-right-s-line', 20)}</div>
          </div>
        </div>
      </div>
      <div class="foot pdp-foot">
        ${S.cart[p.id] ? qtyStepper(p, 'qty-wide') : `<button class="btn-l" data-action="add" data-id="${p.id}">${BUY_ICON()}Mua</button>`}
      </div>
      ${S.cartTip && n ? tooltip(D.copy.cartAdded, 'tt-up tt-pdp-cart', '#/cart') : ''}
    </div>`;
  };

  // 4. Cart
  screens.cart = () => {
    const items = cartItems();
    const n = cartLines();
    const sum = subtotal();
    return `
    <div class="scr scr-cart">
      <div class="appbar bordered"><button class="appbar-l" data-action="back" aria-label="Đóng">${icon('close-line')}</button><h1>Giỏ hàng</h1></div>
      <div class="body">
        <div class="cart-promo" data-action="noop"><span>${D.cartPromo}</span>${icon('arrow-right-s-line', 20)}</div>
        <div class="cart-all"><span class="cb on"></span><span class="grow">Chọn tất cả (${n} món)</span><a data-action="noop">Xóa (${n})</a></div>
        <div class="cart-list">
          ${items.length ? items.map(({ p }) => `
          <div class="ci">
            <div class="ci-top">
              <span class="cb on"></span>
              <img src="${p.img}" width="40" height="40" alt="" data-action="pdp" data-id="${p.id}">
              <p class="ci-name">${p.name}</p>
              <div class="ci-price"><b>${fmt(p.price)}<small> đ</small></b><s>${fmt(p.oldPrice)}<small> đ</small></s></div>
            </div>
            <div class="ci-btm">
              <button class="ci-del" data-action="del" data-id="${p.id}" aria-label="Xóa">${icon('delete-bin-6-line', 20)}</button>
              ${qtyStepper(p)}
            </div>
          </div>`).join('') : `<div class="cart-empty">Giỏ hàng trống. <a data-action="go" data-to="#/welcome">Xem deal online</a></div>`}
        </div>
        <div class="cart-noti-wrap">
          <div class="cart-noti" data-action="noop">
            <img src="${D.cartNoti.img}" width="45" height="45" alt="">
            <div class="grow"><b>${D.cartNoti.title}</b><p>${D.cartNoti.text}</p></div>
            <button class="btn-s" data-action="noop">${D.cartNoti.cta}</button>
          </div>
        </div>
        <div class="rec">
          <h2>Thường được mua kèm</h2>
          <div class="rec-list">${D.recommendIds.map((id) => recCard(byId[id])).join('')}</div>
        </div>
      </div>
      <div class="foot cart-foot">
        <div class="cf-row" data-action="noop">${icon('coupon-3-line', 20, 'c-brand')}<b class="grow">Dùng Voucher</b><small>Đã áp dụng ${appliedVoucher(sum) ? 1 : 0} Voucher</small>${icon('arrow-right-s-line', 16)}</div>
        <div class="btn-group">
          <div class="bg-left"><p class="c-safe">Tiết kiệm ${fmt(listTotal() - sum)} đ</p><p class="bg-price"><b>${fmt(sum)} đ</b><s>${fmt(listTotal())} đ</s></p></div>
          <button class="bg-btn ${n ? 'anim-cart anim-strong' : ''}" data-action="${n ? 'go' : 'noop'}" data-to="#/checkout">${BUY_ICON(20)}<b>Mua hàng</b><span> · ${n} món</span></button>
        </div>
      </div>
    </div>`;
  };

  // 5. Checkout
  // giữ "đ" cùng dòng với số tiền
  const nb = (t) => t.replace(/ đ/g, '&nbsp;đ');
  const MERCHANT = '<p class="vc-mer"><img class="vc-logo" src="assets/img/ic-merchant-ol.svg" width="12" height="12" alt="">ONELIFE</p>';
  const voucherImg = (v) => {
    if (v.kind === 'ship') return `<div class="vc-img vc-ship"><b>${v.imgTitle}</b><em>${v.imgSub}</em><i class="vc-tag">MEMBER</i><span class="vc-circle">${icon('takeaway-fill', 24)}</span></div>`;
    if (v.kind === 'percent') return `<div class="vc-img vc-pct"><b>${v.imgTitle}</b><span class="vc-circle">${icon('coin-fill', 24)}</span></div>`;
    return `<div class="vc-img vc-cash"><b>${v.imgTitle}</b><span class="vc-circle">${icon('coin-fill', 24)}</span></div>`;
  };

  // bước coachmark đang hiện ở Checkout (null nếu không có)
  const coachId = () => (!S.coachDone && cartLines() && !guide ? (checkoutSteps()[coachStep] || {}).id : null);

  screens.checkout = () => {
    const items = cartItems();
    const sum = subtotal();
    const vcHint = coachId() === 'voucher';
    const vc = appliedVoucher(sum);
    const vcAmt = vc ? voucherAmount(vc, sum) : 0;
    const fee = shipFee();
    const disc = Math.min(vcAmt, sum + fee);
    const total = sum + fee - disc;
    const saving = listTotal() - sum + disc;
    const points = Math.round(total / 1000);
    return `
    <div class="scr scr-co">
      <div class="appbar bordered"><button class="appbar-l" data-action="back" aria-label="Quay lại">${icon('arrow-left-s-line')}</button><h1>Thanh toán</h1></div>
      <div class="body">
        <section class="co-sec" id="co-s1">
          ${titleCheckout(1, 'Chọn phương thức giao')}
          <div class="co-deli">
            <button class="${S.deli === 'ship' ? 'on' : ''}" data-action="deli" data-v="ship"><i>${icon('e-bike-line', 16)}</i>Giao hàng</button>
            <button class="${S.deli === 'pickup' ? 'on' : ''}" data-action="deli" data-v="pickup"><i>${icon('walk-line', 16)}</i>Nhận tại siêu thị</button>
          </div>
          ${((h) => `<p class="co-deli-hint">${icon('information-line', 14)}<span>${h.text} <b>${h.highlight}</b></span></p>`)(D.copy.deliveryHint[isShip() ? 'ship' : 'pickup'])}
        </section>
        <section class="co-sec" id="co-s2">
          ${isShip() ? `
          ${titleCheckout(2, 'Chọn địa chỉ giao')}
          <div class="co-addr">
            <i class="co-pinic">${icon('map-pin-2-line', 20)}</i>
            <p class="grow co-ship-txt"><span class="co-ship-to">Giao đến <b>${D.delivery.receiver}</b></span><span class="co-ship-addr">${D.delivery.address}</span></p>
            <a data-action="noop">Đổi</a>
          </div>
          <div class="co-serve">
            <div class="grow"><small>Siêu thị phục vụ bạn</small><b>${store().name}, ${store().address}</b></div>
            <a data-action="go" data-to="#/stores">Đổi</a>
          </div>` : `
          ${titleCheckout(2, 'Chọn nơi nhận')}
          <div class="co-addr">
            <i class="co-storeic">${icon('store-2-line', 20)}</i>
            <p class="grow co-addr-txt">Nhận tại <b>${store().name}, ${store().address}</b></p>
            <a data-action="go" data-to="#/stores">Đổi</a>
          </div>`}
        </section>
        <section class="co-sec" id="co-s3">
          ${titleCheckout(3, isShip() ? 'Chọn giờ giao' : 'Chọn giờ nhận')}
          <div class="co-order">
            <div class="co-slots-wrap" id="co-slots">
              <div class="co-days">${timeCfg().days.map((d, i) => `<button class="chip ${(S.day || 0) === i ? 'on' : ''}" data-action="day" data-i="${i}">${d}</button>`).join('')}</div>
              <div class="co-slots">${timeCfg().slots.map((s, i) => `<button class="${S.slot === i ? 'on' : ''}" data-action="slot" data-i="${i}">${s}</button>`).join('')}</div>
            </div>
            <div class="co-items">
              ${items.map(({ p, q }) => `
              <div class="co-item">
                <div class="co-item-top"><img src="${p.img}" width="40" height="40" alt=""><p class="grow">${p.name}</p></div>
                <div class="co-item-btm"><b>${fmt(p.price * q)} đ</b><s>${fmt(p.oldPrice * q)} đ</s><span class="tag-deal">${icon('price-tag-3-fill', 14)}Ưu đãi</span><span class="grow"></span><span class="co-q">x${q}</span></div>
              </div>`).join('')}
            </div>
            <div class="co-note"><textarea rows="3" placeholder="Nhập ghi chú đơn"></textarea></div>
            <div class="co-points">Dự kiến +${fmt(points)} điểm cho đơn ${icon('information-line', 16)}</div>
          </div>
        </section>
        <section class="co-sec co-sec-promo" id="co-s4">
          <div id="co-s4-top">
            ${titleCheckout(4, 'Chọn khuyến mãi', '<a class="co-all" data-action="go" data-to="#/vouchers">Xem tất cả</a>')}
            <div class="co-code"><span class="grow">Nhập mã khuyến mãi của bạn tại đây</span><i></i><a data-action="noop">Áp dụng</a></div>
            <div class="vc-list">${D.vouchers.filter((v) => !voucherBlock(v, sum)).slice(0, 4).map((v, i) => {
              const on = vc === v;
              return `
              <div class="vc ${on ? 'applied' : ''} ${vcHint && i === 0 ? 'vc-hint' : ''}">
                ${voucherImg(v)}
                <div class="vc-txt">${MERCHANT}<p class="vc-title">${nb(v.title)}</p><p class="vc-cond">${v.cond}</p><p class="vc-exp">${v.expiry}</p></div>
                <a class="vc-act" data-action="voucher" data-id="${v.id}">${on ? 'Gỡ' : 'Dùng'}</a>
                ${v.qty ? `<span class="vc-qty">x${v.qty}</span>` : ''}
              </div>`;
            }).join('')}
            </div>
          </div>
          <div class="co-usepts">
            <i class="co-pts-ic">${icon('coin-fill', 16)}</i>
            <p class="grow">Dùng 2.000 điểm <small class="c-safe2">(~Giảm 10.000 đ)</small></p>
            <button class="switch ${S.usePoints ? 'on' : ''}" data-action="points" aria-label="Dùng điểm"><i></i></button>
          </div>
        </section>
        <section class="co-sec" id="co-s5">
          ${titleCheckout(5, 'Chọn phương thức thanh toán')}
          <div class="pay-list">
            ${D.payments.map((m) => `
            <div class="pay-row" data-action="pay" data-id="${m.id}">
              <span class="radio ${S.payment === m.id ? 'on' : ''}"></span>
              <img src="${m.img}" width="32" height="32" alt="">
              <div class="grow"><p>${m.label}</p>${m.sub ? `<small class="${m.guide ? 'pay-desc' : ''}">${m.sub.replace('{balance}', `${fmt(D.user.olCardBalance)} đ`)}${m.guide ? ' <a class="pay-guide" data-action="guide-open">Xem hướng dẫn</a>' : ''}</small>` : ''}</div>
            </div>`).join('')}
            <div class="pay-add">
              <a data-action="noop">${icon('add-line', 20)}${D.payAdd.label}</a>
              <p>${D.payAdd.desc}</p>
            </div>
          </div>
          <div class="pay-notes">${D.paymentNotes.map((t) => `<p>${t}</p>`).join('')}</div>
        </section>
        <section class="co-sec" id="co-s6">
          ${titleCheckout(6, 'Kiểm tra thông tin hóa đơn')}
          <div class="sum">
            <div class="sum-row"><span>Tổng tạm tính</span><b>${fmt(sum)} đ</b></div>
            ${isShip() ? `<div class="sum-row"><span>Phí vận chuyển</span><b>${fmt(fee)} đ</b></div>` : ''}
            ${vc ? `
            <div class="sum-row"><span>Tổng khuyến mãi ${icon('arrow-up-s-line', 16)}</span></div>
            <div class="sum-sub"><div class="sum-row"><span>${vc.ship ? 'Giảm giá phí vận chuyển' : vc.title}</span><b class="c-safe">-${fmt(vcAmt)} đ</b></div></div>` : `
            <div class="sum-row"><span>Tổng khuyến mãi</span><b>0 đ</b></div>`}
            <hr>
            <div class="sum-row sum-total"><span>Tổng cộng</span><b>${fmt(total)} đ</b></div>
          </div>
        </section>
      </div>
      <div class="foot btn-group co-foot">
        <div class="bg-left"><p class="c-safe">Tiết kiệm ${fmt(saving)} đ</p><p class="bg-price"><b>${fmt(total)} đ</b></p></div>
        <button class="bg-btn" id="co-order-btn" data-action="noop"><b>Đặt đơn</b></button>
      </div>
      ${guide ? bankGuideSheet() : ''}
    </div>`;
  };

  // Bottom sheet "Hướng dẫn Chuyển khoản ngân hàng"
  // nội dung bên trong sheet — đổi tab / bước chỉ vẽ lại phần này, sheet giữ nguyên (không chạy lại hiệu ứng mở)
  // các bước xếp ngang trong .gd-track — vuốt tay hoặc bấm Quay lại / Tiếp tục đều được
  const bankGuideBody = () => {
    const tab = D.bankGuide[guide.tab];
    return `
        <div class="gd-tabs">${D.bankGuide.map((t, i) => `<button class="${i === guide.tab ? 'on' : ''}" data-action="guide-tab" data-i="${i}">${t.tab}</button>`).join('')}</div>
        <div class="gd-card">
          <div class="gd-track">${tab.steps.map((st, i) => `
            <div class="gd-slide">
              <img class="gd-img" src="${st.img}" width="183" height="395" alt="Bước ${i + 1}">
              <div class="gd-title"><small>BƯỚC ${i + 1}</small><p>${st.text}</p></div>
            </div>`).join('')}
          </div>
          <div class="gd-nav">
            <button data-action="guide-step" data-d="-1">Quay lại</button>
            <span class="gd-dots">${tab.steps.map(() => '<i></i>').join('')}</span>
            <button data-action="guide-step" data-d="1">Tiếp tục</button>
          </div>
        </div>`;
  };
  // đồng bộ chấm + nút theo bước đang hiện
  const syncGuide = () => {
    const nav = app.querySelector('.gd-nav');
    if (!nav) return;
    const [prev, next] = nav.querySelectorAll('button');
    const n = D.bankGuide[guide.tab].steps.length;
    prev.classList.toggle('hide', guide.step === 0);
    next.classList.toggle('hide', guide.step >= n - 1);
    nav.querySelectorAll('.gd-dots i').forEach((d, i) => d.classList.toggle('on', i === guide.step));
  };
  const bindGuide = () => {
    const track = app.querySelector('.gd-track');
    if (!track) return;
    track.scrollLeft = guide.step * track.clientWidth;
    syncGuide();
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== guide.step) { guide.step = i; syncGuide(); }
    }, { passive: true });
  };
  const bankGuideSheet = () => `
    <div class="sheet-ov" data-action="guide-close"></div>
    <div class="sheet">
      <div class="sheet-hd"><button class="appbar-l" data-action="guide-close" aria-label="Đóng">${icon('close-line')}</button><h2>Hướng dẫn Chuyển khoản ngân hàng</h2></div>
      <div class="sheet-body">${bankGuideBody()}</div>
      <div class="sheet-ft"><button class="btn-l" data-action="guide-close">Đóng</button></div>
    </div>`;
  const updateGuide = () => { const b = app.querySelector('.sheet-body'); if (b) { b.innerHTML = bankGuideBody(); bindGuide(); } else render(true); };

  // 6. "Ưu đãi của bạn" — mở từ "Xem tất cả" ở Checkout
  let vcPick;             // voucher đang tick trong màn này (chưa áp dụng)
  const vcCard = (v, block) => `
    <div class="vcl ${block ? 'na' : ''}" ${block ? '' : `data-action="vc-pick" data-id="${v.id}"`}>
      <div class="vcl-main">
        ${voucherImg(v)}
        <div class="vcl-txt">${MERCHANT}<p class="vcl-title">${nb(v.title)}</p><p class="vc-exp">${v.expiry}</p></div>
        ${block ? '<span class="vcl-use">Dùng</span>' : `<span class="cb ${vcPick === v.id ? 'on' : ''}"></span>`}
      </div>
      ${block ? `<p class="vcl-why">${block}</p>` : ''}
    </div>`;
  screens.vouchers = () => {
    const sum = subtotal();
    if (vcPick === undefined) vcPick = appliedVoucher(sum) ? S.voucher : null;
    const ok = D.vouchers.filter((v) => !voucherBlock(v, sum));
    const na = D.vouchers.filter((v) => voucherBlock(v, sum));
    return `
    <div class="scr scr-vcl">
      <div class="appbar bordered"><button class="appbar-l" data-action="back" aria-label="Đóng">${icon('close-line')}</button><h1>Ưu đãi của bạn</h1></div>
      <div class="vcl-code"><div class="co-code"><span class="grow">Nhập mã khuyến mãi của bạn tại đây</span><i></i><a data-action="noop">Áp dụng</a></div></div>
      <div class="body">
        ${ok.map((v) => vcCard(v)).join('')}
        ${na.length ? `<h2 class="vcl-h">Voucher không khả dụng</h2>${na.map((v) => vcCard(v, voucherBlock(v, sum))).join('')}` : ''}
      </div>
      <div class="foot vcl-foot"><button class="btn-l" data-action="vc-apply" ${vcPick === (appliedVoucher(sum) ? S.voucher : null) ? 'disabled' : ''}>Áp dụng</button></div>
    </div>`;
  };

  // 7. "Đổi siêu thị" — mở từ nút "Đổi" ở Checkout (giao hàng & nhận tại siêu thị) và thanh siêu thị ở Home
  let storeQ = '';
  const storeRows = () => {
    const q = storeQ.trim().toLowerCase();
    const list = D.stores.filter((x) => !q || `${x.name} ${x.address}`.toLowerCase().includes(q));
    return list.length ? list.map((x) => `
      <div class="st-row" data-action="store-pick" data-id="${x.id}">
        <span class="radio ${store().id === x.id ? 'on' : ''}"></span>
        <div class="grow"><b>${x.name}, ${x.address}</b><small><span class="c-safe">Đang mở cửa</span> · Đóng lúc ${x.close} · Cách ${x.dist}</small></div>
      </div>`).join('') : '<p class="st-empty">Không tìm thấy siêu thị phù hợp</p>';
  };
  screens.stores = () => `
    <div class="scr scr-st">
      <div class="appbar bordered"><button class="appbar-l" data-action="back" aria-label="Đóng">${icon('close-line')}</button><h1>Đổi siêu thị</h1></div>
      <div class="st-search">${icon('search-line', 20, 'c-brand')}<input type="search" data-filter="stores" value="${storeQ}" placeholder="Tìm cửa hàng theo Tên hoặc Quận"></div>
      <div class="body" id="st-list">${storeRows()}</div>
    </div>`;

  // 8. Search — design OLA_Revision "search.focus.full"
  let searchQ = '';
  const searchBody = () => {
    const q = searchQ.trim().toLowerCase();
    if (q) {
      const hits = D.products.filter((p) => p.name.toLowerCase().includes(q));
      return hits.length
        ? `<h2 class="sr-h">Kết quả cho “${searchQ.trim()}”</h2><div class="sr-grid">${hits.map((p) => recCard(p, true)).join('')}</div>`
        : `<p class="sr-empty">Không tìm thấy sản phẩm cho “${searchQ.trim()}”</p>`;
    }
    const sw = D.search;
    return `
      <section class="sr-sec"><h2>Tìm kiếm gần đây</h2><div class="sr-chips">${sw.recent.map((t) => `<button data-action="search-chip" data-q="${t}">${t}</button>`).join('')}</div></section>
      <section class="sr-sec"><h2>Ngành hàng bạn hay mua</h2><div class="cates sr-cates">${D.categories.filter((c) => !c.reorder).map((c) => `
        <div class="cate" data-action="noop"><img src="${c.img}" width="48" height="48" alt=""><span>${c.label}</span></div>`).join('')}</div></section>
      <section class="rec sr-rec"><h2>Sản phẩm bạn đã xem</h2><div class="rec-list">${sw.viewedIds.map((id) => recCard(byId[id])).join('')}</div></section>
      <section class="rec sr-rec"><h2>Deal dành riêng cho bạn</h2><div class="rec-list">${D.dealIds.map((id) => recCard(byId[id])).join('')}</div></section>
      <section class="sr-sec sr-re"><h2>Đặt lại sản phẩm</h2><div class="sr-grid">${sw.reorderIds.map((id) => recCard(byId[id], true)).join('')}</div></section>`;
  };
  screens.search = () => {
    const n = cartCount();
    return `
    <div class="scr scr-sr">
      <div class="sr-top">
        <button class="sr-back" data-action="back" aria-label="Quay lại">${icon('arrow-left-s-line')}</button>
        <label class="sr-input">${icon('search-line', 20, 'c-brand')}<input type="search" data-filter="search" value="${searchQ}" placeholder="${D.search.placeholder}" autocomplete="off"></label>
        <button class="sr-cart ${S.cartTip && n ? 'cart-hint' : ''}" data-action="go" data-to="#/cart" aria-label="Giỏ hàng">${icon('shopping-cart-2-line', 22)}${n ? `<span class="badge">${n}</span>` : ''}</button>
      </div>
      <div class="body" id="sr-body">${searchBody()}</div>
    </div>`;
  };

  // ---------- coachmarks ----------
  const COACH_DIM = 'rgba(45, 55, 72, 0.6)';

  const checkoutSteps = () => {
    const c = D.copy.checkoutCoach;
    const next = [[c.next, 'coach-next']];
    return [
      { id: 'receive', targets: ['#co-s1', '#co-s2', '#co-slots'], title: c.receive.title,
        text: isShip() ? c.receive.shipText : c.receive.pickupText, buttons: next },
      { id: 'voucher', targets: ['#co-s4-top'], pointAt: '.vc-hint .vc-act', title: c.voucher.title, text: c.voucher.text, buttons: next },
      // chỉ khoanh tới hết "Thêm liên kết thẻ với VNPAY", không gồm ghi chú Tiền mặt
      { id: 'payment', targets: ['#co-s5 .pay-list'], title: c.payment.title, text: c.payment.text, buttons: next },
      { id: 'order', targets: ['#co-order-btn'], title: isShip() ? c.order.shipTitle : c.order.pickupTitle, above: true, noScroll: true, pad: 0, radius: '100px',
        buttons: [[c.review, 'coach-review'], [c.done, 'coach-done']] },
    ].filter((st) => st.id !== 'voucher' || D.vouchers.some((v) => !voucherBlock(v, subtotal())));
  };

  function unionRect(scr, sels) {
    const base = scr.getBoundingClientRect();
    const rs = sels.map((s) => scr.querySelector(s)).filter(Boolean).map((el) => el.getBoundingClientRect());
    if (!rs.length) return null;
    const top = Math.min(...rs.map((r) => r.top)), bottom = Math.max(...rs.map((r) => r.bottom));
    const left = Math.min(...rs.map((r) => r.left)), right = Math.max(...rs.map((r) => r.right));
    return { top: top - base.top, bottom: bottom - base.top, left: left - base.left, right: right - base.left, scrH: base.height, scrW: base.width };
  }

  // Không khoá cuộn: khách vẫn vuốt được; vùng sáng và tooltip bám theo phần tử khi cuộn.
  // Chạm ra vùng tối = "Tiếp tục" (xử lý trong click handler theo toạ độ vùng sáng).
  function showCoach(scr, step, idx, total) {
    const body = scr.querySelector('.body');
    const foot = scr.querySelector('.foot');
    const footH = foot && !step.above ? foot.offsetHeight : 0;
    if (!step.noScroll) {
      const first = scr.querySelector(step.targets[0]);
      body.scrollTop += first.getBoundingClientRect().top - body.getBoundingClientRect().top - 6;
      // còn thiếu chỗ cho tooltip phía dưới thì cuộn thêm
      const r0 = unionRect(scr, step.targets);
      const TT_H = step.text ? 132 : 108;
      const lack = r0.bottom + 8 + TT_H - (r0.scrH - footH - 8);
      if (lack > 0) body.scrollTop += lack;
    }
    const layer = document.createElement('div');
    layer.className = 'coach coach-step';
    layer.innerHTML = `
      <div class="coach-spot" style="box-shadow:0 0 0 2000px ${COACH_DIM}"></div>
      <div class="coach-tt ${step.above ? 'tip-br' : 'tip-tl'}">
        <p class="ct-title">${step.title}</p>
        ${step.text ? `<p class="ct-text">${step.text}</p>` : ''}
        <div class="ct-foot">
          <span class="ct-dots">${Array.from({ length: total }, (_, i) => `<i class="${i === idx ? 'on' : ''}"></i>`).join('')}</span>
          <span class="grow"></span>
          ${step.buttons.map(([label, act], i) => `<button class="${i || step.buttons.length === 1 ? 'ct-primary' : 'ct-ghost'}" data-action="${act}">${label}</button>`).join('')}
        </div>
      </div>`;
    scr.appendChild(layer);
    const spot = layer.querySelector('.coach-spot');
    const tt = layer.querySelector('.coach-tt');
    const base = scr.getBoundingClientRect();
    const bodyTop = body.getBoundingClientRect().top - base.top;
    const bodyBottom = body.getBoundingClientRect().bottom - base.top;
    const pad = step.pad ?? 4;   // 0 = vùng sáng khít đúng phần tử (vd. nút Đặt đơn bo tròn)
    if (step.radius) spot.style.borderRadius = step.radius;
    const place = () => {
      const r = unionRect(scr, step.targets);
      // phần bị cuộn khuất dưới thanh tiêu đề / footer thì cắt bớt
      const top = step.above ? r.top : Math.max(r.top + 6, bodyTop - 6);
      const bottom = step.above ? r.bottom : Math.min(r.bottom, bodyBottom);
      Object.assign(spot.style, { top: `${top}px`, left: `${r.left + pad}px`, width: `${r.right - r.left - pad * 2}px`, height: `${Math.max(bottom - top, 0)}px` });
      tt.style.top = step.above
        ? `${top - 8 - tt.offsetHeight}px`
        : `${Math.min(bottom + 8, r.scrH - footH - 8 - tt.offsetHeight)}px`;
      // mũi tên tooltip chỉ đúng vào phần tử cần bấm (vd. chữ "Dùng")
      const pt = step.pointAt && scr.querySelector(step.pointAt);
      if (pt) {
        const p = pt.getBoundingClientRect(), t = tt.getBoundingClientRect();
        tt.style.setProperty('--tip-x', `${p.left + p.width / 2 - t.left - 6}px`);
      }
    };
    place();
    body.addEventListener('scroll', () => requestAnimationFrame(place), { passive: true });
  }

  function showHomeTip(scr) {
    const body = scr.querySelector('.body');
    body.style.overflow = 'hidden';
    const r = unionRect(scr, ['#deal-tabs .dtab-0']);   // chỉ khoanh chip "Deals cho {tên}"
    const layer = document.createElement('div');
    layer.className = 'coach';
    layer.dataset.action = 'home-tip-dismiss';
    layer.innerHTML = `
      <div class="coach-spot" style="top:${r.top - 3}px;left:${r.left - 3}px;width:${r.right - r.left + 6}px;height:${r.bottom - r.top + 6}px;border-radius:18px;box-shadow:0 0 0 2000px ${COACH_DIM}"></div>
      <div class="coach-tt tip-bl"><p class="ct-title">${D.copy.homeTip.title}</p><p class="ct-text">${D.copy.homeTip.text}</p><div class="ct-foot"><span class="grow"></span><button class="ct-primary" data-action="home-tip-dismiss">${D.copy.homeTip.button}</button></div></div>`;
    scr.appendChild(layer);
    const tt = layer.querySelector('.coach-tt');
    tt.style.top = `${r.top - 11 - tt.offsetHeight}px`;
  }

  // nút "Xem lại hướng dẫn": thu nhỏ khi đang cuộn, nở lại khi dừng; tự ẩn khi hết thời gian
  let replayTimer = null;
  function initReplay(scr) {
    clearTimeout(replayTimer);
    const btn = scr.querySelector('.replay');
    if (!btn) return;
    replayTimer = setTimeout(() => { if (route().name === 'home') render(true); }, replayLeft() + 50);
    let idle = null;
    scr.querySelector('.body').addEventListener('scroll', (e) => {
      btn.classList.toggle('mini', e.target.scrollTop > 0);
      clearTimeout(idle);
      idle = setTimeout(() => btn.classList.remove('mini'), 700);
    }, { passive: true });
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, '') || 'welcome';
    const [name, arg] = h.split('/');
    return { name, arg };
  }

  let lastRoute = '';
  function render(keepScroll) {
    const { name, arg } = route();
    if (name === 'reset') { S = fresh(); save(); location.replace('#/welcome'); return; }
    const key = `${name}/${arg || ''}`;
    // tooltip "Đã thêm, bấm giỏ hàng để đặt" chỉ mất khi khách vào giỏ hoặc giỏ rỗng
    if (S.cartTip && (name === 'cart' || !cartCount())) { S.cartTip = false; save(); }
    const prevBody = app.querySelector('.body');
    const scrollTop = keepScroll && prevBody ? prevBody.scrollTop : 0;
    const scr = (screens[name] || screens.welcome)(arg);
    app.innerHTML = scr;
    const body = app.querySelector('.body');
    if (body) body.scrollTop = scrollTop;
    lastRoute = key;
    wlFootIn = cartCount() > 0;
    if (toast) { app.insertAdjacentHTML('beforeend', `<div class="toast">${toast}</div>`); toast = null; }
    const el = app.querySelector('.scr');
    if (name === 'home' && dealsJump) {
      dealsJump = false;
      const tabs = el.querySelector('#deal-tabs');
      const top = body.scrollTop + tabs.getBoundingClientRect().top - body.getBoundingClientRect().top - 8;
      body.scrollTo({ top, behavior: 'smooth' });
    }
    if (name === 'home' && !S.homeTipSeen) showHomeTip(el);
    if (name === 'home') initReplay(el);
    if (guide) bindGuide();
    if (name === 'search' && !keepScroll) el.querySelector('input').focus();
    if (name === 'checkout' && !S.coachDone && cartLines() && !guide) {
      const steps = checkoutSteps();
      coachStep = Math.min(coachStep, steps.length - 1);
      showCoach(el, steps[coachStep], coachStep, steps.length);
    }
  }

  // ---------- actions ----------
  // coachmark checkout: chạm ra vùng tối = "Tiếp tục"
  const coachAdvance = () => {
    if (coachStep + 1 >= checkoutSteps().length) { S.coachDone = true; save(); } else coachStep += 1;
  };

  const actions = {
    go: (d) => { location.hash = d.to; },
    back: () => { if (history.length > 1) history.back(); else location.hash = '#/home'; },
    pdp: (d) => { location.hash = `#/pdp/${d.id}`; },
    noop: () => {},
    add: (d) => { S.cart[d.id] = 1; if (['home', 'pdp', 'search'].includes(route().name)) S.cartTip = true; save(); render(true); },
    inc: (d) => { S.cart[d.id] = (S.cart[d.id] || 0) + 1; save(); render(true); },
    dec: (d) => { S.cart[d.id] = (S.cart[d.id] || 0) - 1; if (S.cart[d.id] <= 0) delete S.cart[d.id]; save(); render(true); },
    del: (d) => { delete S.cart[d.id]; save(); render(true); },
    deli: (d) => { S.deli = d.v; S.day = 0; save(); render(true); },
    slot: (d) => { S.slot = Number(d.i); save(); render(true); },
    day: (d) => { S.day = Number(d.i); save(); render(true); },
    'guide-open': () => { guide = { tab: 0, step: 0 }; render(true); },
    'guide-close': () => { guide = null; render(true); },
    'guide-tab': (d) => { guide = { tab: Number(d.i), step: 0 }; updateGuide(); },
    'guide-step': (d) => {
      const track = app.querySelector('.gd-track');
      const n = D.bankGuide[guide.tab].steps.length;
      const i = Math.max(0, Math.min(n - 1, guide.step + Number(d.d)));
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    },
    pay: (d) => { S.payment = d.id; save(); render(true); },
    points: () => { S.usePoints = !S.usePoints; save(); render(true); },
    'home-tip-dismiss': () => { S.homeTipSeen = true; save(); render(true); },
    'coach-next': () => { coachStep += 1; render(true); },
    // khách đã tự chọn xem deal → không cần coachmark "Deal của bạn ở đây" nữa
    'all-deals': () => { dealsJump = true; S.homeTipSeen = true; save(); location.hash = '#/home'; },
    // xem lại onboarding từ đầu, giữ nguyên giỏ hàng
    replay: () => { S.homeTipSeen = false; S.coachDone = false; coachStep = 0; save(); location.hash = '#/welcome'; },
    voucher: (d) => { S.voucher = S.voucher === d.id ? null : d.id; save(); render(true); },
    'vc-pick': (d) => { vcPick = vcPick === d.id ? null : d.id; render(true); },
    'vc-apply': () => { S.voucher = vcPick; save(); history.back(); },
    'store-pick': (d) => { S.storeId = d.id; save(); history.back(); },
    'search-chip': (d) => { searchQ = d.q; render(true); },
    'coach-review': () => { coachStep = 0; render(true); },
    'coach-done': () => { S.coachDone = true; save(); render(true); },
  };

  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    // coachmark Checkout: chạm ra vùng tối = "Tiếp tục"; chạm trong vùng sáng = thao tác thật, ở lại bước đó;
    // riêng nút "Đặt đơn" ở bước cuối thì kết thúc hướng dẫn
    const coach = app.querySelector('.coach-step');
    if (coach && !e.target.closest('.coach-tt')) {
      const sp = coach.querySelector('.coach-spot').getBoundingClientRect();
      const inside = e.clientX >= sp.left && e.clientX <= sp.right && e.clientY >= sp.top && e.clientY <= sp.bottom;
      if (!inside || e.target.closest('#co-order-btn')) { e.stopPropagation(); coachAdvance(); render(true); return; }
    }
    if (!el || !app.contains(el)) return;
    // nút bên trong thẻ sản phẩm không mở PDP
    e.stopPropagation();
    const fn = actions[el.dataset.action];
    if (fn) fn(el.dataset);
  });

  // Reset cho khách mới: ấn giữ 3s vào nút menu (góc trái header Home) hoặc avatar ở tab bar
  const HOLD_MS = 3000;
  let holdTimer = null, held = false;
  const holdEnd = () => { clearTimeout(holdTimer); holdTimer = null; };
  app.addEventListener('pointerdown', (e) => {
    held = false;
    if (!e.target.closest('[data-hold="reset"]')) return;
    holdEnd();
    holdTimer = setTimeout(() => {
      holdTimer = null; held = true;
      S = fresh(); save(); coachStep = 0; guide = null;
      toast = D.copy.resetToast;
      if (route().name === 'welcome') render(false); else location.hash = '#/welcome';
    }, HOLD_MS);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => app.addEventListener(t, holdEnd, true));
  // chặn click phát sinh ngay sau khi giữ, và menu ngữ cảnh khi giữ lâu trên mobile
  app.addEventListener('click', (e) => { if (held) { held = false; e.stopPropagation(); e.preventDefault(); } }, true);
  app.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-hold]')) e.preventDefault(); });

  // ô tìm kiếm: chỉ vẽ lại danh sách để không mất focus khi gõ
  app.addEventListener('input', (e) => {
    const f = e.target.dataset.filter;
    if (f === 'stores') { storeQ = e.target.value; app.querySelector('#st-list').innerHTML = storeRows(); }
    if (f === 'search') { searchQ = e.target.value; app.querySelector('#sr-body').innerHTML = searchBody(); }
  });

  window.addEventListener('hashchange', () => {
    const name = route().name;
    // mở "Ưu đãi của bạn" / "Đổi siêu thị" từ Checkout thì quay lại vẫn giữ bước coachmark
    if (!['checkout', 'vouchers', 'stores'].includes(name)) coachStep = 0;
    if (name !== 'vouchers') vcPick = undefined;
    if (name !== 'stores') storeQ = '';
    if (name !== 'search' && name !== 'pdp') searchQ = '';
    guide = null;
    render(false);
  });
  render(false);
})();
