import Image from "next/image"
import { Icon } from "@/components/icon"
import { Rich } from "@/components/rich"
import { ScrollToButton } from "@/components/scroll-to-button"
import { Wrap } from "@/components/section-parts"
import { hero, HERO_PHONES, HERO_POINTS, SECTION } from "@/content/site"

/* ══ 02 히어로 ══
   폰 두 대가 겹쳐 서 있고, 설명글은 그 아래 자리를 따로 받습니다. */
export function Hero() {
  return (
    <div
      id="top"
      className="overflow-x-clip bg-[radial-gradient(1100px_460px_at_78%_-8%,var(--color-cc-mist)_0%,rgba(233,242,236,0)_62%)] pt-[34px] pb-[60px] lg:pt-14 lg:pb-[86px]"
    >
      <Wrap className="grid grid-cols-1 items-center gap-[34px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-12">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-cc-mist px-[15px] py-[7px] text-[15px] font-bold text-cc-green">
            <Icon name="shield" size="sm" />
            {hero.eyebrow}
          </p>
          <h1 className="text-[clamp(36px,5vw,68px)] leading-[1.12] tracking-[-0.025em]">
            <Rich text={hero.title} />
          </h1>
          <p className="mt-5 max-w-[46ch] text-[clamp(17px,1.6vw,21px)] leading-[1.65] text-cc-muted">
            <Rich text={hero.sub} />
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ScrollToButton target={SECTION.demo}>
              <Icon name="scan" size="sm" />
              {hero.primary}
            </ScrollToButton>
            <ScrollToButton target={SECTION.institution} variant="outline">
              {hero.secondary}
            </ScrollToButton>
          </div>
          <ul className="mt-[26px] flex flex-wrap gap-[22px]">
            {HERO_POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-[9px] text-[15.5px] text-cc-muted">
                <Icon name={p.icon} size="sm" className="text-cc-leaf" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex h-[430px] items-center justify-center pb-[46px] lg:h-[560px]">
          <figure className="absolute top-[34px] left-1/2 -ml-[166px] w-[194px] animate-ph-back overflow-hidden rounded-[30px] border border-cc-line bg-white shadow-[0_26px_60px_rgba(36,51,43,.22)]">
            <Image {...HERO_PHONES.back} alt={HERO_PHONES.back.alt} priority sizes="194px" className="block h-auto w-full" />
          </figure>
          <figure className="absolute top-1.5 left-1/2 -ml-5 w-[218px] animate-ph-front overflow-hidden rounded-[30px] border border-cc-line bg-white shadow-[0_26px_60px_rgba(36,51,43,.22)]">
            {/* 결과 화면은 아주 깁니다. [112에 전화하기] 버튼 번짐까지(727px) 보이게 자릅니다 */}
            <Image
              {...HERO_PHONES.front}
              alt={HERO_PHONES.front.alt}
              priority
              sizes="218px"
              className="block aspect-[390/727] h-auto w-full object-cover object-top"
            />
          </figure>
          <p className="absolute inset-x-0 bottom-0 text-center text-[13px] leading-normal text-cc-muted">
            <Rich text={hero.phonesCaption} />
          </p>
        </div>
      </Wrap>
    </div>
  )
}
