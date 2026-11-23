"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { Reveal } from "@/components/reveal"
import { Rich } from "@/components/rich"
import { Eyebrow, Heading, Lead, Section, Wrap } from "@/components/section-parts"
import { NumberedSteps, Signal } from "@/components/signal"
import { demo, DEMO_CASES, type DemoCase } from "@/content/demo"
import { SECTION } from "@/content/site"
import { verdictOf, type VerdictKey } from "@/content/verdicts"

/* ══ 04 데모 「직접 눌러 보세요」 ══
   문자를 고르고 [확인하기]를 누르면 1.15초 「확인하고 있어요」 뒤에 결과가 뜹니다.
   다시 누르면 처음부터 다시 봅니다(다시 보기). ⚠️ 실제로 검사하지 않습니다. */

type Phase = "idle" | "scanning" | "shown"

const MSG_ICON: Record<VerdictKey, string> = {
  d: "text-cc-alert",
  c: "text-[#8A4E12]",
  u: "text-cc-muted",
}

const VERDICT_BOX: Record<VerdictKey, string> = {
  d: "bg-cc-blush border-[#F2D6D2] [&_b]:text-[#A63F3A]",
  c: "bg-cc-amber-bg border-[#EFD9B4] [&_b]:text-[#8A4E12]",
  u: "bg-[#F1F3F1] border-cc-line [&_b]:text-[#3F4A43]",
}

function Result({ c }: { c: DemoCase }) {
  const v = verdictOf(c.verdict)
  return (
    <div className="animate-fade-up">
      <Signal picked={c.verdict} label={demo.screen.signalLabel + v.title} />
      <div className={cn("mt-4 rounded-2xl border-2 px-[17px] py-[15px]", VERDICT_BOX[c.verdict])}>
        <b className="mb-1 block text-[21px]">{v.title}</b>
        <span className="text-[15.5px] leading-normal text-cc-muted">{v.sub}</span>
      </div>
      <p className="mt-[18px] mb-2 text-sm text-cc-muted">
        <b>{demo.screen.whyLabel}</b>
      </p>
      <ul className="flex flex-col gap-2">
        {c.why.map((w) => (
          <li
            key={w}
            className="relative pl-[26px] text-[15.5px] leading-normal before:absolute before:top-[.42em] before:left-0.5 before:size-3.5 before:rounded-full before:bg-cc-mist before:shadow-[inset_0_0_0_2px_var(--color-cc-leaf)]"
          >
            {w}
          </li>
        ))}
      </ul>
      <p className="mt-[18px] mb-2 text-sm text-cc-muted">
        <b>{demo.screen.todoLabel}</b>
      </p>
      <NumberedSteps steps={v.todo} tone={c.verdict} />
      <p className="mt-[18px] text-[13px] text-cc-muted">
        <Rich text={demo.screen.footnote} />
      </p>
    </div>
  )
}

export function Demo() {
  const [picked, setPicked] = useState<DemoCase>(DEMO_CASES[0])
  const [shownCase, setShownCase] = useState<DemoCase | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  /* 누를 때마다 1씩 올려 결과가 처음부터 다시 나타나게 합니다 */
  const [runId, setRunId] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  function run() {
    if (phase === "scanning") return
    const c = picked
    setRunId((n) => n + 1)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShownCase(c)
      setPhase("shown")
      return
    }
    setPhase("scanning")
    timer.current = setTimeout(() => {
      setShownCase(c)
      setPhase("shown")
    }, demo.scanMs)
  }

  return (
    <Section id={SECTION.demo}>
      <Wrap>
        <Eyebrow icon="scan">{demo.eyebrow}</Eyebrow>
        <Heading text={demo.title} />
        <Lead text={demo.lead} />

        <div className="mt-[34px] grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-[46px]">
          <div>
            <Reveal delay={1} role="group" aria-label={demo.pickLabel} className="flex flex-col gap-3">
              {DEMO_CASES.map((c) => {
                const on = c.id === picked.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked(c)}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3.5 rounded-[18px] border-2 px-[18px] py-4 text-left transition-[border-color,translate,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_26px_rgba(36,51,43,.1)]",
                      on ? "border-cc-green bg-cc-mist" : "border-cc-line bg-white"
                    )}
                  >
                    <Icon name="msg" className={MSG_ICON[c.verdict]} />
                    <span>
                      <span className="mb-[3px] block text-sm text-cc-muted">{c.from}</span>
                      <span className="block text-[16.5px] leading-normal">{c.text}</span>
                    </span>
                  </button>
                )
              })}
            </Reveal>

            <Reveal delay={2}>
              <Button type="button" onClick={run} disabled={phase === "scanning"} className="mt-5">
                <Icon name="scan" size="sm" />
                {demo.run}
              </Button>
            </Reveal>
            <Reveal as="p" delay={2} className="mt-3.5 text-sm text-cc-muted">
              <span className="inline-block rounded-full bg-cc-amber-bg px-[11px] py-1 text-[13.5px] font-bold text-[#7A440F]">
                {demo.badge}
              </span>{" "}
              <Rich text={demo.note} />
            </Reveal>
            <Reveal
              as="a"
              delay={2}
              href={demo.proto.href}
              className="mt-[18px] flex items-center gap-3.5 rounded-[18px] bg-cc-mist px-[18px] py-4 text-cc-deep no-underline shadow-[inset_0_0_0_1.5px_var(--color-cc-line)] hover:shadow-[inset_0_0_0_2px_var(--color-cc-leaf)]"
            >
              <span className="flex-none text-[22px]" aria-hidden="true">
                {demo.proto.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className="text-[17px]">{demo.proto.title}</b>
                <small className="mt-0.5 text-sm text-cc-muted">{demo.proto.sub}</small>
              </span>
              <span className="flex-none text-[22px] font-bold" aria-hidden="true">
                →
              </span>
            </Reveal>
            {/* 미션 6: 의심 문자 사례집(CRUD)으로 가는 길 */}
            <Reveal
              as="a"
              delay={2}
              href={demo.cases.href}
              className="mt-3 flex items-center gap-3.5 rounded-[18px] bg-white px-[18px] py-4 text-cc-deep no-underline shadow-[inset_0_0_0_1.5px_var(--color-cc-line)] hover:shadow-[inset_0_0_0_2px_var(--color-cc-leaf)]"
            >
              <span className="flex-none text-[22px]" aria-hidden="true">
                {demo.cases.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className="text-[17px]">{demo.cases.title}</b>
                <small className="mt-0.5 text-sm text-cc-muted">{demo.cases.sub}</small>
              </span>
              <span className="flex-none text-[22px] font-bold" aria-hidden="true">
                →
              </span>
            </Reveal>
          </div>

          <Reveal
            delay={2}
            aria-live="polite"
            className="mx-auto flex min-h-[420px] w-full max-w-[320px] flex-col gap-3.5 rounded-[30px] border border-cc-line bg-white p-5 shadow-[0_20px_48px_rgba(36,51,43,.14)] lg:w-[300px]"
          >
            <div className="flex items-center gap-[9px] border-b border-cc-line pb-3 text-sm text-cc-muted">
              <Icon name="shield" size="sm" className="text-cc-green" />
              <b>{demo.screen.brand}</b> {demo.screen.title}
            </div>
            <div>
              {phase === "idle" && (
                <p className="text-base text-cc-muted">
                  <Rich text={demo.screen.idle} />
                </p>
              )}
              {phase === "scanning" && (
                <div className="animate-fade-up">
                  <p className="text-base">
                    <b>{demo.screen.scanningTitle}</b>
                  </p>
                  <p className="mt-1.5 mb-3.5 text-[14.5px] text-cc-muted">{demo.screen.scanningSub}</p>
                  <div className="h-[7px] overflow-hidden rounded-[7px] bg-cc-mist">
                    <i className="block h-full w-0 animate-scan rounded-[7px] bg-cc-leaf" />
                  </div>
                </div>
              )}
              {phase === "shown" && shownCase && <Result key={runId} c={shownCase} />}
            </div>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  )
}
