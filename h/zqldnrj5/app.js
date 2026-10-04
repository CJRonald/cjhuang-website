// app.js — Lovely Home UI. Talks to the server through google.script.run (provided by shim.js).
  var state = { category: null, currency: 'USD', usdRate: 32, busy: null, scanGen: 0, formGen: 0, scanFilled: {} };
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return n == null ? '—' : 'NT$' + Math.round(n).toLocaleString('en-US'); };

  function today() {
    var d = new Date(), p = function (x) { return String(x).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  // 本月 follows the phone's date, same as the default entry date.
  function thisMonth() { return today().slice(0, 7); }

  function chips(el, values, current, onPick) {
    el.innerHTML = '';
    values.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (v === current ? ' on' : ''); b.textContent = v;
      b.onclick = function () { onPick(v); };
      el.appendChild(b);
    });
  }

  function options(el, values, current) {
    el.innerHTML = '';
    values.forEach(function (v) {
      var o = document.createElement('option'); o.value = o.textContent = v;
      if (v === current) o.selected = true;
      el.appendChild(o);
    });
  }

  var init = null;
  function render(data, keepForm) {
    init = data;

    state.usdRate = data.lastUsdRate;
    if (!keepForm) {
      $('date').value = today();
      options($('payer'), data.payers.concat(data.payers.indexOf('待確認') < 0 ? ['待確認'] : []), data.me.payer);
      options($('funding'), data.fundings, '自付');
      options($('method'), data.methods, store('method') || data.methods[0]);
      setCurrency(state.currency);
    }
    drawCategories(); drawCurrencies();
    drawDash();
    if (pie.range === null) pie.range = (dashAgg().byMonth[init.month] || 0) > 0 ? 'month' : 'all';
    drawPie();

    $('recent').innerHTML = data.recent.map(function (r) {
      return '<li><div>' + esc(r.item) + '<div class="meta">' + esc(r.date) + ' ' + catTag(r.category) + ' ' + esc(r.payer) + '</div></div>' +
             '<div class="amt">' + esc(r.amount) + ' ' + esc(r.currency) + '<div class="meta">' + (r.twd ? 'NT$' + esc(r.twd) : '') + '</div></div></li>';
    }).join('') || '<li class="loading">尚無資料</li>';
    $('submit').disabled = !!state.busy;   // a refresh during a scan or save must not re-enable it
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var CAT_SHOWN = 8, MORE = '更多 ▾', LESS = '收合 ▴';
  // Everyday categories in the order they are expected to be used most; one-time categories live under 更多.
  var CAT_DEFAULT_ORDER = ['食材', '外食', '日用品', '交通', '住房', '水電網', '教育', '娛樂旅遊', '服飾', '3C', '訂閱', '醫療', '保險', '車'];
  function topCategories() {
    var n = {}, once = init.oneTimeCats || [];
    (init.rows || []).forEach(function (r) { n[r.c] = (n[r.c] || 0) + 1; });
    var rank = function (c) { var i = CAT_DEFAULT_ORDER.indexOf(c); return i < 0 ? 99 : i; };
    // Most used everyday categories first; ties (and the start, with no history) follow CAT_DEFAULT_ORDER.
    return init.categories.filter(function (c) { return once.indexOf(c) < 0; }).sort(function (a, b) {
      return (n[b] || 0) - (n[a] || 0) || rank(a) - rank(b);
    }).slice(0, CAT_SHOWN);
  }
  function drawCategories() {
    var list = init.categories;
    if (!state.catOpen && list.length > CAT_SHOWN + 1) {
      var top = topCategories();
      if (state.category && top.indexOf(state.category) < 0) top.push(state.category);
      list = init.categories.filter(function (c) { return top.indexOf(c) >= 0; }).concat([MORE]);
    } else if (list.length > CAT_SHOWN + 1) {
      list = list.concat([LESS]);
    }
    chips($('categories'), list, state.category, function (v) {
      if (v === MORE || v === LESS) state.catOpen = v === MORE; else state.category = v;
      drawCategories();
    });
    var last = $('categories').lastChild;
    if (last && (last.textContent === MORE || last.textContent === LESS)) last.classList.add('more');
  }
  function drawCurrencies() { chips($('currencies'), init.currencies, state.currency, setCurrency); }
  function setCurrency(c) {
    state.currency = c;
    $('rate').value = c === 'TWD' ? 1 : state.usdRate;
    $('rate').disabled = c === 'TWD';
    if (init) drawCurrencies();
  }

  // Fixed category -> color slot. Categories without a slot always fold into 其他.
  var CAT_COLOR = { '住房':'--c1', '外食':'--c2', '日用品':'--c3', '車':'--c4', '娛樂旅遊':'--c5', '食材':'--c6', '交通':'--c7', '教育':'--c8' };
  var PIE_MAX = 5;  // top 5 + 其他 = at most 6 slices
  var pie = { range: null, sel: null };

  function pieSlices() {
    var src = dashAgg().cat[pie.range] || {}, named = [], other = 0;
    Object.keys(src).forEach(function (k) {
      if (src[k] <= 0) return;
      if (CAT_COLOR[k]) named.push({ name: k, v: src[k], color: 'var(' + CAT_COLOR[k] + ')' }); else other += src[k];
    });
    named.sort(function (a, b) { return b.v - a.v; });
    named.slice(PIE_MAX).forEach(function (x) { other += x.v; });
    var out = named.slice(0, PIE_MAX);
    var members = Object.keys(src).filter(function (k) {
      return src[k] > 0 && !out.some(function (x) { return x.name === k; });
    }).sort(function (a, b) { return src[b] - src[a]; });
    if (other > 0) out.push({ name: '其他', v: other, color: 'var(--cother)',
                              members: members.map(function (k) { return k + ' ' + money(src[k]); }).join('、') });
    return out;
  }

  function arc(cx, cy, r0, r1, a0, a1) {
    var p = function (r, a) { return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
    var large = a1 - a0 > Math.PI ? 1 : 0, A = p(r1, a0), B = p(r1, a1), C = p(r0, a1), D = p(r0, a0);
    return 'M' + A + 'A' + r1 + ',' + r1 + ' 0 ' + large + ' 1 ' + B + 'L' + C + 'A' + r0 + ',' + r0 + ' 0 ' + large + ' 0 ' + D + 'Z';
  }

  function drawPie() {
    chips($('pieRange'), ['本月', '累計'], pie.range === 'month' ? '本月' : '累計', function (v) {
      pie.range = v === '本月' ? 'month' : 'all'; pie.sel = null; drawPie();
    });
    var sl = pieSlices(), total = sl.reduce(function (a, x) { return a + x.v; }, 0);
    if (pie.sel && !sl.some(function (x) { return x.name === pie.sel; })) pie.sel = null;
    var svg = '', a = 0, GAP = sl.length > 1 ? 0.035 : 0;  // ~2px surface gap between slices
    sl.forEach(function (x) {
      var span = x.v / total * 2 * Math.PI;
      var a0 = a + GAP / 2, a1 = Math.max(a0 + 0.001, a + span - GAP / 2);
      if (sl.length === 1) { a0 = 0; a1 = 2 * Math.PI - 0.0001; }
      svg += '<path d="' + arc(75, 75, 50, 73, a0, a1) + '" fill="' + x.color + '" data-n="' + esc(x.name) + '"' +
             (x.name === pie.sel ? ' class="on"' : '') + '><title>' + esc(x.name) + ' ' + money(x.v) + '</title></path>';
      a += span;
    });
    var cur = sl.filter(function (x) { return x.name === pie.sel; })[0];
    var label = total === 0 ? '尚無資料' : cur ? cur.name + ' ' + Math.round(cur.v / total * 100) + '%' : (pie.range === 'month' ? '本月合計' : '累計');
    svg += '<g class="pie-center"><text class="k" x="75" y="70" text-anchor="middle">' + esc(label) + '</text>' +
           '<text class="v" x="75" y="90" text-anchor="middle">' + (total ? money(cur ? cur.v : total) : '') + '</text></g>';
    $('pie').innerHTML = svg;
    $('pieWrap').className = 'pie-wrap' + (pie.sel ? ' sel' : '');
    $('pieLegend').innerHTML = sl.map(function (x) {
      return '<li data-n="' + esc(x.name) + '"' + (pie.sel && x.name !== pie.sel ? ' class="dim"' : '') + '><span><span class="sw" style="background:' + x.color + '"></span>' + esc(x.name) +
             '<span class="pct">' + Math.round(x.v / total * 100) + '%</span>' +
             (x.members ? '<span class="members">' + esc(x.members) + '</span>' : '') +
             '</span><span class="amt">' + money(x.v) + '</span></li>';
    }).join('');
    var pick = function (ev) {
      var n = ev.target.closest('[data-n]'); if (!n) return;
      pie.sel = pie.sel === n.getAttribute('data-n') ? null : n.getAttribute('data-n'); drawPie();
    };
    $('pie').onclick = pick; $('pieLegend').onclick = pick;
  }

  function catTag(c) {
    return '<span class="tag" style="--tc:var(' + (CAT_COLOR[c] || '--cother') + ')">' + esc(c) + '</span>';
  }

  // Per-device memory of the last card used; storage may be unavailable, so never depend on it.
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('ledger.' + k); localStorage.setItem('ledger.' + k, v); } catch (e) {}
    return v;
  }

  function msg(text, isErr, undo) {
    var m = $('msg'); m.className = 'msg' + (isErr ? ' err' : ''); m.textContent = text;
    if (undo) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = '復原';
      b.onclick = function () {
        b.disabled = true;
        google.script.run.withSuccessHandler(function (d) { render(d, true); msg('已復原'); })
          .withFailureHandler(function (e) { msg(e.message, true); }).undoExpense(undo.row, undo.sig, thisMonth());
      };
      m.appendChild(b);
    }
  }

  // Scan and submit never overlap: a scan result must not rewrite a form that is being (or was just) saved.
  function setBusy(what) {
    state.busy = what;
    $('scanBtn').disabled = !!what;
    $('submit').disabled = !!what || !init;
  }

  $('f').onsubmit = function (ev) {
    ev.preventDefault();
    if (state.busy === 'scan') { msg('收據辨識中，請稍候', true); return; }
    if (!state.category) { msg('請選類別', true); return; }
    var e = {
      date: $('date').value, item: $('item').value, category: state.category,
      amount: $('amount').value, currency: state.currency, rate: $('rate').value,
      payer: $('payer').value, method: store('method', $('method').value), funding: $('funding').value,
      ref: [$('ref').value.trim(), state.receiptUrl || ''].filter(Boolean).join(' '),
      note: [$('pending').checked ? '待補' : '', $('oneTime').checked ? '一次性' : '', $('note').value.trim()].filter(Boolean).join('；')
    };
    // Same payload after a failure keeps the same request id, so a save whose reply was lost is not written twice.
    var key = JSON.stringify(e);
    if (!state.pending || state.pending.key !== key) {
      state.pending = { key: key, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 10) };
    }
    e.reqId = state.pending.id;
    e.month = thisMonth();
    setBusy('submit'); msg('寫入中…');
    google.script.run
      .withSuccessHandler(function (res) {
        state.pending = null;
        state.formGen++;                       // any scan still in flight now belongs to an old form
        setBusy(null);
        var undo = { row: res.row, sig: res.sig };
        if (res.init) {
          render(res.init, true);
          msg('已記：' + res.item + '（第 ' + res.row + ' 列）', false, undo);
        } else {
          msg('已儲存：' + res.item + '（第 ' + res.row + ' 列）；摘要更新失敗，請重新整理', true, undo);
        }
        $('amount').value = ''; $('item').value = ''; $('ref').value = ''; $('note').value = '';
        // Each new entry starts from today again, even after back-filling an older date.
        $('date').value = today(); state.dateTouched = false;
        state.receiptUrl = null; state.scanFilled = {}; $('pending').checked = false; $('oneTime').checked = false; scanStatus('自動填入金額、日期、項目');
        state.category = null; drawCategories();
      })
      .withFailureHandler(function (err) {
        setBusy(null);
        // The write may have gone through even though the reply was lost: show the latest rows before a retry.
        msg(err.message + '（請先看「最近 10 筆」是否已有這筆，再決定是否重送）', true);
        load(true);
      })
      .addExpense(e);
  };

  // ---- Receipt scan: shrink on the phone, upload (link first), then recognise and prefill for review ----
  function scanStatus(text, url) {
    var st = $('scanSt'); st.textContent = text;
    if (url) { var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.textContent = ' 📎收據'; st.appendChild(a); }
  }

  var MAX_PHOTO_BYTES = 30 * 1024 * 1024;
  function shrink(file, maxSide, cb) {
    if (file.size > MAX_PHOTO_BYTES) { cb(null); return; }
    var img = new Image(), url = URL.createObjectURL(file), done = false;
    var finish = function (data) { if (done) return; done = true; URL.revokeObjectURL(url); cb(data); };
    img.onload = function () {
      try {
        var k = Math.min(1, maxSide / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        var out = c.toDataURL('image/jpeg', 0.8).split(',')[1];
        finish(out && out.length > 100 ? out : null);
      } catch (e) { finish(null); }
    };
    img.onerror = function () { finish(null); };
    img.src = url;
  }

  // Current values of the fields a scan may fill.
  function scanFields() {
    return { amount: $('amount').value, item: $('item').value, date: $('date').value,
             method: $('method').value, category: state.category, currency: state.currency };
  }
  function setScanField(k, v) {
    if (k === 'amount' || k === 'item') $(k).value = v == null ? '' : v;
    else if (k === 'date') { $('date').value = v || today(); state.dateTouched = !!v; }
    else if (k === 'method') $('method').value = v || store('method') || init.methods[0];
    else if (k === 'category') { state.category = v || null; drawCategories(); }
    else if (k === 'currency' && v && v !== state.currency) setCurrency(v);   // same currency keeps a manual rate
  }

  // Fill only fields the user has not touched since the scan started. Values left by a previous scan that this
  // scan did not read are cleared, so two receipts never mix.
  function applyScan(f, before) {
    var labels = { amount: '金額', item: '項目', date: '日期', category: '類別', method: '付款方式', currency: '幣別' };
    var now = scanFields(), prev = state.scanFilled || {}, filled = {}, shown = [];
    Object.keys(labels).forEach(function (k) {
      if (String(now[k]) !== String(before[k])) return;                      // edited during the scan: keep
      if (f[k] != null && f[k] !== '') {
        setScanField(k, f[k]); filled[k] = String(scanFields()[k]);
        if (k !== 'currency') shown.push(labels[k]);
      } else if (prev[k] != null && String(now[k]) === prev[k] && k !== 'currency') {
        setScanField(k, null);                                               // stale value from the previous receipt
      }
    });
    state.scanFilled = filled;
    return shown;
  }

  $('scanBtn').onclick = function () { if (!state.busy) $('scanFile').click(); };
  $('scanFile').onchange = function () {
    var file = this.files && this.files[0]; this.value = '';
    if (!file || state.busy) return;
    var gen = ++state.scanGen, formGen = state.formGen, before = scanFields();
    var stale = function () { return gen !== state.scanGen || formGen !== state.formGen; };
    setBusy('scan'); scanStatus('處理照片中…');
    shrink(file, 1600, function (data) {
      if (!data) { setBusy(null); scanStatus('無法讀取這張照片（太大或格式不支援）'); return; }
      var photo = { data: data, mime: 'image/jpeg' };
      google.script.run
        .withSuccessHandler(function (up) {
          if (stale()) { setBusy(null); return; }
          state.receiptUrl = up.fileUrl;
          scanStatus('照片已存，辨識中…', up.fileUrl);
          google.script.run
            .withSuccessHandler(function (res) {
              setBusy(null);
              if (stale()) return;
              if (!res.fields) { scanStatus('照片已存，辨識失敗，請手動填', up.fileUrl); msg(res.error, true); return; }
              var shown = applyScan(res.fields, before);
              scanStatus(shown.length ? '已填：' + shown.join('、') + '，請確認' : '照片已存，沒讀到資料，請手動填', up.fileUrl);
            })
            .withFailureHandler(function (err) {
              setBusy(null);
              if (!stale()) { scanStatus('照片已存，辨識失敗，請手動填', up.fileUrl); msg(err.message, true); }
            })
            .recognizeReceipt(photo);
        })
        .withFailureHandler(function (err) { setBusy(null); if (!stale()) { scanStatus('上傳失敗'); msg(err.message, true); } })
        .uploadReceipt(photo);
    });
  };

  function load(keepForm) {
    google.script.run
      .withSuccessHandler(function (d) { render(d, keepForm); })
      .withFailureHandler(function (err) { msg('載入失敗：' + err.message, true); })   // server messages are fixed, user-facing text
      .getInit(thisMonth());
  }

  // A page left open across midnight: move an untouched default date to today and refresh 本月.
  $('date').addEventListener('input', function () { state.dateTouched = true; });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || !init) return;
    if (!state.dateTouched) $('date').value = today();
    load(true);
  });


  // ---- Tabs ----
  function showTab(t) {
    $('tabEntry').hidden = t !== 'entry';
    $('tabDash').hidden = t !== 'dash';
    [].forEach.call(document.querySelectorAll('#tabbar button'), function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === t); });
    window.scrollTo(0, 0);
  }
  $('tabbar').onclick = function (ev) { var b = ev.target.closest('button'); if (b) showTab(b.getAttribute('data-tab')); };
  showTab('dash');   // always open on the Dashboard

  // ---- Dashboard: aggregated on the phone from init.rows, in the chosen display currency ----
  var dash = { cur: store('dashCur') === 'TWD' ? 'TWD' : 'USD', sel: null };
  function money(v) {
    if (v == null) return '—';
    return (dash.cur === 'USD' ? 'US$' : 'NT$') + Math.round(v).toLocaleString('en-US');
  }
  function val(r) { return dash.cur === 'USD' ? r.usd : r.twd; }

  function shiftMonth(m, k) {
    var d = new Date(+m.slice(0, 4), +m.slice(5, 7) - 1 + k, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  // Sums per month, category (this month / all), payer (all / this month) and the rows of one month.
  function dashAgg() {
    var month = init.month, a = { byMonth: {}, daily: {}, once: {}, cat: { month: {}, all: {} }, payerAll: {}, payerMonth: {}, total: 0 };
    init.rows.forEach(function (r) {
      var v = val(r), m = /^\d{4}-\d{2}-\d{2}$/.test(r.d) ? r.d.slice(0, 7) : null;
      a.total += v;
      a.payerAll[r.p] = (a.payerAll[r.p] || 0) + v;
      a.cat.all[r.c] = (a.cat.all[r.c] || 0) + v;
      if (m) {
        a.byMonth[m] = (a.byMonth[m] || 0) + v;
        var bucket = r.o ? a.once : a.daily;          // one-time spending is shown but not counted against the budget
        bucket[m] = (bucket[m] || 0) + v;
      }
      if (m === month) {
        a.cat.month[r.c] = (a.cat.month[r.c] || 0) + v;
        a.payerMonth[r.p] = (a.payerMonth[r.p] || 0) + v;
      }
    });
    return a;
  }
  function budget() { return dash.cur === 'USD' ? init.budgetUsd : init.budgetUsd * init.fx; }

  function drawDash() {
    var a = dashAgg(), cur = init.month, prev = shiftMonth(cur, -1);
    chips($('dashCur'), ['USD', 'TWD'], dash.cur, function (v) { dash.cur = v; store('dashCur', v); drawDash(); drawPie(); });
    var c = a.daily[cur] || 0, p = a.daily[prev] || 0;
    $('monthLabel').textContent = cur + ' 本月';
    $('monthTwd').textContent = money(a.byMonth[cur] || 0);
    // Month-over-month compares everyday spending only, so a one-off purchase does not swing it.
    $('monthDelta').textContent = '日常 ' + money(c) + (p > 0 ? ' · 較上月 ' + (c >= p ? '▲' : '▼') + Math.abs(Math.round((c - p) / p * 100)) + '%' : '');
    $('totalTwd').textContent = money(a.total);
    $('payRonald').textContent = money(a.payerAll.Ronald || 0);
    $('payLivia').textContent = money(a.payerAll.Livia || 0);
    var n = init.pendingCount || 0;
    $('pendingCard').innerHTML = n > 0 ? '有 <b>' + n + '</b> 筆標記「待補」，跟 Claude 說「對帳」就會依收據補齊' : '沒有待補項目';
    if (!dash.sel) dash.sel = cur;
    drawTrend(a, cur);
    drawPayerSplit(a.payerMonth);
    $('fxNote').textContent = '匯率 1 USD = ' + init.fx.toFixed(2) + ' TWD（' + init.fxSource + '）；美金支出以原幣計，台幣支出依此匯率換算';
  }

  // The selected month drives the header, the budget line text and the top-5 list.
  function selectMonth(m, a) {
    dash.sel = m;
    var v = a.daily[m] || 0, once = a.once[m] || 0, b = budget(), left = b - v;
    $('trendSel').textContent = m + '：' + money(a.byMonth[m] || 0);
    var bl = $('budgetLine');
    bl.className = 'budget' + (left < 0 ? ' over' : '');
    bl.textContent = '日常 ' + money(v) + '，' + (left >= 0 ? '距離 Budget 還剩 ' + money(left) + '（已用 ' + Math.round(v / b * 100) + '%）'
                                                        : '超出 Budget ' + money(-left) + '（' + Math.round(v / b * 100) + '%）');
    if (once > 0) {
      var sub = document.createElement('span'); sub.className = 'sub';
      sub.textContent = '另有一次性 ' + money(once) + '，不計入預算';
      bl.appendChild(sub);
    }
    var rows = init.rows.filter(function (r) { return r.d.slice(0, 7) === m; })
                        .sort(function (x, y) { return val(y) - val(x); }).slice(0, 5);
    $('topTitle').textContent = (m === init.month ? '本月' : m) + ' 最大 5 筆';
    $('topMonth').innerHTML = rows.map(function (r) {
      return '<li><div>' + esc(r.i) + '<div class="meta">' + esc(r.d) + ' ' + catTag(r.c) + ' ' + esc(r.p) + '</div></div>' +
             '<div class="amt">' + money(val(r)) + '</div></li>';
    }).join('') || '<li class="loading">' + m + ' 沒有資料</li>';
  }

  // Bar path with rounded top corners only (r = 0 for a square top).
  function barPath(cx, bw, yBottom, yTop, r) {
    var L = cx - bw / 2, R = cx + bw / 2;
    if (!r) return 'M' + L + ',' + yBottom + 'V' + yTop + 'H' + R + 'V' + yBottom + 'Z';
    return 'M' + L + ',' + yBottom + 'V' + (yTop + r) + 'Q' + L + ',' + yTop + ' ' + (L + r) + ',' + yTop +
           'H' + (R - r) + 'Q' + R + ',' + yTop + ' ' + R + ',' + (yTop + r) + 'V' + yBottom + 'Z';
  }

  // Monthly bars: everyday spending (accent) with one-time spending stacked on top (gray); the selected month is
  // emphasised; the dashed line is the monthly budget, which applies to everyday spending only.
  function drawTrend(a, cur) {
    var keys = Object.keys(a.byMonth).filter(function (k) { return k <= cur; }).sort();
    var first = keys.length ? keys[0] : cur, months = [];
    for (var m = shiftMonth(cur, -11) > first ? shiftMonth(cur, -11) : first; m <= cur; m = shiftMonth(m, 1)) months.push(m);
    if (months.indexOf(dash.sel) < 0) dash.sel = cur;
    var W = 320, H = 150, top = 18, base = 124, b = budget();
    var max = Math.max.apply(null, months.map(function (k) { return a.byMonth[k] || 0; }).concat([b, 1]));
    var y = function (v) { return base - (base - top) * v / max; };
    var slot = W / Math.max(months.length, 6), bw = Math.min(28, slot - 8);
    var x0 = (W - slot * months.length) / 2;
    var svg = '<line class="grid" x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '"/>';
    if (max > b * 1.08) svg += '<line class="grid" x1="0" x2="' + W + '" y1="' + top + '" y2="' + top + '" stroke-dasharray="3 3"/>' +
                               '<text class="gl" x="0" y="' + (top - 5) + '">' + money(max) + '</text>';
    months.forEach(function (k, i) {
      var d = a.daily[k] || 0, o = a.once[k] || 0, cx = x0 + slot * i + slot / 2, on = k === dash.sel ? ' on' : '';
      var hd = d > 0 ? Math.max(3, base - y(d)) : 0, ho = o > 0 ? Math.max(3, base - y(o)) : 0;
      var yd = base - hd, yo = yd - ho - (hd && ho ? 2 : 0);     // 2px surface gap between the two segments
      if (hd) svg += '<path class="bar' + on + '" d="' + barPath(cx, bw, base, yd, ho ? 0 : Math.min(4, hd, bw / 2)) + '"/>';
      if (ho) svg += '<path class="bar1' + on + '" d="' + barPath(cx, bw, yo + ho, yo, Math.min(4, ho, bw / 2)) + '"/>';
      svg += '<text class="lbl' + on + '" x="' + cx + '" y="' + (base + 16) + '" text-anchor="middle">' + (+k.slice(5)) + '月</text>';
    });
    var by = y(b);
    svg += '<line class="bline" x1="0" x2="' + W + '" y1="' + by + '" y2="' + by + '"/>' +
           '<text class="blbl" x="' + W + '" y="' + (by - 4) + '" text-anchor="end">Budget ' + money(b) + '</text>';
    // Hit areas last so they sit above the budget line and label.
    months.forEach(function (k, i) {
      svg += '<rect class="hit" data-m="' + k + '" x="' + (x0 + slot * i) + '" y="0" width="' + slot + '" height="' + H + '"><title>' +
             k + ' 日常 ' + money(a.daily[k] || 0) + '／一次性 ' + money(a.once[k] || 0) + '</title></rect>';
    });
    $('trend').innerHTML = svg;
    selectMonth(dash.sel, a);
    $('trend').onclick = function (ev) {
      var t = ev.target.closest('[data-m]'); if (!t) return;
      dash.sel = t.getAttribute('data-m'); drawTrend(a, cur);
    };
  }

  function drawPayerSplit(bp) {
    var colors = { Ronald: 'var(--pR)', Livia: 'var(--pL)' };
    var names = Object.keys(bp).filter(function (k) { return bp[k] > 0; }).sort(function (a, b) { return bp[b] - bp[a]; });
    var total = names.reduce(function (a, k) { return a + bp[k]; }, 0);
    $('payerBar').innerHTML = names.map(function (k) {
      return '<span style="width:' + (bp[k] / total * 100) + '%;background:' + (colors[k] || 'var(--pX)') + '"></span>';
    }).join('');
    $('payerLegend').innerHTML = names.map(function (k) {
      return '<li><span><span class="sw" style="background:' + (colors[k] || 'var(--pX)') + '"></span>' + esc(k) +
             '<span class="pct" style="margin-left:6px;color:var(--muted)">' + Math.round(bp[k] / total * 100) + '%</span></span>' +
             '<span class="amt">' + money(bp[k]) + '</span></li>';
    }).join('') || '<li class="loading">本月尚無資料</li>';
  }

  // ---- Family agenda (calendars listed on the 設定 tab, read as the viewer) ----
  var agenda = { at: 0, loading: false };
  var CAL_COLOR = { '家庭': 'var(--accent)', 'Rica': 'var(--c5)', 'Finance': 'var(--c4)' };
  function pad2(n) { return String(n).padStart(2, '0'); }
  function localDay(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function hm(d) { return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
  function dayLabel(key) {
    var t = today(), d = new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10));
    var tm = new Date(); tm.setDate(tm.getDate() + 1);
    var md = (d.getMonth() + 1) + '/' + d.getDate(), wd = '日一二三四五六'.charAt(d.getDay());
    if (key === t) return '今天 ' + md + '（' + wd + '）';
    if (key === localDay(tm)) return '明天 ' + md + '（' + wd + '）';
    return '週' + wd + ' ' + md;
  }
  function loadAgenda(force) {
    if (agenda.loading || (!force && Date.now() - agenda.at < 5 * 60 * 1000)) return;
    agenda.loading = true;
    google.script.run
      .withSuccessHandler(function (a) { agenda.loading = false; agenda.at = Date.now(); drawAgenda(a); })
      .withFailureHandler(function (err) {
        agenda.loading = false;
        $('agenda').innerHTML = '<div class="note">行程讀取失敗：' + esc(err.message) + '</div>';
      })
      .getAgenda(7);
  }
  function drawAgenda(a) {
    if (a.authUrl) {
      // Missing calendar consent: offer Google's own authorization page, then reload to read the calendars.
      $('agenda').innerHTML = '<div class="note">需要授權讀取行事曆，才能顯示家庭行程。</div>' +
        '<a class="auth-btn" target="_blank" rel="noopener" href="' + esc(a.authUrl) + '">授權讀取行事曆</a>' +
        '<div class="note">授權完成後回到這裡，重新整理頁面。</div>';
      return;
    }
    var groups = {}, t = today();
    a.events.forEach(function (ev) {
      var s = new Date(ev.start), e = new Date(ev.end);
      var key = ev.allDay ? ev.date : localDay(s);
      if (key < t) key = t;                                   // multi-day / overnight items already under way
      (groups[key] = groups[key] || []).push({ ev: ev, s: s, e: e });
    });
    var keys = Object.keys(groups).sort(), html = '';
    keys.forEach(function (k) {
      html += '<div class="day">' + dayLabel(k) + '</div>';
      // Within a day: all-day items first, then by start time.
      groups[k].sort(function (a, b) { return (b.ev.allDay - a.ev.allDay) || (a.s - b.s); });
      groups[k].forEach(function (x) {
        var ev = x.ev, time = ev.allDay ? '全天' : hm(x.s) + '–' + hm(x.e);
        if (ev.busy) {
          html += '<div class="ev busy"><span class="t">' + time + '</span><span class="dot"></span><span class="n">' + esc(ev.cal) + ' 忙碌</span></div>';
        } else {
          html += '<div class="ev" style="--cal:' + (CAL_COLOR[ev.cal] || 'var(--c7)') + '"><span class="t">' + time +
                  '</span><span class="dot"></span><span class="n">' + esc(ev.title) + '<span class="c">' + esc(ev.cal) + '</span></span></div>';
        }
      });
    });
    if (!keys.length) html = '<div class="loading">接下來 ' + a.days + ' 天沒有行程</div>';
    if (a.missing.length) html += '<div class="note">讀不到：' + a.missing.map(esc).join('、') + '（尚未共用給這個帳號）</div>';
    $('agenda').innerHTML = html;
  }
  $('tabbar').addEventListener('click', function () { if (!$('tabDash').hidden) loadAgenda(false); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !$('tabDash').hidden) loadAgenda(false);
  });
  loadAgenda(true);

  load(false);
