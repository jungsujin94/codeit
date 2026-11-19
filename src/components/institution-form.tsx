"use client"

import { useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { INSTITUTION_FIELDS, institutionForm, type FieldSpec } from "@/content/institution"
import { MAIL } from "@/content/site"

/*
  시범 도입 문의 신청서 — 원본 site.js 의 검사 순서를 그대로 옮겼습니다.

    ⓐ 숨은 칸(nickname)이 채워져 있으면 기계입니다 → 아무 말 없이 「접수되었습니다」
    ⓑ 필수 칸이 비었으면 → 무엇이 빠졌는지 그 자리에서 말씀드립니다
       이메일 모양이 틀리면 → 「이메일 주소를 다시 봐 주세요」
    ⓒ 처음 손댄 뒤 2초 안에 다 채웠으면 사람이 아닙니다 → 아무 말 없이 「접수되었습니다」
       (⚠️ 채워진 것을 먼저 봅니다. 순서를 바꾸면 빈 신청서에 「접수되었습니다」가 뜹니다)
    ⓓ 통과 → 「접수되었습니다」

  ⚠️ 과제용 사본입니다. **어디로도 보내지 않습니다.** fetch · API · Supabase 를 쓰지 않습니다.
*/

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
/* 사람이 칸 넷을 채우는 데 2초는 걸립니다 */
const MIN_FILL_MS = 2000

const fieldClass =
  "min-h-[52px] rounded-[14px] border-2 border-cc-line bg-white px-[15px] py-[13px] text-[16.5px] md:text-[16.5px] focus-visible:border-cc-leaf focus-visible:ring-0"

function Field({ f }: { f: FieldSpec }) {
  const common = { id: f.id, name: f.name, maxLength: f.maxLength, autoComplete: f.autoComplete }
  return (
    <div className="mb-[18px]">
      <Label htmlFor={f.id} className="mb-2 block text-base leading-normal font-bold">
        {f.label} {f.required && <span className="text-cc-alert">*</span>}
      </Label>
      {f.kind === "select" ? (
        <select {...common} className={`w-full ${fieldClass} outline-none focus:border-cc-leaf`}>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : f.kind === "textarea" ? (
        <Textarea {...common} className={`min-h-[110px] resize-y ${fieldClass}`} />
      ) : (
        <Input
          {...common}
          type={f.kind}
          inputMode={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : undefined}
          placeholder={f.placeholder}
          className={`h-auto ${fieldClass}`}
        />
      )}
      {f.hint && <span className="mt-[7px] block text-sm text-cc-muted">{f.hint}</span>}
    </div>
  )
}

export function InstitutionForm() {
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const started = useRef(0)
  const doneRef = useRef<HTMLDivElement>(null)

  function onStart() {
    if (!started.current) started.current = Date.now()
  }

  function finish() {
    setError("")
    setDone(true)
    /* 읽어 주는 화면을 쓰시는 분께도 바뀐 것이 전해지도록, 접수 안내로 초점을 옮깁니다 */
    requestAnimationFrame(() => doneRef.current?.focus({ preventScroll: true }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (done) return
    const data = new FormData(e.currentTarget)
    const get = (name: string) => String(data.get(name) ?? "").trim()

    // ⓐ 숨은 칸
    if (get("nickname")) return finish()

    // ⓑ 빠진 칸 → 이메일 모양
    const missing =
      INSTITUTION_FIELDS.find((f) => f.required && !get(f.name))?.required ??
      (!get("consent") ? institutionForm.consent.missing : undefined) ??
      (institutionForm.emailFields.some((n) => !EMAIL_RE.test(get(n))) ? institutionForm.badEmail : undefined)
    if (missing) {
      setError(missing)
      return
    }

    // ⓒ 너무 빠름
    if (!started.current || Date.now() - started.current < MIN_FILL_MS) return finish()

    // ⓓ 통과 — 과제용 사본이라 보내지 않고 접수 화면만 보여 드립니다
    finish()
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onStart} onChange={onStart}>
      {!done ? (
        <div>
          <h3 className="mb-1.5 text-[23px]">{institutionForm.title}</h3>
          <p className="mb-[22px] text-base text-cc-muted">{institutionForm.sub}</p>

          {INSTITUTION_FIELDS.map((f) => (
            <Field key={f.name} f={f} />
          ))}

          {/* 사람 눈에 보이지 않는 칸. 채워져 있으면 기계입니다 */}
          <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
            <label htmlFor="org-nick">nickname</label>
            <input type="text" id="org-nick" name="nickname" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mb-[18px] rounded-2xl bg-cc-ivory p-[18px]">
            <label htmlFor="org-agree" className="flex cursor-pointer items-start gap-[11px] text-[16.5px]">
              <input
                type="checkbox"
                id="org-agree"
                name="consent"
                className="mt-0.5 size-[21px] flex-none accent-cc-green"
              />
              <span>
                {institutionForm.consent.label}{" "}
                <span className="text-cc-alert">{institutionForm.consent.required}</span>
              </span>
            </label>
            <ul className="mt-3 pl-8">
              {institutionForm.consent.items.map((item) => (
                <li
                  key={item}
                  className="relative mb-[5px] pl-3 text-[14.5px] text-cc-muted before:absolute before:left-0 before:content-['·']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p
            role="alert"
            aria-live="polite"
            hidden={!error}
            className="mb-4 rounded-xl bg-cc-blush px-[15px] py-[13px] text-base text-[#8E3833]"
          >
            {error}
          </p>

          <Button type="submit" className="w-full">
            {institutionForm.submit}
          </Button>
          <noscript>
            <p className="mt-3 rounded-[14px] bg-cc-ivory p-4 text-[15px] text-cc-muted">
              {institutionForm.noscriptBefore}
              <a href={`mailto:${MAIL}`}>{MAIL}</a>
              {institutionForm.noscriptAfter}
            </p>
          </noscript>
        </div>
      ) : (
        <div ref={doneRef} tabIndex={-1} className="px-2.5 py-[34px] text-center outline-none">
          <b className="mb-2.5 block text-[22px] text-cc-green">{institutionForm.done.title}</b>
          <p className="text-[16.5px] text-cc-muted">{institutionForm.done.body}</p>
        </div>
      )}
    </form>
  )
}
