import type { ReactNode } from "react"
import { Icon, type IconName } from "@/components/icon"

/* 빈 목록 · 없는 주소 · 오류 화면이 같이 쓰는 안내 칸 */
export function StatePanel({
  icon = "q",
  title,
  body,
  children,
  role,
}: {
  icon?: IconName
  title: string
  body: string
  children?: ReactNode
  role?: "alert" | "status"
}) {
  return (
    <div role={role} className="mx-auto max-w-[520px] rounded-[22px] border border-cc-line bg-white px-7 py-12 text-center">
      <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-cc-mist text-cc-green">
        <Icon name={icon} size="md" />
      </span>
      <h2 className="mb-2 text-[22px]">{title}</h2>
      <p className="text-[17px] text-cc-muted">{body}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
