# Deploy lên Fly.io (fly.dev)

App này **không cần backend/DB** (dữ liệu lưu ở máy người dùng bằng IndexedDB), chỉ là một
container Next.js nhỏ. Đã có sẵn: `Dockerfile`, `.dockerignore`, `fly.toml`, và
`output: "standalone"` trong `next.config.ts`.

## 1. Cài Fly CLI (flyctl)

Windows (PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```
macOS/Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

## 2. Đăng nhập / đăng ký

```bash
fly auth signup   # hoặc: fly auth login
```
> Fly yêu cầu thêm thẻ thanh toán để chống lạm dụng, nhưng có hạn mức nhỏ chạy gần như miễn phí.

## 3. Tạo app + deploy lần đầu

Đổi `ban-tho-cua-ban` thành **tên duy nhất** của bạn (sẽ thành `https://<tên>.fly.dev`):

```bash
fly launch --copy-config --name ban-tho-cua-ban --region sin --yes
```
- `--copy-config`: dùng `fly.toml` sẵn có.
- `--region sin`: Singapore (gần Việt Nam). Có thể đổi `hkg`, `nrt`...
- Fly sẽ tự build image (trên máy chủ của Fly, **không cần cài Docker** ở máy bạn) rồi deploy.

## 4. Đặt đúng URL công khai (cho SEO) và deploy lại

```bash
fly deploy --build-arg NEXT_PUBLIC_SITE_URL=https://ban-tho-cua-ban.fly.dev
```
Bước này giúp thẻ SEO/canonical/Open Graph trỏ đúng tên miền.

## 5. Mở web

```bash
fly open
```
→ Trang đã public tại `https://ban-tho-cua-ban.fly.dev`.

## Lệnh hữu ích

```bash
fly logs                 # xem log
fly status               # trạng thái máy
fly deploy               # deploy lại sau khi sửa code
fly scale memory 1024    # tăng RAM nếu cần
```

## Ghi chú

- `fly.toml` đang đặt `auto_stop_machines` + `min_machines_running = 0`: máy **tự ngủ khi
  không có khách** (rẻ nhất), lần truy cập đầu sau khi ngủ sẽ chờ ~vài giây để khởi động.
  Muốn luôn "nóng": đổi `min_machines_running = 1`.
- Sau này gắn tên miền riêng: `fly certs add tenmien.vn`.
- Bật quảng cáo/Analytics: đặt biến môi trường khi deploy, ví dụ
  `fly deploy --build-arg NEXT_PUBLIC_SITE_URL=... --build-arg NEXT_PUBLIC_GA_ID=G-XXXX`
  (cần thêm các ARG tương ứng vào `Dockerfile`).
