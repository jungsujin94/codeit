import type { ReactNode } from "react"
import { cn } from "cn"
import { VERDICTS, type VerdictKey } from "@/content/verdicts"

/*
  판정 신호등 (원본 .signal / .tl / .stepsnum).
  ⚠️ 색만으로 뜻을 전하지 않습니다 — 램프마다 글자가 붙고, 고른 램프는
     테두리 · 위치 · 글자 굵기로도 구분됩니다 (흑백으로 출력해도 구분돼야 합니다).
  ⚠️ 맨 아래 램프는 초록이 아니라 옅은 회색입니다.
*/

const LIT_INDEX: Record<VerdictKey, number> = { d: 0, c: 1, u: 2 }

/* 켜진 램프: 번짐 두 겹. 램프 지름 --d 하나로 전부 계산합니다 */
const LIT_LAMP: Record<VerdictKey, string> = {
  d: "border-[#E2483C] bg-[#E2483C] shadow-[0_0_calc(var(--d)*.26)_calc(var(--d)*.05)_rgba(226,72,60,.85),0_0_calc(var(--d)*.55)_calc(var(--d)*.10)_rgba(226,72,60,.38)]",
  c: "border-[#F2A51A] bg-[#F2A51A] shadow-[0_0_calc(var(--d)*.26)_calc(var(--d)*.05)_rgba(242,165,26,.85),0_0_calc(var(--d)*.55)_calc(var(--d)*.10)_rgba(242,165,26,.38)]",
  u: "border-[#AFBCB4] bg-[#AFBCB4] shadow-[0_0_calc(var(--d)*.26)_calc(var(--d)*.05)_rgba(175,188,180,.85),0_0_calc(var(--d)*.55)_calc(var(--d)*.10)_rgba(175,188,180,.38)]",
}

const PICKED_COLUMN: Record<VerdictKey, string> = {
  d: "bg-cc-blush border-[#E7B8B3]",
  c: "bg-cc-amber-bg border-[#E3C68E]",
  u: "bg-[#EBEEEC] border-[#C6CFC9]",
}

/* 할 일 첫 줄 번호의 색 (글자가 작아 4.5:1 을 넘는 색) */
export const LIT_TEXT: Record<VerdictKey, string> = {
  d: "bg-cc-alert",
  c: "bg-[#8A4E12]",
  u: "bg-[#4A554E]",
}

function TrafficLight({ lit }: { lit: VerdictKey }) {
  return (
    <i
      aria-hidden="true"
      className="flex h-[calc(var(--d)*3.74)] w-[calc(var(--d)*1.52)] flex-none flex-col items-center gap-[calc(var(--d)*.11)] rounded-[calc(var(--d)*.76)] bg-[#253028] py-[calc(var(--d)*.26)]"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "box-border size-(--d) flex-none rounded-full border border-[#38463E] bg-[#18211C] transition-[background-color,box-shadow,border-color] duration-400",
            i === LIT_INDEX[lit] && LIT_LAMP[lit]
          )}
        />
      ))}
    </i>
  )
}

/**
 * 신호등 세 칸.
 * - onPick 이 있으면 각 칸이 누를 수 있는 버튼이 됩니다 (판정 구간).
 * - 없으면 그림 한 장으로 읽힙니다 (데모 결과 화면).
 */
export function Signal({
  picked,
  big = false,
  onPick,
  label,
}: {
  picked: VerdictKey
  big?: boolean
  onPick?: (key: VerdictKey) => void
  label?: string
}) {
  return (
    <div
      className={cn("flex items-stretch gap-2.5", big ? "[--d:30px]" : "[--d:24px]")}
      {...(onPick ? { role: "group" } : { role: "img", "aria-label": label })}
    >
      {VERDICTS.map((v) => {
        const on = v.key === picked
        const cls = cn(
          "flex flex-1 flex-col items-center rounded-2xl border-2 border-transparent bg-[#F3F5F3] transition-[background-color,border-color,translate] duration-350 ease-rise",
          big ? "gap-3.5 px-3 py-[22px]" : "gap-[11px] px-2 py-4",
          on && cn("-translate-y-1", PICKED_COLUMN[v.key])
        )
        const content: ReactNode = (
          <>
            <TrafficLight lit={v.key} />
            <b
              className={cn(
                "text-center leading-[1.3]",
                big ? "text-[17px]" : "text-[13.5px]",
                on ? "font-bold text-cc-ink" : "font-normal text-cc-muted"
              )}
            >
              {v.title}
            </b>
          </>
        )
        return onPick ? (
          <button
            key={v.key}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(v.key)}
            className={cn(cls, "cursor-pointer")}
          >
            {content}
          </button>
        ) : (
          <div key={v.key} className={cls}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

/* 번호 매긴 할 일 — 첫 줄은 그 등급의 색으로 강조합니다 */
export function NumberedSteps({ steps, tone }: { steps: string[]; tone: VerdictKey }) {
  return (
    <ol className="flex flex-col gap-[9px]">
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn("flex items-start gap-[11px] text-[15.5px] leading-normal", i === 0 && "font-bold")}
        >
          <em
            className={cn(
              "mt-px grid size-[23px] flex-none place-items-center rounded-full text-[13px] font-bold not-italic",
              i === 0 ? cn(LIT_TEXT[tone], "text-white") : "bg-[#E7EBE8] text-cc-muted"
            )}
          >
            {i + 1}
          </em>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}
