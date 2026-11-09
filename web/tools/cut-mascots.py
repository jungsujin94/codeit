# -*- coding: utf-8 -*-
"""캐릭터 시트에서 랜딩페이지용 이미지를 잘라 낸다.

캐릭터는 **찬이 한 사람만** 씁니다 (2026-09-30).

    python web/tools/cut-mascots.py      (저장소 맨 위에서 실행)

시트(branding/찬이-미니.png · 찬아-미니.png)는 배경이 **순백색**이다.
흰 배경은 테두리에서 이어진 곳만 지운다 — 그래야 폰 화면처럼
인물 안쪽에 있는 흰색은 남는다.

시트를 새로 만드시면 ROWS(줄 위치)와 PICK(어느 칸을 어디에 쓸지)만
고쳐서 다시 돌리면 됩니다. 결과는 web/img/ 에 덮어씁니다.
"""
import numpy as np
from PIL import Image
from collections import deque

BASE = "branding/"
ALSO = "branding/Archive/"   # 정리해 옮겨 둔 예전 시트도 여기서 찾는다
OUT = "web/img/"
LO, HI = 244, 252          # 이보다 밝으면 배경, 어두우면 인물 (사이는 반투명)
FLOOD = 238                # 배경을 따라갈 때 쓰는 기준 (넉넉하게)
INNER_MAX = 30000          # 이보다 작은 「갇힌 흰 곳」만 인물 안쪽으로 본다

# 시트마다 (파일, 줄들) — 줄은 (y시작, y끝, x시작, x끝, 칸 수)
SHEETS = {
    'i': (u'찬이-미니5.png',
          [(31, 288, 10, 1520, 8),     # 줄1 — 인사 · 엄지 · 폰확인 · 돋보기 · 궁금 · 전구 · 하트 · 응원
           (307, 546, 13, 1528, 8),    # 줄2 — 경고 · STOP · 단호 · 폰경고 · 걱정 · 놀람 · 놀람 · 팔짱
           (559, 789, 16, 1520, 8),    # 줄3 — 확성기 · 점검표 · 방패 · 편지 · 전화 · 말풍선 · 달력 · 강아지
           (806, 1009, 23, 1530, 8)]), # 줄4 — 노트북 · 경고 · 안심 · 인사 · 물음표 · 생각 · 눈물 · 응원
}

# 쓸 곳 → (줄, 칸)  ※ 둘 다 0부터 셈
PICK = {
    'i': {'stand': (0, 3), 'guide': (2, 0), 'explain': (2, 5), 'check': (0, 2),
          'cheer': (0, 7), 'recommend': (0, 1), 'think': (0, 4),
          # 위험 · 조심 · 불확실 — 판정에 쓰는 표정
          'warn': (1, 0), 'careful': (1, 4), 'unsure': (3, 4),
          # 첫 화면에서 인사하는 모습
          'hello': (0, 0)},
}

# 아이콘 줄 — 두 시트에 같은 아이콘이 있어 한쪽에서만 가져온다
ICON_SHEET = 'i4'
ICON_ROW = (895, 1011, 40, 1473, 10)
ICON_FILE = u'찬이-미니4.png'   # 아이콘 줄이 있는 시트
ICONS = ['shield', 'warn', 'chat', 'phone', 'mail', 'search', 'calendar', 'bell', 'gear', 'person']


def sheet_path(fn):
    """시트를 branding/ 에서 찾고, 없으면 Archive/ 에서 찾는다."""
    import os
    for d in (BASE, ALSO):
        if os.path.exists(d + fn): return d + fn
    raise SystemExit('시트를 찾지 못했습니다: ' + fn)


def to_rgba(im):
    """흰 배경을 투명하게 만든다. 테두리에서 이어진 흰색만 지운다.
    시트가 이미 투명하면 그대로 쓴다."""
    if im.mode in ('RGBA', 'LA'):
        rgba = im.convert('RGBA')
        al0 = np.asarray(rgba)[..., 3].astype(np.float64)
        if (al0 < 10).mean() > 0.05:
            return rgba, al0
    a = np.asarray(im.convert('RGB'), dtype=np.float64)
    mn = a.min(axis=2)
    al = np.clip((HI - mn) / float(HI - LO), 0, 1) * 255
    h, w = mn.shape
    # 배경을 따라갈 때는 기준을 넉넉히 잡는다. 칸 사이가 살짝 어두우면
    # 거기서 막혀서 그 너머가 「인물 안쪽」으로 오인된다.
    white = mn >= FLOOD
    bg = np.zeros((h, w), bool); q = deque()
    for x in range(w):
        for y in (0, h-1):
            if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w-1):
            if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x+dx, y+dy
            if 0 <= nx < w and 0 <= ny < h and white[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((nx, ny))
    # 테두리에서 못 닿은 흰 곳 가운데 **작은 것만** 인물 안쪽(폰 화면 등)으로 보고 채운다.
    inner = white & ~bg
    seen = np.zeros((h, w), bool)
    for sy, sx in zip(*np.nonzero(inner)):
        if seen[sy, sx]: continue
        comp = []; seen[sy, sx] = True; q = deque([(sx, sy)])
        while q:
            x, y = q.popleft(); comp.append((y, x))
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                nx, ny = x+dx, y+dy
                if 0 <= nx < w and 0 <= ny < h and inner[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((nx, ny))
        if len(comp) <= INNER_MAX:
            for y, x in comp: al[y, x] = 255

    # 반투명 가장자리에는 흰 배경이 섞여 있어 어두운 바탕에 올리면 흰 테두리로 보인다.
    # 섞이기 전 색을 되돌려 놓는다 (a로 나누기).
    f = np.clip(al/255.0, 0, 1)[..., None]
    rgb = np.where(f > 0.02, (a - 255*(1-f)) / np.maximum(f, 0.02), a)
    out = Image.fromarray(np.clip(rgb, 0, 255).astype('uint8'), 'RGB').convert('RGBA')
    out.putalpha(Image.fromarray(al.astype('uint8'), 'L'))
    return out, al


def cut_row(al, y0, y1, x0, x1, k, win=40):
    """한 줄을 칸 수만큼 나눈다. 칸이 붙어 있으면
    예상 경계 근처에서 그림이 가장 적게 걸리는 열을 찾아 자른다."""
    band = al[y0:y1, :] > 40
    cov = band.sum(axis=0)
    cuts = [x0]
    pitch = (x1 - x0) / float(k)
    for i in range(1, k):
        c = int(x0 + i*pitch)
        lo, hi = max(x0+20, c-win), min(x1-20, c+win)
        cuts.append(int(lo + np.argmin(cov[lo:hi])))
    cuts.append(x1)
    out = []
    for i in range(k):
        a, b = cuts[i], cuts[i+1]
        sub = band[:, a:b]
        ys = np.nonzero(sub.any(axis=1))[0]
        xs = np.nonzero(sub.any(axis=0))[0]
        out.append((a+int(xs[0]), y0+int(ys[0]), a+int(xs[-1])+1, y0+int(ys[-1])+1))
    return out


def trim(im):
    b = im.getbbox()
    return im.crop(b) if b else im


if __name__ == '__main__':
    for pre, (fn, rows) in SHEETS.items():
        rgba, al = to_rgba(Image.open(sheet_path(fn)))
        pieces = [cut_row(al, *r) for r in rows]
        for name, (ri, ci) in PICK[pre].items():
            o = trim(rgba.crop(pieces[ri][ci]))
            o.save(OUT + '%s-%s.png' % (pre, name))
            print('%s-%s' % (pre, name), o.size)

    # 아이콘은 아이콘 줄이 있는 시트에서 따로 가져온다
    rgba, al = to_rgba(Image.open(sheet_path(ICON_FILE)))
    for name, box in zip(ICONS, cut_row(al, *ICON_ROW)):
        o = trim(rgba.crop(box))
        o.save(OUT + 'ic-%s.png' % name)
        print('ic-'+name, o.size)
