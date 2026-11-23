/*
  의심 문자 사례 — 저장소 (서버에서만 씁니다).

  · 배포(Vercel): Vercel Blob 에 저장합니다. 환경 변수 BLOB_READ_WRITE_TOKEN 이 있으면 이쪽입니다.
      cases/{id}.json   — 사례 한 건 (글자 칸 + 그림 정보 + 만든 · 고친 시각)
      images/{id}-….jpg — 올린 그림 (이름 끝에 무작위 글자가 붙어 겹치지 않습니다)
  · 내 컴퓨터(npm run dev): 토큰이 없으면 프로젝트 안 .data/ 폴더에 같은 모양으로 저장합니다.
      .data/ 는 .gitignore 에 들어 있어 GitHub 에 올라가지 않습니다.

  어느 쪽이든 그림은 /cases/files/… 주소로 이 앱이 직접 내보냅니다 (Blob 저장소를 비공개로 둘 수 있습니다).
*/
import { randomUUID } from "node:crypto"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { BlobNotFoundError, del, get, list, put } from "@vercel/blob"
import { IMAGE_TYPES, PAGE_SIZE as PAGE, type CaseImage, type CaseRecord } from "./schema"

export type NewCase = Omit<CaseRecord, "id" | "createdAt" | "updatedAt">

type ImageFile = { name: string; type: string; size: number; arrayBuffer(): Promise<ArrayBuffer> }

interface Store {
  readAll(): Promise<CaseRecord[]>
  read(id: string): Promise<CaseRecord | null>
  write(record: CaseRecord): Promise<void>
  remove(id: string): Promise<void>
  putImage(id: string, file: ImageFile): Promise<CaseImage>
  removeImage(image: CaseImage): Promise<void>
  /** /cases/files/[...path] 가 그림을 내보낼 때 씁니다 */
  openImage(imagePath: string): Promise<{ body: ReadableStream<Uint8Array> | Uint8Array; contentType: string } | null>
}

/* id 는 우리가 만든 UUID 만 받습니다 — 주소창에 이상한 값을 넣어 다른 파일을 읽지 못하게 합니다 */
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
export const isValidId = (id: string) => ID_RE.test(id)
const IMAGE_PATH_RE = /^images\/[0-9a-f-]{36}-[A-Za-z0-9]+\.(jpg|png|webp)$/

const casePath = (id: string) => `cases/${id}.json`
const imageUrl = (p: string) => `/cases/files/${p}`

/* ── Vercel Blob ─────────────────────────────────────────── */
function blobStore(): Store {
  const access = process.env.BLOB_ACCESS === "public" ? "public" : "private"

  async function readJson(pathname: string): Promise<CaseRecord | null> {
    const res = await get(pathname, { access, useCache: false })
    if (!res || res.statusCode !== 200) return null
    return JSON.parse(await new Response(res.stream).text()) as CaseRecord
  }

  return {
    async readAll() {
      const paths: string[] = []
      let cursor: string | undefined
      do {
        const page = await list({ prefix: "cases/", cursor })
        paths.push(...page.blobs.map((b) => b.pathname))
        cursor = page.hasMore ? page.cursor : undefined
      } while (cursor)
      const rows = await Promise.all(paths.map(readJson))
      return rows.filter((r): r is CaseRecord => r !== null)
    },
    async read(id) {
      try {
        return await readJson(casePath(id))
      } catch (err) {
        if (err instanceof BlobNotFoundError) return null
        throw err
      }
    },
    async write(record) {
      await put(casePath(record.id), JSON.stringify(record), {
        access,
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      })
    },
    async remove(id) {
      await del(casePath(id))
    },
    async putImage(id, file) {
      const ext = IMAGE_TYPES[file.type]
      const res = await put(`images/${id}.${ext}`, Buffer.from(await file.arrayBuffer()), {
        access,
        addRandomSuffix: true,
        contentType: file.type,
      })
      return { url: imageUrl(res.pathname), path: res.pathname, contentType: file.type, size: file.size }
    },
    async removeImage(image) {
      await del(image.path)
    },
    async openImage(imagePath) {
      const res = await get(imagePath, { access })
      if (!res || res.statusCode !== 200) return null
      return { body: res.stream, contentType: res.blob.contentType }
    },
  }
}

/* ── 내 컴퓨터 (.data 폴더) ──────────────────────────────── */
function localStore(): Store {
  const root = path.join(process.cwd(), ".data")
  const file = (p: string) => path.join(root, ...p.split("/"))

  return {
    async readAll() {
      await mkdir(file("cases"), { recursive: true })
      const names = (await readdir(file("cases"))).filter((n) => n.endsWith(".json"))
      return Promise.all(
        names.map(async (n) => JSON.parse(await readFile(file(`cases/${n}`), "utf8")) as CaseRecord)
      )
    },
    async read(id) {
      try {
        return JSON.parse(await readFile(file(casePath(id)), "utf8")) as CaseRecord
      } catch {
        return null
      }
    },
    async write(record) {
      await mkdir(file("cases"), { recursive: true })
      await writeFile(file(casePath(record.id)), JSON.stringify(record, null, 2))
    },
    async remove(id) {
      await rm(file(casePath(id)), { force: true })
    },
    async putImage(id, f) {
      const p = `images/${id}-${randomUUID().slice(0, 8)}.${IMAGE_TYPES[f.type]}`
      await mkdir(file("images"), { recursive: true })
      await writeFile(file(p), Buffer.from(await f.arrayBuffer()))
      return { url: imageUrl(p), path: p, contentType: f.type, size: f.size }
    },
    async removeImage(image) {
      await rm(file(image.path), { force: true })
    },
    async openImage(imagePath) {
      try {
        const body = new Uint8Array(await readFile(file(imagePath)))
        const ext = imagePath.split(".").pop()
        const contentType = Object.keys(IMAGE_TYPES).find((t) => IMAGE_TYPES[t] === ext) ?? "application/octet-stream"
        return { body, contentType }
      } catch {
        return null
      }
    },
  }
}

const store: Store = process.env.BLOB_READ_WRITE_TOKEN ? blobStore() : localStore()

/* ── 화면 · Server Action 이 쓰는 함수 ───────────────────── */

export type ListQuery = { page: number; q?: string; verdict?: string; sort?: "new" | "old" }

export async function listCases({ page, q, verdict, sort = "new" }: ListQuery) {
  let rows = await store.readAll()
  if (verdict) rows = rows.filter((r) => r.verdict === verdict)
  if (q) {
    const needle = q.toLowerCase()
    rows = rows.filter(
      (r) => r.title.toLowerCase().includes(needle) || r.message.toLowerCase().includes(needle)
    )
  }
  rows.sort((a, b) => (sort === "old" ? 1 : -1) * a.createdAt.localeCompare(b.createdAt))

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE))
  const current = Math.min(Math.max(1, page), pageCount)
  return { items: rows.slice((current - 1) * PAGE, current * PAGE), total, page: current, pageCount }
}

export async function getCase(id: string) {
  if (!isValidId(id)) return null
  return store.read(id)
}

export async function createCase(input: Omit<NewCase, "image">, image: ImageFile | null) {
  const id = randomUUID()
  const now = new Date().toISOString()
  const saved = image ? await store.putImage(id, image) : null
  const record: CaseRecord = { id, ...input, image: saved, createdAt: now, updatedAt: now }
  try {
    await store.write(record)
  } catch (err) {
    /* 글을 못 남겼으면 먼저 올린 그림도 치웁니다 */
    if (saved) await store.removeImage(saved).catch(() => {})
    throw err
  }
  return record
}

/**
 * 고치기. image 는
 *  · "keep"   — 그대로 둠
 *  · "remove" — 지움
 *  · 파일     — 새 그림으로 바꿈 (옛 그림은 저장이 끝난 뒤 지웁니다)
 */
export async function updateCase(
  id: string,
  input: Omit<NewCase, "image">,
  image: "keep" | "remove" | ImageFile
) {
  const before = await getCase(id)
  if (!before) return null

  let next: CaseImage | null = before.image
  if (image === "remove") next = null
  else if (image !== "keep") next = await store.putImage(id, image)

  const record: CaseRecord = { ...before, ...input, image: next, updatedAt: new Date().toISOString() }
  try {
    await store.write(record)
  } catch (err) {
    if (next && next !== before.image) await store.removeImage(next).catch(() => {})
    throw err
  }
  if (before.image && before.image.path !== next?.path) await store.removeImage(before.image).catch(() => {})
  return record
}

export async function deleteCase(id: string) {
  const before = await getCase(id)
  if (!before) return false
  await store.remove(id)
  if (before.image) await store.removeImage(before.image).catch(() => {})
  return true
}

export async function openImage(imagePath: string) {
  if (!IMAGE_PATH_RE.test(imagePath)) return null
  return store.openImage(imagePath)
}
