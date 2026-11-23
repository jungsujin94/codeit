"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteCaseAction } from "@/app/cases/actions"
import { cases } from "@/content/cases"

/*
  지우기 — 한 번 더 묻고 지웁니다 (shadcn/ui Dialog).
  지우는 동안 두 버튼이 모두 잠기고, 끝나면 목록으로 갑니다.
*/
export function DeleteCaseDialog({ id, title }: { id: string; title: string }) {
  const t = cases.deleteDialog
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function confirm() {
    setError(null)
    startTransition(async () => {
      const res = await deleteCaseAction(id)
      if (res?.message) setError(res.message)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
      <DialogTrigger render={<Button variant="outline" className="text-cc-alert" />}>
        {cases.detail.delete}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[min(440px,calc(100%-2rem))] gap-0 rounded-[22px] bg-white p-[30px] text-cc-ink shadow-[0_24px_60px_rgba(0,0,0,.3)] ring-0 sm:max-w-[440px]"
      >
        <DialogTitle className="mb-3 text-[22px] leading-snug font-bold">{t.title}</DialogTitle>
        <DialogDescription className="mb-2 text-[17px] leading-[1.62] text-cc-muted">
          「{title}」
          <br />
          {t.body}
        </DialogDescription>
        {error && (
          <p role="alert" className="mt-2 rounded-xl bg-cc-blush px-[15px] py-[13px] text-base text-[#8E3833]">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <DialogClose render={<Button variant="outline" disabled={pending} />}>{t.cancel}</DialogClose>
          <Button onClick={confirm} disabled={pending} className="bg-cc-alert hover:bg-[#8E3833]">
            {pending ? t.pending : t.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
