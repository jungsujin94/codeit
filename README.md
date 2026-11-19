# 찬찬 랜딩 페이지 — Next.js 과제판

[chanchan.kr](https://chanchan.kr) 랜딩 페이지를 **Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui** 로 다시 만든 과제용 저장소입니다.
구간 차례와 한국어 문구는 chanchan.kr 와 글자 그대로 같습니다.

> **과제용 사본입니다.** 신청서는 검사(필수 칸 · 이메일 모양 · 숨은 칸 · 입력 시간)까지만 하고, **어디로도 보내지 않습니다.**
> 네트워크 요청 · API · 환경 변수 · 외부 데이터베이스가 없습니다.

- 실제 서비스: https://chanchan.kr
- 개인정보처리방침 · 이용약관: chanchan.kr 원본 문서로 연결합니다.

## 기술 스택

| 구분 | 사용한 것 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) · React 19 · TypeScript |
| 스타일 | Tailwind CSS v4 — 브랜드 색은 `src/app/globals.css` 의 `@theme` 에 `cc-*` 이름으로 넣었습니다 |
| UI 컴포넌트 | shadcn/ui — Button · Accordion · Input · Textarea · Label · Dialog · Card |
| 글꼴 | 광양햇살체(.woff2) — `next/font/local` |
| 이미지 · 메타 | `next/image`, Next.js Metadata API (`lang="ko"`, Open Graph 절대 경로 이미지) |

## 실행 방법

Node.js 20 이상이 필요합니다.

```bash
npm install      # 처음 한 번
npm run dev      # 개발 서버 → http://localhost:3000
npm run build    # 배포용으로 묶기 (오류 없이 끝나야 합니다)
npm run lint     # 코드 검사
```

## 폴더 구조

```
src/
├─ app/
│  ├─ layout.tsx          # <html lang="ko">, 글꼴, 메타데이터(title · description · openGraph)
│  ├─ page.tsx            # 구간을 chanchan.kr 와 같은 차례로 놓습니다
│  ├─ globals.css         # Tailwind 테마(브랜드 색 · 움직임) + shadcn 토큰
│  └─ icon.png            # 파비콘
├─ components/
│  ├─ sections/           # 구간 하나 = 파일 하나
│  │  ├─ site-header.tsx    # 네비게이션 + 기관용 띠 + 「앱 받기」(출시 준비 중 Dialog)
│  │  ├─ hero.tsx           # 히어로 (폰 두 대)
│  │  ├─ problem.tsx        # 왜 문자인가 (문제 → 해결 3단계)
│  │  ├─ demo.tsx           # 직접 눌러 보세요 (데모 · 다시 보기)
│  │  ├─ features.tsx       # 이렇게 도와드려요 (Card)
│  │  ├─ verdict-tiers.tsx  # 판정 3등급 신호등
│  │  ├─ audience.tsx       # 이용 대상 · 이것만은 지킵니다 (원칙과 신뢰)
│  │  ├─ family.tsx         # 어떻게 만들고 있나 · 자녀분께 가는 것 · 30초 영상
│  │  ├─ faq.tsx            # 궁금하신 점 (Accordion)
│  │  ├─ institution.tsx    # 기관 도입 + 시범 도입 문의
│  │  └─ site-footer.tsx    # 바닥
│  ├─ ui/                 # shadcn/ui 컴포넌트 (브랜드에 맞게 크기 · 색을 고침)
│  ├─ institution-form.tsx  # 신청서 (Input · Textarea · Label, 검사만 하고 보내지 않음)
│  ├─ coming-soon-dialog.tsx# 「아직 받으실 수 없습니다」 (Dialog)
│  ├─ signal.tsx            # 신호등 · 번호 매긴 할 일
│  ├─ section-parts.tsx     # 구간 머리(eyebrow · 제목 · 이끄는 글) · 영상 등 공통 조각
│  └─ …                     # 아이콘, 스크롤해서 나타나기, 부드러운 스크롤 버튼
├─ content/               # 문구와 반복 항목(카드 · 단계 · FAQ · 신청서 칸)을 담은 데이터 → .map() 으로 그림
└─ fonts/                 # 광양햇살체 .woff2
public/                   # 로고 · 앱 화면 그림 · 영상(mp4)과 포스터
docs/ai-review-log.md     # AI 가 만든 것과 사람이 확인 · 고친 것
```

## 원본(chanchan.kr)과 다른 점

- 신청서 위에 「과제용 사본입니다. 입력하신 내용은 저장되지 않습니다.」 한 줄을 넣었습니다.
- 원본에는 「출시 준비 중」 안내 창을 여는 버튼이 없어서, 위쪽 띠에 **「앱 받기」** 버튼을 하나 더했습니다.
- 이 버튼이 들어갈 자리를 위해 폭이 좁은 화면(640px 미만)에서는 로고 옆 「급할수록 찬찬히」를 숨깁니다.
- 광고 · 통계 도구(GA4 · Meta Pixel · Clarity)와 유입 경로 기록은 옮기지 않았습니다 (네트워크 요청을 하지 않기 위해).
- 「두 폰 체험」 · 개인정보처리방침 · 이용약관 · 오픈소스 라이선스는 chanchan.kr 의 원본 페이지로 연결합니다.

## 출처

이 사이트는 광양시청이 만든 **광양햇살체**를 씁니다 (공공누리 제1유형 · 출처표시).
