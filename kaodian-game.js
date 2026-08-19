/* ============================================================
   教材考点记忆系统（知识内容重构核心）
   - 记忆关四层：认识 → 理解 → 主动回忆(挖空) → 完整回忆(拼接)
   - 多条考点五阶段：查看 → 重排 → 挖空 → 口诀回忆 → 完全回忆
   - 考点掌握度：knowledgeId / mastery / studyCount / recallCount /
     errorCount / lastStudyTime / nextReviewTime / forgetRisk
   - 依赖 world.js + kaodian.js（必须在两者之后加载）
   ============================================================ */
var RK_KM = "rk2_km", RK_KMXP = "rk2_kmxp";

/* ---------- 考点掌握度 ---------- */
function rkKmState() { return rkLSGet(RK_KM, {}); }
function rkKmMastery(id) {
  var e = rkKmState()[id];
  if (!e) return 0;
  var days = (Date.now() - e.last) / 86400000;
  return Math.max(0, Math.min(100, Math.round(15 + e.study * 8 + e.recall * 12 - e.error * 7 - days * 2)));
}
function rkKmRisk(id) {
  var e = rkKmState()[id];
  var days = e ? (Date.now() - e.last) / 86400000 : 999;
  var m = rkKmMastery(id);
  if (days >= 3 || m < 40) return { lv: "high", name: "高", min: 16 };
  if (days >= 1 || m < 70) return { lv: "med", name: "中", min: 12 };
  return { lv: "low", name: "低", min: 8 };
}
function rkKmTouch(id, type) {
  var s = rkKmState(), e = s[id] || { study: 0, recall: 0, error: 0, last: 0 };
  e.last = Date.now();
  if (type === "study") e.study++;
  else if (type === "recall") e.recall++;
  else if (type === "error") e.error++;
  s[id] = e;
  rkLSSet(RK_KM, s);
}
function rkKmNext(id) {
  var m = rkKmMastery(id);
  var d = new Date();
  d.setDate(d.getDate() + (m >= 80 ? 7 : m >= 50 ? 3 : 1));
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/* ---------- 记忆关引擎 ---------- */
var RK_LEARN = null; // {id, phases, pi, orderIdx, blanks, filled, pool, wrong}
function rkKdLearn(id) {
  var k = (window.KAODIAN || []).find(function (x) { return x.id === id; });
  if (!k) return;
  var phases = k.items.length >= 5 ? ["view", "order", "blank", "mnemonic", "full"] : ["view", "blank", "full"];
  if (!k.mnemonic) phases = phases.filter(function (p) { return p !== "mnemonic"; });
  RK_LEARN = { id: id, phases: phases, pi: 0, orderIdx: 0, blanks: [], filled: [], pool: [], wrong: 0, answered: false };
  rkKmTouch(id, "study");
  rkLearnRender();
}
function rkLearnK() { return (window.KAODIAN || []).find(function (x) { return x.id === RK_LEARN.id; }); }
function rkLearnPhaseName(p) {
  return p === "view" ? "① 认识" : p === "order" ? "② 重排" : p === "blank" ? "③ 挖空" : p === "mnemonic" ? "④ 口诀回忆" : "⑤ 完全回忆";
}
function rkLearnHeader(k) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
    '<button class="btn-back" onclick="goHome()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 返回</button>' +
    '<div style="text-align:center"><div style="font-size:15px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + esc(k.title) + '</div>' +
    '<div style="font-size:10px;color:var(--dim)">' + esc(k.chapterName) + ' · ' + esc(k.topic) + '</div></div>' +
    '<span style="width:60px"></span></div>' +
    '<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap">' +
    RK_LEARN.phases.map(function (p, i) {
      return '<span style="font-size:10px;padding:3px 8px;border-radius:10px;' + (i === RK_LEARN.pi ? 'background:rgba(217,180,91,.25);color:var(--gold);border:1px solid var(--gold)' : i < RK_LEARN.pi ? 'background:rgba(74,157,124,.2);color:var(--jade);border:1px solid rgba(74,157,124,.5)' : 'background:rgba(255,255,255,.04);color:var(--dim);border:1px solid rgba(255,255,255,.12)') + '">' + rkLearnPhaseName(p) + '</span>';
    }).join("") + '</div>';
}
function rkLearnRender() {
  var k = rkLearnK(), p = RK_LEARN.phases[RK_LEARN.pi];
  var html = rkLearnHeader(k);
  if (p === "view") html += rkLearnView(k);
  else if (p === "order" || p === "mnemonic") html += rkLearnOrder(k, p === "mnemonic");
  else if (p === "blank") html += rkLearnBlank(k);
  else html += rkLearnOrder(k, false, true);
  $("screen-learn").innerHTML = html;
  showScreen("screen-learn");
}
function rkLearnView(k) {
  var html = '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(217,180,91,.35);border-radius:14px;padding:14px 16px;margin-bottom:12px">';
  if (k.mnemonic) html += '<div style="font-size:12px;color:var(--gold);font-family:\'Kaiti SC\',serif;margin-bottom:8px">📜 口诀：' + esc(k.mnemonic) + '</div>';
  k.items.forEach(function (it, i) {
    html += '<div style="padding:5px 0;line-height:1.8;font-size:13px;color:var(--paper)"><span style="color:var(--gold);font-family:\'Kaiti SC\',serif">' + (i + 1) + '.</span> ' + esc(it) + '</div>';
  });
  html += '</div>';
  // 理解层：项目场景为什么
  if (k.scene) {
    html += '<div style="background:rgba(74,157,124,.08);border:1px solid rgba(74,157,124,.35);border-radius:12px;padding:12px 14px;margin-bottom:12px;font-size:12px;line-height:1.9">' +
      '<div style="color:var(--jade);font-size:11px;margin-bottom:4px">🧠 理解 · 项目场景为什么</div>' + esc(k.scene) + '</div>';
  }
  if (k.confusable) {
    html += '<div style="background:rgba(192,80,60,.08);border:1px solid rgba(192,80,60,.3);border-radius:12px;padding:12px 14px;margin-bottom:12px;font-size:12px;line-height:1.9">' +
      '<div style="color:var(--cinnabar);font-size:11px;margin-bottom:4px">⚠️ 易混提醒</div>' + esc(k.confusable.a) + ' ≠ ' + esc(k.confusable.b) + '：' + esc(k.confusable.d) + '</div>';
  }
  html += '<button onclick="rkLearnNextPhase()" style="width:100%;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:12px 0;font-size:14px;cursor:pointer;font-family:inherit">已认识，进入下一层 →</button>';
  return html;
}
function rkLearnOrder(k, mnemonicHint, full) {
  // 初始化顺序数据
  if (!RK_LEARN.order) {
    RK_LEARN.order = 0;
    RK_LEARN.orderWrong = 0;
    var idx = k.items.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    RK_LEARN.orderShuffled = idx;
  }
  var html = '';
  if (full) html += '<div style="font-size:12px;color:var(--dim);margin-bottom:8px">🧠 完全回忆：不看任何提示，把考点完整排出来。</div>';
  else if (mnemonicHint) html += '<div style="font-size:12px;color:var(--gold);font-family:\'Kaiti SC\',serif;margin-bottom:8px">📜 口诀提示：' + esc(k.mnemonic) + '</div>';
  else html += '<div style="font-size:12px;color:var(--dim);margin-bottom:8px">🧩 打乱重排：按正确顺序点回去。</div>';
  html += '<div id="rkord-line" style="min-height:44px;background:rgba(255,255,255,.04);border:1px dashed rgba(217,180,91,.4);border-radius:10px;padding:10px;margin-bottom:10px;font-size:12px;line-height:2;color:var(--paper)">' +
    (RK_LEARN.order === 0 ? '<span style="color:var(--dim)">已排 0/' + k.items.length + ' · 点下面的条目开始</span>' : '') + '</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">';
  RK_LEARN.orderShuffled.forEach(function (srcIdx, chipIdx) {
    html += '<button id="rkord-chip-' + chipIdx + '" onclick="rkLearnOrderPick(' + chipIdx + ')" style="background:rgba(255,255,255,.06);border:1px solid rgba(217,180,91,.45);color:var(--paper);border-radius:10px;padding:9px 12px;font-size:12px;cursor:pointer;font-family:inherit;text-align:left;line-height:1.5">' + esc(k.items[srcIdx]) + '</button>';
  });
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim)">排错会亮红提示，可重试。完成自动进入下一层。</div>';
  return html;
}
function rkLearnOrderPick(chipIdx) {
  var k = rkLearnK();
  var srcIdx = RK_LEARN.orderShuffled[chipIdx];
  var chip = $("rkord-chip-" + chipIdx);
  var expected = RK_LEARN.order;
  if (srcIdx === expected) {
    chip.style.display = "none";
    RK_LEARN.order++;
    var line = $("rkord-line");
    if (RK_LEARN.order === 1) line.innerHTML = "";
    line.innerHTML += '<span style="color:var(--paper)">' + esc(k.items[srcIdx]) + '</span> → ';
    if (RK_LEARN.order >= k.items.length) {
      line.innerHTML = line.innerHTML.replace(/ → $/, "");
      line.style.borderColor = "var(--jade)";
      line.innerHTML += '<div style="color:var(--jade);margin-top:6px">✅ 完整回忆成功！</div>';
      rkLearnPhaseDone("recall");
    }
  } else {
    RK_LEARN.orderWrong++;
    rkKmTouch(RK_LEARN.id, "error");
    chip.style.borderColor = "var(--cinnabar)";
    chip.style.background = "rgba(192,80,60,.15)";
    setTimeout(function () { chip.style.borderColor = "rgba(217,180,91,.45)"; chip.style.background = "rgba(255,255,255,.06)"; }, 500);
    toast("顺序不对，再想想");
  }
}
function rkLearnBlank(k) {
  // 选最多5条要点挖空
  if (!RK_LEARN.blanks.length) {
    var scored = k.items.map(function (it, i) {
      var s = /\d/.test(it) ? 30 : 0;
      s += Math.min(it.length, 60) / 5;
      return { i: i, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
    var chosen = [], blanks = [];
    for (var x = 0; x < scored.length && blanks.length < Math.min(5, k.items.length); x++) {
      var idx = scored[x].i;
      var tok = rkLearnToken(k.items[idx], k.mnemonic || "");
      if (!tok) continue;
      chosen.push(idx);
      blanks.push({ pt: k.items[idx], token: tok, filled: "" });
    }
    RK_LEARN.blanks = blanks;
    var pool = [];
    blanks.forEach(function (b) { if (pool.indexOf(b.token) < 0) pool.push(b.token); });
    // 干扰词：同章其他考点的条目词
    var cand = [];
    (window.KAODIAN || []).forEach(function (kk) {
      if (kk.chapter === k.chapter) (kk.items || []).forEach(function (it) {
        var t = rkLearnToken(it, kk.mnemonic || "");
        if (t && pool.indexOf(t) < 0 && cand.indexOf(t) < 0) cand.push(t);
      });
    });
    for (var i2 = cand.length - 1; i2 > 0; i2--) { var j2 = Math.floor(Math.random() * (i2 + 1)); var t2 = cand[i2]; cand[i2] = cand[j2]; cand[j2] = t2; }
    var n = Math.max(0, 6 - pool.length);
    cand.slice(0, n).forEach(function (c) { pool.push(c); });
    for (var i3 = pool.length - 1; i3 > 0; i3--) { var j3 = Math.floor(Math.random() * (i3 + 1)); var t3 = pool[i3]; pool[i3] = pool[j3]; pool[j3] = t3; }
    RK_LEARN.pool = pool;
  }
  var html = '<div style="font-size:12px;color:var(--dim);margin-bottom:8px">🧠 主动回忆：关键词被挖掉了，从词池挑词填回去。</div>';
  html += '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(217,180,91,.35);border-radius:12px;padding:14px 16px;margin-bottom:12px">';
  k.items.forEach(function (it, i) {
    var bi = -1;
    RK_LEARN.blanks.forEach(function (b, idx) { if (b.pt === it) bi = idx; });
    if (bi < 0) { html += '<div style="padding:3px 0;line-height:1.8;font-size:12px;color:var(--dim)">' + esc(it) + '</div>'; return; }
    var parts = it.split(RK_LEARN.blanks[bi].token);
    var line = "", added = false;
    parts.forEach(function (p, k) {
      line += esc(p);
      if (k < parts.length - 1) {
        if (!added) {
          added = true;
          line += '<button id="rkb-slot-' + bi + '" onclick="rkbSlotBack(' + bi + ')" style="background:rgba(255,255,255,.08);border:1px dashed rgba(217,180,91,.7);color:var(--gold);border-radius:6px;padding:2px 10px;min-width:56px;font-size:12px;font-family:inherit;cursor:pointer;margin:0 2px">____</button>';
        } else line += esc(RK_LEARN.blanks[bi].token);
      }
    });
    html += '<div style="padding:3px 0;line-height:2;font-size:12px;color:var(--paper)">' + line + '</div>';
  });
  html += '</div><div style="font-size:11px;color:var(--dim);margin-bottom:6px">🗂️ 词池：</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">';
  RK_LEARN.pool.forEach(function (t, i) {
    html += '<button id="rkb-chip-' + i + '" onclick="rkbChip(' + i + ')" style="background:rgba(255,255,255,.06);border:1px solid rgba(217,180,91,.45);color:var(--paper);border-radius:8px;padding:7px 12px;font-size:12px;cursor:pointer;font-family:inherit">' + esc(t) + '</button>';
  });
  html += '</div>';
  html += '<button id="rkb-check" onclick="rkbCheck()" disabled style="width:100%;background:rgba(74,157,124,.2);border:1px solid var(--jade);color:var(--jade);border-radius:10px;padding:11px 0;font-size:13px;cursor:pointer;font-family:inherit;opacity:.4">✅ 核对</button>';
  return html;
}
function rkbChip(i) {
  var tok = RK_LEARN.pool[i];
  for (var bi = 0; bi < RK_LEARN.blanks.length; bi++) {
    if (!RK_LEARN.blanks[bi].filled) {
      RK_LEARN.blanks[bi].filled = tok;
      var slot = $("rkb-slot-" + bi); if (slot) slot.textContent = tok;
      var chip = $("rkb-chip-" + i); if (chip) { chip.style.opacity = ".25"; chip.style.pointerEvents = "none"; }
      rkbEnable();
      return;
    }
  }
}
function rkbSlotBack(bi) {
  var b = RK_LEARN.blanks[bi];
  if (!b.filled) return;
  var tok = b.filled;
  b.filled = "";
  var slot = $("rkb-slot-" + bi); if (slot) slot.textContent = "____";
  var idx = RK_LEARN.pool.indexOf(tok);
  if (idx >= 0) { var chip = $("rkb-chip-" + idx); if (chip) { chip.style.opacity = "1"; chip.style.pointerEvents = "auto"; } }
  rkbEnable();
}
function rkbEnable() {
  var btn = $("rkb-check");
  if (!btn) return;
  var full = RK_LEARN.blanks.every(function (b) { return !!b.filled; });
  btn.disabled = !full; btn.style.opacity = full ? "1" : ".4";
}
function rkbCheck() {
  var allOk = RK_LEARN.blanks.every(function (b) { return b.filled === b.token; });
  if (!allOk) {
    RK_LEARN.blanks.forEach(function (b, bi) {
      var slot = $("rkb-slot-" + bi);
      if (slot && b.filled !== b.token) { slot.style.borderColor = "var(--cinnabar)"; slot.style.color = "var(--cinnabar)"; slot.textContent = b.token; }
    });
    rkKmTouch(RK_LEARN.id, "error");
    toast("❌ 有填错的，红框是正确答案");
    return;
  }
  rkLearnPhaseDone("recall");
}
function rkLearnToken(pt, mn) {
  var best = null, bs = -999;
  function consider(t) {
    if (!t || t.length < 2) return;
    if (t.length > 10) return;
    var s = 0;
    if (/\d/.test(t)) s += 100;
    if (mn && mn.indexOf(t) >= 0) s += 80;
    if (pt.indexOf("：" + t) >= 0 || pt.indexOf(":" + t) >= 0) s += 30;
    if (t.length >= 4 && t.length <= 6) s += 25;
    if (t.length >= 7 && t.length <= 8) s += 15;
    if (s > bs) { bs = s; best = t; }
  }
  var m = pt.match(/\d[\d.~%→－\-]*[^，。；;：:（）()\/+\s]{0,3}/);
  if (m) consider(m[0]);
  pt.split(/[、，。；;：:（）()\/+\s]+/).forEach(function (t) { consider(t); });
  if (!best) {
    var chars = ["为", "是", "指", "对", "由", "把", "将", "被", "向", "给", "与", "和", "及", "或", "的", "了"];
    var bi = -1;
    for (var c = 0; c < chars.length; c++) { var idx = pt.indexOf(chars[c]); if (idx >= 0 && (bi < 0 || idx < bi)) bi = idx; }
    if (bi >= 0 && pt.length - bi - 1 >= 2) consider(pt.substr(bi + 1, 6));
    if (!best) consider(pt.slice(0, 4));
  }
  return best;
}
function rkLearnNextPhase() {
  RK_LEARN.order = null; RK_LEARN.blanks = []; RK_LEARN.filled = []; RK_LEARN.pool = [];
  RK_LEARN.pi++;
  if (RK_LEARN.pi >= RK_LEARN.phases.length) { rkLearnFinish(); return; }
  rkLearnRender();
}
function rkLearnPhaseDone() {
  var id = RK_LEARN.id, p = RK_LEARN.phases[RK_LEARN.pi];
  rkKmTouch(id, "recall");
  var xp = rkLSGet(RK_KMXP, {});
  if (!xp[id] || !xp[id][p]) {
    if (!xp[id]) xp[id] = {};
    xp[id][p] = true;
    rkLSSet(RK_KMXP, xp);
    rkAddXP(3, "记忆关·" + rkLearnPhaseName(p));
  }
  toast("✅ 通过" + rkLearnPhaseName(p) + "！");
  rkLearnNextPhase();
}
function rkLearnFinish() {
  var k = rkLearnK();
  var m = rkKmMastery(RK_LEARN.id);
  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
    '<button class="btn-back" onclick="goHome()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 返回</button>' +
    '<h2 style="font-size:16px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + esc(k.title) + '</h2><span style="width:60px"></span></div>' +
    '<div style="text-align:center;padding:30px 16px">' +
    '<div style="font-size:38px;margin-bottom:8px">🎓</div>' +
    '<div style="font-size:15px;color:var(--gold);font-family:\'Kaiti SC\',serif;margin-bottom:6px">记忆关全部通过！</div>' +
    '<div style="font-size:12px;color:var(--dim);margin-bottom:4px">当前掌握度 <b style="color:var(--gold)">' + m + '%</b></div>' +
    '<div style="font-size:11px;color:var(--dim);margin-bottom:4px">下次复习：' + rkKmNext(RK_LEARN.id) + '</div>' +
    '<div style="font-size:11px;color:var(--dim)">遗忘风险：' + rkKmRisk(RK_LEARN.id).name + ' · 建议 ' + rkKmRisk(RK_LEARN.id).min + ' 分钟后巩固</div></div>' +
    '<div style="display:flex;gap:10px">' +
    '<button onclick="rkKdLearn(\'' + k.id + '\')" style="flex:1;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:11px 0;font-size:14px;cursor:pointer;font-family:inherit">🔁 再练一轮</button>' +
    '<button onclick="rkKaodianHome()" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:var(--paper);border-radius:10px;padding:11px 0;font-size:14px;cursor:pointer;font-family:inherit">📚 返回考点库</button></div>';
  $("screen-learn").innerHTML = html;
  showScreen("screen-learn");
}

/* ---------- 教材考点页（考点库新 tab） ---------- */
function rkKaodianHome() {
  var total = (window.KAODIAN || []).length;
  var html = '<div style="font-size:12px;color:var(--dim);margin-bottom:10px">📖 教材考点 · 9~11章完整收录（' + total + '个考点 / 158条子考点）· 点考点进入记忆关</div>' +
    '<input id="rk-kd-search" oninput="rkKaodianFilter(this.value)" placeholder="🔍 搜考点：WBS / 范围说明书 / 风险管理计划 / 项目章程 / PMO…" style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(217,180,91,.35);border-radius:10px;color:var(--paper);padding:10px 14px;font-size:14px;margin-bottom:12px;font-family:inherit;outline:none">' +
    '<div id="rk-kd-list"></div>';
  $("kd-body").innerHTML = html;
  rkKaodianFilter("");
}
function rkKaodianFilter(q) {
  q = (q || "").trim().toLowerCase();
  var list = (window.KAODIAN || []).filter(function (k) {
    if (!q) return true;
    return (k.title + " " + k.topic + " " + (k.mnemonic || "") + " " + (k.items || []).join(" ")).toLowerCase().indexOf(q) >= 0;
  });
  var html = "";
  [9, 10, 11].forEach(function (ch) {
    var kds = list.filter(function (k) { return k.chapter === ch; });
    if (!kds.length) return;
    html += '<div class="section-h">第' + ch + '章 <span style="font-size:10px;color:var(--dim)">' + kds.length + '个考点</span></div>';
    kds.forEach(function (k) {
      var m = rkKmMastery(k.id), r = rkKmRisk(k.id);
      html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:11px 14px;margin-bottom:8px;cursor:pointer" onclick="rkKdLearn(\'' + k.id + '\')">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<span style="font-size:13px;color:var(--paper)">📖 ' + esc(k.title) + '</span>' +
        '<span style="font-size:10px;color:' + (r.lv === "high" ? "var(--cinnabar)" : m > 0 ? "var(--jade)" : "var(--dim)") + ';border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:1px 6px;flex-shrink:0">' + (m > 0 ? "掌握" + m + "%" : "未学") + '</span></div>' +
        '<div style="font-size:10px;color:var(--dim);margin-top:4px">' + k.items.length + '条' + (k.mnemonic ? " · 📜 " + esc(k.mnemonic) : "") + (r.lv === "high" ? " · 🔴 该复习" : "") + '</div></div>';
    });
  });
  if (!list.length) html = '<div style="text-align:center;color:var(--dim);padding:30px;font-size:13px">🔍 没搜到，换个关键词试试</div>';
  $("rk-kd-list").innerHTML = html;
}
