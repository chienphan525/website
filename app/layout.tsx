import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Chiến Phan — Những điều đáng nhớ", description: "Nhật ký cá nhân, những mẩu chuyện về cuộc sống và tình yêu." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body>{children}</body></html>; }
