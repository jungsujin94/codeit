import Image from "next/image"
import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, IconBox, Lead, Section, Wrap } from "@/components/section-parts"
import { features, FEATURE_CARDS } from "@/content/sections"

/* ══ 05 이렇게 도와드려요 (벤토) ══
   큰 카드 하나(홈 화면 그림 포함) + 작은 카드 둘. 카드는 shadcn/ui Card 입니다. */
export function Features() {
  return (
    <Section tone="tint">
      <Wrap>
        <Eyebrow icon="check">{features.eyebrow}</Eyebrow>
        <Heading text={features.title} />
        <Lead text={features.lead} />

        <div className="mt-[34px] grid grid-cols-1 gap-[18px] lg:grid-cols-[1.35fr_1fr]">
          {FEATURE_CARDS.map((card, i) => (
            <Reveal
              key={card.title}
              delay={(i + 1) as 1 | 2 | 3}
              className={cn(card.big && "lg:row-span-2")}
            >
              <Card className={cn("h-full", card.big && "justify-between")}>
                <div>
                  <IconBox icon={card.icon} />
                  <h3 className={cn("mb-[9px] text-[21px]", card.big ? "mt-[18px]" : "mt-4")}>{card.title}</h3>
                  <p className="text-[16.5px] text-cc-muted">{card.body}</p>
                </div>
                {card.big && (
                  <Image
                    {...features.image}
                    alt={features.image.alt}
                    sizes="280px"
                    className="mx-auto mt-[22px] h-[360px] w-full max-w-[280px] rounded-2xl border border-cc-line object-cover object-top"
                  />
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </Section>
  )
}
