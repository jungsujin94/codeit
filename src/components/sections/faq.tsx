import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Reveal } from "@/components/reveal"
import { Eyebrow, Heading, Section, Wrap } from "@/components/section-parts"
import { faq, FAQS } from "@/content/sections"

/* ══ FAQ ══ 원본 <details> → shadcn/ui Accordion. 여러 개를 함께 펼칠 수 있습니다(원본과 같음). */
export function Faq() {
  return (
    <Section tone="tint">
      <Wrap className="max-w-[860px]">
        <Eyebrow icon="q">{faq.eyebrow}</Eyebrow>
        <Heading text={faq.title} />
        <Reveal delay={1} className="mt-[26px]">
          <Accordion multiple>
            {FAQS.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-b border-cc-line">
                <AccordionTrigger className="cursor-pointer items-center gap-3 rounded-none py-5 text-[19px] font-bold text-cc-ink hover:no-underline **:data-[slot=accordion-trigger-icon]:size-6 **:data-[slot=accordion-trigger-icon]:text-cc-green">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[70ch] pb-[22px] text-[16.5px] leading-[1.7] text-cc-muted">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Wrap>
    </Section>
  )
}
