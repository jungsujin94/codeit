import type { Metadata } from "next"
import { CasesHeader } from "@/components/cases/cases-header"
import { cases } from "@/content/cases"

export const metadata: Metadata = {
  title: { default: cases.meta.title, template: "%s — 찬찬 사례집" },
  description: cases.meta.description,
}

export default function CasesLayout({ children }: LayoutProps<"/cases">) {
  return (
    <>
      <CasesHeader />
      <main id="main" className="mx-auto min-h-[70vh] max-w-[1200px] px-5 pt-10 pb-24 lg:px-10 lg:pt-14">
        {children}
      </main>
    </>
  )
}
