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
    receiverName: 'Hiến',        // Checkout: "Giao đến Hiến" (theo design)
    address: 'Vinhomes, phường a, Quận 9, TP.HCM',
  },

  store: {
    home: 'KFM - Huỳnh Tấn Phát, Quận 7, TP. HCM',                // Home > deliMethod
    pickup: 'Kingfoodmart - 375 Nguyễn Thị Thập, Quận 7',          // Checkout > Siêu thị phục vụ bạn
    pickupShort: 'KFM 375 Nguyễn Thị Thập',                         // Coachmark checkout bước 1
  },

  pickup: {
    day: 'Ngày mai',
    slots: ['12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'],
    selectedSlot: 1,
  },

  // 4 deal online ở Welcome screen + Home
  products: [
    { id: 'cha-lua', name: 'Combo Chả lụa ớt xiêm xanh', img: 'assets/img/cha-lua.webp', price: 105000, oldPrice: 152000, discount: 39, stockLeft: 12, sold: 955, stock: 1000 },
    { id: 'chabaa', name: 'Combo 2 chai nước ép Chabaa vị Nho', img: 'assets/img/chabaa.webp', price: 98000, oldPrice: 112000, discount: 32, stockLeft: 20, sold: 820, stock: 1000 },
    { id: 'gao', name: 'Combo Gạo ST 25 Neptune 5kg', img: 'assets/img/gao.webp', price: 258000, oldPrice: 322000, discount: 29, stockLeft: 8, sold: 640, stock: 1000 },
    { id: 'cha-ca', name: 'Combo 2 gói Chả cá phô mai EB', img: 'assets/img/cha-ca.webp', price: 158000, oldPrice: 212000, discount: 25, stockLeft: 15, sold: 712, stock: 1000 },
  ],

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

  payments: [
    { id: 'olcard', label: 'Thẻ OneLife', sub: 'Số dư: 20.000 đ', img: 'assets/img/pay-olcard.webp' },
    { id: 'cash', label: 'Tiền mặt', img: 'assets/img/pay-cash.webp' },
    { id: 'momo', label: 'Ví MoMo', img: 'assets/img/pay-momo.webp' },
    { id: 'vnpay', label: 'VNPAY', img: 'assets/img/pay-vnpay.webp' },
  ],
};
