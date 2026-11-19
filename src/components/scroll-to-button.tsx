"use client"

import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"

/*
  누르면 해당 구간으로 부드럽게 내려갑니다 (원본 site.js 의 [data-scroll-to]).
  신청서로 내려가면, 다 내려간 뒤 첫 칸에 커서를 놓아 드립니다.
*/
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  const first = target.querySelector<HTMLElement>("input:not([tabindex='-1']), select, textarea")
  if (first) setTimeout(() => first.focus({ preventScroll: true }), 500)
}

export function ScrollToButton({
  target,
  ...props
}: { target: string } & ComponentProps<typeof Button>) {
  return <Button type="button" onClick={() => scrollToSection(target)} {...props} />
}
