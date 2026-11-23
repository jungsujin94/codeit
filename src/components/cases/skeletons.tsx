import { cases } from "@/content/cases"

/* 불러오는 동안 보이는 뼈대 — 화면이 덜컥 바뀌지 않게 카드 자리를 먼저 잡습니다 */
export function CaseListSkeleton() {
  return (
    <div role="status" aria-label={cases.list.loading}>
      <div className="h-[106px] animate-pulse rounded-[22px] bg-cc-ivory" />
      <div className="mt-6 mb-4 h-6 w-24 animate-pulse rounded bg-cc-ivory" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} className="h-[340px] animate-pulse rounded-[22px] bg-cc-ivory" />
        ))}
      </ul>
      <span className="sr-only">{cases.list.loading}</span>
    </div>
  )
}

export function CaseDetailSkeleton() {
  return (
    <div role="status" aria-label={cases.list.loading} className="max-w-[860px]">
      <div className="mb-6 h-6 w-24 animate-pulse rounded bg-cc-ivory" />
      <div className="mb-4 h-10 w-2/3 animate-pulse rounded bg-cc-ivory" />
      <div className="h-[320px] animate-pulse rounded-[22px] bg-cc-ivory" />
      <span className="sr-only">{cases.list.loading}</span>
    </div>
  )
}
