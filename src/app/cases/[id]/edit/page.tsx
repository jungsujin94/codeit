import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CaseForm } from "@/components/cases/case-form"
import { updateCaseAction } from "@/app/cases/actions"
import { cases } from "@/content/cases"
import { getCase } from "@/lib/cases/store"

export const metadata: Metadata = { title: cases.form.editTitle }

/* 수정 — 지금 값을 불러와 채워 둡니다 */
export default async function EditCasePage({ params }: PageProps<"/cases/[id]/edit">) {
  const { id } = await params
  const item = await getCase(id)
  if (!item) notFound()

  const t = cases.form
  return (
    <div className="mx-auto max-w-[760px]">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)] leading-[1.25]">{t.editTitle}</h1>
      <p className="mb-8 text-[17px] text-cc-muted">{t.editLead}</p>
      <CaseForm action={updateCaseAction.bind(null, item.id)} initial={item} cancelHref={`/cases/${item.id}`} />
    </div>
  )
}
