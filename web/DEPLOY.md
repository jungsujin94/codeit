# 배포 안내 — 랜딩·방침 페이지

2026-10-26 기준. **사이트는 하나입니다.**

| | |
|---|---|
| 주소 | `https://chanchan.kr` (공짜 주소: `chanchan-kr.pages.dev`) |
| 소스 | `web/` |
| 올리는 곳 | Cloudflare Pages — 프로젝트 이름 **`chanchan-kr`** |

처음 설정하는 순서는 **`docs/가이드-chanchan.kr-설정.md`** 를 보세요.
이 문서는 **이미 올라간 것을 다시 올릴 때** 보는 것입니다.

> ### 옛 내용을 지웠습니다 (2026-10-26)
> | 지운 것 | 왜 |
> |---|---|
> | `chanchan.site` · `app.chanchan.site` | 도메인을 `chanchan.kr` 로 옮겼습니다. `.site` 는 네임칩 WHOIS 미확인으로 정지됐고 갱신하지 않습니다 |
> | `chanchan-app` (웹 앱) | `sponsorfit` 은 **보관**입니다. 앱은 `android-java` 한 벌뿐입니다 |
> | `analyze-message` Edge Function 배포 | 판정을 **기기 안에서** 합니다. 서버 AI 를 쓰지 않습니다 |
> | 구글 로그인용 Supabase URL 설정 | 로그인을 **전화번호 + 문자 6자리**로 바꿉니다 (`docs/결정기록-2026-10-26.md`) |

---

## 다시 올리는 법

### 0. 올리기 전에 — `config.js` 를 채우셨나요 (2026-11-04)

신청서와 광고 숫자 세기는 **`web/config.js` 의 번호로 돕니다.**
비어 있으면 페이지는 그대로 뜨지만 **신청서가 안 보내집니다.**

| 넣을 값 | 어디서 |
|---|---|
| `supabaseUrl` · `supabaseAnon` | Supabase → Project Settings → API (**anon public**. service_role 아님) |
| `metaPixelId` | Meta 이벤트 관리자 → 데이터 소스 |
| `ga4Id` | Google Analytics → 관리 → 데이터 스트림 (`G-` 로 시작) |
| `clarityId` | Microsoft Clarity → Settings → Overview |

그리고 Supabase 에서 **`024_landing_forms.sql` 을 돌리셨어야** 합니다.
안 돌리면 신청서가 「전송에 실패했습니다」만 보여 줍니다.

올린 뒤 확인 — 브라우저에서 F12 → Console 에 붙여넣기:

```js
fetch('https://<내프로젝트>.supabase.co/rest/v1/waitlist_signups?select=*',
      {headers:{apikey:'<anon 키>'}}).then(r=>r.status)
```

**401 또는 403 이 나와야 맞습니다.** 200 이 나오면 신청자 이메일이
공개되고 있다는 뜻입니다 — 광고를 멈추고 알려 주세요.

---

### 1. 법무 문서를 고쳤다면 먼저 다시 만듭니다

```bash
cd C:\chanchan\web; python build_legal.py
```

`legal/01_개인정보처리방침.md` · `legal/02_서비스이용약관.md` 에서
`privacy.html` · `terms.html` 을 다시 만듭니다. **html 을 직접 고치지 마세요** — 덮어쓰입니다.

### 1-2. IR 덱(`/irdeck`)의 출처 표 다시 만들기

```bash
cd C:\chanchan\web; python build_irdeck.py
```

`pitch/build_ir.js` 의 숫자 출처 37줄을 뽑아 `irdeck/sources.js` 를 만듭니다.
**IR 덱의 숫자를 고쳤다면 이것을 먼저 돌리세요** — 안 돌리면 웹 부록만
옛 출처로 남습니다. `sources.js` 는 생성물이라 손으로 고치지 않습니다.

> ⚠️ 슬라이드 **본문**의 숫자는 `web/irdeck/index.html` 에 직접 적혀 있습니다.
> `pitch/build_ir.js` 를 고칠 때 **둘을 같이** 고쳐야 합니다
> (`.claude/rules/docs-and-claims.md` — IR · 사업계획서 · 웹의 숫자는 같아야 합니다).

### 2. 올릴 묶음 만들기

```bash
cd C:\chanchan\web; python -c "import zipfile,os;z=zipfile.ZipFile('chanchan-kr-upload.zip','w',zipfile.ZIP_DEFLATED);[z.write(f,f) for f in ['index.html','privacy.html','terms.html','config.js','site.js','logo.png','favicon.png']];[z.write(os.path.join(r,f),os.path.join(r,f).replace(os.sep,'/')) for d in ['fonts','img','video'] for r,_,fs in os.walk(d) for f in fs];z.close();print(len(z.namelist()),'files')"
```

### 3. 올리기

```bash
cd C:\chanchan\web; python build_dist.py; npx --yes wrangler pages deploy _dist --project-name=chanchan-kr
```

> ⚠️ **`deploy .` 으로 하지 마세요** (2026-11-03 에 고쳤습니다).
> `.` 은 **폴더 전체**를 올립니다 — `_archive/` 의 옛 묶음(틀린 이메일이 든),
> `DEPLOY.md`, `build_legal.py`, `tools/` 까지 **전부 공개**됩니다.
> `build_dist.py` 가 **페이지가 실제로 쓰는 파일만** `_dist/` 에 담습니다.
>
> ⚠️ 처음 한 번은 **브라우저 로그인 창**이 뜹니다. Cloudflare 계정으로
> 허용해 주세요. 그 뒤로는 안 묻습니다.

또는 화면에서: Cloudflare → **Workers & Pages** → `chanchan-kr` → **Create deployment** →
`chanchan-kr-upload.zip` 끌어다 놓기

---

## 올리는 것 · 안 올리는 것

| 올립니다 | 올리지 않습니다 |
|---|---|
| `index.html` `privacy.html` `terms.html` | `DEPLOY.md` (이 문서) |
| **`irdeck/`** ← IR 덱 (2026-11-09) | `build_legal.py` · `build_irdeck.py` (빌드용) |
| `logo.png` `favicon.png` | `tools/` (작업용) |
| `fonts/` ← **빠지면 제목이 시스템 글꼴로 나옵니다** | `*.zip` (묶음 자체) |
| `img/` | |
| **`video/`** ← 30초 영상 + 포스터 (2026-11-03) | |

> ⚠️ 위의 **2번 「올릴 묶음 만들기」(zip) 는 `irdeck/` 를 담지 않습니다.**
> 손으로 적은 목록이라서입니다. **3번 `build_dist.py` 로 올리세요** —
> 그쪽이 페이지가 가리키는 파일을 스스로 찾습니다.

> `fonts` 가 빠져도 **에러가 나지 않습니다.** 제목만 조용히 다른 글꼴로 바뀝니다.
> 올린 뒤 꼭 눈으로 확인하세요.

---

## 배포 후 확인

- [ ] `https://chanchan.kr` 열림 (자물쇠)
- [ ] `https://chanchan.kr/privacy` 열림 — **플레이의 개인정보처리방침 URL**
- [ ] `https://chanchan.kr/terms` 열림
- [ ] `https://chanchan.kr/irdeck` 열림 — 오른쪽 화살표로 28장이 넘어가는지
- [ ] 제목이 광양햇살체로 나옴
- [ ] 휴대폰 브라우저에서도 확인

> **IR 덱은 검색에 안 잡히게 해 두었습니다**(`noindex`). 주소를 아는 분은
> 열 수 있지만 구글 검색에는 안 나옵니다 — 가격 가설 · 재무 가정 ·
> 「부족한 것」이 들어 있어서입니다. 검색에 나오게 하려면
> `web/irdeck/index.html` 의 `robots` 줄을 지우세요.

---

## 이메일

| | |
|---|---|
| 업무·계정 | `sujin.chanchan@gmail.com` — 플레이 콘솔·Firebase·Supabase 로그인과 복구 |
| 공개 문의 (사이트·앱·법무 문서) | `support@chanchan.kr` |
| 개인정보 문의 | `privacy@chanchan.kr` |

둘 다 Cloudflare **Email Routing** 으로 `support.chanchan@gmail.com` 에 **전달**됩니다
(무료, 받기 전용). 메일은 그 Gmail 에서 읽습니다.

**왜 Gmail 을 직접 적지 않나** (2026-10-27 결정, 10-26 결정을 뒤집음)
이 주소는 **앱 바이너리**(`strings_help.xml`)와 법무 문서에 박힙니다. 바꾸려면
앱을 다시 내야 하고, 이미 깔린 폰에는 옛 주소가 영원히 남습니다. 도메인 주소로
두면 담당자가 바뀌어도 **전달 설정만 고치면** 됩니다.

⚠️ **알고 계셔야 할 한계** — 전달은 받기 전용입니다. 답장하면 받는 쪽에는
`support.chanchan@gmail.com` 에서 온 것으로 보입니다. 앱에 적힌 주소와 달라서,
어르신께는 그 자체가 의심거리가 될 수 있습니다 (찬찬이 가르치는 신호입니다).
먼저 메일을 보낼 일이 생기면 그때 **Zoho Mail 무료** 나 **구글 워크스페이스
(월 약 8천원)** 로 옮기세요. 주소는 그대로라 **앱도 방침도 안 고칩니다.**

⚠️ 중요한 서비스의 **로그인·비밀번호 복구 메일에는 전달 주소를 쓰지 마세요.**
도메인이나 전달 설정이 끊기면 계정을 못 찾습니다. 그런 곳은 Gmail 직접.

✅ `@chanchan.app` 은 찬찬 것이 아니었습니다 (임시값이 법무 문서까지 들어가
있었습니다). 2026-10-26~27 에 전부 치웠습니다.
