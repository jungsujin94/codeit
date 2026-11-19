import type { ReactNode } from "react"
import { cn } from "cn"

/*
  chanchan.kr 의 SVG 스프라이트(<symbol>)를 그대로 옮긴 아이콘입니다.
  선 굵기 · 끝 모양도 원본과 같습니다.
*/
const PATHS = {
  warn: (
    <>
      <path d="M12 3.5 2.6 20h18.8L12 3.5Z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="17" r=".7" fill="currentColor" />
    </>
  ),
  msg: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2.5V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />
      <path d="M8.5 11h7M8.5 14.5h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v6c0 4.6 3.1 8.2 7.5 9.4 4.4-1.2 7.5-4.8 7.5-9.4V6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="8.5" r="3" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M2.8 19a5.2 5.2 0 0 1 10.4 0M14 19a4.3 4.3 0 0 1 7.2-2.6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.8" y="10.5" width="14.4" height="9.7" rx="2" />
      <path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3h11a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3Z" />
      <path d="M10.5 18h3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="m8.4 12.2 2.5 2.5 4.7-5" />
    </>
  ),
  q: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M9.7 9.6a2.4 2.4 0 1 1 3.1 2.5c-.6.2-.8.7-.8 1.3v.5" />
      <circle cx="12" cy="16.6" r=".65" fill="currentColor" />
    </>
  ),
  gov: (
    <>
      <path d="M4 20.5h16M5.5 20.5V9l6.5-4.5L18.5 9v11.5" />
      <path d="M9.5 20.5v-5h5v5" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M7 20.5v-6M12 20.5V7.5M17 20.5v-9" />
    </>
  ),
  type: <path d="M4 7V5h16v2M12 5v14M9 19h6" />,
  rules: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8 8.5h8M8 12.5h8M8 16.5h5" />
    </>
  ),
  stop: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M8.6 8.6 15.4 15.4" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8.5V5.5A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3" />
      <path d="M4 12h16" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS

const SIZES = {
  sm: "size-5",
  md: "size-[26px]",
  lg: "size-[34px] stroke-[1.7]",
} as const

export function Icon({
  name,
  size = "md",
  className,
}: {
  name: IconName
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        "flex-none fill-none stroke-current stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]",
        SIZES[size],
        className
      )}
    >
      {PATHS[name]}
    </svg>
  )
}
