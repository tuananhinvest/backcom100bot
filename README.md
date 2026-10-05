# Backcom 100% Bot (@Backcom100Bot)

## Cài đặt
```bash
npm install
cp .env.example .env          # điền BOT_TOKEN, DB_* (DB_NAME=backcom100schema)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS backcom100schema CHARACTER SET utf8mb4"
mysql -u root -p < sql/schema.sql   # schema của bạn + bảng calendar_link
npm start                           # chạy nền: pm2 start src/bot.js --name backcom100bot
```
Nếu DB đã có sẵn các bảng, chỉ cần chạy riêng phần `calendar_link` ở cuối `sql/schema.sql`.

## Chỗ bạn cần sửa
| Việc | Nơi sửa |
|---|---|
| Tỉ lệ backcom (%), `ratePerLotMin` / `ratePerLotMax` (USD/lot), link ref từng sàn | `src/config/exchanges.js` |
| Hướng dẫn tạo tài khoản hoặc chuyển IB (1 nội dung / sàn / ngôn ngữ), username hỗ trợ | `src/guides.js` |
| Link lịch kinh tế tuần / tháng (bài viết trên channel) | bảng `calendar_link` |
| Chữ trên nút / tin nhắn | `src/i18n.js` |

Cập nhật link lịch (không cần restart bot, cache tối đa 60 giây):
```sql
UPDATE calendar_link SET url = 'https://t.me/your_channel/123' WHERE type = 'week';
UPDATE calendar_link SET url = 'https://t.me/your_channel/456' WHERE type = 'month';
```
Hai nút lịch ở menu là nút URL mở thẳng bài viết. Link trống/không hợp lệ thì bấm nút sẽ báo "chưa có link".

## Cách hoạt động
- **Check** (`/check` hoặc gửi dãy số): tìm số nhập vào trong `trading_account.account_number` (Vantage) và `backcom_user.uid` (BingX hoặc UID Vantage → gộp mọi số tài khoản của UID). Có → hiện khối lượng + backcom tháng này / tổng (từ `bingx_trade` / `vantage_trade`: `volume`, `commission`), không có → báo chưa đăng ký. Backcom = `commission × rebatePercent / 100`.
- **Ước tính**: backcom từ `lot × ratePerLotMin × %` đến `lot × ratePerLotMax × %`; Min = Max thì hiện 1 giá trị.
- Thêm sàn mới: 1 khối trong `EXCHANGES`, 1 nội dung trong `guides.js`, 1 dòng trong `TRADE` ở `src/db/accounts.js` (bảng giao dịch + cột khoá).

## Cấu trúc
```
src/bot.js                  lệnh, nút bấm, xử lý tin nhắn
src/config/exchanges.js     sàn + thông số backcom + hàm ước tính
src/i18n.js, src/guides.js  chữ giao diện, hướng dẫn (vi, en)
src/keyboards/mainMenu.js   mọi bàn phím (đều có nút Quay lại)
src/handlers/               check, estimate, calendar
src/helpers/                render (hiển thị/menu), format (số, khoảng)
src/db/                     users, accounts, calendar
sql/schema.sql              schema của bạn + calendar_link
```
