"use client"

import { useEffect } from "react"

/* 페이지에 한 번만 둡니다. [data-reveal] 이 화면에 들어오면 data-in 을 붙입니다. */
export function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const show = (el: Element) => el.setAttribute("data-in", "")

    if (!("IntersectionObserver" in window)) {
      items.forEach(show)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
