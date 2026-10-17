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
  },

  // Siêu thị nhận hàng — dùng chung cho Home, Checkout và coachmark
  store: {
    name: 'Kingfoodmart - Chung cư Era Town',
    address: 'Tầng trệt B4, Phường Tân Mỹ, Thành phố Hồ Chí Minh',
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
    { label: 'Đặt lại sản phẩm', img: 'assets/img/cate-history.webp', active: true },
    { label: 'Tết tưng bừng', img: 'assets/img/cate-tet.webp' },
    { label: 'Thế giới trái cây', img: 'assets/img/cate-fruit.webp' },
    { label: 'Rau, củ, quả', img: 'assets/img/cate-veg.webp' },
    { label: 'Thịt, cá, trứng, sữa', img: 'assets/img/cate-meat-partial.webp', partial: true },
  ],

  dealTabs: ['⭐️ Deals cho anh Triều', 'Khuyến mãi HOT', 'Rau sạch', 'Giá tốt', 'Mua là tặng'],

  // Checkout > Chọn khuyến mãi
  vouchers: [
    { kind: 'cash', imgTitle: 'PHIẾU GIẢM GIÁ TIỀN MẶT', title: 'Giảm 20.000 đ phí vận chuyển', cond: 'Đơn bất kỳ', expiry: 'Hạn dùng: 17/08/2023', applied: true },
    { kind: 'ship', imgTitle: 'MIỄN PHÍ VẬN CHUYỂN', imgSub: 'Đơn từ 500k', title: 'Giảm 20.000 đ phí vận chuyển', cond: 'Đơn bất kỳ', expiry: 'Hạn dùng: 17/08/2023', qty: 2 },
    { kind: 'percent', imgTitle: 'PHIẾU GIẢM GIÁ %', title: 'Giảm 10% tối đa 50.000 đ', cond: 'Cho đơn từ 200.000 đ', expiry: 'Hạn dùng: 17/08/2023', qty: 2 },
  ],

  // Khuyến mãi áp dụng trong "Kiểm tra thông tin hóa đơn"
  orderDiscounts: [
    { label: 'OneLife Club · Phiếu giảm giá 25k', amount: 25000, club: true },
  ],

  // guide: true → hiện mô tả + link "Xem hướng dẫn" mở bottom sheet hướng dẫn chuyển khoản
  payments: [
    { id: 'olcard', label: 'Thẻ OneLife', sub: 'Số dư: 20.000 đ', img: 'assets/img/pay-olcard.webp' },
    { id: 'cash', label: 'Tiền mặt', img: 'assets/img/pay-cash.webp' },
    { id: 'bank', label: 'Chuyển khoản ngân hàng', sub: 'Chụp lại mã QR hoặc nhấn vào logo ngân hàng để thanh toán.', guide: true, img: 'assets/img/pay-vnpay.webp' },
    { id: 'onepay', label: 'Thẻ Visa / Master / JCB / ATM / Chuyển khoản', img: 'assets/img/pay-onepay.webp' },
    { id: 'applepay', label: 'Apple Pay', img: 'assets/img/pay-applepay.webp' },
    { id: 'momo', label: 'Ví MoMo', img: 'assets/img/pay-momo.webp' },
  ],
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
