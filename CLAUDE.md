# CLAUDE.md — 찬찬 랜딩 Next.js 과제판

AI(Claude Code)와 함께 작업할 때 지키는 규칙입니다. 이 저장소는 **과제용**이며, 이 문서도 과제에 필요한 내용만 담습니다.

@AGENTS.md

## 목적

chanchan.kr 랜딩 페이지를 Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui 로 다시 만듭니다.
구간을 컴포넌트로 나누고, 반복되는 UI 는 데이터 배열 + `.map()` 으로 그립니다.

## 스택

- Next.js 16 (App Router, `src/` 폴더) · React 19 · TypeScript
- Tailwind CSS v4 — 테마는 `src/app/globals.css` 의 `@theme` (브랜드 색 `cc-*`, 화면 폭 `lg` = 980px)
- shadcn/ui (Base UI 기반 base-nova) — Button · Accordion · Input · Textarea · Label · Dialog · Card
- 글꼴: 광양햇살체 `.woff2` 만, `next/font/local`

## 구조

- `src/components/sections/` — 구간 하나 = 파일 하나. `src/app/page.tsx` 가 chanchan.kr 와 같은 차례로 놓습니다.
- `src/content/*.ts` — 모든 문구와 반복 항목. 컴포넌트에는 문구를 직접 쓰지 않습니다.
  - `**굵게**` 와 줄바꿈 `\n` 은 `<Rich>` 가 `<b>` · `<br>` 로 바꿉니다.
- `src/components/ui/` — shadcn/ui. 어르신용으로 크기(버튼 52px)와 색을 고친 판입니다.

## AI 가 따른 규칙

1. **문구는 글자 그대로.** chanchan.kr 의 한국어 문구를 바꾸거나 줄이거나 「다듬지」 않습니다.
   - 「안전합니다」 · 「정상」 · 「괜찮습니다」를 판정으로 쓰지 않습니다. 가장 낮은 등급은 「답하지 않으셔도 됩니다」입니다.
   - 신호등 맨 아래 램프는 초록이 아니라 옅은 회색입니다.
2. **큰 글씨 · 높은 대비.** 본문은 17px 아래로 내려가지 않습니다. 누르는 곳은 44px 이상(기본 52px).
   색만으로 뜻을 전하지 않습니다(글자 · 테두리 · 굵기로도 구분).
3. **아무것도 보내지 않습니다.** `fetch` · API 경로 · 외부 데이터베이스 · 환경 변수 · 광고/통계 스크립트를 넣지 않습니다.
   신청서는 검사 후 접수 화면만 보여 줍니다.
4. **스팸 막기는 CAPTCHA 없이.** 숨은 칸(nickname)과 최소 입력 시간(2초)으로 봅니다. 검사 순서(빈 칸 → 이메일 → 시간)를 바꾸지 않습니다.
5. **움직임 줄이기 존중.** `prefers-reduced-motion` 이면 애니메이션 없이 바로 보여 줍니다.
6. 바꾼 뒤에는 `npm run lint` 와 `npm run build` 가 오류 없이 끝나는지 확인합니다.
