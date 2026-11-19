"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Rich } from "@/components/rich"
import { comingSoon, header, MAIL } from "@/content/site"

/*
  「출시 준비 중」 안내 (원본 <dialog id="wip">) → shadcn/ui Dialog.
  Esc · 바깥 누르기 · [닫기] 로 닫히고, 닫히면 누르셨던 버튼으로 돌아갑니다.
*/
export function ComingSoonDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>{header.appCta}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[min(440px,calc(100%-2rem))] gap-0 rounded-[22px] bg-white p-[30px] text-cc-ink shadow-[0_24px_60px_rgba(0,0,0,.3)] ring-0 sm:max-w-[440px]"
      >
        <DialogTitle className="mb-3 text-[22px] leading-snug font-bold">{comingSoon.title}</DialogTitle>
        <DialogDescription className="mb-3 text-[16.5px] leading-[1.62] text-cc-muted">
          <Rich text={comingSoon.body} />
        </DialogDescription>
        <p className="mb-3 text-[15px] text-cc-muted">
          {comingSoon.contactBefore}
          <a href={`mailto:${MAIL}`}>{MAIL}</a>
          {comingSoon.contactAfter}
        </p>
        <DialogClose render={<Button className="mt-2 w-full" />}>{comingSoon.close}</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
