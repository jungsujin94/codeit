"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, Lead, Section, SourceNote, Wrap } from "@/components/section-parts"
import { NumberedSteps, Signal } from "@/components/signal"
import { verdictOf, verdictSection, type VerdictKey } from "@/content/verdicts"

/* ══ 판정 3등급 ══
   신호등 램프를 누르면 그 등급에서 무엇을 하시면 되는지 아래에 뜹니다. */
export function VerdictTiers() {
  const [tier, setTier] = useState<VerdictKey>("d")
  const v = verdictOf(tier)

  return (
    <Section>
      <Wrap>
        <Eyebrow icon="rules">{verdictSection.eyebrow}</Eyebrow>
        <Heading text={verdictSection.title} />
        <Lead text={verdictSection.lead} />

        <Reveal delay={1} className="mt-[30px] max-w-[720px]">
          <Signal picked={tier} big onPick={setTier} />
          <Card className="mt-4" aria-live="polite">
            <b className="text-[19px]">{v.title}</b>
            <p className="mt-1 text-[16.5px] text-cc-muted">{v.sub}</p>
            <p className="mt-4 mb-2 text-sm text-cc-muted">
              <b>{verdictSection.todoLabel}</b>
            </p>
            <NumberedSteps steps={v.todo} tone={tier} />
          </Card>
        </Reveal>
        <SourceNote text={verdictSection.source} />
      </Wrap>
    </Section>
  )
}
