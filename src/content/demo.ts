import type { VerdictKey } from "./verdicts"

/*
  「직접 눌러 보세요」 데모.
  ⚠️ 실제로 검사하지 않습니다. 미리 적어 둔 예시를 보여 줄 뿐입니다.
*/
export type DemoCase = {
  id: "danger" | "caution" | "unclear"
  verdict: VerdictKey
  from: string
  text: string
  why: string[]
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: "danger",
    verdict: "d",
    from: "02-3XXX-1190",
    text: "서울중앙지검입니다. 귀하 명의 계좌가 범죄에 연루되어 안전계좌로 옮기셔야 합니다.",
    why: ["수사기관을 사칭하고 있어요.", "「안전계좌」로 돈을 옮기라고 재촉해요.", "모르는 번호에서 왔어요."],
  },
  {
    id: "caution",
    verdict: "c",
    from: "010-4XXX-7731",
    text: "배송이 멈췄어요. 주소를 고쳐주세요 ▶ bit.ly/······",
    why: ["인터넷 주소를 누르라고 해요.", "보낸 곳이 분명하지 않아요."],
  },
  {
    id: "unclear",
    verdict: "u",
    from: "15XX-XXXX",
    text: "[결제 안내] 승인 12,800원 / 일시불 / 잔액 조회는 앱에서 확인하세요.",
    why: [
      "아는 사기 수법과 맞는 것을 찾지 못했습니다.",
      "안전하다는 뜻은 아닙니다. 처음 보는 수법은 찾지 못할 수 있어요.",
    ],
  },
]

export const demo = {
  eyebrow: "작동 방식",
  title: "직접 눌러 보세요",
  lead: "아래 문자는 **설명을 위해 만든 예시**입니다. 실제로 받은 문자가 아니고, 어디로도 보내지 않습니다.",
  pickLabel: "예시 문자 고르기",
  run: "확인하기",
  badge: "예시 화면",
  note: "실제 판정은 폰 안에서 규칙 29가지와 조합 6가지로 합니다. 이 페이지의 결과는 **미리 적어 둔 예시**이며 실제로 검사하지 않습니다.",
  proto: {
    href: "https://chanchan.kr/prototype",
    icon: "📱📱",
    title: "두 폰으로 직접 눌러 보기",
    sub: "가입부터 가족에게 알리기까지, 어머니 폰과 딸 폰으로 따라가 보세요",
  },
  /* 미션 6 에서 더한 길 — 원본 chanchan.kr 에는 없습니다 */
  cases: {
    href: "/cases",
    icon: "🗂️",
    title: "의심 문자 사례집",
    sub: "다른 분들이 받은 의심 문자를 보고, 받으신 문자도 남겨 보세요",
  },
  screen: {
    brand: "찬찬",
    title: "확인 결과",
    idle: "왼쪽에서 문자를 고르고 **확인하기**를 눌러 주세요.",
    scanningTitle: "확인하고 있어요",
    scanningSub: "보낸 사람과 요구하는 것을 살펴보고 있어요.",
    whyLabel: "왜 이렇게 나왔나요",
    todoLabel: "이렇게 하세요",
    footnote: "예시 화면입니다. **안전하다는 뜻이 아닙니다.**",
    signalLabel: "판정 신호등 — ",
  },
  /* 원본과 같은 1.15초 동안 「확인하고 있어요」를 보여 줍니다 */
  scanMs: 1150,
}
