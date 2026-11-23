/*
  의심 문자 사례 — 데이터 모양과 검사 규칙.
  브라우저(입력하는 동안)와 서버(저장 직전)가 이 파일 하나를 같이 씁니다.
  ⚠️ 서버 검사가 진짜입니다. 브라우저 검사는 빨리 알려 드리기 위한 것일 뿐입니다.
*/
import type { VerdictKey } from "@/content/verdicts"

export const SENDER_TYPES = [
  "모르는 번호",
  "택배 · 배송",
  "기관 사칭",
  "가족 · 지인 사칭",
  "금융 · 대출",
  "기타",
] as const
export type SenderType = (typeof SENDER_TYPES)[number]

export const VERDICT_KEYS: VerdictKey[] = ["d", "c", "u"]

/** 저장되는 한 건 (Blob 에는 cases/{id}.json 으로 들어갑니다) */
export type CaseRecord = {
  id: string
  title: string
  message: string
  senderType: SenderType
  verdict: VerdictKey
  note: string
  image: CaseImage | null
  createdAt: string
  updatedAt: string
}

export type CaseImage = {
  /** 화면에 그릴 주소 */
  url: string
  /** 저장소 안의 경로 (지울 때 씁니다) */
  path: string
  contentType: string
  size: number
}

export const LIMITS = {
  title: { min: 2, max: 60 },
  message: { min: 5, max: 1000 },
  note: { max: 500 },
  image: { maxBytes: 3 * 1024 * 1024 },
} as const

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const PAGE_SIZE = 6

export type CaseFields = {
  title: string
  message: string
  senderType: string
  verdict: string
  note: string
}

export type FieldName = keyof CaseFields | "image"
export type FieldErrors = Partial<Record<FieldName, string>>

/** 글자 칸 검사 — 틀린 칸마다 어르신이 읽고 고칠 수 있는 말로 돌려줍니다 */
export function validateFields(f: CaseFields): FieldErrors {
  const e: FieldErrors = {}
  const title = f.title.trim()
  const message = f.message.trim()

  if (!title) e.title = "제목을 적어 주세요."
  else if (title.length < LIMITS.title.min) e.title = `제목은 ${LIMITS.title.min}자 이상 적어 주세요.`
  else if (title.length > LIMITS.title.max) e.title = `제목은 ${LIMITS.title.max}자까지 적을 수 있어요.`

  if (!message) e.message = "받으신 문자 내용을 적어 주세요."
  else if (message.length < LIMITS.message.min) e.message = `문자 내용은 ${LIMITS.message.min}자 이상 적어 주세요.`
  else if (message.length > LIMITS.message.max) e.message = `문자 내용은 ${LIMITS.message.max}자까지 적을 수 있어요.`

  if (!f.senderType) e.senderType = "보낸 곳을 골라 주세요."
  else if (!(SENDER_TYPES as readonly string[]).includes(f.senderType)) e.senderType = "목록에 있는 것 중에서 골라 주세요."

  if (!f.verdict) e.verdict = "판정을 하나 골라 주세요."
  else if (!(VERDICT_KEYS as string[]).includes(f.verdict)) e.verdict = "판정은 셋 중 하나만 고를 수 있어요."

  if (f.note.trim().length > LIMITS.note.max) e.note = `설명은 ${LIMITS.note.max}자까지 적을 수 있어요.`

  return e
}

/** 그림 파일 검사 — 파일이 없으면(선택 안 함) 통과입니다. 그림은 꼭 넣지 않아도 됩니다 */
export function validateImage(file: { type: string; size: number } | null): string | undefined {
  if (!file || file.size === 0) return undefined
  if (!IMAGE_TYPES[file.type]) return "JPG · PNG · WEBP 그림만 올릴 수 있어요."
  if (file.size > LIMITS.image.maxBytes) return "그림은 3MB 까지 올릴 수 있어요. 더 작은 그림을 골라 주세요."
  return undefined
}

/* 화면에 날짜를 보여 줄 때 (한국 시간) */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}
