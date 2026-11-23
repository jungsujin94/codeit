import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { cases } from "@/content/cases"

/* 입력 칸 공통 모양 (기관 신청서와 같은 크기 · 테두리) */
export const fieldClass =
  "min-h-[52px] w-full rounded-[14px] border-2 border-cc-line bg-white px-[15px] py-[13px] text-[17px] md:text-[17px] outline-none focus-visible:border-cc-leaf focus-visible:ring-0 aria-invalid:border-cc-alert aria-invalid:ring-0"

/**
 * 이름표 + 칸 + 도움말 + 오류 한 묶음.
 * children 에는 id={id}, aria-describedby={describedBy(id, error)} 를 단 칸을 넣습니다.
 */
export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
  as = "label",
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  /** 여러 칸을 묶을 때(라디오)는 fieldset 으로 그립니다 */
  as?: "label" | "fieldset"
}) {
  const head = (
    <>
      {label}{" "}
      {required && (
        <span className="text-cc-alert">
          * <span className="sr-only">{cases.form.required}</span>
        </span>
      )}
    </>
  )
  const foot = (
    <>
      {hint && (
        <span id={`${id}-hint`} className="mt-[7px] block text-[15px] text-cc-muted">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="mt-[7px] block text-base font-bold text-cc-alert">
          {error}
        </span>
      )}
    </>
  )

  if (as === "fieldset") {
    return (
      <fieldset className="mb-6" aria-describedby={describedBy(id, error, hint)}>
        <legend className="mb-2 block text-[17px] leading-normal font-bold">{head}</legend>
        {children}
        {foot}
      </fieldset>
    )
  }
  return (
    <div className="mb-6">
      <Label htmlFor={id} className="mb-2 block text-[17px] leading-normal font-bold">
        {head}
      </Label>
      {children}
      {foot}
    </div>
  )
}

export function describedBy(id: string, error?: string, hint?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
}
