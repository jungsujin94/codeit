import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { meta } from "@/content/site"
import "./globals.css"

/* 광양햇살체 (광양시청 · 공공누리 제1유형 · 출처표시) — .woff2 두 벌만 씁니다 */
const gwangyang = localFont({
  src: [
    { path: "../fonts/Gwangyang-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Gwangyang-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gwangyang",
  display: "swap",
  /* 한글 글꼴이라 미리 받지 않습니다(파일이 큽니다). 없으면 맑은 고딕으로 먼저 보입니다 */
  preload: false,
  fallback: ["Malgun Gothic", "Apple SD Gothic Neo", "sans-serif"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://chanchan.kr"),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.ogDescription,
    type: "website",
    locale: "ko_KR",
    images: [{ url: meta.ogImage, width: 480, height: 480, alt: "찬찬" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={gwangyang.variable}>
      <body>{children}</body>
    </html>
  )
}
