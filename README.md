# OL · Prototype App OneLife

Prototype web của App OneLife, dùng để làm usability testing trước khi làm tính năng. Hiện có:

- **Flow onboarding** cho user mới mua đơn online ngay sau khi tích điểm ở máy POS, nhận đơn tại siêu thị.
- Các màn dùng chung của app: **Search**, **Ưu đãi của bạn**, **Đổi siêu thị**, Checkout ở cả 2 chế độ **Giao hàng** và **Nhận tại siêu thị**.

Design:
- [Figma · OL_Flow_Onboarding-new-online-user](https://www.figma.com/design/4S3G36yn05tG1DcOW47gef/OL_Flow_Onboarding-new-online-user)
- [Figma · OLA_Revision — Search](https://www.figma.com/design/XGolY83Pfu6cbVrlPqPw8g/OLA_Revision_Product-display--home--search-result--cate--product-detail-?node-id=17-16852)

## Chạy thử

Prototype là trang tĩnh (HTML/CSS/JS thuần), không cần cài đặt hay build.

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

- Trên điện thoại: giao diện hiển thị full màn hình.
- Trên máy tính: hiển thị trong khung điện thoại 375×812.
- Trạng thái (giỏ hàng, voucher, siêu thị đã chọn, đã xem tooltip…) lưu trong `sessionStorage`, nên F5 không mất. Đóng tab là reset.

### Reset giữa các khách

- **Ấn giữ 3 giây** vào nút menu (góc trái header Home) hoặc avatar ở tab bar. App hiện thông báo "Đã làm mới, sẵn sàng cho khách mới" và quay về màn đầu.
- Hoặc mở `#reset` (ví dụ `http://localhost:8000/#reset`).

Reset xóa giỏ hàng, voucher, siêu thị đã chọn và cho mọi tooltip/coachmark hiện lại từ đầu.

## Màn hình và tương tác

### 1. Welcome — `#/welcome`
"Bạn đã tích điểm thành công" + 4 Deal online.
- Nút **Mua** của deal đầu tiên có motion theo design (Figma `anim.btn.buy.type=pDeal`): 2 vòng sáng lan ra, dấu "+" trên icon giỏ nảy lên và xoay. Tất cả nút Mua dùng icon giỏ có dấu "+".
- Bấm **Mua**: nút đổi thành stepper. Footer hiện "Đặt deal online, nhận ngay tại siêu thị…" và nút **Tiếp tục đặt hàng · N món** (sang Giỏ hàng, có motion `anim.btn.cart`). Màn hình không bị làm tối.
- Bấm ảnh / tên sản phẩm: sang Chi tiết sản phẩm. Nút ✕: sang Home.

### 2. Home — `#/home`
- Lần đầu vào: overlay + tooltip **"Deal của bạn ở đây"** trỏ vào tab Deals. Bấm **Đã hiểu** hoặc chạm bất kỳ đâu để tắt.
- Nút **Mua** của deal đầu tiên có motion giống Welcome.
- Bấm **Mua** (Home, Search, chi tiết sản phẩm): tooltip **"Đã thêm, bấm giỏ hàng để đặt"** trỏ vào giỏ hàng. Tooltip không tự tắt, chỉ mất khi khách vào giỏ hoặc giỏ rỗng. Bấm vào tooltip = sang giỏ hàng.
- Thanh **tìm kiếm**: sang Search.
- Thanh **"tại <siêu thị>"**: sang Đổi siêu thị.
- Tab **Giỏ hàng**: sang Giỏ hàng.
- Nút nổi **"↺ Xem lại hướng dẫn"** (góc trái, trên tab bar; thu nhỏ khi cuộn):
  - Chỉ hiện cho khách `segment` là `new` / `churned`, trong `replayMinutes` (15) phút kể từ lúc tích điểm ở POS. Prototype tính mốc này từ lần mở đầu tiên hoặc lần reset gần nhất.
  - Bấm vào thì chạy lại onboarding từ màn Welcome, giữ nguyên giỏ hàng.

### 3. Chi tiết sản phẩm — `#/pdp/<id>`
- Bấm **Mua**: nút đổi thành stepper, tooltip **"Đã thêm, bấm giỏ hàng để đặt"** dưới icon giỏ ở header (cùng hành vi với Home).

### 4. Giỏ hàng — `#/cart`
- Tooltip **"Bấm mua hàng để đặt đơn"** phía trên footer, mũi tên chỉ xuống nút. Bấm vào tooltip = sang Thanh toán.
- Nút **Mua hàng** có motion theo design (Figma `anim.btn.cart`).
- In-page noti voucher và "Thường được mua kèm" (bấm Mua để thêm vào giỏ).
- Dòng "Dùng Voucher" hiện số voucher đang áp dụng.
- Stepper +/–, xoá món: cập nhật giỏ và tổng tiền.

### 5. Thanh toán — `#/checkout`
**Phương thức giao** (bấm để đổi):

| | Nhận tại siêu thị | Giao hàng |
|---|---|---|
| Mục 2 | "Chọn nơi nhận": siêu thị + **Đổi** | "Chọn địa chỉ giao": người nhận + địa chỉ (**Đổi** chưa có behavior); khung "Siêu thị phục vụ bạn" + **Đổi** |
| Mục 3 | "Chọn giờ nhận": Ngày mai / Thứ 2… | "Chọn giờ giao": Hôm nay / Ngày mai |
| Hóa đơn | Không có phí giao | Thêm dòng "Phí vận chuyển"; nếu áp voucher giảm phí vận chuyển thì "Tổng khuyến mãi" có dòng "Giảm giá phí vận chuyển" |

- Mặc định chọn sẵn ngày đầu tiên và khung giờ gần nhất (`pickup.selectedSlot` trong data).
- **Đổi** siêu thị (cả 2 chế độ): sang Đổi siêu thị.
- **Chọn khuyến mãi**: chỉ hiện voucher dùng được cho đơn hiện tại (tối đa 4). **Dùng / Gỡ** áp dụng ngay. **Xem tất cả**: sang Ưu đãi của bạn (có cả voucher không khả dụng).
- Mỗi đơn dùng 1 voucher. Tổng tiền và "Tiết kiệm" chỉ trừ voucher đang áp dụng.
- Chọn phương thức thanh toán. "Chuyển khoản ngân hàng" có link **Xem hướng dẫn**, mở bottom sheet 2 tab (Chụp lại mã QR / Ứng dụng ngân hàng).
- **Coachmark 4 bước** (lần đầu vào): Cách bạn nhận hàng → Áp dụng khuyến mãi → Kiểm tra phương thức thanh toán → Đặt đơn là xong.
  - Nút: Bỏ qua / Tiếp tục / Xem lại / Đã hiểu.
  - Bấm ra vùng tối = Tiếp tục (bước cuối = Đã hiểu).
  - Bấm thao tác trong vùng sáng (chọn ngày/slot, Đổi siêu thị, Dùng voucher, Xem tất cả, chọn thanh toán, Xem hướng dẫn) thì thao tác có tác dụng nhưng **vẫn ở bước đó**. Riêng **Đặt đơn** ở bước cuối thì kết thúc hướng dẫn. Mở Đổi siêu thị / Ưu đãi của bạn rồi quay lại vẫn giữ bước coachmark.
  - Bước thanh toán chỉ có tiêu đề "Kiểm tra phương thức thanh toán". Tooltip luôn nằm dưới vùng sáng, không che danh sách.
  - Text bước 1 đổi theo chế độ: "Đơn này nhận tại siêu thị …" hoặc "Đơn này giao đến …", kèm khung giờ đang chọn.

### 6. Ưu đãi của bạn — `#/vouchers`
Mở từ **Xem tất cả** ở Thanh toán.
- Danh sách voucher khả dụng có ô tick (chọn 1). Bấm lại để bỏ chọn.
- Mục **"Voucher không khả dụng"**: hiện mờ, kèm lý do: "Mua thêm Xđ để sử dụng được voucher", "Đơn hàng chưa có sản phẩm thuộc chương trình ưu đãi", "Không áp dụng cho đơn nhận tại siêu thị".
- Nút **Áp dụng** (sáng lên khi lựa chọn khác với hiện tại): áp voucher đã chọn và quay về Thanh toán. Nút ✕: quay lại, không đổi gì.

### 7. Đổi siêu thị — `#/stores`
Mở từ **Đổi** ở Thanh toán (cả Giao hàng và Nhận tại siêu thị) và thanh siêu thị ở Home.
- Ô tìm kiếm lọc theo tên / địa chỉ.
- Bấm một siêu thị: chọn và quay lại. Siêu thị mới được dùng ở Home, Thanh toán và coachmark.

### 8. Search — `#/search`
Mở từ thanh tìm kiếm ở Home. Theo design OLA_Revision (bản cho user đã đăng nhập).
- Khi chưa gõ: Tìm kiếm gần đây (chip) → Ngành hàng bạn hay mua → Sản phẩm bạn đã xem → Deal dành riêng cho bạn → Đặt lại sản phẩm.
- "Đặt lại sản phẩm" và kết quả tìm kiếm dùng product card thường 2 cột; 2 mục trượt ngang dùng card nhỏ.
- Bấm chip gần đây hoặc gõ từ khoá: hiện kết quả lọc theo tên sản phẩm, hoặc thông báo không tìm thấy.
- Bấm **Mua** trên mọi card: thêm vào giỏ. Bấm ảnh / tên: sang Chi tiết sản phẩm. Icon giỏ: sang Giỏ hàng.

## Sửa data

Toàn bộ text, giá, sản phẩm, siêu thị, địa chỉ giao, khung giờ, voucher, phương thức thanh toán và nội dung Search nằm trong **`js/data.js`**:

| Key | Dùng cho |
|---|---|
| `user` | Tên, điểm, `segment` (new / churned / active) |
| `replayMinutes` | Thời gian hiện nút "Xem lại hướng dẫn" |
| `stores` | Danh sách siêu thị (cái đầu tiên là mặc định) |
| `delivery` | Người nhận, địa chỉ, ngày/khung giờ giao, phí giao |
| `pickup` | Ngày/khung giờ nhận tại siêu thị |
| `products`, `dealIds`, `homeDeals`, `recommendIds` | Sản phẩm và nơi hiển thị |
| `vouchers` | Voucher và điều kiện (`min`, `pct`/`max`, `off`, `ship`, `productIds`) |
| `search` | Từ khoá gần đây, sản phẩm đã xem, đặt lại |
| `payments`, `payAdd`, `paymentNotes`, `bankGuide` | Phương thức thanh toán, ô "Thêm liên kết thẻ", ghi chú và hướng dẫn chuyển khoản |

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

Các phần này bấm vào không có tác dụng:

- **Đặt đơn** ở Thanh toán (chưa có màn đặt đơn thành công).
- Header Home: voucher, thông báo. Tab Khuyến mãi, QR, Tài khoản.
- Home: banner Thịt bò Úc, "Mua ngay" Kiwi, danh mục, các tab deal khác, thẻ thành viên.
- Thanh toán: **Đổi** địa chỉ giao, ô nhập mã khuyến mãi + "Áp dụng", "Thêm liên kết thẻ với VNPAY", ghi chú đơn, switch dùng điểm (chỉ đổi trạng thái hiển thị).
- Giỏ hàng: dòng "Dùng Voucher", "Xóa (n)", banner "Đơn 100k…", nút "Dùng Ngay".
- PDP: chia sẻ, chính sách.
- Search: ngành hàng.

## Ghi chú so với design

- Ảnh sản phẩm lấy từ ảnh gốc trong Figma (604px). Các asset khác xuất ở 2x.
- Màn PDP trong design là template (sữa DeliFres + Yakult). Prototype dùng layout đó nhưng hiển thị ảnh, giá, tên của đúng sản phẩm được bấm.
- Giỏ hàng và Thanh toán hiển thị đúng các món user đã thêm. Các block mẫu trong design như "5 món tạm thời hết hàng", Mua chung… được lược bỏ vì không áp dụng cho user mới.
- Sản phẩm "Thường được mua kèm", địa chỉ giao, phí giao hàng (20.000 đ) và voucher là data mẫu.
- Tổng tiền, tiết kiệm và điểm dự kiến được tính từ giỏ hàng thật, cộng phí giao (nếu giao hàng) và trừ đúng voucher khách đang áp dụng. Giảm theo % được làm tròn đến nghìn.
- Search dùng sản phẩm có sẵn trong prototype thay cho ảnh mẫu "Nho Úc" trong design.
- Không vẽ status bar giả (9:41…), vì prototype chạy trên trình duyệt điện thoại thật.
