"use client"

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, describedBy, fieldClass } from "@/components/cases/form-field"
import { VerdictBadge } from "@/components/cases/verdict-badge"
import type { FormState } from "@/app/cases/actions"
import { cases } from "@/content/cases"
import { VERDICTS } from "@/content/verdicts"
import {
  LIMITS,
  SENDER_TYPES,
  validateFields,
  validateImage,
  type CaseFields,
  type CaseRecord,
  type FieldErrors,
  type FieldName,
} from "@/lib/cases/schema"

/*
  등록 · 수정이 같이 쓰는 신청서.
  · 누르면 먼저 브라우저에서 검사 → 틀린 칸이 있으면 보내지 않고 그 칸으로 갑니다.
  · 통과하면 Server Action 으로 보냅니다. 저장하는 동안 버튼이 잠겨 두 번 저장되지 않습니다.
  · 서버가 돌려준 오류도 같은 자리에 보여 드리고, 쓰신 글은 그대로 남깁니다.
*/

type ImageMode = "keep" | "replace" | "remove"
const FIELD_ORDER: FieldName[] = ["title", "message", "senderType", "verdict", "note", "image"]
const INITIAL: FormState = { errors: {} }

export function CaseForm({
  action,
  initial,
  cancelHref,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>
  /** 수정일 때 지금 값 */
  initial?: CaseRecord
  cancelHref: string
}) {
  const t = cases.form
  const isEdit = Boolean(initial)
  const [state, formAction, pending] = useActionState(action, INITIAL)

  const [values, setValues] = useState<CaseFields>({
    title: initial?.title ?? "",
    message: initial?.message ?? "",
    senderType: initial?.senderType ?? "",
    verdict: initial?.verdict ?? "",
    note: initial?.note ?? "",
  })
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null)
  const [mode, setMode] = useState<ImageMode>(initial?.image ? "keep" : "replace")
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  /* 서버가 돌려준 오류가 새로 오면 그것을 보여 드립니다 */
  const [seenState, setSeenState] = useState(state)
  if (state !== seenState) {
    setSeenState(state)
    setClientErrors(null)
  }
  const errors = clientErrors ?? state.errors
  const errorCount = Object.keys(errors).length

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  /* 보낸 뒤 오류가 있으면 첫 번째 틀린 칸으로 초점을 옮깁니다 (쓰는 동안에는 옮기지 않습니다) */
  function focusFirst(found: FieldErrors, message?: string) {
    const first = FIELD_ORDER.find((f) => found[f])
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus()
    else if (message) summaryRef.current?.focus()
  }
  useEffect(() => {
    focusFirst(state.errors, state.message)
  }, [state])

  const set = (k: keyof CaseFields) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }))
    if (clientErrors?.[k]) setClientErrors((e) => ({ ...e, [k]: undefined }))
  }

  function onFile(file: File | undefined) {
    const err = file ? validateImage(file) : undefined
    setPreview(file && !err ? URL.createObjectURL(file) : null)
    setClientErrors((e) => ({ ...(e ?? {}), image: err }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return
    const fd = new FormData(e.currentTarget)
    const file = fd.get("image")
    const f = file instanceof File && file.size > 0 ? file : null

    const found = validateFields(values)
    const imgErr = mode === "replace" ? validateImage(f) : undefined
    if (imgErr) found.image = imgErr
    if (isEdit && mode === "replace" && !f) found.image = "바꿀 그림을 골라 주세요."
    if (Object.keys(found).length) {
      setClientErrors(found)
      requestAnimationFrame(() => focusFirst(found))
      return
    }
    if (mode !== "replace") fd.delete("image")
    setClientErrors({})
    /* 직접 보냅니다 — React 가 신청서를 자동으로 비우지 않아, 실패해도 쓰신 글이 남습니다 */
    startTransition(() => formAction(fd))
  }

  const err = (k: FieldName) => errors[k]
  const invalid = (k: FieldName) => (errors[k] ? true : undefined)

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate encType="multipart/form-data" aria-busy={pending}>
      <input type="hidden" name="imageMode" value={mode} />

      {(errorCount > 0 || state.message) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-xl bg-cc-blush px-[15px] py-[13px] text-[17px] text-[#8E3833] outline-none"
        >
          {state.message && !clientErrors ? state.message : t.fixErrors(errorCount)}
        </div>
      )}

      <FormField id="case-title" label={t.title.label} required hint={t.title.hint} error={err("title")}>
        <Input
          id="case-title"
          name="title"
          data-field="title"
          value={values.title}
          onChange={(e) => set("title")(e.target.value)}
          maxLength={LIMITS.title.max + 20}
          placeholder={t.title.placeholder}
          aria-invalid={invalid("title")}
          aria-describedby={describedBy("case-title", err("title"), t.title.hint)}
          className={cn("h-auto", fieldClass)}
        />
      </FormField>

      <FormField id="case-message" label={t.message.label} required hint={t.message.hint} error={err("message")}>
        <Textarea
          id="case-message"
          name="message"
          data-field="message"
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder={t.message.placeholder}
          aria-invalid={invalid("message")}
          aria-describedby={describedBy("case-message", err("message"), t.message.hint)}
          className={cn("min-h-[150px] resize-y", fieldClass)}
        />
        <span className="mt-1 block text-right text-[15px] text-cc-muted" aria-hidden="true">
          {values.message.trim().length} / {LIMITS.message.max}
        </span>
      </FormField>

      <FormField id="case-sender" label={t.senderType.label} required error={err("senderType")}>
        <select
          id="case-sender"
          name="senderType"
          data-field="senderType"
          value={values.senderType}
          onChange={(e) => set("senderType")(e.target.value)}
          aria-invalid={invalid("senderType")}
          aria-describedby={describedBy("case-sender", err("senderType"))}
          className={fieldClass}
        >
          <option value="">{t.senderType.placeholder}</option>
          {SENDER_TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="case-verdict" as="fieldset" label={t.verdict.label} required error={err("verdict")}>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {VERDICTS.map((v, i) => (
            <label
              key={v.key}
              className={cn(
                "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[14px] border-2 bg-white px-[15px] py-3 transition-colors",
                values.verdict === v.key ? "border-cc-green bg-cc-mist" : "border-cc-line hover:border-cc-leaf",
                errors.verdict && "border-cc-alert"
              )}
            >
              <input
                type="radio"
                name="verdict"
                value={v.key}
                data-field={i === 0 ? "verdict" : undefined}
                checked={values.verdict === v.key}
                onChange={() => set("verdict")(v.key)}
                className="size-5 flex-none accent-cc-green"
              />
              <VerdictBadge verdict={v.key} className="border-0 bg-transparent px-0 py-0" />
            </label>
          ))}
        </div>
      </FormField>

      <FormField id="case-note" label={t.note.label} hint={t.note.hint} error={err("note")}>
        <Textarea
          id="case-note"
          name="note"
          data-field="note"
          value={values.note}
          onChange={(e) => set("note")(e.target.value)}
          placeholder={t.note.placeholder}
          aria-invalid={invalid("note")}
          aria-describedby={describedBy("case-note", err("note"), t.note.hint)}
          className={cn("min-h-[110px] resize-y", fieldClass)}
        />
      </FormField>

      <FormField id="case-image" as="fieldset" label={t.image.label} hint={t.image.hint} error={err("image")}>
        {initial?.image && (
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={initial.image.url}
              alt={t.image.currentAlt}
              width={160}
              height={220}
              unoptimized
              className={cn(
                "h-[220px] w-40 flex-none rounded-xl border border-cc-line object-cover object-top",
                mode !== "keep" && "opacity-40"
              )}
            />
            <div className="flex flex-col gap-2">
              {(["keep", "replace", "remove"] as const).map((m) => (
                <label key={m} className="flex min-h-11 cursor-pointer items-center gap-3 text-[17px]">
                  <input
                    type="radio"
                    name="imageModePick"
                    checked={mode === m}
                    onChange={() => {
                      setMode(m)
                      setClientErrors((e) => ({ ...(e ?? {}), image: undefined }))
                    }}
                    className="size-5 accent-cc-green"
                  />
                  {t.image[m]}
                </label>
              ))}
            </div>
          </div>
        )}
        {mode === "replace" && (
          <>
            <input
              id="case-image"
              type="file"
              name="image"
              data-field="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => onFile(e.target.files?.[0])}
              aria-invalid={invalid("image")}
              aria-describedby={describedBy("case-image", err("image"), t.image.hint)}
              className={cn(
                fieldClass,
                "cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-cc-mist file:px-4 file:py-2 file:text-[15px] file:font-bold file:text-cc-green"
              )}
            />
            {preview && (
              <Image
                src={preview}
                alt={t.image.previewAlt}
                width={160}
                height={220}
                unoptimized
                className="mt-3 h-[220px] w-40 rounded-xl border border-cc-line object-cover object-top"
              />
            )}
          </>
        )}
      </FormField>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
          {t.cancel}
        </Link>
        <Button type="submit" disabled={pending} className="sm:min-w-44">
          {pending ? t.pending : isEdit ? t.submitEdit : t.submitCreate}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? t.pending : ""}
      </p>
    </form>
  )
}
