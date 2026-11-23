# CLAUDE.md — 찬찬 랜딩 + 의심 문자 사례집 (Next.js 과제판)

AI(Claude Code)와 함께 작업할 때 지키는 규칙입니다. 이 저장소는 **과제용**이며, 이 문서도 과제에 필요한 내용만 담습니다.

@AGENTS.md

## 목적

- 미션 5: chanchan.kr 랜딩 페이지를 Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui 로 다시 만듭니다.
  구간을 컴포넌트로 나누고, 반복되는 UI 는 데이터 배열 + `.map()` 으로 그립니다.
- 미션 6: `/cases` 에 **의심 문자 사례집** CRUD(등록 → 목록 → 상세 → 수정 → 삭제 + 그림 올리기)를 붙입니다.

## 스택

- Next.js 16 (App Router, `src/` 폴더) · React 19 · TypeScript
- Tailwind CSS v4 — 테마는 `src/app/globals.css` 의 `@theme` (브랜드 색 `cc-*`, 화면 폭 `lg` = 980px)
- shadcn/ui (Base UI 기반 base-nova) — Button · Accordion · Input · Textarea · Label · Dialog · Card
- 글꼴: 광양햇살체 `.woff2` 만, `next/font/local`
- 저장소: **Vercel Blob** (`@vercel/blob`). Supabase 는 쓰지 않습니다 (강사님 안내). `cacheComponents: true` 라 요청마다 달라지는 데이터는 `<Suspense>` / `loading.tsx` 안에서 읽습니다.

## 구조

- `src/components/sections/` — 구간 하나 = 파일 하나. `src/app/page.tsx` 가 chanchan.kr 와 같은 차례로 놓습니다.
- `src/content/*.ts` — 모든 문구와 반복 항목. 컴포넌트에는 문구를 직접 쓰지 않습니다.
  - `**굵게**` 와 줄바꿈 `\n` 은 `<Rich>` 가 `<b>` · `<br>` 로 바꿉니다.
- `src/components/ui/` — shadcn/ui. 어르신용으로 크기(버튼 52px)와 색을 고친 판입니다.
- `src/app/cases/` — 사례집 화면과 `actions.ts`(Server Actions). `src/components/cases/` — 사례집이 다시 쓰는 조각.
- `src/lib/cases/schema.ts` — 데이터 모양 · 검사 규칙 (브라우저 · 서버 공용). `store.ts` — 저장소 (서버 전용).

## 데이터 구조 — cases

사례 한 건 = Blob `cases/{id}.json`. 그림 = Blob `images/{id}-{무작위}.{jpg|png|webp}`.

| 컬럼 | 타입 | 필수 | 규칙 |
| --- | --- | --- | --- |
| id | UUID v4 | ✔ | 서버가 만듦. 주소의 id 는 UUID 모양이 아니면 읽지 않음 |
| title | string | ✔ | 2~60자 |
| message | string | ✔ | 5~1000자 |
| senderType | enum | ✔ | `SENDER_TYPES` 6개 중 하나 |
| verdict | `d` \| `c` \| `u` | ✔ | 판정 이름은 `content/verdicts.ts` 그대로 |
| note | string | ✔ | 0~500자 |
| image | `{url,path,contentType,size}` \| null | ✔ | JPG · PNG · WEBP, 3MB 까지 |
| createdAt / updatedAt | ISO 8601 | ✔ | 만들 때 둘 다, 고칠 때 updatedAt 만 |

## 데이터 처리 규칙

- 쓰기는 `src/app/cases/actions.ts` 의 Server Action 으로만 합니다. Server Action 은 화면 밖에서도 불릴 수 있으므로 **서버에서 다시 검사**합니다.
- 검사 규칙은 `schema.ts` 한 곳에만 둡니다 (화면과 서버가 같은 함수를 씁니다).
- 그림을 바꾸거나 지우면, 새 기록이 저장된 **뒤에** 옛 그림을 지웁니다. 기록 저장이 실패하면 새로 올린 그림을 치웁니다.
- 읽기는 `useCache: false` 로 저장소에서 바로 읽습니다 (고친 직후에도 옛 내용이 보이지 않게).
- 그림은 `/cases/files/…` Route Handler 로 내보냅니다. 저장소는 비공개(private)가 기본입니다.
- `BLOB_READ_WRITE_TOKEN` 이 없으면(내 컴퓨터) `.data/` 폴더에 같은 모양으로 저장합니다. `.data/` 와 `.env*` 는 GitHub 에 올리지 않습니다 (`.env.example` 은 이름만).
- 인증 · 사용자별 권한 · 접근 제어는 미션 7 범위입니다. 실제 개인정보는 저장하지 않습니다 (화면에 안내 띠).

## AI 가 따른 규칙

1. **문구는 글자 그대로.** chanchan.kr 의 한국어 문구를 바꾸거나 줄이거나 「다듬지」 않습니다.
   - 「안전합니다」 · 「정상」 · 「괜찮습니다」를 판정으로 쓰지 않습니다. 가장 낮은 등급은 「답하지 않으셔도 됩니다」입니다.
   - 신호등 맨 아래 램프는 초록이 아니라 옅은 회색입니다.
2. **큰 글씨 · 높은 대비.** 본문은 17px 아래로 내려가지 않습니다. 누르는 곳은 44px 이상(기본 52px).
   색만으로 뜻을 전하지 않습니다(글자 · 테두리 · 굵기로도 구분).
3. **랜딩의 기관 신청서는 아무것도 보내지 않습니다.** 검사 후 접수 화면만 보여 줍니다. 광고/통계 스크립트를 넣지 않습니다.
   저장은 사례집(`/cases`)만, 위의 데이터 처리 규칙대로 합니다.
4. **스팸 막기는 CAPTCHA 없이.** 숨은 칸(nickname)과 최소 입력 시간(2초)으로 봅니다. 검사 순서(빈 칸 → 이메일 → 시간)를 바꾸지 않습니다.
5. **움직임 줄이기 존중.** `prefers-reduced-motion` 이면 애니메이션 없이 바로 보여 줍니다.
6. 바꾼 뒤에는 `npm run lint` 와 `npm run build` 가 오류 없이 끝나는지 확인합니다.
