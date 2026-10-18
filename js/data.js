// Toàn bộ data của prototype nằm ở file này — sửa text / giá / store tại đây.
window.DATA = {
  user: {
    name: 'anh Triều',           // Home: "Deals cho anh Triều"
    fullName: 'Anh Triều',       // Thẻ thành viên ở Home
    memberSince: '08/2022',
    points: '200.000',
    pointsValue: '~200.000 đ',
    olCardBalance: '77.000 đ',
    voucherCount: 8,
    // 'new' | 'churned' (lâu không mua online) | 'active' — nút "Xem lại hướng dẫn" chỉ hiện cho new / churned
    segment: 'new',
  },

  // Nút "Xem lại hướng dẫn" ở Home: chỉ hiện trong N phút kể từ lúc khách tích điểm / đặt đơn offline ở POS
  // (prototype tính từ lúc mở màn đầu tiên hoặc lần reset gần nhất)
  replayMinutes: 15,

  // Danh sách siêu thị ("Đổi siêu thị"). Siêu thị đầu tiên là mặc định;
  // siêu thị đang chọn dùng chung cho Home, Checkout (giao hàng & nhận tại siêu thị) và coachmark
  stores: [
    { id: 'era', name: 'Kingfoodmart - Chung cư Era Town', address: 'Tầng trệt B4, Phường Tân Mỹ, Thành phố Hồ Chí Minh', dist: '0.3km', close: '22:00' },
    { id: 'riviera', name: 'Kingfoodmart - A-14-15-16-17 The Infinity, Chung cư Riviera Point', address: 'Phường Tân Mỹ, Thành phố Hồ Chí Minh', dist: '0.5km', close: '22:00' },
    { id: 'scenic', name: 'Kingfoodmart - Chung cư Scenic Valley 2, Block B', address: 'Phường Tân Mỹ, Thành phố Hồ Chí Minh', dist: '0.7km', close: '22:00' },
    { id: 'golden', name: 'Kingfoodmart - Chung cư The Golden Star, B01.01', address: 'Phường Tân Thuận, Thành phố Hồ Chí Minh', dist: '0.8km', close: '22:00' },
    { id: 'tanmy31', name: 'Kingfoodmart - 31 Tân Mỹ', address: 'Phường Tân Mỹ, Thành phố Hồ Chí Minh', dist: '0.9km', close: '22:00' },
    { id: 'midtown', name: 'Kingfoodmart - 17 Đường 16 - Midtown Phú Mỹ Hưng', address: 'Phường Tân Mỹ, Thành phố Hồ Chí Minh', dist: '1.0km', close: '22:00' },
  ],

  // Checkout > Giao hàng (data mẫu)
  delivery: {
    receiver: 'Anh Triều',
    address: '67 đường Hoàng Văn Thái, Phường Tân Mỹ, Thành phố Hồ Chí Minh',
    days: ['Hôm nay', 'Ngày mai'],
    slots: ['15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00'],
    fee: 20000,
  },

  pickup: {
    days: ['Ngày mai', 'Thứ 2, 19/10'],
    slots: ['16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'],
    selectedSlot: 1,
  },

  // 4 deal online ở Welcome screen + Home
  dealIds: ['cha-lua', 'chabaa', 'gao', 'cha-ca'],

  // Giỏ hàng > "Thường được mua kèm" (data mẫu)
  recommendIds: ['tao-cherry', 'rau-mui', 'cai-ngot'],

  products: [
    { id: 'cha-lua', name: 'Combo Chả lụa ớt xiêm xanh', img: 'assets/img/cha-lua.webp', price: 105000, oldPrice: 152000, discount: 39, stockLeft: 12, sold: 955, stock: 1000 },
    { id: 'chabaa', name: 'Combo 2 chai nước ép Chabaa vị Nho', img: 'assets/img/chabaa.webp', price: 98000, oldPrice: 112000, discount: 32, stockLeft: 20, sold: 820, stock: 1000 },
    { id: 'gao', name: 'Combo Gạo ST 25 Neptune 5kg', img: 'assets/img/gao.webp', price: 258000, oldPrice: 322000, discount: 29, stockLeft: 8, sold: 640, stock: 1000 },
    { id: 'cha-ca', name: 'Combo 2 gói Chả cá phô mai EB', img: 'assets/img/cha-ca.webp', price: 158000, oldPrice: 212000, discount: 25, stockLeft: 15, sold: 712, stock: 1000 },
    { id: 'tao-cherry', name: 'Táo cherry hộp 500g', img: 'assets/img/rec-tao-cherry.webp', price: 49000, oldPrice: 79000, discount: 38, stockLeft: 30, sold: 430, stock: 1000 },
    { id: 'rau-mui', name: 'Rau mùi 100g', img: 'assets/img/rec-rau-mui.webp', price: 9000, oldPrice: 12000, discount: 25, stockLeft: 40, sold: 610, stock: 1000 },
    { id: 'cai-ngot', name: 'Cải ngọt 300g', img: 'assets/img/rec-cai.webp', price: 15000, oldPrice: 19000, discount: 21, stockLeft: 25, sold: 520, stock: 1000 },
  ],

  // Giỏ hàng
  cartPromo: 'Đơn 100k, mua sản phẩm với giá tốt',
  cartNoti: {
    img: 'assets/img/noti-voucher-hot.webp',
    title: 'Quá nhiều mã giảm giá bạn ơi 🎉',
    text: 'Bộ voucher giới hạn đã có sẵn trong ví. Thêm ưu đãi tới 30% nhiều món dành riêng cho bạn',
    cta: 'Dùng Ngay',
  },

  // Thứ tự hiển thị ở Home (tab "Deals cho anh Triều")
  homeDeals: ['chabaa', 'gao', 'cha-ca', 'cha-lua'],

  categories: [
    { label: 'Đặt lại sản phẩm', img: 'assets/img/cate-history.webp', active: true, reorder: true },
    { label: 'Tết tưng bừng', img: 'assets/img/cate-tet.webp' },
    { label: 'Thế giới trái cây', img: 'assets/img/cate-fruit.webp' },
    { label: 'Rau, củ, quả', img: 'assets/img/cate-veg.webp' },
    { label: 'Thịt, cá, trứng, sữa', img: 'assets/img/cate-meat-partial.webp', partial: true },
  ],

  dealTabs: ['⭐️ Deals cho anh Triều', 'Khuyến mãi HOT', 'Rau sạch', 'Giá tốt', 'Mua là tặng'],

  // Checkout > Chọn khuyến mãi / "Ưu đãi của bạn" — dùng 1 voucher mỗi đơn
  //   off: giảm cố định (đ) · pct + max: giảm % tối đa · min: giá trị đơn tối thiểu
  //   ship: giảm phí giao hàng (chỉ dùng khi chọn Giao hàng)
  //   productIds: chỉ áp dụng khi giỏ có 1 trong các sản phẩm này
  vouchers: [
    { id: 'new12', kind: 'percent', imgTitle: 'PHIẾU GIẢM GIÁ %', title: 'Giảm 12% tối đa 50.000 đ', cond: 'Cho đơn từ 100.000 đ', expiry: 'Dùng ngày: 31/10/2026', pct: 12, max: 50000, min: 100000 },
    { id: 'new20k', kind: 'cash', imgTitle: 'PHIẾU GIẢM GIÁ TIỀN MẶT', title: 'Giảm 20.000 đ', cond: 'Đơn bất kỳ', expiry: 'Dùng ngày: 31/10/2026', off: 20000, min: 0, qty: 2 },
    { id: 'p7', kind: 'percent', imgTitle: 'PHIẾU GIẢM GIÁ', title: 'Giảm 7% tối đa 20k cho đơn 200k', cond: 'Cho đơn từ 200.000 đ', expiry: 'Dùng ngày: 18/10/2026', pct: 7, max: 20000, min: 200000 },
    { id: 'ship', kind: 'ship', imgTitle: 'MIỄN PHÍ VẬN CHUYỂN', imgSub: 'Đơn từ 500k', title: 'Giảm 20.000 đ phí vận chuyển', cond: 'Cho đơn từ 500.000 đ', expiry: 'Dùng ngày: 31/10/2026', ship: true, off: 20000, min: 500000 },
    { id: 'c35', kind: 'cash', imgTitle: 'VOUCHER CUỐI TUẦN', title: 'Giảm 35k cho đơn 600k', cond: 'Cho đơn từ 600.000 đ', expiry: 'Dùng ngày: 18/10/2026', off: 35000, min: 600000 },
    { id: 'chinsu', kind: 'percent', imgTitle: 'VOUCHER GIẢM 20%', title: 'Giảm 20% tối đa 20K cho đơn Chinsu 88k', cond: 'Đơn có sản phẩm Chinsu', expiry: 'Dùng ngày: 21/10/2026', pct: 20, max: 20000, min: 88000, productIds: ['chinsu'] },
    { id: 'c12', kind: 'cash', imgTitle: 'PHIẾU GIẢM GIÁ', title: 'Giảm 12k cho đơn 330k', cond: 'Cho đơn từ 330.000 đ', expiry: 'Dùng ngày: 22/10/2026', off: 12000, min: 330000 },
  ],

  // Trang Search (thiết kế OLA_Revision — search.focus.full)
  search: {
    placeholder: 'Tìm sản phẩm',
    recent: ['Chả lụa', 'Gạo ST25', 'Nước ép nho'],
    viewedIds: ['tao-cherry', 'cai-ngot', 'rau-mui', 'chabaa'],
    reorderIds: ['cha-lua', 'gao', 'cha-ca', 'chabaa', 'tao-cherry', 'rau-mui'],
  },

  // guide: true → hiện mô tả + link "Xem hướng dẫn" mở bottom sheet hướng dẫn chuyển khoản
  payments: [
    { id: 'olcard', label: 'Thẻ OneLife', sub: 'Số dư: 20.000 đ', img: 'assets/img/pay-olcard.webp' },
    { id: 'cash', label: 'Tiền mặt', img: 'assets/img/pay-cash.webp' },
    { id: 'bank', label: 'Chuyển khoản ngân hàng', sub: 'Chụp lại mã QR hoặc nhấn vào logo ngân hàng để thanh toán.', guide: true, img: 'assets/img/pay-vnpay.webp' },
    { id: 'onepay', label: 'Thẻ Visa / Master / JCB / ATM / Chuyển khoản', img: 'assets/img/pay-onepay.webp' },
    { id: 'applepay', label: 'Apple Pay', img: 'assets/img/pay-applepay.webp' },
    { id: 'momo', label: 'Ví MoMo', img: 'assets/img/pay-momo.webp' },
  ],
  // Ô "Thêm liên kết thẻ" dưới danh sách phương thức thanh toán
  payAdd: {
    label: 'Thêm liên kết thẻ với VNPAY',
    desc: 'Chọn để thêm Thẻ ATM hoặc Thẻ quốc tế (VISA, MASTER CARD) với VNPAY',
  },
  paymentNotes: [
    'Không áp dụng Tiền mặt cho đơn trên 2 triệu',
    'Không áp dụng Tiền mặt cho đơn có sản phẩm Bia Rượu, Nước có cồn',
  ],

  // Bottom sheet "Hướng dẫn Chuyển khoản ngân hàng"
  bankGuide: [
    { tab: 'Chụp lại mã QR', steps: [
      { img: 'assets/img/guide-qr1.webp', text: 'Chụp lại ảnh màn hình có mã QR bằng điện thoại của bạn' },
      { img: 'assets/img/guide-qr2.webp', text: 'Đăng nhập ứng dụng hỗ trợ thanh toán ngân hàng, chọn chức năng Mã QR' },
      { img: 'assets/img/guide-qr3.webp', text: 'Tải lên ảnh QR bạn vừa chụp' },
      { img: 'assets/img/guide-qr4.webp', text: 'Kiểm tra thông tin đơn hàng để tiếp tục' },
      { img: 'assets/img/guide-qr5.webp', text: 'Xác nhận thanh toán & hoàn tất giao dịch' },
    ] },
    { tab: 'Ứng dụng ngân hàng', steps: [
      { img: 'assets/img/guide-app1.webp', text: 'Cuộn xuống dưới, nhấn vào logo của ứng dụng hỗ trợ thanh toán QR trong danh sách' },
      { img: 'assets/img/guide-app2.webp', text: 'Đồng ý mở ứng dụng hỗ trợ thanh toán QR theo yêu cầu thông báo trên màn hình' },
      { img: 'assets/img/guide-app3.webp', text: 'Xác nhận thanh toán & hoàn tất giao dịch' },
    ] },
  ],
};
