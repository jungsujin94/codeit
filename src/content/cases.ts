/*
  의심 문자 사례집 — 화면 문구.
  ⚠️ 판정 이름은 verdicts.ts 의 것을 그대로 씁니다. 「안전합니다」 같은 말은 쓰지 않습니다.
*/
export const cases = {
  meta: {
    title: "의심 문자 사례집 — 찬찬",
    description: "받으신 의심 문자를 모아 두고, 어디가 위험한지 함께 봅니다.",
  },
  nav: { home: "찬찬 소개", list: "사례 목록", create: "사례 등록" },
  notice: "과제용 사본입니다. 실제 이름 · 전화번호 · 계좌번호 같은 개인정보는 적지 마세요.",

  list: {
    eyebrow: "의심 문자 사례집",
    title: "이런 문자가 왔었습니다",
    lead: "받으신 의심 문자를 남겨 주시면, 다른 분들도 같은 문자를 알아볼 수 있습니다.",
    total: (n: number) => `모두 ${n}건`,
    emptyTitle: "아직 남겨진 사례가 없습니다",
    emptyBody: "받으신 의심 문자를 처음으로 남겨 주세요.",
    noMatchTitle: "찾으시는 사례가 없습니다",
    noMatchBody: "낱말을 바꾸거나, 판정 고르기를 「모두」로 바꿔 보세요.",
    clear: "모두 보기",
    deleted: "사례를 지웠습니다.",
    loading: "사례를 불러오고 있어요",
  },
  filters: {
    label: "사례 찾기",
    q: "찾을 낱말",
    qPlaceholder: "예) 택배, 환급",
    verdict: "판정",
    verdictAll: "모두",
    sort: "차례",
    sortNew: "최근에 남긴 것부터",
    sortOld: "먼저 남긴 것부터",
    submit: "찾기",
  },
  pagination: { label: "쪽 넘기기", prev: "이전", next: "다음", page: (n: number) => `${n}쪽` },

  card: { noImage: "그림 없음", sender: "보낸 곳" },

  detail: {
    back: "목록으로",
    message: "받으신 문자",
    sender: "보낸 곳",
    verdict: "판정",
    note: "설명 · 대처",
    noNote: "남겨진 설명이 없습니다.",
    image: "문자 화면 그림",
    noImage: "올린 그림이 없습니다.",
    created: "남긴 때",
    updated: "고친 때",
    edit: "고치기",
    delete: "지우기",
    saved: { created: "사례를 남겼습니다.", updated: "고친 내용을 저장했습니다." },
  },
  deleteDialog: {
    title: "이 사례를 지울까요?",
    body: "지우면 되돌릴 수 없습니다. 올리신 그림도 함께 지워집니다.",
    cancel: "그만두기",
    confirm: "지우기",
    pending: "지우고 있어요…",
  },
  notFound: {
    title: "찾으시는 사례가 없습니다",
    body: "이미 지워졌거나 주소가 바뀌었을 수 있습니다.",
    back: "사례 목록으로",
  },
  error: {
    title: "사례를 불러오지 못했습니다",
    body: "잠시 뒤 다시 시도해 주세요.",
    retry: "다시 시도",
  },

  form: {
    createTitle: "의심 문자 남기기",
    createLead: "받으신 문자를 그대로 옮겨 적고, 판정을 골라 주세요.",
    editTitle: "사례 고치기",
    editLead: "바꿀 칸만 고친 뒤 저장해 주세요.",
    required: "꼭 적어 주세요",
    title: { label: "제목", placeholder: "예) 택배 주소가 틀렸다는 문자", hint: "2~60자" },
    message: {
      label: "받으신 문자 내용",
      placeholder: "문자에 적힌 글을 그대로 옮겨 적어 주세요.",
      hint: "5~1000자 · 문자 속 실제 전화번호나 주소는 ○○○ 로 바꿔 적어 주세요.",
    },
    senderType: { label: "보낸 곳", placeholder: "골라 주세요" },
    verdict: { label: "판정" },
    note: {
      label: "설명 · 대처 (적지 않아도 됩니다)",
      placeholder: "어디가 이상했는지, 어떻게 하셨는지 적어 주세요.",
      hint: "500자까지",
    },
    image: {
      label: "문자 화면 그림 (올리지 않아도 됩니다)",
      hint: "JPG · PNG · WEBP, 3MB 까지",
      keep: "지금 그림 그대로 두기",
      replace: "다른 그림으로 바꾸기",
      remove: "그림 지우기",
      previewAlt: "올리실 그림 미리보기",
      currentAlt: "지금 올라가 있는 문자 화면 그림",
    },
    fixErrors: (n: number) => `고칠 칸이 ${n}곳 있습니다. 빨간 글씨를 봐 주세요.`,
    submitCreate: "남기기",
    submitEdit: "저장하기",
    pending: "저장하고 있어요…",
    cancel: "그만두기",
  },
}
