/*
  사이트 전체에 걸친 문구: 메타데이터 · 위쪽 띠 · 히어로 · 출시 준비 중 안내 · 바닥.
  문구는 chanchan.kr 에서 글자 그대로 옮겼습니다.
*/
import type { IconName } from "@/components/icon"

export const LIVE_SITE = "https://chanchan.kr"
export const MAIL = "support@chanchan.kr"

export const meta = {
  title: "찬찬 — 의심스러운 순간, 찬찬하게",
  description:
    "모르는 번호로 온 문자를 어르신 폰 안에서 먼저 보고, 위험하면 무엇을 하실지까지 알려드립니다. 어르신은 무료. 복지관·지자체 시범 도입 문의를 받습니다.",
  ogDescription: "모르는 번호로 온 문자를 폰 안에서 먼저 보고, 무엇을 하실지까지 알려드립니다.",
  ogImage: `${LIVE_SITE}/logo.png`,
}

/* 구간 id — 네비게이션 · 버튼이 이 id 로 내려갑니다 (원본과 같은 id) */
export const SECTION = {
  problem: "서비스소개",
  demo: "작동방식",
  audience: "이용대상",
  institution: "기관문의",
} as const

export type NavLink = { label: string; href: string }

export const NAV_LINKS: NavLink[] = [
  { label: "서비스 소개", href: `#${SECTION.problem}` },
  { label: "작동 방식", href: `#${SECTION.demo}` },
  { label: "이용 대상", href: `#${SECTION.audience}` },
  { label: "기관 도입", href: `#${SECTION.institution}` },
  { label: "사례집", href: "/cases" },
  { label: "두 폰 체험", href: `${LIVE_SITE}/prototype` },
]

export const header = {
  skip: "본문으로 건너뛰기",
  logoAlt: "찬찬",
  tagline: "급할수록 찬찬히",
  navLabel: "주요 메뉴",
  cta: "시범 도입 문의",
  /* 과제용 사본에서 「출시 준비 중」 안내를 여는 버튼 (원본에는 여는 버튼이 없었습니다) */
  appCta: "앱 받기",
  orgbar: "복지관 · 지자체에서 검토 중이신가요?",
  orgbarCta: "시범 도입 문의 →",
}

export const hero = {
  eyebrow: "문자 사기 · 스미싱 확인",
  title: "의심스러운 순간,\n찬찬하게.",
  sub: "모르는 번호로 온 문자를 어르신 폰 안에서 먼저 보고, 위험하면 **무엇을 하실지까지** 알려드립니다.",
  primary: "데모 체험하기",
  secondary: "시범 도입 문의",
  phonesCaption: "Figma **chanchan.v2** 설계 화면입니다. 화면 속 이름과 숫자는 예시입니다.",
}

export const HERO_POINTS: { icon: IconName; text: string }[] = [
  { icon: "check", text: "어르신은 무료" },
  { icon: "lock", text: "문자 내용은 폰 밖으로 안 나갑니다" },
  { icon: "phone", text: "안드로이드 7 이상" },
]

export const HERO_PHONES = {
  back: { src: "/img/app-lock.png", alt: "잠금화면에 뜬 찬찬 경고 알림", width: 390, height: 844 },
  front: { src: "/img/app-result.png", alt: "확인 결과 화면 — 왜 위험한지와 지금 할 일", width: 390, height: 1272 },
}

export const comingSoon = {
  title: "아직 받으실 수 없습니다",
  body: "찬찬은 구글 플레이에 올리기 위한 **심사를 받고 있습니다.** 준비가 끝나면 이 사이트에 플레이 스토어 주소를 올리겠습니다.",
  contactBefore: "복지관 · 기관에서 먼저 써 보고 싶으시면 ",
  contactAfter: " 로 알려 주세요.",
  close: "닫기",
}

export const footer = {
  tagline: "급할수록 찬찬히",
  owner: "대표 정수진 · 사업자등록 준비 중",
  exploreTitle: "둘러보기",
  docsTitle: "문서",
  fine: [
    "찬찬은 위험 신호를 찾아 알려드리는 도구이며, **메시지의 진위를 보증하지 않습니다.** 「안전합니다」라는 판정을 제공하지 않습니다.",
    "이 페이지의 데모는 설명을 위해 만든 예시이며 실제 검사 결과가 아닙니다. 앱은 출시 준비 중입니다.",
    "**화면 속 이름과 숫자는 예시입니다.**",
    "이 사이트는 광양시청이 만든 **광양햇살체**를 씁니다 (공공누리 제1유형 · 출처표시).",
  ],
}

export const FOOTER_DOCS: NavLink[] = [
  { label: "개인정보처리방침", href: `${LIVE_SITE}/privacy.html` },
  { label: "이용약관", href: `${LIVE_SITE}/terms.html` },
  { label: "오픈소스 라이선스", href: `${LIVE_SITE}/licenses.html` },
  { label: "문의하기", href: `mailto:${MAIL}` },
]
