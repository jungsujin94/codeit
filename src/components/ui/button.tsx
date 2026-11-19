import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
  shadcn/ui Button — 찬찬 브랜드에 맞게 고친 판.
  어르신이 누르기 쉽게 기본 높이를 52px(작은 것 44px)로, 모서리는 알약 모양입니다.
*/
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-[9px] rounded-full font-bold whitespace-nowrap no-underline transition-[background-color,box-shadow,transform] duration-200 outline-none select-none hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-cc-leaf/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-cc-green text-white hover:bg-cc-deep",
        outline:
          "bg-transparent text-cc-green shadow-[inset_0_0_0_2px_var(--color-cc-line)] hover:bg-cc-mist hover:shadow-[inset_0_0_0_2px_var(--color-cc-leaf)]",
        onDark: "bg-cc-snow text-cc-deep hover:bg-white",
        ghost: "hover:bg-cc-mist hover:text-cc-green",
        link: "text-cc-green underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[52px] px-[26px] text-[17px]",
        sm: "min-h-11 px-[18px] text-[15px]",
        "icon-sm": "size-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
