import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { VerdictBadge } from "@/components/cases/verdict-badge"
import { cases } from "@/content/cases"
import { formatDate, type CaseRecord } from "@/lib/cases/schema"

/* 목록의 사례 한 장 — 누르면 상세로 갑니다 */
export function CaseCard({ item }: { item: CaseRecord }) {
  return (
    <Link
      href={`/cases/${item.id}`}
      className="group block rounded-[22px] text-cc-ink no-underline transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Card className="h-full gap-3 p-0 transition-shadow group-hover:shadow-[0_14px_34px_rgba(36,51,43,.10)]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-[22px] border-b border-cc-line bg-cc-ivory">
          {item.image ? (
            <Image
              src={item.image.url}
              alt={`「${item.title}」 문자 화면 그림`}
              fill
              unoptimized
              sizes="(min-width: 980px) 360px, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <span className="grid h-full place-items-center text-[15px] text-cc-muted">{cases.card.noImage}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2.5 px-6 pb-6">
          <VerdictBadge verdict={item.verdict} className="self-start" />
          <h2 className="text-[20px] leading-snug group-hover:text-cc-green">{item.title}</h2>
          <p className="line-clamp-2 text-[17px] text-cc-muted">{item.message}</p>
          <p className="mt-auto text-[15px] text-cc-muted">
            {cases.card.sender} · {item.senderType} · {formatDate(item.createdAt)}
          </p>
        </div>
      </Card>
    </Link>
  )
}
