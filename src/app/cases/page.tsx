import { Suspense } from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { CaseCard } from "@/components/cases/case-card"
import { CaseFilters } from "@/components/cases/case-filters"
import { Pagination } from "@/components/cases/pagination"
import { StatePanel } from "@/components/cases/state-panel"
import { CaseListSkeleton } from "@/components/cases/skeletons"
import { cases } from "@/content/cases"
import { listCases } from "@/lib/cases/store"

/* 목록 — /cases?page=2&q=택배&verdict=d&sort=old */
export default function CasesPage({ searchParams }: PageProps<"/cases">) {
  const t = cases.list
  return (
    <>
      <p className="mb-3 inline-flex rounded-full bg-cc-mist px-[15px] py-[7px] text-[15px] font-bold text-cc-green">
        {t.eyebrow}
      </p>
      <h1 className="mb-3 text-[clamp(28px,3.4vw,42px)] leading-[1.25]">{t.title}</h1>
      <p className="mb-8 max-w-[62ch] text-[clamp(17px,1.5vw,20px)] text-cc-muted">{t.lead}</p>
      <Suspense fallback={<CaseListSkeleton />}>
        <CaseList searchParams={searchParams} />
      </Suspense>
    </>
  )
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined

async function CaseList({ searchParams }: { searchParams: PageProps<"/cases">["searchParams"] }) {
  const sp = await searchParams
  const q = one(sp.q)?.slice(0, 50)
  const verdict = ["d", "c", "u"].includes(one(sp.verdict) ?? "") ? one(sp.verdict) : undefined
  const sort = one(sp.sort) === "old" ? "old" : undefined
  const page = Number.parseInt(one(sp.page) ?? "1", 10) || 1
  const deleted = one(sp.deleted) === "1"

  const result = await listCases({ page, q, verdict, sort })
  const filtered = Boolean(q || verdict)
  const t = cases.list

  return (
    <>
      {deleted && (
        <p role="status" className="mb-6 rounded-xl bg-cc-mist px-[15px] py-[13px] text-[17px] font-bold text-cc-green">
          {t.deleted}
        </p>
      )}
      <CaseFilters q={q} verdict={verdict} sort={sort} />
      <p className="mt-6 mb-4 text-[17px] text-cc-muted" aria-live="polite">
        {t.total(result.total)}
      </p>

      {result.items.length === 0 ? (
        filtered ? (
          <StatePanel title={t.noMatchTitle} body={t.noMatchBody} role="status">
            <Link href="/cases" className={buttonVariants({ variant: "outline" })}>
              {t.clear}
            </Link>
          </StatePanel>
        ) : (
          <StatePanel icon="msg" title={t.emptyTitle} body={t.emptyBody} role="status">
            <Link href="/cases/new" className={buttonVariants()}>
              {cases.nav.create}
            </Link>
          </StatePanel>
        )
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((item) => (
            <li key={item.id}>
              <CaseCard item={item} />
            </li>
          ))}
        </ul>
      )}

      <Pagination page={result.page} pageCount={result.pageCount} params={{ q, verdict, sort }} />
    </>
  )
}
