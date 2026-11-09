# -*- coding: utf-8 -*-
"""
올릴 것만 `_dist/` 에 담습니다.

── 왜 필요한가 ────────────────────────────────────────────

예전 안내는 `wrangler pages deploy .` 이었습니다. `.` 은 **폴더 전체**를
올립니다 — 이런 것들이 같이 공개됩니다.

  _archive/chanchan-site-upload-2026-10-22.zip   버린 도메인 · 옛 이메일이 든 묶음
  DEPLOY.md · build_legal.py · tools/            작업용 파일
  .wrangler/                                     계정 캐시

2026-11-03 에 배포 직전에 발견했습니다.

그리고 `img/` 에는 **지금 안 쓰는 옛 캐릭터 그림 20여 장**이 남아 있습니다
(캐릭터를 뺐지만 파일은 지우지 않았습니다). 그것도 같이 올라갔습니다.

이 스크립트는 **페이지가 실제로 가리키는 파일만** 찾아서 담습니다.
그림을 새로 쓰면 자동으로 따라옵니다 — 목록을 손으로 고칠 필요가 없습니다.

돌리는 법
  cd C:\\chanchan\\web
  python build_dist.py
  npx --yes wrangler pages deploy _dist --project-name=chanchan-kr
"""
import io
import os
import re
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, '_dist')

#: 올릴 페이지. 하위 폴더 페이지도 여기 적습니다 (`irdeck/` → `chanchan.kr/irdeck`)
PAGES = ['index.html', 'privacy.html', 'terms.html', 'irdeck/index.html']

#: 언제나 올리는 것 (페이지가 가리키지 않아도 필요합니다)
ALWAYS = PAGES + ['favicon.png']

#: 페이지에서 주소를 찾아낼 자리
# `data-lb` 는 IR 덱에서 「크게 보기」로 띄우는 그림입니다. 이것도 봐야
# 합니다 — 2026-11-09 에 posmap 이 이 regex 에 안 걸려 빠졌습니다.
REFS = re.compile(r'(?:src|href|poster|data-lb)="([^"]+)"')
CSS_URL = re.compile(r"url\(['\"]?([^'\")]+)")


def referenced():
    """페이지가 실제로 가리키는 파일을 모읍니다.

    ⚠️ 주소는 **그 페이지가 있는 폴더 기준**입니다. `irdeck/index.html` 의
       `../fonts/x.ttf` 는 `fonts/x.ttf` 이고 `img/y.png` 는
       `irdeck/img/y.png` 입니다. 페이지 기준을 안 보면 조용히 빠집니다.
    """
    found = set()
    for page in PAGES:
        path = os.path.join(HERE, page.replace('/', os.sep))
        if not os.path.exists(path):
            continue
        base = os.path.dirname(page)
        text = io.open(path, encoding='utf-8').read()
        for m in list(REFS.finditer(text)) + list(CSS_URL.finditer(text)):
            url = m.group(1).split('?')[0].split('#')[0]
            if not url or url.startswith(('http', 'mailto:', 'data:', '/', '#')):
                continue
            rel = os.path.normpath(os.path.join(base, url)).replace(os.sep, '/')
            # ⚠️ `web/` 밖을 가리키면 담지 않습니다 — 올리면 안 되는 파일입니다
            if rel.startswith('..'):
                print('⚠️ web/ 밖을 가리킵니다 (담지 않음): ' + page + ' → ' + url)
                continue
            found.add(rel)
    return found


def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    want = set(ALWAYS) | referenced()
    missing = []
    copied = []
    for rel in sorted(want):
        src = os.path.join(HERE, rel.replace('/', os.sep))
        if not os.path.isfile(src):
            # ⚠️ 조용히 넘기지 않습니다. 빠진 파일은 깨진 페이지가 됩니다
            missing.append(rel)
            continue
        dst = os.path.join(DIST, rel.replace('/', os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied.append(rel)

    total = sum(os.path.getsize(os.path.join(r, f))
                for r, _, fs in os.walk(DIST) for f in fs)
    print('담았습니다: ' + str(len(copied)) + '개 · '
          + str(round(total / 1024 / 1024, 1)) + ' MB')
    for rel in copied:
        print('  ' + rel)

    if missing:
        print('')
        print('⚠️ 페이지가 가리키는데 파일이 없습니다 — 그대로 올리면 깨집니다:')
        for rel in missing:
            print('  ' + rel)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
