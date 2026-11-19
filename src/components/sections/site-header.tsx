"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "cn"
import { ComingSoonDialog } from "@/components/coming-soon-dialog"
import { ScrollToButton, scrollToSection } from "@/components/scroll-to-button"
import { Wrap } from "@/components/section-parts"
import { header, NAV_LINKS, SECTION } from "@/content/site"

/* ══ 01 네비게이션 + 기관용 띠 ══
   첫 화면을 지나면(40px) 바탕을 채웁니다. 좁은 화면에서는 메뉴 글자를 숨기고 버튼만 둡니다. */
export function SiteHeader() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="absolute top-0 -left-[9999px] z-[100] rounded-br-[10px] bg-cc-green px-[18px] py-3 text-white focus:left-0"
      >
        {header.skip}
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-250",
          solid
            ? "border-cc-line bg-cc-bg/94 shadow-[0_2px_18px_rgba(36,51,43,.05)] backdrop-blur-[10px]"
            : "border-transparent bg-cc-bg/0"
        )}
      >
        <Wrap className="flex h-[74px] items-center gap-3 lg:gap-[26px]">
          <a href="#top" className="flex flex-none items-center gap-[9px] text-cc-ink no-underline">
            <Image src="/logo.png" alt={header.logoAlt} width={40} height={40} priority className="size-10" />
            <span className="hidden text-[15px] text-cc-muted sm:inline">{header.tagline}</span>
          </a>
          <nav aria-label={header.navLabel} className="ml-auto hidden gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[10px] px-3.5 py-2.5 text-base font-bold text-cc-muted no-underline transition-colors hover:bg-cc-mist hover:text-cc-green"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <ComingSoonDialog />
            <ScrollToButton target={SECTION.institution} size="sm">
              {header.cta}
            </ScrollToButton>
          </div>
        </Wrap>
      </header>

      <div className="bg-cc-deep text-cc-snow">
        <Wrap>
          <button
            type="button"
            onClick={() => scrollToSection(SECTION.institution)}
            className="w-full cursor-pointer py-[15px] text-center text-base text-cc-snow"
          >
            {header.orgbar} <span className="ml-1.5 font-bold text-[#F7B9B3]">{header.orgbarCta}</span>
          </button>
        </Wrap>
      </div>
    </>
  )
}
