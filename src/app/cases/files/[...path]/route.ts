/*
  올린 그림을 내보내는 Route Handler — /cases/files/images/{id}-….jpg
  저장소(Vercel Blob 비공개 저장소 또는 내 컴퓨터 .data)에서 읽어 그대로 보냅니다.
  그림 이름에는 무작위 글자가 붙어 같은 이름이 다시 쓰이지 않으므로 오래 캐시해도 됩니다.
*/
import { openImage } from "@/lib/cases/store"

export async function GET(_req: Request, ctx: RouteContext<"/cases/files/[...path]">) {
  const { path } = await ctx.params
  const file = await openImage(path.join("/"))
  if (!file) return new Response("Not found", { status: 404 })
  return new Response(file.body as BodyInit, {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
