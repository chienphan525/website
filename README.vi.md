# Chiến Phan — Nhật ký cá nhân

Đây là website nhật ký cá nhân gọn nhẹ, nhanh và sẵn sàng đưa lên Vercel. Bạn có thể viết bài mới chỉ bằng tệp Markdown, không cần đăng nhập WordPress hoặc dùng cơ sở dữ liệu.

[![Triển khai với Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME)

Trước khi bấm nút, hãy thay `YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME` bằng đường dẫn repository GitHub của bạn.

## Đăng bài mới

1. Mở thư mục `content/posts`.
2. Sao chép một tệp `.md` có sẵn và đổi tên, ví dụ: `chuyen-di-dau-tien.md`.
3. Sửa phần thông tin nằm giữa hai dòng `---`, sau đó viết bài ở bên dưới.
4. Lưu, commit và đẩy lên GitHub. Vercel sẽ tự động cập nhật website.

```md
---
title: "Tên câu chuyện của bạn"
date: "2026-08-29"
category: "Nhật ký"
excerpt: "Lời giới thiệu ngắn, hiển thị ở trang chủ."
---
Nội dung bài viết bắt đầu ở đây.

## Tiêu đề một phần

Viết đoạn tiếp theo ở đây.
```

Ngày phải theo dạng `YYYY-MM-DD`. Bài có ngày mới nhất sẽ hiển thị trước. Bạn có thể dùng đoạn văn bình thường và tiêu đề bắt đầu bằng `##`.

## Chuyển bài viết từ WordPress

Project có sẵn công cụ chuyển các bài viết công khai ở website WordPress hiện tại. Sau khi chạy `npm install`, hãy chạy một lần `npm run import:wordpress`; công cụ sẽ lấy các bài từ `chienphan.com` về `content/posts/` dưới dạng Markdown và không ghi đè tệp đã có. Hãy xem lại các tệp được tạo, sau đó commit trước khi triển khai.

## Chạy thử trên máy tính

Cài Node.js phiên bản 20 trở lên, rồi chạy `npm install` và `npm run dev`. Mở `http://localhost:3000`. Trước khi đưa lên mạng, chạy `npm run build`.

## Đưa website lên Vercel

1. Tạo repository mới trên GitHub và tải project này lên.
2. Vào [Vercel](https://vercel.com/new), chọn import repository vừa tạo.
3. Giữ nguyên phần cài đặt Next.js mà Vercel nhận diện, rồi bấm **Deploy**.
4. Trong Vercel, vào **Settings → Domains**, thêm `chienphan.com` và làm theo hướng dẫn DNS hiển thị tại đó.

Mỗi lần bạn đẩy thay đổi lên GitHub, Vercel sẽ tự triển khai phiên bản mới. Không cần cơ sở dữ liệu và cũng không cần đăng nhập WordPress để viết bài.

## Cấu trúc project

- `content/posts/` — nơi chứa tất cả bài viết; bình thường bạn chỉ cần làm việc tại đây.
- `app/page.tsx` — trang chủ.
- `app/bai-viet/[slug]/page.tsx` — trang đọc bài.
- `app/globals.css` — giao diện website.

Bài viết chuyện tình đầu tiên được chuyển thể từ bài công khai trên website cũ, để ngôi nhà mới vẫn bắt đầu bằng một kỷ niệm quen thuộc.
