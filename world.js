/* ============================================================
   项目管理修炼世界 2.0 · 第一阶段
   全新首页 / 项目世界 / 今日修炼 / RPG等级 / 学习进度(LocalStorage)
   - 保留全部原有 7 个训练工具（训练场）
   - 纯本地运行，无后端，GitHub Pages 可直接部署
   - 所有状态存 localStorage（rk2_ 前缀，与原有游戏存档互不干扰）
   ============================================================ */

/* ---------- 工具 ---------- */
function rkLSGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
function rkLSSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function rkToday() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function rkYesterday() {
  var d = new Date(); d.setDate(d.getDate() - 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function rkShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
function rkHeader(title) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
    '<button class="btn-back" onclick="goHome()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 返回</button>' +
    '<h2 style="font-size:17px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + title + '</h2><span style="width:60px"></span></div>';
}

var RK_PLAYER = "rk2_player", RK_WORLD = "rk2_world", RK_DAILY = "rk2_daily", RK_STREAK = "rk2_streak";

/* ---------- RPG 等级系统 ---------- */
var RK_LEVELS = [
  { lv: 1, name: "项目学徒", xp: 0 },
  { lv: 2, name: "项目助理", xp: 120 },
  { lv: 3, name: "项目经理", xp: 320 },
  { lv: 4, name: "高级项目经理", xp: 650 },
  { lv: 5, name: "项目专家", xp: 1100 },
  { lv: 6, name: "项目大师", xp: 1700 }
];
function rkLvInfo(xp) {
  var cur = RK_LEVELS[0], next = null;
  for (var i = 0; i < RK_LEVELS.length; i++) if (xp >= RK_LEVELS[i].xp) cur = RK_LEVELS[i];
  for (var j = 0; j < RK_LEVELS.length - 1; j++) if (xp < RK_LEVELS[j + 1].xp) { next = RK_LEVELS[j + 1]; break; }
  return { cur: cur, next: next };
}
function rkAddXP(n, reason) {
  var s = rkLSGet(RK_PLAYER, { xp: 0 });
  var before = rkLvInfo(s.xp).cur.lv;
  s.xp = Math.max(0, s.xp + n);
  rkLSSet(RK_PLAYER, s);
  var after = rkLvInfo(s.xp).cur.lv;
  if (n > 0) toast("✨ 修炼值 +" + n + (reason ? "（" + reason + "）" : ""));
  if (after > before) toast("🎉 晋升！Lv." + after + " " + rkLvInfo(s.xp).cur.name);
  rkRenderHome();
  return s;
}

/* ---------- 项目世界数据：五大阶段（用户指定结构） ---------- */
var RK_STAGES = [
  {
    key: "startup", name: "启动村", icon: "🏘️",
    intro: "项目还没开始，先想清楚三件事：做不做？凭什么做？谁来做？",
    areas: [
      { key: "init", name: "项目立项", q: "立项" },
      { key: "charter", name: "项目章程", q: "项目章程" },
      { key: "pm", name: "项目经理", q: "项目经理" },
      { key: "stakeholder", name: "干系人", q: "干系人" },
      { key: "kickoff", name: "项目启动", q: "启动" }
    ]
  },
  {
    key: "planning", name: "规划城", icon: "🏯",
    intro: "把「怎么做」想透，计划先行，十大领域都在这。",
    areas: [
      { key: "scope", name: "范围", q: "范围" },
      { key: "schedule", name: "进度", q: "进度" },
      { key: "cost", name: "成本", q: "成本" },
      { key: "quality", name: "质量", q: "质量" },
      { key: "resource", name: "资源", q: "资源" },
      { key: "comm", name: "沟通", q: "沟通" },
      { key: "risk", name: "风险", q: "风险" },
      { key: "procure", name: "采购", q: "采购" },
      { key: "stake2", name: "干系人参与", q: "干系人参与" },
      { key: "pmp", name: "项目管理计划", q: "项目管理计划" }
    ]
  },
  {
    key: "execution", name: "执行营", icon: "⚔️",
    intro: "按计划开干，把项目真正做出来。",
    areas: [
      { key: "direct", name: "指导与管理项目工作", q: "指导与管理项目工作" },
      { key: "qa", name: "质量保证", q: "质量保证" },
      { key: "getres", name: "获取资源", q: "获取资源" },
      { key: "build", name: "建设团队", q: "建设团队" },
      { key: "mteam", name: "管理团队", q: "管理团队" },
      { key: "mcomm", name: "管理沟通", q: "管理沟通" },
      { key: "mrisk", name: "实施风险应对", q: "实施风险应对" },
      { key: "mproc", name: "实施采购", q: "实施采购" },
      { key: "mstake", name: "管理干系人参与", q: "管理干系人参与" }
    ]
  },
  {
    key: "monitor", name: "监控塔", icon: "🗼",
    intro: "边干边查：做得对不对？偏差大不大？该不该变更？",
    areas: [
      { key: "mwork", name: "监控项目工作", q: "监控项目工作" },
      { key: "ccb", name: "整体变更控制", q: "变更控制" },
      { key: "sconfirm", name: "范围确认", q: "范围确认" },
      { key: "scontrol", name: "范围控制", q: "范围控制" },
      { key: "schedc", name: "进度控制", q: "进度控制" },
      { key: "costc", name: "成本控制", q: "成本控制" },
      { key: "qcontrol", name: "质量控制", q: "质量控制" },
      { key: "rcontrol", name: "资源控制", q: "资源控制" },
      { key: "ccomm", name: "沟通监督", q: "沟通监督" },
      { key: "crisk", name: "风险监督", q: "监督风险" },
      { key: "cproc", name: "采购控制", q: "采购控制" },
      { key: "cstake", name: "干系人监督", q: "干系人参与" }
    ]
  },
  {
    key: "closing", name: "收尾殿", icon: "🏛️",
    intro: "正式收官：验收、归档、释放资源、总结经验教训。",
    areas: [
      { key: "close", name: "项目收尾", q: "收尾" },
      { key: "accept", name: "验收", q: "验收" },
      { key: "lessons", name: "经验教训", q: "经验教训" },
      { key: "archive", name: "项目资料归档", q: "归档" },
      { key: "release", name: "资源释放", q: "释放" }
    ]
  }
];

/* ---------- 世界状态与解锁 ---------- */
function rkWState() {
  var w = rkLSGet(RK_WORLD, { visits: {} });
  if (!w.visits) w.visits = {};
  return w;
}
function rkStageVisited(s) {
  var w = rkWState(), c = 0;
  s.areas.forEach(function (a) { if (w.visits[a.key]) c++; });
  return c;
}
function rkStageUnlocked(idx) {
  if (idx <= 0) return true;
  var prev = RK_STAGES[idx - 1];
  return rkStageVisited(prev) >= prev.areas.length;
}
function rkAllVisited() {
  var w = rkWState(), c = 0;
  RK_STAGES.forEach(function (s) { s.areas.forEach(function (a) { if (w.visits[a.key]) c++; }); });
  return c;
}
function rkAllTotal() {
  var c = 0;
  RK_STAGES.forEach(function (s) { c += s.areas.length; });
  return c;
}

/* ---------- 打开考点库并搜索（连接世界与知识） ---------- */
function rkOpenSearch(q) {
  openKnowledge();   // 考点库（默认挖空闯关 tab）
  kdTab("browse");   // 切到全览搜索
  var inp = $("kd-search");
  if (inp) { inp.value = q; kdFilter(q); }
}

/* ---------- 项目世界界面 ---------- */
function rkOpenWorld() {
  var html = rkHeader("🏯 项目世界");
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:16px;line-height:1.8">扮演项目经理，点亮每个知识区域。<br>点亮前一阶段全部区域，解锁下一阶段。</div>';
  html += '<div class="map-vertical">';
  RK_STAGES.forEach(function (s, i) {
    var visited = rkStageVisited(s), total = s.areas.length;
    var unlocked = rkStageUnlocked(i);
    var pct = Math.round(visited / total * 100);
    html += '<div class="map-node' + (unlocked ? "" : " locked") + '" onclick="rkStageClick(' + i + ')">' +
      '<div class="nm">' + s.icon + ' ' + s.name + (unlocked ? "" : " 🔒") + '</div>' +
      '<div class="ds">' + esc(s.intro) + '</div>' +
      '<div class="pr">' + (unlocked ? "🗺️ 已探索 " + visited + "/" + total + " · " + pct + "%" : "🔒 需先完成" + RK_STAGES[i - 1].name) + '</div></div>';
    if (i < RK_STAGES.length - 1) html += '<div class="map-link">│</div>';
  });
  html += '</div>';
  $("screen-world").innerHTML = html;
  showScreen("screen-world");
}
function rkStageClick(idx) {
  if (!rkStageUnlocked(idx)) { toast("🔒 先点亮上一阶段全部区域"); return; }
  var s = RK_STAGES[idx];
  var w = rkWState();
  var html = rkHeader(s.icon + " " + s.name);
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:12px;line-height:1.7">' + esc(s.intro) + '</div>';
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:6px">点击区域 → 打开考点库学习该考点（点亮得 15 修炼值）</div>';
  html += '<div>';
  s.areas.forEach(function (a, j) {
    var done = !!w.visits[a.key];
    html += '<span class="area-chip' + (done ? " done" : "") + '" onclick="rkAreaClick(' + idx + ',' + j + ')">' + esc(a.name) + '</span>';
  });
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim);margin-top:16px;line-height:1.8">🧭 阶段使命：点亮本阶段全部 ' + s.areas.length + ' 个区域' +
    (rkStageVisited(s) >= s.areas.length ? ' → ✅ 已完成' : '') + '</div>';
  $("screen-world").innerHTML = html;
  showScreen("screen-world");
}
function rkAreaClick(stageIdx, areaIdx) {
  var s = RK_STAGES[stageIdx], a = s.areas[areaIdx];
  if (!rkStageUnlocked(stageIdx)) { toast("🔒 先点亮上一阶段全部区域"); return; }
  var w = rkWState();
  var first = !w.visits[a.key];
  w.visits[a.key] = true;
  rkLSSet(RK_WORLD, w);
  if (first) {
    rkAddXP(15, "探索 " + s.name + " · " + a.name);
    if (rkStageVisited(s) >= s.areas.length) {
      if (stageIdx < RK_STAGES.length - 1) {
        rkAddXP(40, "完成" + s.name);
        toast("🗺️ 解锁：" + RK_STAGES[stageIdx + 1].name + "！");
      } else {
        rkAddXP(80, "五大阶段全部点亮");
        toast("🏆 收尾殿完成！项目世界通关！");
      }
    }
  }
  rkOpenSearch(a.q);
}

/* ---------- 今日修炼 ---------- */
function rkDailyState() {
  var d = rkLSGet(RK_DAILY, null);
  if (!d || d.date !== rkToday()) d = rkGenDaily();
  return d;
}
function rkGenDaily() {
  var w = rkWState();
  var all = [];
  RK_STAGES.forEach(function (s) { s.areas.forEach(function (a) { all.push({ key: a.key, name: a.name, q: a.q, visited: !!w.visits[a.key] }); }); });
  var unseen = all.filter(function (a) { return !a.visited; });
  var pool = unseen.length >= 5 ? unseen : all;
  var tasks = rkShuffle(pool.slice()).slice(0, 5);
  return { date: rkToday(), tasks: tasks, done: tasks.map(function () { return false; }), claimed: false };
}
function rkOpenDaily() {
  var d = rkDailyState();
  var doneCount = d.done.filter(Boolean).length;
  var html = rkHeader("🔥 今日修炼");
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:12px">' + d.date + ' · 完成 ' + doneCount + '/' + d.tasks.length +
    (d.claimed ? ' · ✅ 全勤奖励已领' : ' · 全勤 +100 修炼值') + '</div>';
  d.tasks.forEach(function (t, i) {
    html += '<div class="task-item' + (d.done[i] ? " done" : "") + '" onclick="rkOpenTask(' + i + ')">' +
      '<div class="ck" onclick="event.stopPropagation();rkToggleTask(' + i + ')">' + (d.done[i] ? "✓" : "") + '</div>' +
      '<div style="flex:1"><div style="font-size:13px">' + esc(t.name) + '</div>' +
      '<div style="font-size:10px;color:var(--dim);margin-top:2px">点右侧圆圈标记完成 · 点任务去考点库学习</div></div></div>';
  });
  html += '<div style="font-size:11px;color:var(--dim);line-height:1.9;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;margin-top:4px">💡 每天自动换 5 个考点，优先挑你还没学过的。<br>每个任务 +10 修炼值，5 个全勤再 +50，共 100。</div>';
  $("screen-daily").innerHTML = html;
  showScreen("screen-daily");
}
function rkOpenTask(i) {
  var d = rkDailyState();
  rkOpenSearch(d.tasks[i].q);
}
function rkToggleTask(i) {
  var d = rkDailyState();
  if (d.claimed) { toast("今日全勤奖励已领取"); return; }
  d.done[i] = !d.done[i];
  rkLSSet(RK_DAILY, d);
  if (d.done[i]) rkAddXP(10, "完成修炼任务");
  else rkAddXP(-10, "撤销任务");
  if (d.done.every(Boolean) && !d.claimed) {
    d.claimed = true;
    rkLSSet(RK_DAILY, d);
    rkAddXP(50, "今日修炼全勤");
    var st = rkLSGet(RK_STREAK, { count: 0, last: "" });
    if (st.last === rkYesterday()) st.count++;
    else if (st.last !== rkToday()) st.count = 1;
    st.last = rkToday();
    rkLSSet(RK_STREAK, st);
    toast("🔥 连续修炼 " + st.count + " 天！");
  }
  rkOpenDaily();
}

/* ---------- 我的记忆（阶段掌握度） ---------- */
function rkOpenMemory() {
  var html = rkHeader("🧠 我的记忆");
  var totalV = 0, totalA = 0;
  RK_STAGES.forEach(function (s) {
    var v = rkStageVisited(s), t = s.areas.length;
    totalV += v; totalA += t;
    var pct = Math.round(v / t * 100);
    html += '<div style="margin-bottom:16px">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px"><span>' + s.icon + ' ' + s.name + '</span><span style="color:var(--gold)">' + pct + '%</span></div>' +
      '<div class="mem-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div style="font-size:10px;color:var(--dim);margin-top:4px">已学习 ' + v + '/' + t + ' 区域' + (v >= t ? ' · ✅ 已完成' : '') + '</div></div>';
  });
  var overall = totalA ? Math.round(totalV / totalA * 100) : 0;
  var st = rkLSGet(RK_STREAK, { count: 0, last: "" });
  html += '<div style="background:rgba(217,180,91,.08);border:1px solid rgba(217,180,91,.3);border-radius:12px;padding:12px 14px;margin-top:6px">' +
    '<div style="font-size:13px;color:var(--gold);font-family:\'Kaiti SC\',serif">总掌握度 ' + overall + '%</div>' +
    '<div style="font-size:11px;color:var(--dim);margin-top:6px;line-height:1.8">🔥 连续修炼 ' + st.count + ' 天<br>🧠 记忆算法（学习次数/最近学习/对错记录）将在第二阶段升级为遗忘地图</div></div>';
  $("screen-memory").innerHTML = html;
  showScreen("screen-memory");
}

/* ---------- 知识地图（第二阶段占位） ---------- */
function rkOpenMap() {
  var html = rkHeader("🗺️ 知识地图");
  html += '<div style="text-align:center;padding:60px 20px;color:var(--dim);font-size:13px;line-height:2.2">🧠 知识地图 · 第二阶段建设中<br><span style="font-size:11px">将展示 范围 → WBS → 活动 → 进度 → 成本 → 风险 的知识关系网<br>每个知识点可查：是什么 / 为什么 / 何时用 / 关联 / 易混 / 怎么考</span></div>';
  $("screen-map").innerHTML = html;
  showScreen("screen-map");
}

/* ---------- 首页状态条 ---------- */
function rkRenderHome() {
  var el = $("home-status");
  if (!el) return;
  var s = rkLSGet(RK_PLAYER, { xp: 0 });
  var li = rkLvInfo(s.xp);
  var d = rkDailyState();
  var doneCount = d.done.filter(Boolean).length;
  var totalV = rkAllVisited(), totalA = rkAllTotal();
  var mastery = totalA ? Math.round(totalV / totalA * 100) : 0;
  var xpPct = li.next ? Math.round((s.xp - li.cur.xp) / (li.next.xp - li.cur.xp) * 100) : 100;
  el.innerHTML = '<div class="row1"><span>Lv.' + li.cur.lv + ' <span class="lv">' + li.cur.name + '</span></span><span>✨ ' + s.xp + ' 修炼值</span></div>' +
    '<div class="bar"><i style="width:' + Math.min(100, xpPct) + '%"></i></div>' +
    '<div class="row2"><span>🔥 今日修炼 ' + doneCount + '/' + d.tasks.length + '</span>' +
    '<span>🧠 掌握度 ' + mastery + '%</span>' +
    '<span>🗺️ ' + totalV + '/' + totalA + ' 区域</span></div>';
}

/* ---------- 初始化 ---------- */
rkRenderHome();
