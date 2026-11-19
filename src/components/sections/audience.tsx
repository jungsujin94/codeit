import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, IconBox, Lead, Section, Wrap } from "@/components/section-parts"
import { ACCESSIBILITY_RULES, audience, PROMISES } from "@/content/sections"
import { SECTION } from "@/content/site"

/* ══ 06 이용 대상 · 이것만은 지킵니다 (원칙과 신뢰) ══ */
export function Audience() {
  return (
    <Section id={SECTION.audience} tone="tint">
      <Wrap className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow icon="type">{audience.eyebrow}</Eyebrow>
          <Heading text={audience.title} />
          <Lead text={audience.lead} />
          <Reveal delay={2} className="mt-[26px] grid grid-cols-1 gap-3 lg:grid-cols-2">
            {ACCESSIBILITY_RULES.map((r) => (
              <Card key={r.title} className="p-[18px]">
                <b className="text-[17px]">{r.title}</b>
                <p className="mt-1 text-[15px] text-cc-muted">{r.body}</p>
              </Card>
            ))}
          </Reveal>
        </div>

        <div>
          <Eyebrow icon="lock">{audience.promiseEyebrow}</Eyebrow>
          <Heading text={audience.promiseTitle} small />
          <Reveal as="ul" delay={1} className="mt-5">
            {PROMISES.map((p) => (
              <li
                key={p.title}
                className="flex items-start gap-[15px] border-t border-cc-line py-5 first:border-t-0"
              >
                <IconBox icon={p.icon} small />
                <div>
                  <b className="mb-1 block text-lg">{p.title}</b>
                  <p className="text-base text-cc-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </Wrap>
    </Section>
  )
}
