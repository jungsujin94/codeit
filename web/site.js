/*
  chanchan.kr — 신청서 · 광고 숫자 세기

  ── 이 파일이 하는 일 ──────────────────────────────────────

    ① 어느 광고에서 왔는지 기억합니다 (utm_*)
    ② 광고·통계 도구 세 개를 불러옵니다 (번호가 있을 때만)
    ③ 신청서를 **페이지를 떠나지 않고** Supabase 로 보냅니다
    ④ 어디까지 보고 어디서 멈추셨는지 셉니다

  ── ⚠️ 지키는 것 ───────────────────────────────────────────

    · **이메일 · 성함 · 연락처를 광고·통계 도구로 보내지 않습니다.**
      보내는 것은 「보냈다는 사실」과 어느 신청서였는지뿐입니다.
      Meta · Google · Microsoft 로 신청자가 누군지 넘어가면 안 됩니다.

    · 넣기만 하고 **되돌려 받지 않습니다** (`Prefer: return=minimal`).
      024 에서 익명에게 읽기 권한을 주지 않았습니다. 기본값인
      `return=representation` 으로 보내면 넣기는 되고 **응답에서
      거부당해** 성공을 실패로 보여 드리게 됩니다.

    · 자동으로 밀어 넣는 것을 막는 데 **그림 맞추기(CAPTCHA)를
      쓰지 않습니다.** 어르신 가족이 많이 떨어져 나갑니다. 대신
      숨은 칸과 걸린 시간으로 봅니다.

  번호는 `config.js` 에 있습니다. 여기에 쓰지 마세요.
*/
(function () {
  'use strict';

  var CFG = window.CHANCHAN_CONFIG || {};
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  /* 사람이 넷을 채우는 데 2초는 걸립니다. 그보다 빠르면 사람이 아닙니다 */
  var MIN_FILL_MS = 2000;

  var MAIL = CFG.contactEmail || 'support@chanchan.kr';


  /* ══ ① 어느 광고에서 왔나 ═══════════════════════════════════
     처음 들어온 주소에만 utm 이 붙어 있습니다. 페이지를 옮기면
     사라지므로 그 자리에서 **기억해 둡니다.**

     ⚠️ sessionStorage 는 시크릿 창이나 저장을 막아 둔 폰에서
        **던지기만 하고 안 됩니다.** 전부 감싸고, 안 되면 그냥
        이 페이지에서만 들고 있습니다. 신청서는 그래도 보내집니다. */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  var STORE = 'chanchan.src';
  var source = {};

  function query(name) {
    /* URLSearchParams 를 못 쓰는 옛 폰도 있습니다 */
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  function readStore() {
    try {
      return JSON.parse(sessionStorage.getItem(STORE) || '{}') || {};
    } catch (e) { return {}; }
  }

  (function collectSource() {
    source = readStore();
    var fresh = false;
    KEYS.forEach(function (k) {
      var v = query(k);
      if (v) { source[k] = v.slice(0, 200); fresh = true; }
    });
    /* 첫 방문의 유입 경로만 남깁니다. 우리 페이지 사이를 옮겨 다닌
       것으로 덮어쓰면 「어디서 왔나」가 사라집니다 */
    if (!source.referrer && document.referrer &&
        document.referrer.indexOf(location.host) === -1) {
      source.referrer = document.referrer.slice(0, 500);
      fresh = true;
    }
    if (fresh) {
      try { sessionStorage.setItem(STORE, JSON.stringify(source)); } catch (e) {}
    }
  })();


  /* ══ ② 광고·통계 도구 ══════════════════════════════════════
     번호가 비어 있으면 **아예 안 불러옵니다.** 번호를 넣기 전에
     쓸데없는 요청을 보내지 않고, 콘솔에 오류도 남지 않습니다. */

  function addScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
    return s;
  }

  /* Google Analytics 4
     줄 세우는 자리(dataLayer)는 **번호가 없어도** 만듭니다. 그게 GA4 의
     표준 방식이고, 번호를 넣기 전에도 어떤 이벤트가 쌓이는지 확인할 수
     있습니다. 번호가 없으면 **불러오지만 않습니다** — 아무 데도 안 갑니다. */
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  if (CFG.ga4Id) {
    window.gtag('js', new Date());
    window.gtag('config', CFG.ga4Id);
    addScript('https://www.googletagmanager.com/gtag/js?id=' +
              encodeURIComponent(CFG.ga4Id));
  }

  /* Meta Pixel */
  if (CFG.metaPixelId) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CFG.metaPixelId);
    /* PageView 는 들어오신 것뿐입니다. 신청(`Lead`)은 **보내기가
       성공한 뒤에만** 쏩니다 — 페이지를 열 때 쏘면 광고 성과가
       전부 거짓이 됩니다 */
    window.fbq('track', 'PageView');
  }

  /* Microsoft Clarity — 화면 녹화·히트맵
     ⚠️ 녹화에 **입력하신 글자가 담기면 안 됩니다.** 모든 입력 칸에
        `data-clarity-mask` 를 붙여 두었고, 아래에서 혹시 빠진 칸이
        있으면 한 번 더 붙입니다 */
  if (CFG.clarityId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CFG.clarityId);
  }

  function maskInputs(root) {
    var f = root.querySelectorAll('input, textarea, select');
    for (var i = 0; i < f.length; i++) {
      if (!f[i].hasAttribute('data-clarity-mask')) {
        f[i].setAttribute('data-clarity-mask', 'true');
      }
    }
  }

  /* 두 곳으로 같이 보냅니다.
     ⚠️ params 에는 **이메일·성함·연락처를 넣지 마세요.** */
  function track(name, params) {
    params = params || {};
    if (window.gtag) window.gtag('event', name, params);
    if (window.fbq) window.fbq('trackCustom', name, params);
  }


  /* ══ ③ 신청서 ══════════════════════════════════════════════ */

  var FORMS = {
    waitlist: {
      table: 'waitlist_signups',
      row: function (get, el) {
        return {
          email:          get('email'),
          parent_android: get('parent_android') || null,
          wtp:            get('wtp') || null,
          region:         get('region') || null,
          consent:        true,
          placement:      el.getAttribute('data-placement') || null,
          user_agent:     (navigator.userAgent || '').slice(0, 500)
        };
      },
      /* [칸 이름, 못 채우셨을 때 드릴 말씀] */
      need: [
        ['email', '이메일을 적어 주세요.'],
        ['parent_android', '부모님 휴대폰이 안드로이드인지 골라 주세요.'],
        ['wtp', '월 얼마까지 괜찮으신지 골라 주세요.'],
        ['consent', '개인정보 수집·이용에 동의해 주세요.']
      ],
      email: ['email']
    },
    institution: {
      table: 'institution_inquiries',
      row: function (get) {
        return {
          org_name:      get('org_name'),
          org_type:      get('org_type'),
          department:    get('department') || null,
          contact_name:  get('contact_name'),
          contact_email: get('contact_email'),
          contact_phone: get('contact_phone') || null,
          message:       get('message') || null,
          consent:       true
        };
      },
      need: [
        ['org_name', '기관명을 적어 주세요.'],
        ['org_type', '기관 유형을 골라 주세요.'],
        ['contact_name', '담당자 성함을 적어 주세요.'],
        ['contact_email', '이메일을 적어 주세요.'],
        ['consent', '개인정보 수집·이용에 동의해 주세요.']
      ],
      email: ['contact_email']
    }
  };

  function send(table, row, done) {
    if (!CFG.supabaseUrl || !CFG.supabaseAnon) {
      /* 번호를 아직 안 넣으셨습니다. 조용히 넘기면 신청이 들어오는 줄
         알고 광고를 돌리게 됩니다 */
      done(false, 'not_configured');
      return;
    }
    var url = CFG.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/' + table;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CFG.supabaseAnon,
        'Authorization': 'Bearer ' + CFG.supabaseAnon,
        /* ⚠️ 이 줄을 지우지 마세요 — 위 주석 참고 */
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      done(r.ok, r.ok ? '' : 'http_' + r.status);
    }).catch(function () {
      done(false, 'network');
    });
  }

  function initForm(el) {
    var kind = el.getAttribute('data-form');
    var spec = FORMS[kind];
    if (!spec) return;

    var body = el.querySelector('.fbody');
    var done = el.querySelector('.fdone');
    var err  = el.querySelector('.ferr');
    var btn  = el.querySelector('button[type="submit"]');
    var place = el.getAttribute('data-placement') || '';

    maskInputs(el);

    var started = 0;
    var sentOk = false;

    function get(name) {
      var f = el.elements[name];
      if (!f) return '';
      if (f.length !== undefined && !f.tagName) {           // 라디오 묶음
        for (var i = 0; i < f.length; i++) if (f[i].checked) return f[i].value;
        return '';
      }
      if (f.type === 'checkbox') return f.checked ? 'on' : '';
      return (f.value || '').trim();
    }

    function say(msg) {
      if (!err) return;
      err.textContent = msg;
      err.hidden = !msg;
    }

    /* 어디까지 보셨나 — 신청서가 화면에 **들어온 순간** 한 번.

       ⚠️ threshold 를 올리지 마세요. 이것은 「보이는 넓이의 비율」인데
          신청서는 폰 화면보다 **길어서** 30%가 한 번에 들어오는 일이
          없습니다. 0.3 으로 뒀더니 아예 한 번도 안 떴습니다
          (2026-11-04 에 실제로 그랬습니다). 0 이 맞습니다. */
    /* ⚠️ **다 불린 뒤에** 봅니다. 그림에 크기를 적어 두지 않아서,
          불리기 전에는 페이지가 납작하게 접혀 신청서 셋이 **전부
          화면 안에 있는 것처럼** 보입니다. 2026-11-04 에 그래서
          form_view 가 열자마자 세 번 떠 버렸습니다 — 아무도 안 봤는데요.

          높이도 같이 봅니다. 접힌 상태에서는 들어온 높이가 0 입니다. */
    if ('IntersectionObserver' in window) {
      var watch = function () {
        var io = new IntersectionObserver(function (es) {
          if (es[0].isIntersecting && es[0].intersectionRect.height > 40) {
            track('form_view', { form_type: kind, placement: place });
            io.unobserve(el);
          }
        }, { threshold: 0 });
        io.observe(el);
      };
      if (document.readyState === 'complete') watch();
      else window.addEventListener('load', watch);
    }

    /* 처음 손을 대신 순간 */
    el.addEventListener('focusin', onStart);
    el.addEventListener('change', onStart);
    function onStart() {
      if (started) return;
      started = Date.now();
      track('form_start', { form_type: kind, placement: place });
    }

    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (sentOk) return;

      /* ⓐ 숨은 칸 — 사람 눈에는 없는 칸입니다. 채워져 있으면 기계입니다.
            **아무 말씀도 드리지 않고** 성공한 것처럼 보여 줍니다.
            「막혔다」고 알려 주면 기계가 다른 길을 찾습니다 */
      if (get('nickname')) {
        track('form_submit_error', { form_type: kind, reason: 'honeypot' });
        finish();
        return;
      }

      /* ⓑ 안 채워진 칸 — 무엇이 빠졌는지 그 자리에서 말씀드립니다 */
      var missing = '';
      for (var i = 0; i < spec.need.length; i++) {
        if (!get(spec.need[i][0])) { missing = spec.need[i][1]; break; }
      }
      if (!missing) {
        for (var j = 0; j < spec.email.length; j++) {
          if (!EMAIL_RE.test(get(spec.email[j]))) {
            missing = '이메일 주소를 다시 봐 주세요. 예) name@example.com';
            break;
          }
        }
      }
      if (missing) {
        say(missing);
        track('form_submit_error', { form_type: kind, reason: 'validation' });
        return;
      }

      /* ⓒ 너무 빠름.

            ⚠️ **채워진 것을 먼저 봅니다.** 순서를 바꾸면 안 됩니다.
               시간을 먼저 보면, 빈 신청서를 급히 눌러 보신 분께
               「접수되었습니다」를 보여 드리고 자료는 버리게 됩니다.

            여기까지 온 것은 **필수 칸이 전부 제대로 채워진** 신청서뿐
            입니다. 그걸 2초 안에 끝내는 사람은 없습니다.

            아무 말씀도 드리지 않고 성공한 것처럼 보여 줍니다 —
            「막혔다」고 알려 주면 기계가 다른 길을 찾습니다. */
      if (!started || Date.now() - started < MIN_FILL_MS) {
        track('form_submit_error', { form_type: kind, reason: 'too_fast' });
        finish();
        return;
      }

      /* ⓓ 보냅니다 */
      say('');
      if (btn) { btn.disabled = true; btn.textContent = '보내고 있습니다…'; }

      var row = spec.row(get, el);
      KEYS.forEach(function (k) { if (source[k]) row[k] = source[k]; });
      if (source.referrer) row.referrer = source.referrer;

      send(spec.table, row, function (ok, reason) {
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label'); }
        if (ok) {
          track('form_submit_success', { form_type: kind, placement: place });
          /* Meta 의 기본 이벤트. **성공한 뒤 한 번만** 쏩니다 */
          if (window.fbq) window.fbq('track', 'Lead', { form_type: kind, placement: place });
          finish();
          return;
        }
        track('form_submit_error', { form_type: kind, reason: reason });
        say('전송에 실패했습니다. 잠시 후 다시 시도해 주세요. ' +
            '계속 안 되시면 ' + MAIL + ' 로 알려주세요.');
      });
    });

    function finish() {
      sentOk = true;
      if (body) body.hidden = true;
      if (done) {
        done.hidden = false;
        /* 읽어 주는 화면을 쓰시는 분께도 바뀐 것이 전해져야 합니다 */
        done.setAttribute('tabindex', '-1');
        try { done.focus({ preventScroll: true }); } catch (e) { done.focus(); }
      }
    }
  }


  /* ══ 신청서를 두 자리에 세웁니다 ════════════════════════════
     같은 신청서를 히어로 아래와 맨 아래에 둡니다. 같은 글을 두 번
     적어 두면 한쪽만 고치는 일이 반드시 생기므로, **한 벌을 틀로
     두고 복사**합니다.

     ⚠️ id 는 자리마다 다르게 붙입니다. 같은 id 가 두 번 있으면
        이름표(label)를 눌러도 엉뚱한 칸이 잡힙니다. */
  (function mount() {
    var tpl = document.getElementById('tpl-waitlist');
    if (!tpl || !('content' in tpl)) return;
    var slots = document.querySelectorAll('[data-waitlist-slot]');
    for (var i = 0; i < slots.length; i++) {
      var where = slots[i].getAttribute('data-placement') || ('p' + i);
      var copy = tpl.content.cloneNode(true);
      var form = copy.querySelector('form');
      if (form) form.setAttribute('data-placement', where);
      var marked = copy.querySelectorAll('[id], [for], [aria-describedby]');
      for (var j = 0; j < marked.length; j++) {
        ['id', 'for', 'aria-describedby'].forEach(function (a) {
          var v = marked[j].getAttribute(a);
          if (v) marked[j].setAttribute(a, v + '-' + where);
        });
      }
      slots[i].appendChild(copy);
    }
  })();

  var forms = document.querySelectorAll('form[data-form]');
  for (var i = 0; i < forms.length; i++) initForm(forms[i]);


  /* ══ ④ 기관용 띠 — 누르면 기관 문의로 내려갑니다 ═══════════ */
  var jump = document.querySelectorAll('[data-scroll-to]');
  for (var k = 0; k < jump.length; k++) {
    jump[k].addEventListener('click', function () {
      var t = document.getElementById(this.getAttribute('data-scroll-to'));
      if (!t) return;
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var first = t.querySelector('input, select, textarea');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 500);
    });
  }
})();
