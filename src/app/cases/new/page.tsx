import type { Metadata } from "next"
import { CaseForm } from "@/components/cases/case-form"
import { createCaseAction } from "@/app/cases/actions"
import { cases } from "@/content/cases"

export const metadata: Metadata = { title: cases.form.createTitle }

/* 등록 */
export default function NewCasePage() {
  const t = cases.form
  return (
    <div className="mx-auto max-w-[760px]">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)] leading-[1.25]">{t.createTitle}</h1>
      <p className="mb-8 text-[17px] text-cc-muted">{t.createLead}</p>
      <CaseForm action={createCaseAction} cancelHref="/cases" />
    </div>
  )
}
