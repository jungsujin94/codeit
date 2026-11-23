# 찬찬 — 랜딩 페이지 + 의심 문자 사례집 (Next.js 과제판)

[chanchan.kr](https://chanchan.kr) 랜딩 페이지를 **Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui** 로 다시 만들고(미션 5),
여기에 실제로 저장되는 **의심 문자 사례집 CRUD** 를 붙인 과제용 저장소입니다(미션 6).

- 배포 URL: **DEPLOY_URL**
  - 랜딩: `/` · 사례집: `/cases`
- 실제 서비스: https://chanchan.kr (이 저장소와 데이터를 나누지 않습니다)
- 미션 5 제출 판은 git 태그 `mission-5` 로 남겨 두었습니다.

> **과제용 사본입니다.** 사례집에는 실제 이름 · 전화번호 · 계좌번호 같은 개인정보를 적지 않습니다.
> 랜딩의 「시범 도입 문의」 신청서는 미션 5 와 같이 검사만 하고 **어디로도 보내지 않습니다.**

---

## 1. 서비스 소개

찬찬은 어르신이 받은 의심스러운 문자를 대신 살펴보고 「위험합니다 · 조심하세요 · 답하지 않으셔도 됩니다」 셋 중 하나로 알려 드리는 서비스입니다.
**의심 문자 사례집**은 그 핵심 가치(「이 문자, 어디가 위험한가?」)를 검증하는 기능입니다.
받은 의심 문자를 그대로 옮겨 적고, 판정과 설명, 문자 화면 그림을 남기면 다른 사람도 같은 문자를 알아볼 수 있습니다.

## 2. 핵심 기능 명세 — 의심 문자 사례 (등록 → 목록 → 상세 → 수정 → 삭제)

| 화면 · 주소 | 입력 · 사용자 행동 | 성공 결과 | 실패 결과 |
| --- | --- | --- | --- |
| **목록** `/cases` | 카드 누르기 · 낱말 찾기(`?q=`) · 판정 고르기(`?verdict=`) · 차례(`?sort=old`) · 쪽 넘기기(`?page=`, 한 쪽 6건) | 조건에 맞는 카드 · 「모두 N건」 · 쪽 번호. 주소에 조건이 남아 새로고침 · 공유해도 그대로 | 불러오는 동안: 카드 뼈대 / 저장소 오류: 「사례를 불러오지 못했습니다」 + [다시 시도] / 0건: 「아직 남겨진 사례가 없습니다」 + [사례 등록] / 찾기 결과 0건: 「찾으시는 사례가 없습니다」 + [모두 보기] |
| **등록** `/cases/new` | 제목\* · 받은 문자 내용\* · 보낸 곳\* · 판정\* · 설명 · 문자 화면 그림(선택) → [남기기] | 저장 → 상세로 이동, 「사례를 남겼습니다.」 | 틀린 칸마다 빨간 안내 + 첫 틀린 칸으로 초점 / 저장하는 동안 버튼 잠김(「저장하고 있어요…」) / 저장 실패: 「저장하지 못했습니다…」, 쓰신 글은 그대로 |
| **상세** `/cases/[id]` | [고치기] · [지우기] · [목록으로] | 문자 내용 · 판정과 할 일 · 설명 · 그림(없으면 「올린 그림이 없습니다.」) · 남긴 때 / 고친 때. 제목 · 설명 · OG 이미지가 그 사례에 맞춰짐 | 없는 주소: 「찾으시는 사례가 없습니다」 + [사례 목록으로] |
| **수정** `/cases/[id]/edit` | 지금 값이 채워진 신청서. 그림은 「그대로 두기 · 다른 그림으로 바꾸기 · 지우기」 중 선택 → [저장하기] | 저장 → 상세로, 「고친 내용을 저장했습니다.」. 바꾸거나 지운 옛 그림은 저장소에서도 지움 | 등록과 같은 검사 · 안내. 그 사이 지워진 사례면 「이 사례는 이미 지워졌습니다」 / 없는 주소는 상세와 같은 안내 |
| **삭제** (상세의 [지우기]) | 확인 창(Dialog) → [지우기] 또는 [그만두기] · Esc | 사례와 그림을 지우고 목록으로, 「사례를 지웠습니다.」 | 실패: 창 안에 「지우지 못했습니다…」. 지우는 동안 두 버튼 잠김 |

검사 규칙 (브라우저와 서버가 `src/lib/cases/schema.ts` 를 같이 씁니다. 서버에서 한 번 더 검사합니다)

| 칸 | 규칙 | 안내 예 |
| --- | --- | --- |
| 제목 | 필수, 2~60자 | 「제목을 적어 주세요.」 |
| 받은 문자 내용 | 필수, 5~1000자 | 「문자 내용은 5자 이상 적어 주세요.」 |
| 보낸 곳 | 필수, 정해진 6개 중 하나 | 「보낸 곳을 골라 주세요.」 |
| 판정 | 필수, `d` · `c` · `u` 중 하나 | 「판정을 하나 골라 주세요.」 |
| 설명 | 선택, 500자까지 | 「설명은 500자까지 적을 수 있어요.」 |
| 그림 | 선택, JPG · PNG · WEBP, 3MB 까지 | 「JPG · PNG · WEBP 그림만 올릴 수 있어요.」 |

## 3. 데이터 구조

> 강사님 안내에 따라 Supabase 대신 **Vercel Blob**(같은 Vercel 프로젝트 안의 저장소)을 씁니다.
> 별도 백엔드 서버 없이 Next.js Server Actions 가 저장소에 바로 읽고 씁니다. 인증 · 사용자별 권한은 미션 7 범위입니다.

**cases** — 사례 한 건 = `cases/{id}.json` 파일 하나

| 컬럼 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string (UUID v4) | ✔ | 고유 식별자. 서버가 `crypto.randomUUID()` 로 만듭니다 |
| `title` | string (2~60) | ✔ | 제목 |
| `message` | string (5~1000) | ✔ | 받은 문자 내용 |
| `senderType` | enum | ✔ | `모르는 번호` · `택배 · 배송` · `기관 사칭` · `가족 · 지인 사칭` · `금융 · 대출` · `기타` |
| `verdict` | enum `d` \| `c` \| `u` | ✔ | 위험합니다 · 조심하세요 · 답하지 않으셔도 됩니다 |
| `note` | string (0~500) | ✔ (빈 글 허용) | 설명 · 대처 |
| `image` | object \| null | ✔ | 그림 정보 `{ url, path, contentType, size }`. 없으면 `null` |
| `createdAt` | string (ISO 8601) | ✔ | 만든 시각 (바뀌지 않음) |
| `updatedAt` | string (ISO 8601) | ✔ | 고친 시각 (저장할 때마다 바뀜) |

**images** — 그림 파일 = `images/{id}-{무작위}.{jpg|png|webp}`. 사례의 `image.path` 로 연결됩니다.
그림은 앱의 `/cases/files/…` 주소(Route Handler)로 내보내므로 저장소를 비공개로 둘 수 있습니다.

## 4. 기술 스택

| 구분 | 사용한 것 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Cache Components) · React 19 · TypeScript |
| 데이터 처리 | Server Actions (등록 · 수정 · 삭제), Server Components (목록 · 상세 조회), Route Handler (그림 내보내기) |
| 저장소 | Vercel Blob (`@vercel/blob`) — 배포 / 프로젝트 안 `.data/` 폴더 — 내 컴퓨터 |
| 스타일 | Tailwind CSS v4 — 브랜드 색은 `src/app/globals.css` 의 `@theme` 에 `cc-*` 이름으로 |
| UI 컴포넌트 | shadcn/ui — Button · Card · Input · Textarea · Label · Dialog · Accordion |
| 글꼴 · 이미지 | 광양햇살체(.woff2, `next/font/local`) · `next/image` |

## 5. 실행 방법

Node.js 20 이상이 필요합니다.

```bash
npm install      # 처음 한 번
npm run dev      # 개발 서버 → http://localhost:3000 , 사례집은 /cases
npm run build    # 배포용으로 묶기 (오류 없이 끝나야 합니다)
npm run lint     # 코드 검사
```

- 환경 변수 없이 실행하면 사례가 프로젝트 안 `.data/` 폴더에 저장됩니다 (GitHub 에 올라가지 않습니다).
- 내 컴퓨터에서도 Vercel Blob 을 쓰려면 `npx vercel link` → `npx vercel env pull .env.local` 로 토큰을 받습니다.

## 6. 환경 변수

| 이름 | 어디에 | 설명 |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Vercel (Blob 저장소를 연결하면 자동) · 선택: `.env.local` | Blob 읽기 · 쓰기 토큰. 없으면 `.data/` 폴더를 씁니다 |
| `BLOB_ACCESS` | 선택 | 저장소를 공개(public)로 만들었을 때만 `public`. 기본은 `private` |

실제 값은 `.env.local`(`.gitignore` 에 포함)과 Vercel 설정에만 있고, 저장소에는 이름만 적은 `.env.example` 이 있습니다.

## 7. 폴더 구조

```
src/
├─ app/
│  ├─ page.tsx                 # 랜딩 (미션 5)
│  └─ cases/
│     ├─ layout.tsx            # 사례집 머리(목록 · 등록) + 개인정보 안내 띠
│     ├─ page.tsx              # 목록 · 찾기 · 판정 · 차례 · 쪽 넘기기
│     ├─ actions.ts            # Server Actions: 등록 · 수정 · 삭제 (서버 검사 포함)
│     ├─ error.tsx             # 불러오기 실패 화면
│     ├─ new/page.tsx          # 등록
│     ├─ [id]/page.tsx         # 상세 (+ 사례별 메타데이터 · OG)
│     ├─ [id]/edit/page.tsx    # 수정
│     ├─ [id]/loading.tsx      # 상세 · 수정 불러오는 동안
│     ├─ [id]/not-found.tsx    # 없는 사례 주소
│     └─ files/[...path]/route.ts  # 올린 그림 내보내기
├─ components/
│  ├─ cases/                   # case-form · case-card · form-field · verdict-badge · pagination
│  │                           # case-filters · delete-case-dialog · state-panel · skeletons · cases-header
│  ├─ sections/                # 랜딩 구간 (미션 5)
│  └─ ui/                      # shadcn/ui
├─ content/                    # 화면 문구 (cases.ts 는 사례집 문구)
└─ lib/cases/
   ├─ schema.ts                # 데이터 모양 · 검사 규칙 (브라우저 · 서버 공용)
   └─ store.ts                 # 저장소 (Vercel Blob / .data 폴더)
docs/
├─ qa-checklist.md             # QA 체크리스트와 결과
└─ ai-review-log.md            # AI 가 만든 것과 사람이 확인 · 고친 것
```

## 8. QA 결과

전체 체크리스트와 확인 방법은 [docs/qa-checklist.md](docs/qa-checklist.md) 에 있습니다.

QA_SUMMARY

## 9. 원본(chanchan.kr)과 다른 점

- 미션 6: 위쪽 메뉴에 「사례집」, 「직접 눌러 보세요」 구간 아래에 「의심 문자 사례집」 바로가기를 더했습니다.
- 신청서 위에 「과제용 사본입니다. 입력하신 내용은 저장되지 않습니다.」 한 줄을 넣었습니다.
- 원본에는 「출시 준비 중」 안내 창을 여는 버튼이 없어서, 위쪽 띠에 **「앱 받기」** 버튼을 하나 더했습니다.
- 폭이 좁은 화면(640px 미만)에서는 로고 옆 「급할수록 찬찬히」를 숨깁니다.
- 광고 · 통계 도구(GA4 · Meta Pixel · Clarity)와 유입 경로 기록은 옮기지 않았습니다.
- 「두 폰 체험」 · 개인정보처리방침 · 이용약관 · 오픈소스 라이선스는 chanchan.kr 의 원본 페이지로 연결합니다.

## 출처

이 사이트는 광양시청이 만든 **광양햇살체**를 씁니다 (공공누리 제1유형 · 출처표시).
