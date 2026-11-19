import type { ComponentPropsWithoutRef, ElementType } from "react"
import { cn } from "cn"

/*
  스크롤해서 화면에 들어오면 아래에서 살짝 올라오며 나타납니다 (원본 `.reveal`).
  실제로 보이게 하는 것은 <RevealObserver /> 가 붙이는 data-in 입니다.
  움직임 줄이기를 켜신 분께는 처음부터 보입니다.
*/
const DELAY = ["", "delay-100", "delay-200", "delay-300"] as const

type RevealProps<T extends ElementType> = {
  as?: T
  delay?: 0 | 1 | 2 | 3
} & ComponentPropsWithoutRef<T>

export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  className,
  ...props
}: RevealProps<T>) {
  const Tag: ElementType = as ?? "div"
  return (
    <Tag
      data-reveal=""
      className={cn(
        "translate-y-4 opacity-0 transition-[opacity,translate] duration-550 ease-rise data-in:translate-y-0 data-in:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        DELAY[delay],
        className
      )}
      {...props}
    />
  )
}
