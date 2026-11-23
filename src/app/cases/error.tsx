"use client"

import { Button } from "@/components/ui/button"
import { StatePanel } from "@/components/cases/state-panel"
import { cases } from "@/content/cases"

/* 저장소에서 읽다가 실패했을 때 (목록 · 상세 · 수정 모두) */
export default function CasesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatePanel icon="warn" title={cases.error.title} body={cases.error.body} role="alert">
      <Button onClick={() => reset()}>{cases.error.retry}</Button>
    </StatePanel>
  )
}
