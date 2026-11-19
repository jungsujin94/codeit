import type { ReactNode } from "react"
import { cn } from "cn"
import { Icon, type IconName } from "@/components/icon"
import { Reveal } from "@/components/reveal"
import { Rich } from "@/components/rich"

/*
  모든 구간이 같이 쓰는 머리 부분: 작은 띠(eyebrow) · 제목 · 이끄는 글 · 출처.
  dark 를 주면 어두운 구간(진한 초록 바탕)용 색으로 바뀝니다.
*/

export function Section({
  id,
  tone = "plain",
  className,
  children,
}: {
  id?: string
  tone?: "plain" | "tint" | "dark"
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 lg:py-[92px]",
        tone === "tint" && "bg-cc-ivory",
        tone === "dark" && "bg-cc-deep text-cc-snow",
        className
      )}
    >
      {children}
    </section>
  )
}

export function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto max-w-[1200px] px-5 lg:px-10", className)}>{children}</div>
}

export function Eyebrow({ icon, dark, children }: { icon: IconName; dark?: boolean; children: ReactNode }) {
  return (
    <Reveal
      as="p"
      className={cn(
        "mb-5 inline-flex items-center gap-2 rounded-full px-[15px] py-[7px] text-[15px] font-bold",
        dark ? "bg-cc-haze/14 text-[#C6DED0]" : "bg-cc-mist text-cc-green"
      )}
    >
      <Icon name={icon} size="sm" />
      {children}
    </Reveal>
  )
}

export function Heading({ text, small, className }: { text: string; small?: boolean; className?: string }) {
  return (
    <Reveal
      as="h2"
      className={cn(
        "mb-3.5 leading-[1.25]",
        small ? "text-[clamp(24px,2.6vw,32px)]" : "text-[clamp(28px,3.4vw,42px)]",
        className
      )}
    >
      <Rich text={text} />
    </Reveal>
  )
}

export function Lead({ text, dark, className }: { text: string; dark?: boolean; className?: string }) {
  return (
    <Reveal
      as="p"
      delay={1}
      className={cn(
        "max-w-[62ch] text-[clamp(17px,1.5vw,20px)] leading-[1.65]",
        dark ? "text-cc-sage" : "text-cc-muted",
        className
      )}
    >
      <Rich text={text} />
    </Reveal>
  )
}

export function SourceNote({ text, dark, className }: { text: string; dark?: boolean; className?: string }) {
  return (
    <Reveal
      as="p"
      className={cn("mt-[22px] text-[13.5px] leading-normal", dark ? "text-cc-moss" : "text-cc-muted", className)}
    >
      <Rich text={text} />
    </Reveal>
  )
}

/* 아이콘 상자 (원본 .icbox) */
export function IconBox({
  icon,
  tone = "green",
  small,
}: {
  icon: IconName
  tone?: "green" | "red"
  small?: boolean
}) {
  return (
    <div
      className={cn(
        "grid flex-none place-items-center",
        small ? "size-[42px] rounded-xl" : "size-14 rounded-2xl",
        tone === "green" ? "bg-cc-mist text-cc-green" : "bg-cc-blush text-cc-alert"
      )}
    >
      <Icon name={icon} size={small ? "sm" : "lg"} />
    </div>
  )
}

/* 영상 (포스터 그림이 먼저 보이고, 누르면 재생됩니다) */
export function Video({
  src,
  poster,
  fallback,
  wide,
  className,
}: {
  src: string
  poster: string
  fallback: string
  wide?: boolean
  className?: string
}) {
  return (
    <Reveal
      delay={wide ? 0 : 2}
      className={cn(
        "overflow-hidden rounded-3xl border bg-black",
        wide ? "mx-auto mb-12 max-w-[880px] border-white/14" : "mx-auto mt-7 max-w-[420px] border-cc-line",
        className
      )}
    >
      <video controls preload="none" poster={poster} playsInline className="block w-full text-cc-snow">
        <source src={src} type="video/mp4" />
        {fallback}
      </video>
    </Reveal>
  )
}
