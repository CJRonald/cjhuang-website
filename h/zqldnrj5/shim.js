// ---- Transport shim: app.js was written for google.script.run; here the same calls go to the JSON API
// (Apps Script, execute-as-owner) with this device's session token. An AUTH reply clears the token and
// shows the pairing gate again.
(function () {
  var API_URL = (document.querySelector('meta[name="api-url"]') || {}).content || '';
  var KEY = 'lovelyhome.token';
  var APP_TITLE = '🏡 Ronald & Livia Home';
  function getToken() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setToken(t) { try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch (e) {} }
  function showGate(on) {
    document.body.classList.toggle('gated', on);
    document.getElementById('pairGate').hidden = !on;
    if (!on) {
      document.title = 'Lovely Home';
      var h = document.getElementById('appTitle'); if (h) h.textContent = APP_TITLE;
    }
  }
  function post(body) {
    // text/plain keeps the request "simple" (no CORS preflight, which Apps Script cannot answer).
    return fetch(API_URL, { method: 'POST', body: JSON.stringify(body), redirect: 'follow' })
      .then(function (r) { return r.json(); });
  }
  function call(action, args) {
    return post({ action: action, token: getToken(), args: args }).then(function (j) {
      if (!j.ok) {
        var e = new Error(j.error || '伺服器錯誤'); e.code = j.code;
        if (j.code === 'AUTH') { setToken(null); showGate(true); }
        throw e;
      }
      return j;
    });
  }
  var MAP = {
    getInit: ['init', function (m) { return { month: m }; }],
    getAgenda: ['agenda', function (d) { return { days: d }; }],
    addExpense: ['add', function (e) { return { e: e }; }],
    undoExpense: ['undo', function (row, sig, month) { return { row: row, sig: sig, month: month }; }],
    uploadReceipt: ['upload', function (p, kind) { return { photo: p, kind: kind || 'receipt' }; }],
    getPhoto: ['photo', function (id) { return { id: id }; }],
    recognizeReceipt: ['recognize', function (p) { return { photo: p }; }],
    getTrips: ['trips', function () { return {}; }],
    getTrip: ['trip', function (id) { return { id: id }; }],
    saveTrip: ['tripSave', function (t) { return { trip: t }; }],
    saveItem: ['itemSave', function (i) { return { item: i }; }],
    cancelItem: ['itemCancel', function (id, at) { return { id: id, updatedAt: at }; }],
    saveCheck: ['checkSave', function (c) { return { check: c }; }],
    exportTrip: ['tripExport', function (id) { return { id: id }; }],
  };
  window.google = { script: { get run() {
    var ok = function () {}, fail = function (e) { console.error(e); };
    var o = { withSuccessHandler: function (f) { ok = f; return o; }, withFailureHandler: function (f) { fail = f; return o; } };
    Object.keys(MAP).forEach(function (name) {
      o[name] = function () {
        var args = [].slice.call(arguments), m = MAP[name];
        call(m[0], m[1].apply(null, args)).then(function (j) { ok(j.result); }, function (e) { fail(e); });
      };
    });
    return o;
  } } };

  // Pairing gate
  var input = document.getElementById('pairInput'), go = document.getElementById('pairGo'), err = document.getElementById('pairErr');
  function pair() {
    var code = (input.value || '').replace(/\D/g, '');
    if (code.length !== 6) { err.textContent = '請輸入 6 位數配對碼'; return; }
    go.disabled = true; err.textContent = '';
    post({ action: 'pair', code: code, device: (navigator.platform || '') + ' ' + (navigator.standalone ? 'app' : 'browser') })
      .then(function (j) {
        if (!j.ok) { err.textContent = j.error || '配對失敗'; go.disabled = false; input.select(); return; }
        setToken(j.token);
        location.reload();        // start the app fresh with the token in place
      })
      .catch(function () { err.textContent = '連線失敗，請稍後再試'; go.disabled = false; });
  }
  go.onclick = pair;
  input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') pair(); });
  input.addEventListener('input', function () { if (input.value.replace(/\D/g, '').length === 6) pair(); });

  // Logout clears the device only after the server confirms the session is gone; otherwise the token stays
  // (a half-logout would leave a live session the user believes is dead).
  var lb = document.getElementById('logoutBtn');
  if (lb) lb.onclick = function () {
    lb.disabled = true; lb.textContent = '登出中…';
    post({ action: 'logout', token: getToken() })
      .then(function (j) {
        if (j && j.ok) { setToken(null); location.reload(); return; }
        if (j && j.code === 'AUTH') { setToken(null); location.reload(); return; }   // server no longer knows it anyway
        lb.disabled = false; lb.textContent = '登出失敗，再試一次';
      })
      .catch(function () { lb.disabled = false; lb.textContent = '連線失敗，再試一次'; });
  };

  if (getToken()) showGate(false); else showGate(true);
})();
