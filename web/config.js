/*
  chanchan.kr — 바깥 서비스에 쓰는 값 모음

  ⚠️ **이 파일은 공개됩니다.** 사이트에 올라가면 누구나 열어 볼 수
     있습니다. 아래 값들은 **원래 공개되는 값**이라 그래도 됩니다 —
     광고·통계 도구의 번호, 그리고 Supabase 의 `anon` 키입니다.

  ⚠️ **절대 넣지 마세요**
       · Supabase `service_role` 키   ← 이 키 하나로 모든 자료를 읽고 지웁니다
       · OpenAI 키 · Firebase 서비스 계정 키
       · 비밀번호 · 문자 발송 업체 키
     그런 값은 Supabase Edge Function 의 Secrets 에만 둡니다.

  ⚠️ **왜 index.html 안에 안 쓰나**
     번호를 고칠 때 페이지를 뒤지지 않아도 되게 한자리에 모았습니다.
     값이 비어 있으면 그 도구는 **아예 안 불러옵니다** — 번호를 넣기
     전에도 페이지는 그대로 돌아갑니다.

  채우는 법: 아래 '' 안에 번호를 넣고 저장 → `python build_dist.py` →
            `npx --yes wrangler pages deploy _dist --project-name=chanchan-kr`
*/
window.CHANCHAN_CONFIG = {

  // ── 자료를 받는 곳 (Supabase) ──────────────────────────────
  //
  // Supabase → Project Settings → API 에서 봅니다.
  //   supabaseUrl    'Project URL'
  //   supabaseAnon   'Project API keys' 의 **anon public** (service_role 아님)
  //
  // 이 키로는 **적을 수만 있고 읽을 수 없습니다** (마이그레이션 024).
  supabaseUrl:  '',
  supabaseAnon: '',

  // ── 광고·통계 ──────────────────────────────────────────────
  //
  // 비워 두면 그 도구는 안 불러옵니다. 번호가 생기면 그때 채우세요.
  //
  //   metaPixelId  Meta 이벤트 관리자 → 데이터 소스 → 픽셀 ID (숫자 15~16자리)
  //   ga4Id        Google Analytics → 관리 → 데이터 스트림 → 측정 ID ('G-' 로 시작)
  //   clarityId    Microsoft Clarity → Settings → Overview → Project ID (영문 10자)
  metaPixelId: '',
  ga4Id:       '',
  clarityId:   '',

  // ── 적는 곳 ────────────────────────────────────────────────
  //
  // 화면과 오류 안내에 같이 보여 드리는 주소입니다.
  contactEmail: 'support@chanchan.kr'
};
