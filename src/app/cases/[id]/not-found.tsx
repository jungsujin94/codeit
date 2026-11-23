import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { StatePanel } from "@/components/cases/state-panel"
import { cases } from "@/content/cases"

/* 없는 사례 주소 (/cases/아무거나) — 지워졌거나 잘못 적은 주소 */
export default function CaseNotFound() {
  const t = cases.notFound
  return (
    <StatePanel title={t.title} body={t.body}>
      <Link href="/cases" className={buttonVariants()}>
        {t.back}
      </Link>
    </StatePanel>
  )
}
