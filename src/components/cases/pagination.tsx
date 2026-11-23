import Link from "next/link"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { cases } from "@/content/cases"

/* 쪽 넘기기 — 찾기 · 판정 · 차례 조건은 그대로 두고 page 만 바꿉니다 */
export function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number
  pageCount: number
  params: Record<string, string | undefined>
}) {
  if (pageCount <= 1) return null

  const href = (p: number) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v)
    if (p > 1) sp.set("page", String(p))
    const s = sp.toString()
    return s ? `/cases?${s}` : "/cases"
  }
  const t = cases.pagination
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <nav aria-label={t.label} className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          ← {t.prev}
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40")}>
          ← {t.prev}
        </span>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-label={t.page(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: p === page ? "default" : "ghost", size: "sm" }),
            "min-w-11 px-0"
          )}
        >
          {p}
        </Link>
      ))}
      {page < pageCount ? (
        <Link href={href(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          {t.next} →
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40")}>
          {t.next} →
        </span>
      )}
    </nav>
  )
}
