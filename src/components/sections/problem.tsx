import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, Lead, Section, SourceNote, Wrap } from "@/components/section-parts"
import { problem, PROBLEM_FIGURES, PROBLEM_STEPS } from "@/content/sections"
import { SECTION } from "@/content/site"

/* ══ 03 문제 → 해결 ══ (어두운 구간) */
export function Problem() {
  return (
    <Section id={SECTION.problem} tone="dark">
      <Wrap>
        <Eyebrow icon="warn" dark>
          {problem.eyebrow}
        </Eyebrow>
        <Heading text={problem.title} />
        <Lead text={problem.lead} dark />

        <div className="mt-[30px] grid grid-cols-1 gap-[18px] lg:grid-cols-2">
          {PROBLEM_FIGURES.map((f, i) => (
            <Reveal
              key={f.value}
              delay={(i + 1) as 1 | 2}
              className="rounded-[20px] border border-cc-haze/20 bg-white/7 p-6"
            >
              <b className="block text-[clamp(28px,3.4vw,40px)] leading-[1.1] text-white">{f.value}</b>
              <span className="mt-[9px] block text-[15.5px] leading-normal text-cc-sage">{f.label}</span>
            </Reveal>
          ))}
        </div>

        <ol className="mt-[34px] grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PROBLEM_STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={(i + 1) as 1 | 2 | 3}
              className="rounded-[20px] border border-cc-haze/20 bg-white/7 p-[22px]"
            >
              <em className="mb-3 inline-flex size-[30px] items-center justify-center rounded-full bg-cc-coral text-[15px] font-bold text-white not-italic">
                {i + 1}
              </em>
              <b className="mb-1.5 block text-[19px] text-white">{s.title}</b>
              <span className="text-[15.5px] leading-[1.55] text-cc-sage">{s.body}</span>
            </Reveal>
          ))}
        </ol>

        <SourceNote text={problem.source} dark />
      </Wrap>
    </Section>
  )
}
