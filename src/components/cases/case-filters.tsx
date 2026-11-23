import Form from "next/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fieldClass } from "@/components/cases/form-field"
import { cases } from "@/content/cases"
import { VERDICTS } from "@/content/verdicts"

/*
  찾기 · 판정 · 차례 — 주소의 ?q= &verdict= &sort= 로 남습니다 (새로고침 · 공유해도 그대로).
  next/form 이라 쪽 전체를 새로 받지 않고 넘어갑니다. 찾으면 1쪽부터 다시 봅니다.
*/
export function CaseFilters({ q, verdict, sort }: { q?: string; verdict?: string; sort?: string }) {
  const t = cases.filters
  return (
    <Form
      action="/cases"
      role="search"
      aria-label={t.label}
      className="grid gap-3 rounded-[22px] border border-cc-line bg-white p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
    >
      <div>
        <Label htmlFor="f-q" className="mb-1.5 block text-[15px] font-bold">
          {t.q}
        </Label>
        <Input id="f-q" name="q" type="search" defaultValue={q} placeholder={t.qPlaceholder} className={`h-auto ${fieldClass}`} />
      </div>
      <div>
        <Label htmlFor="f-verdict" className="mb-1.5 block text-[15px] font-bold">
          {t.verdict}
        </Label>
        <select id="f-verdict" name="verdict" defaultValue={verdict ?? ""} className={fieldClass}>
          <option value="">{t.verdictAll}</option>
          {VERDICTS.map((v) => (
            <option key={v.key} value={v.key}>
              {v.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="f-sort" className="mb-1.5 block text-[15px] font-bold">
          {t.sort}
        </Label>
        <select id="f-sort" name="sort" defaultValue={sort ?? "new"} className={fieldClass}>
          <option value="new">{t.sortNew}</option>
          <option value="old">{t.sortOld}</option>
        </select>
      </div>
      <Button type="submit">{t.submit}</Button>
    </Form>
  )
}
