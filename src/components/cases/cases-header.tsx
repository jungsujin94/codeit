import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Wrap } from "@/components/section-parts"
import { cases } from "@/content/cases"
import { header } from "@/content/site"

/* 사례집 화면의 머리 — 로고는 랜딩으로, 오른쪽은 목록 · 등록 */
export function CasesHeader() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cc-line bg-cc-bg/94 backdrop-blur-[10px]">
        <Wrap className="flex h-[74px] items-center gap-3">
          <Link href="/" className="flex flex-none items-center gap-[9px] text-cc-ink no-underline">
            <Image src="/logo.png" alt={header.logoAlt} width={40} height={40} className="size-10" />
            <span className="hidden text-[15px] text-cc-muted sm:inline">{cases.nav.home}</span>
          </Link>
          <nav aria-label={cases.list.eyebrow} className="ml-auto flex items-center gap-2">
            <Link href="/cases" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {cases.nav.list}
            </Link>
            <Link href="/cases/new" className={buttonVariants({ size: "sm" })}>
              {cases.nav.create}
            </Link>
          </nav>
        </Wrap>
      </header>
      <p className="bg-cc-amber-bg px-5 py-3 text-center text-[15px] text-[#7A4510]">{cases.notice}</p>
    </>
  )
}
