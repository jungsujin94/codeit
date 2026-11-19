import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, IconBox, Lead, Section, SourceNote, Video, Wrap } from "@/components/section-parts"
import { BUILD_FACTS, family, FAMILY_SHARE, VIDEO_FALLBACK } from "@/content/sections"

/* ══ 어떻게 만들고 있나 · 자녀분께 드리는 안내 (가족 알림 + 30초 영상) ══ */
export function Family() {
  return (
    <Section>
      <Wrap className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow icon="chart">{family.buildEyebrow}</Eyebrow>
          <Heading text={family.buildTitle} small />
          <Reveal delay={1} className="mt-[22px] grid gap-3">
            {BUILD_FACTS.map((f) => (
              <Card key={f.title} className="border-transparent bg-cc-mist">
                <b className="text-lg">{f.title}</b>
                {f.body && <p className="mt-1.5 text-[16.5px] text-cc-muted">{f.body}</p>}
              </Card>
            ))}
          </Reveal>
          <SourceNote text={family.buildSource} />
        </div>

        <div>
          <Eyebrow icon="family">{family.eyebrow}</Eyebrow>
          <Heading text={family.title} small />
          <Lead text={family.lead} />
          <Reveal delay={2} className="mt-[22px] grid grid-cols-1 gap-3 lg:grid-cols-2">
            {FAMILY_SHARE.map((s) => (
              <Card
                key={s.title}
                className={cn(s.tone === "go" ? "border-transparent bg-cc-mist" : "border-[#F2D6D2] bg-cc-blush")}
              >
                <IconBox icon={s.icon} tone={s.tone === "go" ? "green" : "red"} small />
                <b className="mt-3 block text-[17px]">{s.title}</b>
                <p className="mt-[5px] text-[15.5px] text-cc-muted">{s.body}</p>
              </Card>
            ))}
          </Reveal>
          <Video src={family.video.src} poster={family.video.poster} fallback={VIDEO_FALLBACK} />
          <SourceNote text={family.video.caption} className="text-center" />
        </div>
      </Wrap>
    </Section>
  )
}
