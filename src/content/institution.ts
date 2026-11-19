/*
  기관 도입 구간 + 시범 도입 문의 신청서.
  신청서 칸은 아래 INSTITUTION_FIELDS 배열 하나로 그리고, 검사도 같은 배열로 합니다.
  ⚠️ 과제용 사본이라 **아무 데도 보내지 않습니다** (네트워크 요청 없음).
*/

export const institution = {
  eyebrow: "기관 도입",
  title: "관내 어르신을\n함께 지키실 기관을 찾습니다",
  lead: "자료를 보내드리고, 시범 운영을 함께 설계해 드립니다.",
  source: "시범 기관과 협약 사례는 동의를 받은 뒤에만 공개합니다. 지금 이 페이지에 적힌 기관 이름은 없습니다.",
  video: {
    src: "/video/chanchan-org-40s.mp4",
    poster: "/video/chanchan-org-40s-poster.jpg",
  },
}

export const INSTITUTION_CARDS = [
  {
    title: "누구를 위한 것인가",
    body: "기초 · 광역 지자체, 노인복지관 · 치매안심센터, 금융기관의 소비자보호 · 사회공헌 부서",
  },
  {
    title: "시범은 이렇게 갑니다",
    body: "① 설치 안내(QR 공지 한 장) → ② 동의하신 분들로 사용 집계 → ③ 매달 이용 보고서 → ④ 연간 계약 검토",
  },
  {
    title: "무엇으로 평가하나",
    body: "혼자 설치 완료율 · 14일 유지율 · 경고 뒤 행동률. **「방지한 피해액」 같은 계산한 숫자는 드리지 않습니다.**",
  },
  {
    title: "데이터는 이렇게 다룹니다",
    body: "기관은 **집계 숫자만** 봅니다. 누가 무엇을 확인했는지는 기관도 찬찬도 알 수 없습니다.",
  },
]

export type FieldSpec = {
  name: string
  id: string
  label: string
  kind: "text" | "email" | "tel" | "select" | "textarea"
  maxLength?: number
  autoComplete?: string
  placeholder?: string
  hint?: string
  options?: { value: string; label: string }[]
  /** 비어 있으면 이 말씀을 드립니다. 없으면 선택 칸입니다. */
  required?: string
}

export const INSTITUTION_FIELDS: FieldSpec[] = [
  {
    name: "org_name",
    id: "org-name",
    label: "기관명",
    kind: "text",
    maxLength: 120,
    autoComplete: "organization",
    required: "기관명을 적어 주세요.",
  },
  {
    name: "org_type",
    id: "org-type",
    label: "기관 유형",
    kind: "select",
    options: [
      { value: "", label: "골라 주세요" },
      { value: "basic_local_gov", label: "기초지자체" },
      { value: "metro_local_gov", label: "광역지자체" },
      { value: "welfare_center", label: "노인복지관 · 치매안심센터" },
      { value: "financial", label: "금융기관 (은행 · 보험 · 중앙회)" },
      { value: "other", label: "그 외" },
    ],
    required: "기관 유형을 골라 주세요.",
  },
  { name: "department", id: "org-dept", label: "담당 부서", kind: "text", maxLength: 120 },
  {
    name: "contact_name",
    id: "org-person",
    label: "담당자 성함",
    kind: "text",
    maxLength: 60,
    autoComplete: "name",
    required: "담당자 성함을 적어 주세요.",
  },
  {
    name: "contact_email",
    id: "org-mail",
    label: "이메일",
    kind: "email",
    maxLength: 254,
    autoComplete: "email",
    placeholder: "name@example.com",
    required: "이메일을 적어 주세요.",
  },
  { name: "contact_phone", id: "org-tel", label: "연락처", kind: "tel", maxLength: 40, autoComplete: "tel" },
  {
    name: "message",
    id: "org-msg",
    label: "문의 내용",
    kind: "textarea",
    maxLength: 500,
    hint: "500자까지 적으실 수 있습니다",
  },
]

export const institutionForm = {
  title: "시범 도입 문의",
  sub: "영업일 기준 2일 안에 자료와 함께 연락드리겠습니다.",
  /* 과제용 사본 안내 — 신청서 바로 위에 보입니다 */
  copyNotice: "과제용 사본입니다. 입력하신 내용은 저장되지 않습니다.",
  consent: {
    label: "개인정보 수집·이용에 동의합니다",
    required: "(필수)",
    missing: "개인정보 수집·이용에 동의해 주세요.",
    items: [
      "수집 항목: 기관명, 담당 부서, 담당자 성함, 이메일, 연락처, 문의 내용",
      "이용 목적: 도입 문의 응대 및 자료 발송",
      "보유 기간: 문의 종료 후 1년, 또는 삭제 요청 시까지",
    ],
  },
  emailFields: ["contact_email"],
  badEmail: "이메일 주소를 다시 봐 주세요. 예) name@example.com",
  submit: "문의 보내기",
  noscriptBefore: "이 브라우저에서는 문의를 보낼 수 없어요. ",
  noscriptAfter: " 로 보내 주세요.",
  done: {
    title: "문의가 접수되었습니다.",
    body: "영업일 기준 2일 안에 자료와 함께 연락드리겠습니다.",
  },
}
