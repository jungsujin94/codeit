/*
  올린 그림을 내보내는 Route Handler — /cases/files/images/{id}-….jpg
  저장소(Vercel Blob 비공개 저장소 또는 내 컴퓨터 .data)에서 읽어 그대로 보냅니다.
  ⚠️ 공용 CDN 에는 캐시하지 않습니다 (private). 지운 그림이 CDN 에 남아 옛 주소로 계속 보이는 것을 막습니다.
*/
import { openImage } from "@/lib/cases/store"

export async function GET(_req: Request, ctx: RouteContext<"/cases/files/[...path]">) {
  const { path } = await ctx.params
  const file = await openImage(path.join("/"))
  if (!file) return new Response("Not found", { status: 404 })
  return new Response(file.body as BodyInit, {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
