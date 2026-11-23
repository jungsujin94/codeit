import { cn } from "cn"
import { verdictOf, type VerdictKey } from "@/content/verdicts"

/* 판정 표시 — 색 점 + 판정 이름 + 테두리. 색만으로 뜻을 전하지 않습니다 */
const TONE: Record<VerdictKey, { box: string; dot: string }> = {
  d: { box: "border-[#E7B8B3] bg-cc-blush text-[#8E3833]", dot: "bg-[#E2483C]" },
  c: { box: "border-[#E3C68E] bg-cc-amber-bg text-[#7A4510]", dot: "bg-[#F2A51A]" },
  u: { box: "border-[#C6CFC9] bg-[#EBEEEC] text-[#3F4A43]", dot: "bg-[#AFBCB4]" },
}

export function VerdictBadge({ verdict, className }: { verdict: VerdictKey; className?: string }) {
  const t = TONE[verdict]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-[15px] leading-snug font-bold",
        t.box,
        className
      )}
    >
      <i aria-hidden="true" className={cn("size-2.5 flex-none rounded-full", t.dot)} />
      {verdictOf(verdict).title}
    </span>
  )
}
