import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { NumberedSteps } from "@/components/signal"
import { DeleteCaseDialog } from "@/components/cases/delete-case-dialog"
import { VerdictBadge } from "@/components/cases/verdict-badge"
import { cases } from "@/content/cases"
import { verdictOf } from "@/content/verdicts"
import { formatDate } from "@/lib/cases/schema"
import { getCase } from "@/lib/cases/store"

/* 상세 페이지의 제목 · 설명 · 오픈그래프를 그 사례에 맞춥니다 */
export async function generateMetadata({ params }: PageProps<"/cases/[id]">): Promise<Metadata> {
  const item = await getCase((await params).id)
  if (!item) return { title: cases.notFound.title }
  const description = item.message.slice(0, 110)
  /* 랜딩은 chanchan.kr 를 기준 주소로 씁니다. 사례 그림은 이 앱에만 있으므로 지금 주소를 기준으로 바꿉니다 */
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return {
    metadataBase: new URL(`${proto}://${host}`),
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      images: [item.image?.url ?? "/logo.png"],
    },
  }
}

/* 상세 */
export default async function CaseDetailPage({ params, searchParams }: PageProps<"/cases/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const item = await getCase(id)
  if (!item) notFound()

  const t = cases.detail
  const saved = sp.saved === "created" || sp.saved === "updated" ? t.saved[sp.saved] : null
  const v = verdictOf(item.verdict)

  return (
    <article className="mx-auto max-w-[860px]">
      <Link href="/cases" className="mb-6 flex min-h-11 w-fit items-center text-[17px] font-bold">
        ← {t.back}
      </Link>

      {saved && (
        <p role="status" className="mb-6 rounded-xl bg-cc-mist px-[15px] py-[13px] text-[17px] font-bold text-cc-green">
          {saved}
        </p>
      )}

      <VerdictBadge verdict={item.verdict} className="mb-3" />
      <h1 className="mb-3 text-[clamp(26px,3.2vw,40px)] leading-[1.25]">{item.title}</h1>
      <dl className="mb-8 flex flex-wrap gap-x-6 gap-y-1 text-[15px] text-cc-muted">
        <div className="flex gap-1.5">
          <dt>{t.sender}</dt>
          <dd className="font-bold text-cc-ink">{item.senderType}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>{t.created}</dt>
          <dd>{formatDate(item.createdAt)}</dd>
        </div>
        {item.updatedAt !== item.createdAt && (
          <div className="flex gap-1.5">
            <dt>{t.updated}</dt>
            <dd>{formatDate(item.updatedAt)}</dd>
          </div>
        )}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <section aria-labelledby="d-msg" className="rounded-[22px] border border-cc-line bg-white p-6">
            <h2 id="d-msg" className="mb-3 text-[19px]">
              {t.message}
            </h2>
            <p className="rounded-2xl rounded-tl-sm bg-[#EEF1EF] px-5 py-4 text-[17px] whitespace-pre-wrap">
              {item.message}
            </p>
          </section>

          <section aria-labelledby="d-verdict" className="rounded-[22px] border border-cc-line bg-white p-6">
            <h2 id="d-verdict" className="mb-1 text-[19px]">
              {t.verdict} · {v.title}
            </h2>
            <p className="mb-4 text-[17px] text-cc-muted">{v.sub}</p>
            <NumberedSteps steps={v.todo} tone={item.verdict} />
          </section>

          <section aria-labelledby="d-note" className="rounded-[22px] border border-cc-line bg-white p-6">
            <h2 id="d-note" className="mb-3 text-[19px]">
              {t.note}
            </h2>
            <p className="text-[17px] whitespace-pre-wrap text-cc-ink">
              {item.note || <span className="text-cc-muted">{t.noNote}</span>}
            </p>
          </section>
        </div>

        <section aria-labelledby="d-img" className="self-start rounded-[22px] border border-cc-line bg-white p-6">
          <h2 id="d-img" className="mb-3 text-[19px]">
            {t.image}
          </h2>
          {item.image ? (
            <a href={item.image.url} target="_blank" rel="noopener" className="block">
              <Image
                src={item.image.url}
                alt={`「${item.title}」 문자 화면 그림`}
                width={300}
                height={520}
                unoptimized
                className="h-auto w-full rounded-xl border border-cc-line"
              />
            </a>
          ) : (
            <p className="grid min-h-40 place-items-center rounded-xl bg-cc-ivory text-[17px] text-cc-muted">
              {t.noImage}
            </p>
          )}
        </section>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-cc-line pt-6 sm:flex-row sm:justify-end">
        <DeleteCaseDialog id={item.id} title={item.title} />
        <Link href={`/cases/${item.id}/edit`} className={buttonVariants()}>
          {t.edit}
        </Link>
      </div>
    </article>
  )
}
