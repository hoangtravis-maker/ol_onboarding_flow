# OL · Onboarding flow — new online user

Prototype web cho flow onboarding của **user mới mua đơn online trên App OneLife ngay sau khi tích điểm ở máy POS**. Đơn nhận luôn tại quầy (Tự đến nhận).

Design: [Figma · OL_Flow_Onboarding-new-online-user](https://www.figma.com/design/4S3G36yn05tG1DcOW47gef/OL_Flow_Onboarding-new-online-user)

## Chạy thử

Prototype là trang tĩnh (HTML/CSS/JS thuần), không cần cài đặt hay build.

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

- Trên điện thoại: giao diện hiển thị full màn hình.
- Trên máy tính: hiển thị trong khung điện thoại 375×812.
- **Reset để test với khách mới:** mở `#reset` (ví dụ `http://localhost:8000/#reset`). Lệnh này xóa giỏ hàng và cho các tooltip/coachmark hiện lại từ đầu. Ngay trên prototype: **ấn giữ 3 giây** vào nút menu (góc trái header Home) hoặc avatar ở tab bar, có thông báo "Đã làm mới, sẵn sàng cho khách mới" và quay về màn đầu.
- Trạng thái (giỏ hàng, đã xem tooltip…) lưu trong `sessionStorage`, nên F5 không mất. Đóng tab là reset.

## Flow

| # | Màn | Route | Onboarding |
|---|-----|-------|------------|
| 1 | Welcome: "Bạn đã tích điểm thành công" + 4 Deal online | `#/welcome` | Bấm **Mua**: nút đổi thành stepper, footer hiện "Đặt deal online, nhận ngay tại siêu thị…" và nút **Tiếp tục đặt hàng · N món** |
| 2 | Home | `#/home` | Lần đầu vào: overlay + tooltip **"Deal của bạn ở đây"** trỏ vào tab Deals (chạm để tắt). Bấm Mua: tooltip **"Đã thêm, bấm giỏ hàng để đặt"** trỏ vào tab Giỏ hàng. Nút nổi **"↺ Xem lại hướng dẫn"** góc trái trên tab bar (thu nhỏ khi cuộn): chỉ hiện cho khách `segment` new / churned trong `replayMinutes` (15) phút kể từ lúc tích điểm ở POS (prototype tính từ lần mở đầu / reset); bấm vào chạy lại onboarding, giữ nguyên giỏ |
| 3 | Chi tiết sản phẩm | `#/pdp/<id>` | Bấm Mua: nút đổi thành stepper, tooltip **"Đã thêm, bấm giỏ hàng để đặt"** dưới icon giỏ ở header |
| 4 | Giỏ hàng | `#/cart` | Tooltip **"Bấm mua hàng để đặt đơn"** trên nút Mua hàng. Có in-page noti voucher và "Thường được mua kèm" (bấm Mua để thêm vào giỏ) |
| 5 | Thanh toán | `#/checkout` | Coachmark 4 bước: Cách bạn nhận hàng → Áp dụng khuyến mãi → Kiểm tra cách thanh toán → Đặt đơn là xong (Bỏ qua / Tiếp tục / Xem lại / Đã hiểu). Bấm ra vùng tối = Tiếp tục; bấm thao tác trong vùng sáng (chọn slot, Dùng voucher, chọn thanh toán, Xem hướng dẫn, Đặt đơn) thì thực hiện luôn và sang bước sau. Voucher: dùng 1 voucher giảm hóa đơn/đơn, tổng tiền cập nhật theo; voucher chưa đủ điều kiện hiện mờ kèm lý do. Option "Chuyển khoản ngân hàng" có link **Xem hướng dẫn** mở bottom sheet 2 tab (Chụp lại mã QR / Ứng dụng ngân hàng) |

Vào chi tiết sản phẩm bằng cách bấm vào ảnh hoặc tên sản phẩm ở Welcome / Home.

## Sửa data

Toàn bộ text, giá, store, slot nhận hàng, voucher và phương thức thanh toán nằm trong **`js/data.js`**.

## Cấu trúc

```
index.html        # khung trang + icon sprite (Remix Icon) inline
css/styles.css    # toàn bộ style, token màu lấy từ Figma
js/data.js        # data
js/app.js         # router (hash), state, render màn hình, tooltip & coachmark
assets/img/       # ảnh xuất từ Figma (webp)
assets/fonts/     # Inter (latin + vietnamese) self-host
```

## Những chỗ để trống (chưa có behavior)

Các phần này bấm vào không có tác dụng, để anh bổ sung sau:

- **Đặt đơn** ở màn Thanh toán (chưa có màn đặt đơn thành công)
- Search, menu, thông báo, voucher ở header Home; tab Khuyến mãi, QR, Tài khoản
- Banner Thịt bò Úc, "Mua ngay" Kiwi, danh mục, các tab deal khác
- Các nút "Đổi" (siêu thị), "Xem tất cả", "Áp dụng" mã khuyến mãi, "Thêm liên kết thẻ với VNPAY"
- "Dùng Voucher", "Xóa (n)", banner "Đơn 100k…", nút "Dùng Ngay" ở giỏ hàng; chia sẻ, chính sách ở PDP
- Toggle Giao hàng / Nhận tại siêu thị, chọn ngày và slot giờ, chọn phương thức thanh toán, switch dùng điểm: chỉ đổi trạng thái hiển thị

## Ghi chú so với design

- Ảnh sản phẩm lấy từ ảnh gốc trong Figma (604px). Các asset khác xuất ở 2x.
- Màn PDP trong design là template (sữa DeliFres + Yakult). Prototype dùng layout đó nhưng hiển thị ảnh, giá, tên của đúng deal được bấm.
- Giỏ hàng và Thanh toán hiển thị đúng các món user đã thêm. Các block mẫu trong design như "5 món tạm thời hết hàng", Mua chung… được lược bỏ vì không áp dụng cho user mới.
- Siêu thị nhận hàng dùng chung một nguồn (`store` trong `js/data.js`) cho Home, Thanh toán và coachmark.
- Sản phẩm "Thường được mua kèm" (tên, giá) là data mẫu, ảnh lấy từ ảnh chụp app.
- Tổng tiền, tiết kiệm và điểm dự kiến được tính từ giỏ hàng thật, trừ đúng voucher khách đang áp dụng (không có khuyến mãi mặc định).
- Không vẽ status bar giả (9:41…), vì prototype chạy trên trình duyệt điện thoại thật.

## Host để test với khách

Repo đang **private**. GitHub Pages với repo private cần gói GitHub trả phí. Các cách nhanh:

- **Netlify Drop** (https://app.netlify.com/drop): kéo thả cả thư mục repo vào là có link ngay.
- **Vercel / Cloudflare Pages**: import repo GitHub, không cần cấu hình build (output là thư mục gốc).
- Nếu chuyển repo sang public: merge PR vào `main`, rồi vào Settings → Pages → Source: *Deploy from a branch* → Branch `main`, thư mục `/ (root)` → Save. Sau 1–2 phút link sẽ có dạng `https://hoangtravis-maker.github.io/ol_onboarding_flow/`.
