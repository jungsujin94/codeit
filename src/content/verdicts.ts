/*
  판정 3등급 — 데모(작동 방식)와 판정 구간이 같은 데이터를 씁니다.
  ⚠️ 「안전합니다」 등급은 두지 않습니다. 가장 낮은 등급은 「답하지 않으셔도 됩니다」입니다.
     맨 아래 램프는 초록이 아니라 옅은 회색입니다 (초록은 「가도 좋다」로 읽힙니다).
*/
export type VerdictKey = "d" | "c" | "u"

export type Verdict = {
  key: VerdictKey
  title: string
  sub: string
  todo: string[]
}

export const VERDICTS: Verdict[] = [
  {
    key: "d",
    title: "위험합니다",
    sub: "답장하거나 돈을 보내지 마세요.",
    todo: ["답하지 마세요", "112에 전화해서 신고하세요", "가족에게 알리세요"],
  },
  {
    key: "c",
    title: "조심하세요",
    sub: "답하지 마세요.",
    todo: ["답하지 마세요", "되물을 말을 보세요", "가족에게 물어보세요"],
  },
  {
    key: "u",
    title: "답하지 않으셔도 됩니다",
    sub: "받기만 하면 되는 문자입니다.",
    todo: [
      "답하지 않으셔도 됩니다",
      "문자 속 번호와 주소는 누르지 마세요",
      "걱정되시면 기관 대표번호를 직접 찾아 전화하세요",
    ],
  },
]

export const verdictOf = (key: VerdictKey) => VERDICTS.find((v) => v.key === key)!

export const verdictSection = {
  eyebrow: "판정",
  title: "왜 위험한지 문자에서 짚어드립니다",
  lead: "어디가 문제인지 문자에 그대로 표시해 드리고, 셋 중 하나로 알려드립니다.",
  todoLabel: "이렇게 하세요",
  source:
    "인증번호 · 결제 알림 · 배송 알림 · 광고처럼 받고 끝나는 문자는 「받기만 하면 되는 문자입니다」라고 함께 알려드립니다. **「안전합니다」라는 등급은 두지 않습니다** — 위험 신호를 못 찾았을 뿐, 안전하다는 뜻이 아니기 때문입니다.",
}
