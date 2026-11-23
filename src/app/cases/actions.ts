"use server"

/*
  의심 문자 사례 — Server Actions (등록 · 수정 · 삭제).
  ⚠️ 이 함수들은 화면 밖에서도 POST 로 부를 수 있습니다. 그래서 화면에서 검사했더라도 여기서 한 번 더 검사합니다.
  (로그인 · 사용자별 권한은 이번 과제 범위가 아닙니다 → 미션 7)
*/
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createCase, deleteCase, updateCase } from "@/lib/cases/store"
import {
  validateFields,
  validateImage,
  type CaseFields,
  type FieldErrors,
  type SenderType,
} from "@/lib/cases/schema"
import type { VerdictKey } from "@/content/verdicts"

export type FormState = {
  errors: FieldErrors
  /** 칸과 상관없는 실패 (저장소 오류 등) */
  message?: string
  /** 실패했을 때 쓰신 글을 다시 채워 드리기 위해 돌려줍니다 */
  values?: CaseFields
}

const text = (fd: FormData, key: string) => {
  const v = fd.get(key)
  return typeof v === "string" ? v : ""
}

function readFields(fd: FormData): CaseFields {
  return {
    title: text(fd, "title"),
    message: text(fd, "message"),
    senderType: text(fd, "senderType"),
    verdict: text(fd, "verdict"),
    note: text(fd, "note"),
  }
}

function readFile(fd: FormData) {
  const f = fd.get("image")
  return f instanceof File && f.size > 0 ? f : null
}

const clean = (f: CaseFields) => ({
  title: f.title.trim(),
  message: f.message.trim(),
  senderType: f.senderType as SenderType,
  verdict: f.verdict as VerdictKey,
  note: f.note.trim(),
})

const SAVE_FAILED = "저장하지 못했습니다. 잠시 뒤 다시 눌러 주세요. 쓰신 내용은 그대로 남아 있습니다."

export async function createCaseAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const fields = readFields(fd)
  const file = readFile(fd)
  const errors = validateFields(fields)
  const imageError = validateImage(file)
  if (imageError) errors.image = imageError
  if (Object.keys(errors).length) return { errors, values: fields }

  let id: string
  try {
    id = (await createCase(clean(fields), file)).id
  } catch (err) {
    console.error("[cases] create failed", err)
    return { errors: {}, message: SAVE_FAILED, values: fields }
  }
  revalidatePath("/cases")
  redirect(`/cases/${id}?saved=created`)
}

export async function updateCaseAction(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const fields = readFields(fd)
  const mode = text(fd, "imageMode") // keep | remove | replace
  const file = readFile(fd)
  const errors = validateFields(fields)
  if (mode === "replace") {
    const imageError = file ? validateImage(file) : "바꿀 그림을 골라 주세요."
    if (imageError) errors.image = imageError
  }
  if (Object.keys(errors).length) return { errors, values: fields }

  let found: boolean
  try {
    const image = mode === "remove" ? "remove" : mode === "replace" && file ? file : "keep"
    found = (await updateCase(id, clean(fields), image)) !== null
  } catch (err) {
    console.error("[cases] update failed", err)
    return { errors: {}, message: SAVE_FAILED, values: fields }
  }
  if (!found) return { errors: {}, message: "이 사례는 이미 지워졌습니다. 목록에서 다시 확인해 주세요.", values: fields }

  revalidatePath("/cases")
  revalidatePath(`/cases/${id}`)
  redirect(`/cases/${id}?saved=updated`)
}

export async function deleteCaseAction(id: string): Promise<{ message: string } | void> {
  try {
    await deleteCase(id)
  } catch (err) {
    console.error("[cases] delete failed", err)
    return { message: "지우지 못했습니다. 잠시 뒤 다시 눌러 주세요." }
  }
  revalidatePath("/cases")
  redirect("/cases?deleted=1")
}
