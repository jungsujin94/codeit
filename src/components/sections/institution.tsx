import { Card } from "@/components/ui/card"
import { InstitutionForm } from "@/components/institution-form"
import { Rich } from "@/components/rich"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, Lead, Section, SourceNote, Video, Wrap } from "@/components/section-parts"
import { institution, INSTITUTION_CARDS, institutionForm } from "@/content/institution"
import { VIDEO_FALLBACK } from "@/content/sections"
import { SECTION } from "@/content/site"

/* ══ 07 기관 도입 + 시범 도입 문의 ══ (어두운 구간)
   ⚠️ id="기관문의" 는 네비게이션 · 띠 · 히어로 버튼이 내려보내는 자리입니다. */
export function Institution() {
  return (
    <Section id={SECTION.institution} tone="dark">
      <Wrap>
        <Video src={institution.video.src} poster={institution.video.poster} fallback={VIDEO_FALLBACK} wide />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow icon="gov" dark>
              {institution.eyebrow}
            </Eyebrow>
            <Heading text={institution.title} />
            <Lead text={institution.lead} dark />
            <Reveal delay={2} className="mt-[26px] grid gap-3">
              {INSTITUTION_CARDS.map((c) => (
                <Card key={c.title} className="border-cc-haze/20 bg-white/5.5 text-cc-snow">
                  <b className="text-[17px]">{c.title}</b>
                  <p className="mt-[5px] text-[16.5px] text-cc-sage">
                    <Rich text={c.body} />
                  </p>
                </Card>
              ))}
            </Reveal>
            <SourceNote text={institution.source} dark />
          </div>

          {/* ⚠️ 글자색을 반드시 되돌립니다 — 어두운 구간의 흰 글자가 흰 카드로 새면 신청서가 안 보입니다 */}
          <Reveal
            delay={1}
            className="max-w-[620px] rounded-3xl border border-cc-line bg-white p-[22px] text-cc-ink lg:p-[30px]"
          >
            <p className="mb-5 rounded-xl bg-cc-amber-bg px-4 py-3 text-[15px] font-bold text-[#7A440F]">
              {institutionForm.copyNotice}
            </p>
            <InstitutionForm />
          </Reveal>
        </div>
      </Wrap>
    </Section>
  )
}
