# -*- coding: utf-8 -*-
"""
legal/*.md → web/*.html

법무 원문은 legal/ 폴더가 유일한 기준입니다. 문서를 고치면 이 스크립트를 다시
돌려 웹 페이지를 갱신하세요. 두 벌을 손으로 관리하면 반드시 어긋납니다.

    python web/build_legal.py
"""
import io, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = [
    ('legal/01_개인정보처리방침.md', 'web/privacy.html', '개인정보처리방침'),
    ('legal/02_서비스이용약관.md',   'web/terms.html',   '이용약관'),
]

#: 앱 안에도 **같은 글**이 한 벌 더 있습니다 (설정 → 개인정보처리방침).
#:
#: ⚠️ 2026-11-05 까지 이 사본은 **손으로** 맞추고 있었습니다. 두 벌을 손으로
#:    관리하면 반드시 어긋납니다 — 웹은 고쳤는데 앱은 옛 글을 보여 주는 일이
#:    생깁니다. 방침은 어긋나면 안 되는 글입니다.
COPIES = [
    ('legal/01_개인정보처리방침.md', 'android-java/app/src/main/assets/legal/privacy.md'),
    ('legal/02_서비스이용약관.md',   'android-java/app/src/main/assets/legal/terms.md'),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — 찬찬</title>
<meta name="description" content="찬찬(CHANCHAN) {title}">
<link rel="icon" href="favicon.png">
<!-- 번호는 config.js 한 곳에만. site.js 보다 먼저 와야 합니다 -->
<script src="config.js"></script>
<style>
  :root{{
    --green:#2F6B4F;--deep:#183F30;--mist:#E9F2EC;--ivory:#FFFDFC;
    --oat:#F7F3EA;--ink:#24332B;--slate:#5E6B63;--line:#DDE7E0;
  }}
  /* 브랜드 브리프(2026-11-09): 웹의 **모든 글자**를 광양햇살체로.
     출처표시 — 광양시청 광양햇살체 (공공누리 제1유형). */
  @font-face{{font-family:'Gwangyang';src:url('fonts/Gwangyang-Regular.woff2') format('woff2');
    font-weight:400;font-style:normal;font-display:swap}}
  @font-face{{font-family:'Gwangyang';src:url('fonts/Gwangyang-Bold.woff2') format('woff2');
    font-weight:700;font-style:normal;font-display:swap}}
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{
    font-family:'Gwangyang','Malgun Gothic','맑은 고딕',-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;
    background:var(--ivory);color:var(--ink);line-height:1.8;
    -webkit-font-smoothing:antialiased;
  }}
  header{{background:var(--ivory);border-bottom:1px solid var(--line)}}
  .wrap{{max-width:780px;margin:0 auto;padding:0 24px}}
  .nav{{display:flex;align-items:center;height:72px}}
  .nav img{{height:32px}}
  main{{padding:56px 0 80px}}
  h1{{font-size:clamp(26px,4vw,34px);font-weight:800;letter-spacing:-.6px;margin-bottom:10px}}
  .updated{{color:var(--slate);font-size:15px;margin-bottom:40px}}
  h2{{
    font-size:19px;font-weight:800;margin:38px 0 12px;
    padding-top:22px;border-top:1px solid var(--line)
  }}
  h2:first-of-type{{border-top:none;padding-top:0}}
  h3{{font-size:16px;font-weight:800;margin:22px 0 8px}}
  p{{margin-bottom:14px;color:var(--slate);font-size:16px}}
  strong{{color:var(--ink)}}
  ul,ol{{margin:0 0 16px 22px}}
  li{{margin-bottom:8px;color:var(--slate);font-size:16px}}
  table{{width:100%;border-collapse:collapse;margin:18px 0;font-size:15px}}
  th,td{{border:1px solid var(--line);padding:10px 12px;text-align:left}}
  th{{background:var(--mist);font-weight:800;color:var(--ink)}}
  td{{color:var(--slate)}}
  hr{{border:none;border-top:1px solid var(--line);margin:32px 0}}
  a{{color:var(--green)}}
  .back{{
    display:inline-block;margin-top:48px;padding:13px 26px;border-radius:999px;
    background:var(--green);color:#fff;text-decoration:none;font-weight:800
  }}
  footer{{background:var(--ink);color:#8FA396;padding:36px 0;font-size:14px;text-align:center}}
</style>
</head>
<body>
<header><div class="wrap nav"><a href="index.html"><img src="logo.png" alt="찬찬"></a></div></header>
<main><div class="wrap">
{body}
<a class="back" href="index.html">← 홈으로</a>
</div></main>
<footer><div class="wrap">© 2026 찬찬 (CHANCHAN)</div></footer>
<script src="site.js"></script>
</body>
</html>
"""


def md_to_html(md: str) -> str:
    """의도적으로 최소한만 지원합니다 — 법무 문서에 쓰이는 문법이 전부입니다."""
    out, lines = [], md.split('\n')
    i, in_ul, in_ol, in_table = 0, False, False, False

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul: out.append('</ul>'); in_ul = False
        if in_ol: out.append('</ol>'); in_ol = False

    def inline(t: str) -> str:
        t = html.escape(t)
        t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
        t = re.sub(r'`(.+?)`', r'<code>\1</code>', t)
        t = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', t)
        return t

    while i < len(lines):
        ln = lines[i].rstrip()

        # table
        if ln.startswith('|'):
            if not in_table:
                close_lists(); out.append('<table>'); in_table = True
                cells = [c.strip() for c in ln.strip('|').split('|')]
                out.append('<tr>' + ''.join(f'<th>{inline(c)}</th>' for c in cells) + '</tr>')
                i += 2 if i + 1 < len(lines) and set(lines[i+1].replace('|','').strip()) <= set('-: ') else 1
                continue
            cells = [c.strip() for c in ln.strip('|').split('|')]
            out.append('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in cells) + '</tr>')
            i += 1
            continue
        elif in_table:
            out.append('</table>'); in_table = False

        if not ln.strip():
            close_lists(); i += 1; continue
        if ln.startswith('---'):
            close_lists(); out.append('<hr>'); i += 1; continue
        if ln.startswith('### '):
            close_lists(); out.append(f'<h3>{inline(ln[4:])}</h3>'); i += 1; continue
        if ln.startswith('## '):
            close_lists(); out.append(f'<h2>{inline(ln[3:])}</h2>'); i += 1; continue
        if ln.startswith('# '):
            close_lists(); i += 1; continue          # 제목은 템플릿이 따로 렌더
        if re.match(r'^\d+\.\s', ln):
            if not in_ol:
                close_lists(); out.append('<ol>'); in_ol = True
            item = re.sub(r'^\d+\.\s', '', ln)
            out.append('<li>' + inline(item) + '</li>'); i += 1; continue
        if ln.startswith(('- ', '· ', '* ')):
            if not in_ul: close_lists(); out.append('<ul>'); in_ul = True
            out.append(f'<li>{inline(ln[2:])}</li>'); i += 1; continue

        close_lists(); out.append(f'<p>{inline(ln)}</p>'); i += 1

    close_lists()
    if in_table: out.append('</table>')
    return '\n'.join(out)


for src, dst, title in PAGES:
    md = io.open(os.path.join(ROOT, src), encoding='utf-8').read()
    m = re.search(r'\*\*(시행일|최종 수정일)[^\*]*\*\*', md)
    updated = m.group(0).replace('**', '') if m else ''
    # 헤더에 따로 렌더하므로 본문에서는 제거 — 안 하면 같은 줄이 두 번 나옵니다.
    if m:
        md = md.replace(m.group(0), '', 1)
    body = f'<h1>{title}</h1>'
    if updated:
        body += f'<p class="updated">{html.escape(updated)}</p>'
    body += md_to_html(md)
    io.open(os.path.join(ROOT, dst), 'w', encoding='utf-8').write(
        TEMPLATE.format(title=title, body=body)
    )
    print('wrote', dst)


# ── 앱 안 사본 맞추기 ────────────────────────────────────────
#
# 웹만 고치고 앱을 잊으면, 어르신이 설정에서 보시는 방침이 **옛 글**로
# 남습니다. 그래서 여기서 통째로 덮어씁니다 — 손으로 맞추지 않습니다.
#
# ⚠️ 바뀐 것이 있으면 **다음 앱 빌드에 꼭 들어가야 합니다.** 웹만 올리면
#    앱 안 글은 그대로입니다.
for src, dst in COPIES:
    s = os.path.join(ROOT, src)
    d = os.path.join(ROOT, dst)
    if not os.path.exists(d):
        print('skip (app file missing):', dst)
        continue
    before = io.open(d, encoding='utf-8').read()
    after = io.open(s, encoding='utf-8').read()
    if before == after:
        print('same :', dst)
        continue
    io.open(d, 'w', encoding='utf-8', newline='').write(after)
    print('SYNCED (must go into the next app build):', dst)
