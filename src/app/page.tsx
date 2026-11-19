import { RevealObserver } from "@/components/reveal-observer"
import { Audience } from "@/components/sections/audience"
import { Demo } from "@/components/sections/demo"
import { Faq } from "@/components/sections/faq"
import { Family } from "@/components/sections/family"
import { Features } from "@/components/sections/features"
import { Hero } from "@/components/sections/hero"
import { Institution } from "@/components/sections/institution"
import { Problem } from "@/components/sections/problem"
import { SiteFooter } from "@/components/sections/site-footer"
import { SiteHeader } from "@/components/sections/site-header"
import { VerdictTiers } from "@/components/sections/verdict-tiers"

/* chanchan.kr 와 같은 차례입니다. 구간 하나 = 파일 하나 (src/components/sections/). */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Problem />
        <Demo />
        <Features />
        <VerdictTiers />
        <Audience />
        <Family />
        <Faq />
        <Institution />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  )
}
