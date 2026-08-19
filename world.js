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
  html += (window.rkBossSection ? rkBossSection() : '');
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
  // 为什么系统：每个阶段存在的意义
  html += '<div class="section-h">🧠 为什么有' + s.name + '？</div>' +
    '<div style="font-size:12px;color:var(--paper);line-height:1.9;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px">' + esc(RK_WHY_STAGE[s.key] || "") + '</div>';
  // 项目剧情（第三阶段）
  html += (window.rkStorySection ? rkStorySection(idx) : '');
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
  rkRecordStudy(a.key, true);
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
  RK_STAGES.forEach(function (s) { s.areas.forEach(function (a) { all.push({ key: a.key, name: a.name, q: a.q, visited: !!w.visits[a.key], mastery: rkAreaMastery(a.key) }); }); });
  // 优先：未学过 → 掌握度低的
  all.sort(function (a, b) {
    if (a.visited !== b.visited) return a.visited ? 1 : -1;
    return a.mastery - b.mastery;
  });
  var tasks = rkShuffle(all.slice(0, 8)).slice(0, 5);
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
  if (d.done[i]) { rkAddXP(10, "完成修炼任务"); rkRecordStudy(d.tasks[i].key, true); }
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

/* ============================================================
   第二阶段：知识地图 / 为什么系统 / 知识点关系卡 / 遗忘地图(掌握度)
   ============================================================ */

/* ---------- 知识点关系数据（知识地图 + 关系卡） ---------- */
var RK_MAP_CHAIN = ["scope", "plan", "req", "wbs", "activity", "sched", "cost", "risk"];
var RK_MAP_EXTRA = ["charter", "stakeholder", "pmp", "critical", "ccb", "config", "riskreg"];
var RK_MAP_NODES = [
  { id: "scope", name: "项目范围", icon: "🎯",
    what: "项目要做什么、不做什么的边界定义（范围说明书 + WBS + WBS词典 = 范围基准）。",
    why: "没有边界，需求就会无限蔓延；范围是进度、成本、质量的衡量基准。",
    when: "规划阶段：规划范围管理 → 收集需求 → 定义范围 → 创建 WBS。",
    prev: ["charter", "stakeholder"], next: ["plan"],
    confuse: { a: "范围", b: "需求", d: "范围=做什么的边界；需求=具体要什么。范围说明书描述边界，需求文件列具体条目。" },
    memory: "范围就是项目的「边界线」。",
    exam: "常考：范围说明书11项、范围基准构成、范围蔓延的防范。" },
  { id: "plan", name: "范围管理计划", icon: "📋",
    what: "记录如何定义、确认和控制范围的方法论（范围怎么管的流程）。",
    why: "让团队知道范围怎么管：谁来定、怎么验、怎么改，避免各干各的。",
    when: "规划过程组，制订范围管理计划时。",
    prev: ["scope"], next: ["req"],
    confuse: { a: "范围管理计划", b: "范围说明书", d: "计划=怎么管的流程；说明书=管什么的边界内容。" },
    memory: "范围管理计划是「范围管理的说明书」。",
    exam: "常考：它是子计划之一，内容含定义/确认/控制范围的方法。" },
  { id: "req", name: "需求", icon: "📥",
    what: "干系人对项目成果的具体期望和条件（业务/干系人/解决方案需求等）。",
    why: "需求是范围的来源——先知道要什么，才能定义做什么。",
    when: "规划阶段收集需求，用需求跟踪矩阵从目标贯穿到测试。",
    prev: ["plan"], next: ["wbs"],
    confuse: { a: "需求", b: "范围", d: "需求=要什么（愿望清单）；范围=承诺交付什么（合同边界）。" },
    memory: "需求是愿望，范围是承诺。",
    exam: "常考：需求分类、需求跟踪矩阵、需求基准。" },
  { id: "wbs", name: "WBS", icon: "📦",
    what: "把项目范围和可交付成果逐层分解为更小、更易管理的工作包。",
    why: "让大而模糊的范围变得可管理、可估算、可分配责任、可跟踪。",
    when: "规划阶段创建 WBS（100%原则、4~6层、每元素一人负责）。",
    prev: ["req"], next: ["activity"],
    confuse: { a: "WBS", b: "活动清单", d: "WBS拆交付成果（名词）；活动清单列动作（动词）。" },
    memory: "WBS负责把交付成果拆开。",
    exam: "常考：分解步骤（识成果→定结构→逐层细化→编码→核实）、8方面注意、工作包/控制账户。" },
  { id: "activity", name: "活动", icon: "🏃",
    what: "WBS工作包再往下分解成具体动作（动词短语），是排工期的基础。",
    why: "只有拆到活动级别，才能估算工期、分配资源、画网络图。",
    when: "规划阶段：定义活动（分解 + 滚动式规划）。",
    prev: ["wbs"], next: ["sched"],
    confuse: { a: "活动", b: "工作包", d: "工作包是交付物；活动是做交付物的动作。WBS→工作包→活动。" },
    memory: "WBS拆「东西」，活动拆「动作」。",
    exam: "常考：定义活动工具（分解/滚动式规划）、活动属性。" },
  { id: "sched", name: "进度计划", icon: "📅",
    what: "活动何时开始、何时结束的时间安排（网络图 + 估算 + 资源平衡）。",
    why: "回答「什么时候能交付」，是监控进度的基准。",
    when: "规划阶段：排活动顺序 → 估算工期 → 制订进度计划。",
    prev: ["activity"], next: ["cost", "critical"],
    confuse: { a: "进度计划", b: "进度管理计划", d: "进度计划=具体时间表；进度管理计划=怎么管进度的流程。" },
    memory: "进度计划是「时间表」，管理计划是「管法」。",
    exam: "常考：关键路径法、总时差/自由时差、赶工vs快速跟进。" },
  { id: "critical", name: "关键路径", icon: "⚡",
    what: "网络图中持续时间最长的路径，决定项目最短工期，总浮动为0。",
    why: "关键路径上的活动晚一天，整个项目就晚一天——资源优先保它。",
    when: "制订进度计划时用关键路径法（CPM）算出。",
    prev: ["sched"], next: [],
    confuse: { a: "总时差", b: "自由时差", d: "总时差=不影响总工期可推迟的时间；自由时差=不影响紧后活动可推迟的时间。" },
    memory: "关键路径动不得，一动全项目都动。",
    exam: "常考：找关键路径、算时差、赶工（加资源）与快速跟进（改并行）。" },
  { id: "cost", name: "成本", icon: "💰",
    what: "项目要花多少钱：估算 → 预算 → 成本基准（S曲线），用挣值管理监控。",
    why: "钱是项目约束的核心，超支即失控；成本基准是考核依据。",
    when: "规划阶段估算并定预算；执行/监控阶段用 PV/EV/AC 分析。",
    prev: ["sched"], next: ["risk"],
    confuse: { a: "成本估算", b: "成本预算", d: "估算是预测要花多少；预算是把估算分摊到时间轴上形成基准。" },
    memory: "先估再算，预算变基准。",
    exam: "常考：PV/EV/AC、CV/CPI、EAC/ETC、三点估算。" },
  { id: "risk", name: "风险", icon: "⚠️",
    what: "不确定事件，可能对项目产生正面（机会）或负面（威胁）影响。",
    why: "项目充满不确定，提前识别、分析、应对，才能少踩坑。",
    when: "规划阶段识别→分析→规划应对；执行阶段实施应对；监控阶段监督。",
    prev: ["cost"], next: ["riskreg"],
    confuse: { a: "风险", b: "问题", d: "风险=还没发生的不确定；问题=已经发生的麻烦。" },
    memory: "风险是「可能出事」，问题是「已经出事」。",
    exam: "常考：风险七过程、应对策略（规避/转移/减轻/接受）、风险登记册。" },
  { id: "riskreg", name: "风险登记册", icon: "📖",
    what: "记录已识别风险、分析结果和应对计划的清单（活文档）。",
    why: "风险的唯一事实来源，随项目推进持续更新。",
    when: "识别风险时创建，贯穿整个项目持续更新。",
    prev: ["risk"], next: [],
    confuse: { a: "风险登记册", b: "风险报告", d: "登记册=风险清单底账；报告=给干系人看的阶段性汇报。" },
    memory: "风险登记册是风险的「户口本」。",
    exam: "常考：它是识别风险的输出、贯穿项目、持续更新。" },
  { id: "charter", name: "项目章程", icon: "📜",
    what: "正式批准项目并授权项目经理使用组织资源的文件。",
    why: "没章程=没授权：你凭什么调资源？项目凭什么存在？",
    when: "启动阶段，由发起人发布，先于任何规划。",
    prev: [], next: ["scope", "stakeholder", "pmp"],
    confuse: { a: "项目章程", b: "项目管理计划", d: "章程=启动时批准项目的授权书；计划=规划后怎么做事的方案。" },
    memory: "章程=出生证明+授权书。",
    exam: "常考：章程内容（目标/发起人/授权/初步范围预算）、由发起人发布。" },
  { id: "stakeholder", name: "干系人", icon: "🤝",
    what: "影响项目或被项目影响的个人或组织（客户/老板/团队/供应商…）。",
    why: "不识别干系人=不知道谁会支持你、谁会使绊子。",
    when: "启动阶段识别，规划阶段制定参与计划，执行/监控持续管理。",
    prev: ["charter"], next: ["scope"],
    confuse: { a: "干系人登记册", b: "干系人参与计划", d: "登记册=谁是谁；参与计划=怎么让每个人参与。" },
    memory: "先认人，再管人。",
    exam: "常考：识别干系人工具（权力/利益方格）、参与度五级评估矩阵。" },
  { id: "pmp", name: "项目管理计划", icon: "🗂️",
    what: "整合所有子计划（范围/进度/成本/质量/资源/沟通/风险/采购/干系人）的总计划。",
    why: "项目怎么做的总纲，一切执行、监控、变更都以它为基准。",
    when: "规划阶段整合制定，随变更持续更新。",
    prev: ["charter"], next: ["ccb"],
    confuse: { a: "项目管理计划", b: "项目章程", d: "计划=怎么做事的方案；章程=批准项目存在的授权。" },
    memory: "章程是出生证，计划是施工图。",
    exam: "常考：整合过程（制订项目管理计划）的输出，基准变更要走变更控制。" },
  { id: "ccb", name: "整体变更控制", icon: "🔄",
    what: "一套流程：任何基准变更必须走「提交→评估→审批（CCB）→执行→更新」流程。",
    why: "项目边做边变是常态，没有变更控制=范围蔓延、成本失控。",
    when: "监控阶段贯穿全程，所有变更请求都在这里处理。",
    prev: ["pmp"], next: [],
    confuse: { a: "变更控制", b: "配置管理", d: "变更控制管「要不要改、怎么改」；配置管理管「改了什么、版本对不对」。" },
    memory: "变更管流程，配置管版本。",
    exam: "常考：变更控制流程、CCB职责、配置项状态流转（草稿→正式→修改）。" },
  { id: "config", name: "配置管理", icon: "🗃️",
    what: "管理配置项的标识、版本、变更、审计（开发库/受控库/产品库）。",
    why: "保证产品在任意时刻的版本是正确、可追溯的。",
    when: "贯穿项目：配置项识别→控制→状态记录→配置审计。",
    prev: [], next: ["ccb"],
    confuse: { a: "配置管理", b: "变更控制", d: "配置管版本与基线；变更管审批流程。变更结果靠配置管理落地。" },
    memory: "配置管理是项目的「版本库」。",
    exam: "常考：配置库三库流转、配置项状态流转、配置审计类型。" }
];

/* ---------- 为什么系统（五大阶段顺序逻辑） ---------- */
var RK_WHY_ORDER = [
  { name: "启动", q: "这个项目到底要不要做？", d: "明确项目存在理由、目标与授权（项目章程），任命项目经理。" },
  { name: "规划", q: "这个项目准备怎么做？", d: "范围/进度/成本/质量/资源/沟通/风险/采购/干系人全部想清楚，形成计划。" },
  { name: "执行", q: "按照计划真正开始做。", d: "指导与管理项目工作，把计划变成可交付成果。" },
  { name: "监控", q: "现在做得对不对？有没有偏差？", d: "跟踪、审查、分析偏差、控制变更，及时纠偏。" },
  { name: "收尾", q: "项目是否正式结束？", d: "验收、归档、释放资源、总结经验教训。" }
];
var RK_WHY_STAGE = {
  startup: "启动解决「这个项目到底要不要做？」——明确项目存在理由、目标与授权（项目章程），任命项目经理，识别干系人。",
  planning: "规划解决「这个项目准备怎么做？」——把范围、进度、成本、质量、资源、沟通、风险、采购、干系人全部想清楚，形成项目管理计划。",
  execution: "执行解决「按照计划真正开始做」——指导与管理项目工作，把计划变成可交付成果，建设团队、管理沟通、实施风险应对。",
  monitor: "监控解决「现在做得对不对？有没有偏差？」——跟踪、审查、分析偏差，控制变更，及时纠偏，防止范围蔓延。",
  closing: "收尾解决「项目是否正式结束？」——验收、归档、释放资源、总结经验教训，正式关闭项目。"
};

/* ---------- 知识地图界面 ---------- */
function rkMapFind(id) {
  for (var i = 0; i < RK_MAP_NODES.length; i++) if (RK_MAP_NODES[i].id === id) return RK_MAP_NODES[i];
  return null;
}
function rkOpenMap() {
  var html = rkHeader("🗺️ 知识地图");
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:14px;line-height:1.8">知识点不是孤立的——它们是一条项目流水线。<br>点任意节点，看它是什么、为什么存在、和谁相连。</div>';
  html += '<div style="background:rgba(217,180,91,.08);border:1px solid rgba(217,180,91,.3);border-radius:12px;padding:12px 14px;margin-bottom:12px">' +
    '<div style="font-size:12px;color:var(--gold);font-family:\'Kaiti SC\',serif;margin-bottom:6px">🧠 主链：范围怎么变成风险</div>' +
    '<div style="font-size:11px;color:var(--dim);line-height:1.9">项目范围 → 范围管理计划 → 需求 → WBS → 活动 → 进度计划 → 成本 → 风险<br>从「做什么」一路推到「怕什么」。</div></div>';
  // 主链
  html += '<div class="map-vertical" style="margin-bottom:16px">';
  RK_MAP_CHAIN.forEach(function (id, i) {
    var n = rkMapFind(id);
    html += '<div class="map-node" style="text-align:center" onclick="rkMapNode(\'' + id + '\')">' +
      '<div class="nm">' + n.icon + ' ' + esc(n.name) + '</div></div>';
    if (i < RK_MAP_CHAIN.length - 1) html += '<div class="map-link">↓</div>';
  });
  html += '</div>';
  // 延伸知识点
  html += '<div class="section-h">🔗 延伸知识点</div>';
  html += '<div style="margin-bottom:14px">';
  RK_MAP_EXTRA.forEach(function (id) {
    var n = rkMapFind(id);
    html += '<span class="area-chip" onclick="rkMapNode(\'' + id + '\')">' + n.icon + ' ' + esc(n.name) + '</span>';
  });
  html += '</div>';
  // 为什么系统
  html += '<div class="section-h">🧠 为什么是 启动→规划→执行→监控→收尾？</div>' +
    '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px 14px">';
  RK_WHY_ORDER.forEach(function (w, i) {
    html += '<div style="display:flex;gap:10px;padding:6px 0;font-size:12px;line-height:1.7">' +
      '<span style="color:var(--gold);font-family:\'Kaiti SC\',serif;flex-shrink:0">' + (i + 1) + '. ' + w.name + '</span>' +
      '<span style="color:var(--paper)">「' + esc(w.q) + '」<span style="color:var(--dim)">' + esc(w.d) + '</span></span></div>';
  });
  html += '<div style="font-size:12px;color:var(--gold);font-family:\'Kaiti SC\',serif;padding-top:8px;border-top:1px dashed rgba(217,180,91,.3)">🎯 你记住的不是顺序，而是项目经理工作的逻辑。</div></div>';
  $("screen-map").innerHTML = html;
  showScreen("screen-map");
}
function rkMapNode(id) {
  var n = rkMapFind(id);
  if (!n) return;
  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
    '<button class="btn-back" onclick="rkOpenMap()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 地图</button>' +
    '<h2 style="font-size:17px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + n.icon + ' ' + esc(n.name) + '</h2><span style="width:60px"></span></div>';
  html += '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(217,180,91,.4);border-radius:14px;padding:16px;font-size:13px;line-height:2">' +
    '<div><b style="color:var(--gold)">📌 它是什么？</b><br><span style="color:var(--paper)">' + esc(n.what) + '</span></div>' +
    '<div style="margin-top:10px"><b style="color:var(--gold)">🎯 为什么需要？</b><br><span style="color:var(--paper)">' + esc(n.why) + '</span></div>' +
    '<div style="margin-top:10px"><b style="color:var(--gold)">⏰ 什么时候用？</b><br><span style="color:var(--paper)">' + esc(n.when) + '</span></div>' +
    (n.prev.length ? '<div style="margin-top:10px"><b style="color:var(--gold)">🔗 前置知识</b> ' + n.prev.map(function (p) { var x = rkMapFind(p); return '<span class="area-chip" onclick="rkMapNode(\'' + p + '\')">' + x.icon + ' ' + esc(x.name) + '</span>'; }).join("") + '</div>' : '') +
    (n.next.length ? '<div style="margin-top:6px"><b style="color:var(--gold)">🔗 后续知识</b> ' + n.next.map(function (p) { var x = rkMapFind(p); return '<span class="area-chip" onclick="rkMapNode(\'' + p + '\')">' + x.icon + ' ' + esc(x.name) + '</span>'; }).join("") + '</div>' : '') +
    '<div style="margin-top:10px"><b style="color:var(--gold)">⚠️ 易混辨析</b><br><span style="color:var(--paper)">' + esc(n.confuse.a) + ' ≠ ' + esc(n.confuse.b) + '：' + esc(n.confuse.d) + '</span></div>' +
    '<div style="margin-top:10px"><b style="color:var(--gold)">🧠 一句话记忆</b><br><span style="color:var(--paper);font-family:\'Kaiti SC\',serif">' + esc(n.memory) + '</span></div>' +
    '<div style="margin-top:10px"><b style="color:var(--gold)">📝 考试怎么考</b><br><span style="color:var(--dim)">' + esc(n.exam) + '</span></div>' +
    '</div>';
  html += '<div style="display:flex;gap:10px;margin-top:14px">' +
    '<button onclick="rkMapStudy(\'' + id + '\')" style="flex:1;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">📚 去考点库学习</button>' +
    (id === "cost" ? '<button onclick="rkOpenEVM()" style="flex:1;background:rgba(74,157,124,.2);border:1px solid var(--jade);color:var(--jade);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">📊 挣值仪表盘</button>' : '') +
    '<button onclick="rkOpenMap()" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:var(--dim);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">🗺️ 返回地图</button></div>';
  $("screen-map").innerHTML = html;
  showScreen("screen-map");
}
function rkMapStudy(id) {
  var n = rkMapFind(id);
  if (!n) return;
  rkOpenSearch(n.name);
}

/* ---------- 掌握度算法（遗忘地图数据源） ---------- */
var RK_MASTERY = "rk2_mastery", RK_KDSTATS = "rk2_kdstats", RK_GAMES = "rk2_games";
function rkRecordStudy(areaKey, ok) {
  var m = rkLSGet(RK_MASTERY, {});
  var e = m[areaKey] || { study: 0, last: 0, right: 0, wrong: 0 };
  e.study++; e.last = Date.now();
  if (ok) e.right++; else e.wrong++;
  m[areaKey] = e;
  rkLSSet(RK_MASTERY, m);
}
function rkAreaMastery(key) {
  var e = rkLSGet(RK_MASTERY, {})[key];
  if (!e) return 0;
  var days = (Date.now() - e.last) / 86400000;
  var score = 20 + Math.min(e.study, 6) * 14 + (e.wrong === 0 ? 10 : 0) - e.wrong * 8 - days * 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}
function rkRiskOf(key) {
  var e = rkLSGet(RK_MASTERY, {})[key];
  var days = e ? (Date.now() - e.last) / 86400000 : 999;
  var m = rkAreaMastery(key);
  if (days >= 3 || m < 35) return { lv: "high", name: "高", min: 16 };
  if (days >= 1 || m < 65) return { lv: "med", name: "中", min: 12 };
  return { lv: "low", name: "低", min: 8 };
}
function rkStageMastery(s) {
  var sum = 0;
  s.areas.forEach(function (a) { sum += rkAreaMastery(a.key); });
  return Math.round(sum / s.areas.length);
}
function rkRecommend() {
  // 学过的区域里挑遗忘风险最高的
  var m = rkLSGet(RK_MASTERY, {});
  var studied = [];
  RK_STAGES.forEach(function (s) { s.areas.forEach(function (a) { if (m[a.key]) studied.push({ key: a.key, name: a.name, q: a.q, stage: s }); }); });
  if (!studied.length) return null;
  studied.sort(function (a, b) {
    var ra = rkRiskOf(a.key), rb = rkRiskOf(b.key);
    var lvA = ra.lv === "high" ? 2 : ra.lv === "med" ? 1 : 0;
    var lvB = rb.lv === "high" ? 2 : rb.lv === "med" ? 1 : 0;
    if (lvA !== lvB) return lvB - lvA;
    return rkAreaMastery(a.key) - rkAreaMastery(b.key);
  });
  return studied[0];
}
function rkKdResult(title, ok) {
  var s = rkLSGet(RK_KDSTATS, { cards: {} });
  var c = s.cards[title] || { right: 0, wrong: 0, last: 0 };
  if (ok) c.right++; else c.wrong++;
  c.last = Date.now();
  s.cards[title] = c;
  rkLSSet(RK_KDSTATS, s);
}
function rkKdWeak() {
  var s = rkLSGet(RK_KDSTATS, { cards: {} });
  var arr = [];
  Object.keys(s.cards).forEach(function (k) { var c = s.cards[k]; if (c.wrong > 0) arr.push({ title: k, wrong: c.wrong, right: c.right }); });
  arr.sort(function (a, b) { return b.wrong - a.wrong; });
  return arr.slice(0, 3);
}
function rkGameDone(type, id, title, wrong) {
  var g = rkLSGet(RK_GAMES, { done: {} });
  var key = type + ":" + id;
  var first = !g.done[key];
  g.done[key] = true;
  rkLSSet(RK_GAMES, g);
  rkAddXP(first ? 20 : 5, (first ? "首次通关 " : "复习 ") + title);
}

/* ---------- 遗忘地图（我的记忆 v2） ---------- */
function rkOpenMemory() {
  var html = rkHeader("🧠 我的记忆");
  var totalA = rkAllTotal();
  // 五大阶段掌握度条（掌握度算法：学习次数/最近学习/对错/遗忘衰减）
  RK_STAGES.forEach(function (s) {
    var v = rkStageVisited(s), t = s.areas.length;
    var pct = rkStageMastery(s);
    html += '<div style="margin-bottom:16px">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px"><span>' + s.icon + ' ' + s.name + '</span><span style="color:var(--gold)">' + pct + '%</span></div>' +
      '<div class="mem-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div style="font-size:10px;color:var(--dim);margin-top:4px">已学习 ' + v + '/' + t + ' 区域' + (v >= t ? ' · ✅ 已完成' : '') + '</div></div>';
  });
  // 今日最该复习
  var rec = rkRecommend();
  if (rec) {
    var r = rkRiskOf(rec.key);
    html += '<div style="background:rgba(192,80,60,.1);border:1px solid rgba(192,80,60,.4);border-radius:12px;padding:12px 14px;margin:6px 0 12px">' +
      '<div style="font-size:12px;color:var(--cinnabar);font-weight:600;margin-bottom:6px">🔥 今天最应该复习</div>' +
      '<div style="font-size:14px;color:var(--paper)">' + esc(rec.name) + ' <span style="font-size:10px;color:var(--cinnabar);border:1px solid rgba(192,80,60,.5);border-radius:4px;padding:1px 6px">遗忘风险' + r.name + '</span></div>' +
      '<div style="font-size:11px;color:var(--dim);margin-top:6px">掌握度 ' + rkAreaMastery(rec.key) + '% · 建议修炼时间 ' + r.min + ' 分钟</div>' +
      '<button onclick="rkOpenSearch(\'' + rec.q.replace(/'/g, "") + '\')" style="width:100%;margin-top:10px;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:9px 0;font-size:13px;cursor:pointer;font-family:inherit">📖 去复习 →</button></div>';
  } else {
    html += '<div style="background:rgba(217,180,91,.08);border:1px solid rgba(217,180,91,.3);border-radius:12px;padding:12px 14px;margin:6px 0 12px">' +
      '<div style="font-size:12px;color:var(--gold)">🔥 还没有学习记录</div>' +
      '<div style="font-size:11px;color:var(--dim);margin-top:4px">先去「项目世界」或「今日修炼」学几个考点，遗忘地图就会告诉你该复习什么。</div></div>';
  }
  // 薄弱考点（挖空闯关错题）
  var weak = rkKdWeak();
  if (weak.length) {
    html += '<div class="section-h">📉 薄弱考点 · 挖空闯关常错</div>';
    weak.forEach(function (w) {
      html += '<div class="task-item" onclick="rkOpenSearch(\'' + w.title.replace(/'/g, "") + '\')">' +
        '<div class="ck" style="border-color:var(--cinnabar);color:var(--cinnabar)">' + w.wrong + '</div>' +
        '<div style="flex:1"><div style="font-size:13px">' + esc(w.title) + '</div>' +
        '<div style="font-size:10px;color:var(--dim);margin-top:2px">错 ' + w.wrong + ' 次 · 对 ' + w.right + ' 次 · 点击巩固</div></div></div>';
    });
  }
  // 待学习
  var left = totalA - rkAllVisited();
  html += '<div style="font-size:11px;color:var(--dim);line-height:1.9;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;margin-top:4px">' +
    '🗺️ 项目世界还有 <b style="color:var(--gold)">' + left + '</b> 个区域没探索' +
    '<br>🧠 掌握度 = 学习次数 × 14 + 全对奖励 − 错误扣分 − 遗忘衰减（每过1天−2）' +
    '<br>💾 全部自动保存在本机</div>';
  $("screen-memory").innerHTML = html;
  showScreen("screen-memory");
}

/* ---------- 初始化 ---------- */
rkRenderHome();
