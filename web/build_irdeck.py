# -*- coding: utf-8 -*-
"""
IR 원본(`pitch/build_ir.js`)에서 **숫자 출처 표**를 뽑아
`web/irdeck/sources.js` 를 만듭니다.

    cd C:\\chanchan\\web
    python build_irdeck.py

── 왜 스크립트로 만드나 ───────────────────────────────────

IR 덱 · 사업계획서 · 웹의 숫자는 **서로 같아야 합니다**
(`.claude/rules/docs-and-claims.md`). 출처 37줄을 웹 페이지에 손으로
옮겨 적으면, `build_ir.js` 에서 숫자가 하나 바뀔 때 웹만 옛 숫자로
남습니다. 그래서 **원본에서 뽑아 씁니다.**

`web/irdeck/sources.js` 는 **생성물입니다 — 손으로 고치지 마세요.**
고쳐야 하면 `pitch/build_ir.js` 의 `SRC` 를 고치고 이 스크립트를
다시 돌립니다.

⚠️ 슬라이드 본문(제목 · 카드 · 표)은 `web/irdeck/index.html` 에 직접
   적혀 있습니다. 이 스크립트가 만드는 것은 **부록 출처 표 하나**뿐입니다.
   본문 숫자를 고칠 때는 `build_ir.js` 와 `index.html` 을 **같이** 고칩니다.
"""
import io
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_JS = os.path.join(HERE, os.pardir, 'pitch', 'build_ir.js')
OUT = os.path.join(HERE, 'irdeck', 'sources.js')

#: 홑따옴표 문자열 하나. `\'` 로 이스케이프한 것도 받습니다.
STR = re.compile(r"'((?:[^'\\]|\\.)*)'")


def rows():
    """`const SRC = [ ... ];` 안의 네 칸짜리 줄을 모읍니다."""
    text = io.open(SRC_JS, encoding='utf-8').read()
    start = text.index('const SRC = [')
    end = text.index('Array.from({ length: Math.ceil(SRC.length', start)
    block = text[start:end]

    out = []
    # 한 줄은 `['장', '숫자', '기준', '출처'],` 입니다.
    for line in block.split('\n'):
        line = line.strip()
        if not line.startswith('['):
            continue
        cells = [m.group(1).replace("\\'", "'") for m in STR.finditer(line)]
        if len(cells) != 4:
            # ⚠️ 조용히 넘기지 않습니다. 한 줄이라도 빠지면 출처가 사라집니다
            raise SystemExit('출처 줄을 네 칸으로 읽지 못했습니다: ' + line[:70])
        out.append(cells)
    return out


def main():
    data = rows()
    if len(data) < 30:
        raise SystemExit('출처가 ' + str(len(data)) + '줄뿐입니다 — 원본을 못 읽은 것 같습니다')

    chapters = sorted(set(r[0] for r in data), key=lambda c: int(c))
    body = json.dumps(data, ensure_ascii=False, indent=0).replace('\n', '')

    text = (
        '/* 생성물입니다 — 손으로 고치지 마세요.\n'
        '   원본: pitch/build_ir.js 의 SRC\n'
        '   만드는 법: cd web && python build_irdeck.py */\n'
        'window.IR_SOURCES = ' + body + ';\n'
    )
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(text)

    print('sources.js: ' + str(len(data)) + '줄 · 장 '
          + ', '.join(chapters))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
