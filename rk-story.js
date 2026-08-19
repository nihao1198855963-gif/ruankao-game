/* ============================================================
   第三阶段：项目剧情 / Boss项目事件 / 挣值仪表盘 / 知识对决 / 口诀修炼
   - 全部场景化教学，无 A/B/C/D 刷题
   - 依赖 world.js（rkOpenSearch/rkHeader/rkAddXP/rkLSGet/rkLSSet/rkToday 等）
   - 必须在 world.js 之后加载
   ============================================================ */

/* ================= 项目剧情系统 ================= */
var RK_STORY = [
  { id: "s1", stage: "startup", title: "老板催开工", learn: "项目章程",
    scene: "你被任命为「智慧城市综合管理平台」项目经理。老板拍板：'这项目很重要，三个月必须上线！今天就安排开发团队开工！' 但项目目标、范围、预算都还没定。",
    steps: [
      { q: "你第一步应该做什么？",
        opts: [
          { t: "立即召集开发团队开工", fb: "❌ 目标没定、授权没有，团队只会盲干——返工成本全砸在自己身上。" },
          { t: "先推动立项，拿到项目章程", ok: true, why: "项目章程=正式批准项目+授权项目经理+明确初步目标。没有章程，你连资源都调不动。启动阶段第一件事：做不做、凭什么做。" },
          { t: "自己先写详细方案", fb: "❌ 方案要在范围和预算明确后才有意义，顺序反了=白写。" }
        ] },
      { q: "老板追问：'项目都拿下了，还立什么项？' 你怎么解释？",
        opts: [
          { t: "'立项确定目标与授权，这是我行使权力的依据'", ok: true, why: "章程是任命你的正式文件，也是你向全公司要资源、做决策的凭证。" },
          { t: "'您说得对，那我直接开工'", fb: "❌ 放弃专业判断迎合老板，出了问题责任全是你的。" }
        ] }
    ] },
  { id: "s2", stage: "startup", title: "你凭什么调资源", learn: "项目章程",
    scene: "你要调两名资深工程师，研发总监拦住你：'你一个新来的项目经理，凭什么调我的资源？'",
    steps: [
      { q: "你拿出什么证明自己的权力？",
        opts: [
          { t: "项目章程（发起人签署的授权文件）", ok: true, why: "章程明确授权项目经理使用组织资源——这就是'凭什么'的答案。" },
          { t: "自己写的任命邮件", fb: "❌ 口头/自拟文件没有正式授权效力。" },
          { t: "打感情牌求他帮忙", fb: "❌ 人情能解决一次，解决不了长期资源调配。" }
        ] }
    ] },
  { id: "p1", stage: "planning", title: "功能越多越好", learn: "范围基准",
    scene: "需求评审会上，客户经理兴冲冲地说：'功能越多越好，全都加上！反正预算充足。'",
    steps: [
      { q: "你怎么接这句话？",
        opts: [
          { t: "全部接受，越多越好", fb: "❌ 这就是范围蔓延的起点——需求无限膨胀，进度成本全线失控。" },
          { t: "先记录全部需求，评估后确定范围基准", ok: true, why: "需求≠承诺。收集需求→定义范围→创建WBS，确认过并纳入基准的才叫范围。" },
          { t: "当场拒绝客户", fb: "❌ 拒绝需求=干系人管理失败，客户关系直接破裂。" }
        ] },
      { q: "范围确认后，下一步把它变成什么？",
        opts: [
          { t: "WBS：把交付成果逐层分解", ok: true, why: "WBS把大范围拆成可管理的工作包——这是排工期、估成本的地基。" },
          { t: "直接排工期", fb: "❌ 不分解就无法精确估算活动与工期。" }
        ] }
    ] },
  { id: "p2", stage: "planning", title: "审批要3个月？", learn: "风险",
    scene: "专家提醒你：'政府数据接口的审批流程可能要3个月，咱们等得起吗？'",
    steps: [
      { q: "这属于风险还是问题？",
        opts: [
          { t: "风险——还没发生的不确定事件", ok: true, why: "风险=可能发生的未来事件；问题=已经发生的麻烦。审批还没开始，只是'可能'要3个月——典型风险。" },
          { t: "问题——已经发生了", fb: "❌ 审批尚未进行，只是存在可能性，属于风险。" }
        ] },
      { q: "识别出这个风险后，接下来做什么？",
        opts: [
          { t: "定性/定量分析 → 规划应对（如提前启动审批）", ok: true, why: "风险管理七过程：识别→定性→定量→规划应对→实施应对→监督。" },
          { t: "等它发生了再说", fb: "❌ 被动应对=风险失控，等项目崩了才补救。" }
        ] }
    ] },
  { id: "e1", stage: "execution", title: "团队要散架", learn: "资源管理",
    scene: "执行阶段，两名核心开发被别的项目借走，团队士气低落，交付节奏明显变慢。",
    steps: [
      { q: "你首先应该做什么？",
        opts: [
          { t: "获取资源、建设团队（申请补人+激励团队）", ok: true, why: "执行阶段靠资源管理保证战斗力：获取资源→建设团队→管理团队。" },
          { t: "直接砍掉部分需求", fb: "❌ 砍需求属于范围变更，必须走变更控制，不能擅自决定。" },
          { t: "假装没看见", fb: "❌ 团队士气问题拖得越久，项目死得越快。" }
        ] }
    ] },
  { id: "m1", stage: "monitor", title: "进度落后10天", learn: "关键路径",
    scene: "里程碑检查：关键路径上的「数据对接」模块比计划晚了10天。",
    steps: [
      { q: "先分析什么？",
        opts: [
          { t: "它在关键路径上、总时差为0——总工期直接延后10天", ok: true, why: "关键路径决定最短工期，关键活动延误=总工期延误。" },
          { t: "非关键路径，延误无所谓", fb: "❌ 它就在关键路径上，不存在缓冲。" }
        ] },
      { q: "你采取什么措施？",
        opts: [
          { t: "对关键路径活动赶工（加资源）或快速跟进（并行）", ok: true, why: "赶工=加资源压工期；快速跟进=改并行。二者都只作用于关键路径。" },
          { t: "删掉这个模块", fb: "❌ 删功能=范围变更，要评估影响走CCB，不能拍脑袋。" }
        ] }
    ] },
  { id: "c1", stage: "closing", title: "客户不验收", learn: "验收",
    scene: "系统开发完成，客户却说：'先别验收，再改改这界面……'",
    steps: [
      { q: "你用什么来说话？",
        opts: [
          { t: "验收标准（范围说明书/验收测试标准）", ok: true, why: "验收以事先确认的标准为准，而不是客户的临时感受。" },
          { t: "继续改，直到客户满意", fb: "❌ 无休止修改=范围蔓延+项目永不收尾。" }
        ] },
      { q: "如果确实有合理修改，应该怎么处理？",
        opts: [
          { t: "走变更控制流程，评估后决定", ok: true, why: "收尾阶段也要守变更纪律——合理变更记录进变更日志，纳入新版本。" },
          { t: "先做了再说", fb: "❌ 不评估直接做=范围失控，收尾遥遥无期。" }
        ] }
    ] }
];

/* ================= Boss 项目事件 ================= */
var RK_BOSS = [
  { id: "b1", name: "范围蔓延", icon: "👹", learn: "整体变更控制",
    scene: "上线前两周，客户王总笑呵呵地说：'加个报表功能吧，很简单，就是多一张表！'",
    steps: [
      { q: "王总说得轻巧，你第一反应是？",
        opts: [
          { t: "答应他：'没问题，马上加'", fb: "❌ 未评估就承诺=范围蔓延上身。轻飘飘一句话可能吃掉两周工期。" },
          { t: "先记录变更请求", ok: true, why: "任何变更第一步：书面记录，进入变更流程。先记录，再评估。" }
        ] },
      { q: "记录之后，接下来？",
        opts: [
          { t: "评估影响：工期、成本、质量、风险", ok: true, why: "影响评估是变更决策的依据——一张报表可能要动数据库、接口、测试。" },
          { t: "直接安排开发", fb: "❌ 跳过评估=不知道自己答应了什么。" }
        ] },
      { q: "评估显示要延期5天，你怎么办？",
        opts: [
          { t: "自己拍板：'就加了'", fb: "❌ 范围基准变更必须由变更控制委员会（CCB）审批，不是你一个人能决定的事。" },
          { t: "提交CCB审批", ok: true, why: "基准变更走CCB——集体决策，责任共担。" }
        ] },
      { q: "CCB批准了，最后一步？",
        opts: [
          { t: "更新范围基准+配置管理，通知全体干系人", ok: true, why: "变更落地=更新基准+配置库+干系人知会，闭环才算完成。" },
          { t: "口头通知团队'加了'", fb: "❌ 不更新基准=以后没法判断项目是否超范围。" }
        ] }
    ],
    win: "范围蔓延 Boss 击败！你守住了范围边界。" },
  { id: "b2", name: "项目延期", icon: "👹", learn: "关键路径",
    scene: "距上线30天，「接口联调」关键活动延误12天，测试都没排上。",
    steps: [
      { q: "这个延误对总工期的影响？",
        opts: [
          { t: "关键路径延误=总工期延误12天", ok: true, why: "关键路径总浮动为0，延误直接传导到上线日。" },
          { t: "可以被其他活动缓冲吸收", fb: "❌ 它没有缓冲——这就是关键路径的含义。" }
        ] },
      { q: "你的应对方案？",
        opts: [
          { t: "赶工或快速跟进（作用于关键路径活动）", ok: true, why: "赶工=加资源压工期（成本上升）；快速跟进=并行（可能返工）。只对关键路径有效。" },
          { t: "让测试组也一起加班", fb: "❌ 资源砸在非关键路径上，救不了总工期。" }
        ] },
      { q: "加班两周后仍差5天，你还可以？",
        opts: [
          { t: "削减范围（走变更控制砍非关键需求）", ok: true, why: "实在不行就缩范围——但要CCB批准，不能自己砍。" },
          { t: "再加大投入，不惜成本", fb: "❌ 边际收益递减，成本失控换不来几天。" }
        ] }
    ],
    win: "项目延期 Boss 击败！上线日守住了。" },
  { id: "b3", name: "项目超支", icon: "👹", learn: "挣值管理",
    scene: "财务数据：计划完成价值100万（PV），实际完成价值80万（EV），实际成本90万（AC）。",
    steps: [
      { q: "项目进度如何？",
        opts: [
          { t: "进度落后：EV(80) < PV(100)，SPI=0.8", ok: true, why: "SPI=EV/PV=0.8<1，只完成了计划的80%。" },
          { t: "进度超前", fb: "❌ 完成价值低于计划价值=落后，不是超前。" }
        ] },
      { q: "项目成本如何？",
        opts: [
          { t: "成本超支：EV(80) < AC(90)，CPI=0.89", ok: true, why: "CPI=EV/AC=0.89<1，每花1块钱只产出0.89元价值。" },
          { t: "成本节约", fb: "❌ 花得比产出多=超支。" }
        ] },
      { q: "按当前效率（典型偏差），最终总成本EAC最接近？(BAC=100万)",
        opts: [
          { t: "EAC=BAC/CPI≈112万", ok: true, why: "典型偏差 EAC=BAC/CPI≈100÷0.89≈112万，比预算多12万。" },
          { t: "EAC=BAC=100万", fb: "❌ 偏差不纠正，超支会持续下去。" },
          { t: "EAC=AC+EV=170万", fb: "❌ 把两个不同维度硬加，没有意义。" }
        ] }
    ],
    win: "项目超支 Boss 击败！成本重新可控。" }
];

/* ================= 剧情/Boss 引擎 ================= */
var RK_PLAY = null; // {type, id, step}
function rkStorySection(stageIdx) {
  var evs = RK_STORY.filter(function (e) { return e.stage === RK_STAGES[stageIdx].key; });
  if (!evs.length) return "";
  var done = rkLSGet("rk2_story", {});
  var html = '<div class="section-h">📖 项目剧情</div>';
  evs.forEach(function (e) {
    var d = !!done[e.id];
    html += '<div style="background:' + (d ? "rgba(74,157,124,.08)" : "rgba(217,180,91,.1)") + ';border:1px solid ' + (d ? "rgba(74,157,124,.4)" : "rgba(217,180,91,.4)") + ';border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer" onclick="rkStoryPlay(\'' + e.id + '\')">' +
      '<div style="font-size:13px;color:var(--paper)">' + (d ? "✅ " : "🎬 ") + esc(e.title) + '</div>' +
      '<div style="font-size:11px;color:var(--dim);margin-top:4px">' + (d ? "已完成 · 复习得 +5 修炼值" : "未完成 · 首次完成 +30 修炼值") + '</div></div>';
  });
  return html;
}
function rkBossSection() {
  var done = rkLSGet("rk2_boss", {});
  var allMon = rkStageVisited(RK_STAGES[2]) >= RK_STAGES[2].areas.length; // 执行营完成才解锁
  var html = '<div class="section-h">👹 Boss 挑战</div>';
  if (!allMon) {
    html += '<div style="font-size:11px;color:var(--dim);line-height:1.8;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px">🔒 完成「执行营」全部区域后解锁 Boss 挑战。</div>';
    return html;
  }
  RK_BOSS.forEach(function (b) {
    var d = !!done[b.id];
    html += '<div style="background:' + (d ? "rgba(74,157,124,.08)" : "linear-gradient(135deg,rgba(192,80,60,.18),rgba(14,11,20,.2))") + ';border:1px solid ' + (d ? "rgba(74,157,124,.4)" : "rgba(192,80,60,.5)") + ';border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer" onclick="rkBossPlay(\'' + b.id + '\')">' +
      '<div style="font-size:14px;color:var(--paper);font-weight:600">' + b.icon + ' ' + esc(b.name) + (d ? " ✅" : "") + '</div>' +
      '<div style="font-size:11px;color:var(--dim);margin-top:4px">' + (d ? "已击败 · 复习 +5" : "首次击败 +50 修炼值 · 涉及 " + esc(b.learn)) + '</div></div>';
  });
  return html;
}
function rkStoryPlay(id) {
  RK_PLAY = { type: "story", id: id, step: 0 };
  rkPlayRender("screen-story");
}
function rkBossPlay(id) {
  RK_PLAY = { type: "boss", id: id, step: 0 };
  rkPlayRender("screen-boss");
}
function rkPlayRender(screenId) {
  var p = RK_PLAY, ev = (p.type === "story" ? RK_STORY : RK_BOSS).find(function (x) { return x.id === p.id; });
  if (!ev) return;
  var isBoss = p.type === "boss";
  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
    '<button class="btn-back" onclick="goHome()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 返回</button>' +
    '<h2 style="font-size:16px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + (isBoss ? ev.icon + " " + esc(ev.name) : "🎬 " + esc(ev.title)) + '</h2>' +
    '<span style="font-size:11px;color:var(--dim)">' + (p.step + 1) + '/' + ev.steps.length + '</span></div>';
  // 场景卡
  html += '<div style="background:rgba(217,180,91,.1);border:1px solid rgba(217,180,91,.4);border-radius:12px;padding:14px 16px;margin-bottom:12px;font-size:13px;line-height:1.9">' +
    '<div style="color:var(--gold);font-size:11px;margin-bottom:6px">' + (isBoss ? "👹 突发状况" : "📖 项目剧情") + '</div>' + esc(ev.scene) + '</div>';
  var st = ev.steps[p.step];
  html += '<div style="font-size:14px;color:var(--paper);margin-bottom:10px;line-height:1.8">' + esc(st.q) + '</div>';
  st.opts.forEach(function (o, i) {
    html += '<div id="rkopt-' + i + '" onclick="rkPlayOpt(' + i + ')" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:12px 14px;margin-bottom:8px;cursor:pointer;font-size:13px;line-height:1.6">' + esc(o.t) + '</div>';
  });
  html += '<div id="rkfb" style="display:none;font-size:12px;line-height:1.8;border-radius:10px;padding:10px 14px;margin-top:4px"></div>';
  $(screenId).innerHTML = html;
  showScreen(screenId);
}
function rkPlayOpt(i) {
  var p = RK_PLAY, ev = (p.type === "story" ? RK_STORY : RK_BOSS).find(function (x) { return x.id === p.id; });
  var st = ev.steps[p.step], o = st.opts[i];
  for (var k = 0; k < st.opts.length; k++) {
    var el = $("rkopt-" + k);
    if (!el) continue;
    if (k === i) { el.style.borderColor = o.ok ? "var(--jade)" : "var(--cinnabar)"; }
    else el.style.opacity = ".4";
  }
  var fb = $("rkfb");
  fb.style.display = "block";
  if (o.ok) {
    fb.style.border = "1px solid var(--jade)"; fb.style.background = "rgba(74,157,124,.12)";
    fb.innerHTML = '✅ <b style="color:var(--jade)">回答正确</b><br><span style="color:var(--paper)">🧠 ' + esc(o.why) + '</span>' +
      (p.step + 1 >= ev.steps.length
        ? '<button onclick="rkPlayFinish()" style="width:100%;margin-top:10px;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:9px 0;font-size:13px;cursor:pointer;font-family:inherit">' + (p.type === "boss" ? "🏆 击败 Boss！" : "🎉 剧情完成！") + '</button>'
        : '<button onclick="rkPlayNext()" style="width:100%;margin-top:10px;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:9px 0;font-size:13px;cursor:pointer;font-family:inherit">下一步 →</button>');
  } else {
    fb.style.border = "1px solid var(--cinnabar)"; fb.style.background = "rgba(192,80,60,.12)";
    fb.innerHTML = '<span style="color:var(--cinnabar)">' + esc(o.fb) + '</span><br><span style="font-size:11px;color:var(--dim)">再想想，选对才能继续 👆</span>';
  }
}
function rkPlayNext() { RK_PLAY.step++; rkPlayRender(RK_PLAY.type === "story" ? "screen-story" : "screen-boss"); }
function rkPlayFinish() {
  var p = RK_PLAY;
  var store = p.type === "story" ? "rk2_story" : "rk2_boss";
  var done = rkLSGet(store, {});
  var first = !done[p.id];
  done[p.id] = true;
  rkLSSet(store, done);
  var ev = (p.type === "story" ? RK_STORY : RK_BOSS).find(function (x) { return x.id === p.id; });
  var xp = p.type === "boss" ? (first ? 50 : 5) : (first ? 30 : 5);
  rkAddXP(xp, (first ? "完成" : "复习") + " " + (p.type === "boss" ? ev.name : ev.title));
  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
    '<button class="btn-back" onclick="goHome()" style="background:none;border:1px solid rgba(217,180,91,.4);color:var(--gold);border-radius:8px;padding:6px 14px;font-size:14px;cursor:pointer;font-family:inherit">← 返回</button>' +
    '<h2 style="font-size:16px;color:var(--gold);font-family:\'Kaiti SC\',serif">' + (p.type === "boss" ? ev.icon + " " + ev.name : "🎬 " + ev.title) + '</h2><span style="width:60px"></span></div>' +
    '<div style="text-align:center;padding:30px 16px">' +
    '<div style="font-size:38px;margin-bottom:8px">' + (p.type === "boss" ? "🏆" : "🎉") + '</div>' +
    '<div style="font-size:16px;color:var(--gold);font-family:\'Kaiti SC\',serif;margin-bottom:10px">' + (p.type === "boss" ? ev.win : "剧情完成！") + '</div>' +
    '<div style="font-size:13px;color:var(--dim);margin-bottom:6px">✨ 修炼值 ' + xp + (first ? "（首次）" : "（复习）") + '</div>' +
    '<div style="font-size:12px;color:var(--paper);margin:10px 0">涉及知识点：<b style="color:var(--gold)">' + esc(ev.learn) + '</b></div></div>' +
    '<div style="display:flex;gap:10px">' +
    '<button onclick="rkOpenSearch(\'' + ev.learn.replace(/'/g, "") + '\')" style="flex:1;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">📚 学这个考点</button>' +
    '<button onclick="goHome()" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:var(--paper);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">🏠 回首页</button></div>';
  $(p.type === "story" ? "screen-story" : "screen-boss").innerHTML = html;
  showScreen(p.type === "story" ? "screen-story" : "screen-boss");
}

/* ================= 挣值仪表盘 ================= */
function rkOpenEVM() {
  var html = rkHeader("📊 挣值仪表盘");
  html += '<div style="font-size:12px;color:var(--dim);margin-bottom:12px;line-height:1.8">拖动滑块，亲手感受 <b style="color:var(--gold)">PV / EV / AC</b> 的含义——<b>先理解变量，再记公式</b>。</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
    '<button onclick="rkEVMSet(100,100,100)" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--paper)">正常</button>' +
    '<button onclick="rkEVMSet(100,80,90)" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--paper)">进度落后</button>' +
    '<button onclick="rkEVMSet(100,100,120)" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--paper)">成本超支</button>' +
    '<button onclick="rkEVMSet(100,70,90)" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--paper)">又慢又贵</button>' +
    '<button onclick="rkEVMSet(100,120,100)" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;color:var(--paper)">又快又省</button></div>';
  html += '<div id="rkEVM" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px 16px">' +
    rkEVMSlider("pv", "PV 计划完成价值", "按计划本该完成的活儿值多少钱（万）") +
    rkEVMSlider("ev", "EV 实际完成价值", "真正干完的活儿值多少钱（万）") +
    rkEVMSlider("ac", "AC 实际成本", "实际花出去多少钱（万）") +
    '<div id="rkEVMOut" style="margin-top:12px"></div></div>';
  html += '<div style="font-size:11px;color:var(--dim);line-height:1.9;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;margin-top:10px">' +
    '🧠 记忆锚点：<b style="color:var(--gold)">PV=计划值 / EV=挣到值 / AC=花掉的钱</b><br>' +
    'SV=EV−PV（进度偏差）· CV=EV−AC（成本偏差）<br>' +
    'SPI=EV/PV（进度指数）· CPI=EV/AC（成本指数）<br>' +
    'EAC（典型）=BAC/CPI · EAC（非典型）=AC+BAC−EV</div>';
  $("screen-evm").innerHTML = html;
  showScreen("screen-evm");
  rkEVMUpdate();
}
function rkEVMSlider(id, label, desc) {
  return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px">' +
    '<span style="color:var(--gold)">' + label + '</span><span id="rk' + id + 'v" style="color:var(--paper)">100万</span></div>' +
    '<div style="font-size:10px;color:var(--dim);margin:2px 0 4px">' + desc + '</div>' +
    '<input id="rk' + id + '" class="rk-slider" type="range" min="0" max="150" step="5" value="100" oninput="rkEVMUpdate()" style="width:100%;accent-color:var(--gold)"></div>';
}
function rkEVMSet(pv, ev, ac) {
  $("rkpv").value = pv; $("rkev").value = ev; $("rkac").value = ac;
  rkEVMUpdate();
}
function rkEVMUpdate() {
  var pv = parseInt($("rkpv").value), ev = parseInt($("rkev").value), ac = parseInt($("rkac").value);
  $("rkpv" + "v").textContent = pv + "万"; $("rkevv").textContent = ev + "万"; $("rkacv").textContent = ac + "万";
  var sv = ev - pv, cv = ev - ac;
  var spi = pv ? (ev / pv) : 0, cpi = ac ? (ev / ac) : 0;
  var eacTyp = cpi ? Math.round(100 / cpi) : 0;
  function fmt(x) { return (Math.round(x * 100) / 100); }
  var sState = spi > 1.01 ? "✅ 进度超前" : spi < 0.99 ? "⚠️ 进度落后" : "➖ 进度正常";
  var cState = cpi > 1.01 ? "✅ 成本节约" : cpi < 0.99 ? "⚠️ 成本超支" : "➖ 成本正常";
  var w = Math.min(150, Math.max(pv, ev, ac));
  function bar(id, v, color) {
    return '<div style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:11px"><span style="width:64px;color:var(--dim)">' + id + '</span>' +
      '<div style="flex:1;height:10px;background:rgba(255,255,255,.07);border-radius:5px;overflow:hidden"><i style="display:block;height:100%;width:' + Math.round(v / w * 100) + '%;background:' + color + ';border-radius:5px"></i></div>' +
      '<span style="width:44px;text-align:right;color:var(--paper)">' + v + '万</span></div>';
  }
  var out = bar("PV", pv, "rgba(217,180,91,.8)") + bar("EV", ev, "var(--jade)") + bar("AC", ac, "var(--cinnabar)");
  out += '<div style="border-top:1px dashed rgba(255,255,255,.15);margin-top:8px;padding-top:8px;font-size:12px;line-height:2">' +
    '<div>SV = ' + ev + ' − ' + pv + ' = <b style="color:' + (sv >= 0 ? "var(--jade)" : "var(--cinnabar)") + '">' + sv + '</b> · SPI = ' + fmt(spi) + ' → ' + sState + '</div>' +
    '<div>CV = ' + ev + ' − ' + ac + ' = <b style="color:' + (cv >= 0 ? "var(--jade)" : "var(--cinnabar)") + '">' + cv + '</b> · CPI = ' + fmt(cpi) + ' → ' + cState + '</div>' +
    '<div style="color:var(--dim)">按当前效率 EAC ≈ 100 ÷ ' + fmt(cpi) + ' ≈ <b style="color:var(--gold)">' + eacTyp + '万</b></div></div>';
  $("rkEVMOut").innerHTML = out;
}

/* ================= 知识对决（易混辨析升级） ================= */
var RK_DUEL_SCENES = {
  "项目章程 vs 项目管理计划": { scene: "你刚被任命为项目经理，老板签署了一份文件，正式授权你调兵遣将、使用公司资源。这份文件是？", ans: 0 },
  "赶工 vs 快速跟进": { scene: "上线日期逼近，你把原本串行执行的「开发→测试」改为边开发边测试、并行推进。你用了什么方法？", ans: 1 },
  "增量备份 vs 差分备份": { scene: "周一做全量备份，周二到周日每天都只备份当天变化的数据（各自独立、不与全量比）。这是？", ans: 0 },
  "范围蔓延 vs 镀金": { scene: "客户没提任何要求，开发小张觉得'加上这个功能更酷'，悄悄加进了系统。这是？", ans: 1 },
  "应急储备 vs 管理储备": { scene: "你为「已识别的风险」（如接口审批延迟）预留了一笔时间与资金缓冲。这是？", ans: 0 },
  "总浮动 vs 自由浮动": { scene: "某活动延误3天：不影响项目总工期，但会让它的紧后活动推迟开始。这3天是它的？", ans: 1 },
  "质量管理 QA vs QC": { scene: "QA小组每周审计开发流程是否按规范执行，目的是提前预防缺陷。这是？", ans: 0 },
  "资源平衡 vs 资源平滑": { scene: "为了不让资源需求超出可用量，你调整了非关键活动的开始时间，关键路径没变。这是？", ans: 1 },
  "配置管理 vs 变更管理": { scene: "开发修了个bug，你要求所有文档、基线、版本号同步更新，保证产物可追溯。这是？", ans: 0 },
  "确认范围 vs 控制质量": { scene: "模块开发完，你请客户对照验收标准逐项签字确认。这是？", ans: 0 },
  "项目 vs 运营": { scene: "公司组织一次性的「智慧城市平台建设」，有明确开始和结束时间，干完团队就解散。这是？", ans: 0 },
  "典型偏差 vs 非典型偏差": { scene: "成本偏差是持续性的（效率不会变好），你要预测最终总成本，该用哪个公式？", ans: 0 }
};
var RK_DUEL = null;
function rkDuelBuild() {
  var pairs = [];
  KNOWLEDGE.forEach(function (c) { (c.compares || []).forEach(function (x) { pairs.push(x); }); });
  var qs = pairs.map(function (x) {
    var sc = RK_DUEL_SCENES[x.title];
    var q = { title: x.title, a: x.a, b: x.b, aDesc: x.aDesc, bDesc: x.bDesc, mnemonic: x.mnemonic || "" };
    if (sc) { q.scene = sc.scene; q.ans = sc.ans; }
    else { q.scene = "项目中出现了一种情况，请判断它对应哪个概念：\n「" + x.aDesc + "」"; q.ans = 0; }
    return q;
  });
  for (var i = qs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = qs[i]; qs[i] = qs[j]; qs[j] = t; }
  return qs.slice(0, 8);
}
function rkOpenDuel() {
  RK_DUEL = { qs: rkDuelBuild(), qi: 0, score: 0, streak: 0, maxStreak: 0, correct: 0, answered: false };
  rkDuelRender();
}
function rkDuelRender() {
  var d = RK_DUEL, q = d.qs[d.qi];
  d.answered = false;
  var html = rkHeader("⚔️ 知识对决");
  html += '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-bottom:10px">' +
    '<span>第 ' + (d.qi + 1) + '/' + d.qs.length + ' 题</span><span>🔥 ' + d.streak + ' 连击 · 💯 ' + d.score + '</span></div>';
  html += '<div style="background:rgba(217,180,91,.1);border:1px solid rgba(217,180,91,.4);border-radius:12px;padding:14px 16px;margin-bottom:12px;font-size:13px;line-height:1.9;white-space:pre-line">🧩 ' + esc(q.scene) + '</div>';
  html += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px">⚔️ 这是哪个概念？</div>';
  html += '<div onclick="rkDuelPick(0)" id="rkduel-a" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:13px 14px;margin-bottom:8px;cursor:pointer;font-size:13px">🅰️ ' + esc(q.a) + '</div>';
  html += '<div onclick="rkDuelPick(1)" id="rkduel-b" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:13px 14px;margin-bottom:8px;cursor:pointer;font-size:13px">🅱️ ' + esc(q.b) + '</div>';
  html += '<div id="rkduel-fb" style="display:none;font-size:12px;line-height:1.8;border-radius:10px;padding:12px 14px;margin-top:4px"></div>';
  $("screen-duel").innerHTML = html;
  showScreen("screen-duel");
}
function rkDuelPick(i) {
  var d = RK_DUEL, q = d.qs[d.qi];
  if (d.answered) return;
  d.answered = true;
  var ok = i === q.ans;
  var aEl = $("rkduel-a"), bEl = $("rkduel-b");
  if (q.ans === 0) { aEl.style.borderColor = "var(--jade)"; aEl.style.background = "rgba(74,157,124,.12)"; }
  else { bEl.style.borderColor = "var(--jade)"; bEl.style.background = "rgba(74,157,124,.12)"; }
  if (!ok) { (i === 0 ? aEl : bEl).style.borderColor = "var(--cinnabar)"; }
  if (ok) {
    d.correct++; d.streak++; if (d.streak > d.maxStreak) d.maxStreak = d.streak;
    d.score += 10 + d.streak * 2;
    rkAddXP(2, "对决胜出");
  } else { d.streak = 0; }
  var fb = $("rkduel-fb");
  fb.style.display = "block";
  fb.style.border = "1px solid " + (ok ? "var(--jade)" : "var(--cinnabar)");
  fb.style.background = ok ? "rgba(74,157,124,.1)" : "rgba(192,80,60,.1)";
  fb.innerHTML = '<div style="color:' + (ok ? "var(--jade)" : "var(--cinnabar)") + ';font-weight:600">' + (ok ? "✅ 判断正确！+" + (10 + d.streak * 2) : "❌ 判断错误") + '</div>' +
    '<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:11px">' +
    '<tr><th style="border:1px solid rgba(255,255,255,.12);padding:6px;color:var(--gold)">' + esc(q.a) + '</th><th style="border:1px solid rgba(255,255,255,.12);padding:6px;color:var(--gold)">' + esc(q.b) + '</th></tr>' +
    '<tr><td style="border:1px solid rgba(255,255,255,.12);padding:6px;line-height:1.6">' + esc(q.aDesc) + '</td><td style="border:1px solid rgba(255,255,255,.12);padding:6px;line-height:1.6">' + esc(q.bDesc) + '</td></tr></table>' +
    (q.mnemonic ? '<div style="color:var(--gold);margin-top:6px">📜 口诀：' + esc(q.mnemonic) + '</div>' : '') +
    '<button onclick="rkDuelNext()" style="width:100%;margin-top:10px;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:9px 0;font-size:13px;cursor:pointer;font-family:inherit">' + (d.qi + 1 >= d.qs.length ? "🏁 查看战绩" : "下一题 →") + '</button>';
}
function rkDuelNext() {
  RK_DUEL.qi++;
  if (RK_DUEL.qi >= RK_DUEL.qs.length) { rkDuelResult(); return; }
  rkDuelRender();
}
function rkDuelResult() {
  var d = RK_DUEL, total = d.qs.length, ratio = d.correct / total;
  var stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
  var best = parseInt(localStorage.getItem("rk2_duel_best") || "0");
  if (d.score > best) localStorage.setItem("rk2_duel_best", String(d.score));
  var html = rkHeader("⚔️ 知识对决");
  html += '<div style="text-align:center;padding:30px 16px 10px">' +
    '<div style="font-size:38px;color:var(--gold);margin-bottom:6px">' + (stars === 3 ? "★★★" : stars === 2 ? "★★☆" : "★☆☆") + '</div>' +
    '<div style="font-size:14px;color:var(--paper);margin-bottom:8px">答对 <b style="color:var(--jade)">' + d.correct + '</b> / ' + total + '</div>' +
    '<div style="font-size:12px;color:var(--dim)">💯 ' + d.score + ' 分 · 🔥 最大连击 ' + d.maxStreak + ' · 🏅 历史最佳 ' + best + '</div></div>' +
    '<div style="display:flex;gap:10px;margin-top:18px">' +
    '<button onclick="rkOpenDuel()" style="flex:1;background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">🔁 再来一局</button>' +
    '<button onclick="openCompare()" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:var(--paper);border-radius:10px;padding:10px 0;font-size:14px;cursor:pointer;font-family:inherit">📖 辨析表</button></div>';
  $("screen-duel").innerHTML = html;
  showScreen("screen-duel");
}

/* ================= 口诀速记升级：修炼模式 ================= */
function rkTipsAll() {
  var tips = [];
  KNOWLEDGE.forEach(function (c) { (c.points || []).forEach(function (p) { if (p.mnemonic) tips.push({ m: p.mnemonic, t: p.title, cat: c.cat }); }); });
  return tips;
}
function rkTipsHome() {
  var html = rkHeader("📜 口诀速记");
  html += '<div style="display:flex;gap:8px;margin-bottom:12px">' +
    '<button id="rk-tab-train" onclick="rkTipsTab(\'train\')" style="flex:1;background:rgba(217,180,91,.15);border:1px solid rgba(217,180,91,.5);color:var(--gold);border-radius:10px;padding:9px 0;font-size:14px;cursor:pointer;font-family:inherit">🧘 修炼</button>' +
    '<button id="rk-tab-flip" onclick="rkTipsTab(\'flip\')" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:var(--dim);border-radius:10px;padding:9px 0;font-size:14px;cursor:pointer;font-family:inherit">📜 翻卡</button></div>' +
    '<div id="rk-tips-body"></div>';
  $("screen-tips").innerHTML = html;
  rkTipsTab("train");
  showScreen("screen-tips");
}
function rkTipsTab(t) {
  var a = $("rk-tab-train"), b = $("rk-tab-flip");
  var on = "rgba(217,180,91,.15)", off = "rgba(255,255,255,.04)";
  if (a) { a.style.background = t === "train" ? on : off; a.style.color = t === "train" ? "var(--gold)" : "var(--dim)"; a.style.borderColor = t === "train" ? "rgba(217,180,91,.5)" : "rgba(255,255,255,.12)"; }
  if (b) { b.style.background = t === "flip" ? on : off; b.style.color = t === "flip" ? "var(--gold)" : "var(--dim)"; b.style.borderColor = t === "flip" ? "rgba(217,180,91,.5)" : "rgba(255,255,255,.12)"; }
  if (t === "train") rkTipsTrain(); else rkTipsFlip();
}
function rkTipsFlip() {
  var tips = rkTipsAll();
  var html = '<div style="font-size:12px;color:var(--dim);margin-bottom:12px">共 ' + tips.length + ' 条口诀 · 点击卡片翻面看考点</div>';
  tips.forEach(function (t) {
    html += '<div class="tip-card" onclick="this.classList.toggle(\'flipped\')" style="background:rgba(255,255,255,.05);border:1px solid rgba(217,180,91,.3);border-radius:12px;padding:14px 16px;margin-bottom:10px;cursor:pointer;position:relative">' +
      '<div style="position:absolute;top:8px;right:10px;font-size:10px;color:var(--dim)">翻面</div>' +
      '<div class="tip-front" style="font-family:\'Kaiti SC\',serif;color:var(--gold);font-size:14px">📜 ' + esc(t.m) + '</div>' +
      '<div class="tip-back" style="display:none;font-size:12px;color:var(--dim);margin-top:8px;line-height:1.7;border-top:1px dashed rgba(255,255,255,.15);padding-top:8px">【' + esc(t.cat) + '】' + esc(t.t) + '</div></div>';
  });
  $("rk-tips-body").innerHTML = html;
}
function rkMnTokens(mn) {
  var toks = mn.split(/[→、,，]/).map(function (t) { return t.trim(); }).filter(function (t) { return t; });
  if (toks.length <= 1) toks = mn.split("").filter(function (t) { return t.trim(); });
  return toks;
}
function rkTipsState() { return rkLSGet("rk2_tips", {}); }
function rkTipsTrain() {
  var tips = rkTipsAll();
  var st = rkTipsState(), today = rkToday();
  var list = tips.map(function (t) {
    var s = st[t.m] || { stage: 1, due: today };
    var overdue = s.due < today;
    var dueDays = s.due === today ? 0 : s.due < today ? -1 : Math.round((new Date(s.due) - new Date(today)) / 86400000);
    return { m: t.m, t: t.t, stage: s.stage, due: s.due, overdue: overdue, dueDays: dueDays };
  });
  list.sort(function (a, b) {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    if (a.dueDays !== b.dueDays) return a.dueDays - b.dueDays;
    return a.stage - b.stage;
  });
  var dueN = list.filter(function (x) { return x.overdue || x.dueDays === 0; }).length;
  var html = '<div style="font-size:12px;color:var(--dim);margin-bottom:10px">口诀三阶修炼：完整 → 挖空 → 背诵，按记忆曲线隔天重现。今天到期 <b style="color:var(--gold)">' + dueN + '</b> 条</div>';
  list.slice(0, 30).forEach(function (x) {
    var stageTxt = x.stage === 1 ? "完整" : x.stage === 2 ? "挖空" : "背诵";
    var dueTxt = x.overdue ? "🔴 到期" : x.dueDays === 0 ? "🟡 今天" : x.dueDays === 1 ? "明天" : x.dueDays + "天后";
    var prev = rkMnTokens(x.m);
    var shown = x.stage === 1 ? prev.join(" → ") : x.stage === 2 ? rkMnBlanks(prev).join(" → ") : "？".repeat(Math.min(prev.length, 12));
    html += '<div style="background:rgba(255,255,255,.04);border:1px solid ' + (x.overdue ? "rgba(192,80,60,.5)" : "rgba(255,255,255,.1)") + ';border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer" onclick="rkTipsPractice(\'' + x.m.replace(/'/g, "") + '\')">' +
      '<div style="display:flex;justify-content:space-between;font-size:11px"><span style="color:var(--gold)">' + esc(x.t) + '</span><span style="color:' + (x.overdue ? "var(--cinnabar)" : "var(--dim)") + '">' + dueTxt + ' · 阶段' + x.stage + '(' + stageTxt + ')</span></div>' +
      '<div style="font-size:13px;color:var(--paper);margin-top:6px;font-family:\'Kaiti SC\',serif">' + esc(shown) + '</div></div>';
  });
  html += '<div style="font-size:11px;color:var(--dim);line-height:1.8;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;margin-top:4px">💡 记住了→进阶+延期重现；没记住→退回阶段1、明天再见。<br>每进阶一次 +5 修炼值。</div>';
  $("rk-tips-body").innerHTML = html;
}
function rkMnBlanks(toks) {
  // 隔一个挖一个，返回带 ____ 的数组
  return toks.map(function (t, i) { return (i % 2 === 1) ? "____" : t; });
}
function rkTipsPractice(mn) {
  var tip = rkTipsAll().find(function (x) { return x.m === mn; });
  if (!tip) return;
  var st = rkTipsState();
  var s = st[mn] || { stage: 1, due: rkToday() };
  RK_TIP = { m: mn, t: tip.t, cat: tip.cat, stage: s.stage, phase: 0 };
  rkTipRender();
}
var RK_TIP = null;
function rkTipRender() {
  var p = RK_TIP;
  var toks = rkMnTokens(p.m);
  var html = rkHeader("🧘 口诀修炼");
  html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:18px 16px;margin-bottom:12px">' +
    '<div style="font-size:11px;color:var(--dim);margin-bottom:8px">【' + esc(p.cat) + '】' + esc(p.t) + ' · 阶段' + p.stage + '</div>';
  if (p.stage === 1) {
    html += '<div style="font-size:18px;color:var(--gold);font-family:\'Kaiti SC\',serif;line-height:2;text-align:center">📜 ' + esc(toks.join(" → ")) + '</div>';
  } else if (p.stage === 2) {
    var blanks = rkMnBlanks(toks);
    var blankTok = toks.filter(function (t, i) { return i % 2 === 1; });
    var pool = blankTok.slice(); for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t2 = pool[i]; pool[i] = pool[j]; pool[j] = t2; }
    RK_TIP.pool = pool; RK_TIP.filled = blankTok.map(function () { return ""; });
    html += '<div id="rk-tip-line" style="font-size:16px;color:var(--paper);font-family:\'Kaiti SC\',serif;line-height:2.2;text-align:center">' +
      blanks.map(function (b, i) { return b === "____" ? '<button id="rk-tip-slot-' + (i / 2 | 0) + '" onclick="rkTipSlotBack(' + (i / 2 | 0) + ')" style="background:rgba(255,255,255,.08);border:1px dashed var(--gold);color:var(--gold);border-radius:6px;padding:2px 10px;min-width:52px;font-size:14px;font-family:inherit;cursor:pointer;margin:0 2px">____</button>' : esc(b); }).join(" → ") + '</div>';
    html += '<div style="font-size:11px;color:var(--dim);margin:10px 0 6px">🧩 词池（点击填入，再点空格可收回）：</div><div id="rk-tip-pool" style="text-align:center">' +
      pool.map(function (t, i) { return '<button id="rk-tip-chip-' + i + '" onclick="rkTipChip(' + i + ')" style="background:rgba(255,255,255,.06);border:1px solid rgba(217,180,91,.45);color:var(--paper);border-radius:8px;padding:7px 12px;font-size:13px;cursor:pointer;font-family:inherit;margin:4px">' + esc(t) + '</button>'; }).join("") + '</div>' +
      '<div style="text-align:center;margin-top:10px"><button id="rk-tip-check" onclick="rkTipCheck()" disabled style="background:rgba(74,157,124,.2);border:1px solid var(--jade);color:var(--jade);border-radius:10px;padding:8px 26px;font-size:13px;cursor:pointer;font-family:inherit;opacity:.4">✅ 核对</button></div>';
  } else {
    html += '<div style="font-size:14px;color:var(--paper);text-align:center;margin-bottom:8px">🧠 不看口诀，你能背出来吗？</div>' +
      '<div id="rk-tip-answer" style="display:none;font-size:18px;color:var(--gold);font-family:\'Kaiti SC\',serif;line-height:2;text-align:center">📜 ' + esc(toks.join(" → ")) + '</div>' +
      '<div style="text-align:center;margin-top:10px"><button onclick="rkTipShowAnswer()" style="background:rgba(217,180,91,.2);border:1px solid var(--gold);color:var(--gold);border-radius:10px;padding:8px 26px;font-size:13px;cursor:pointer;font-family:inherit">👁️ 显示答案</button></div>';
  }
  html += '</div>';
  html += '<div style="display:flex;gap:10px">' +
    '<button onclick="rkTipRate(true)" style="flex:1;background:rgba(74,157,124,.2);border:1px solid var(--jade);color:var(--jade);border-radius:10px;padding:11px 0;font-size:14px;cursor:pointer;font-family:inherit">👍 记住了</button>' +
    '<button onclick="rkTipRate(false)" style="flex:1;background:rgba(192,80,60,.2);border:1px solid var(--cinnabar);color:var(--cinnabar);border-radius:10px;padding:11px 0;font-size:14px;cursor:pointer;font-family:inherit">👎 没记住</button></div>' +
    '<div style="font-size:11px;color:var(--dim);text-align:center;margin-top:10px">点「记住了」进阶（完整→挖空→背诵）并按 1/3/7 天重现；点「没记住」退回阶段1、明天再练。</div>';
  $("screen-tips").innerHTML = html;
  showScreen("screen-tips");
}
function rkTipChip(i) {
  var p = RK_TIP; if (!p.filled) return;
  for (var k = 0; k < p.filled.length; k++) {
    if (!p.filled[k]) {
      p.filled[k] = p.pool[i];
      var slot = $("rk-tip-slot-" + k); if (slot) slot.textContent = p.pool[i];
      var chip = $("rk-tip-chip-" + i); if (chip) { chip.style.opacity = ".25"; chip.style.pointerEvents = "none"; }
      rkTipCheckEnable();
      return;
    }
  }
}
function rkTipSlotBack(k) {
  var p = RK_TIP; if (!p.filled) return;
  if (!p.filled[k]) return;
  var tok = p.filled[k];
  p.filled[k] = "";
  var slot = $("rk-tip-slot-" + k); if (slot) slot.textContent = "____";
  var idx = p.pool.indexOf(tok);
  if (idx >= 0) { var chip = $("rk-tip-chip-" + idx); if (chip) { chip.style.opacity = "1"; chip.style.pointerEvents = "auto"; } }
  rkTipCheckEnable();
}
function rkTipCheckEnable() {
  var p = RK_TIP, btn = $("rk-tip-check");
  if (!btn) return;
  var full = p.filled.every(function (f) { return !!f; });
  btn.disabled = !full; btn.style.opacity = full ? "1" : ".4";
}
function rkTipCheck() {
  var p = RK_TIP;
  var blanks = rkMnTokens(p.m).filter(function (t, i) { return i % 2 === 1; });
  var allOk = p.filled.every(function (f, i) { return f === blanks[i]; });
  var fb = $("rk-tip-check");
  fb.textContent = allOk ? "✅ 全部填对！" : "❌ 有填错的，红色标出";
  fb.style.borderColor = allOk ? "var(--jade)" : "var(--cinnabar)";
  fb.style.color = allOk ? "var(--jade)" : "var(--cinnabar)";
  blanks.forEach(function (b, i) {
    var slot = $("rk-tip-slot-" + i);
    if (slot && p.filled[i] !== b) { slot.style.borderColor = "var(--cinnabar)"; slot.style.color = "var(--cinnabar)"; }
  });
}
function rkTipShowAnswer() {
  $("rk-tip-answer").style.display = "block";
}
function rkTipRate(ok) {
  var p = RK_TIP;
  var st = rkTipsState();
  var s = st[p.m] || { stage: 1, due: rkToday() };
  var today = rkToday();
  if (ok) {
    s.stage = Math.min(3, s.stage + 1);
    var intv = s.stage === 2 ? 1 : s.stage === 3 ? 3 : 7;
    var d = new Date(); d.setDate(d.getDate() + (s.stage === 3 ? 7 : intv));
    s.due = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var ups = rkLSGet("rk2_tips_up", {});
    if (!ups[p.m]) { ups[p.m] = true; rkLSSet("rk2_tips_up", ups); rkAddXP(5, "口诀进阶"); }
  } else {
    s.stage = 1;
    var d2 = new Date(); d2.setDate(d2.getDate() + 1);
    s.due = d2.getFullYear() + "-" + String(d2.getMonth() + 1).padStart(2, "0") + "-" + String(d2.getDate()).padStart(2, "0");
  }
  st[p.m] = s;
  rkLSSet("rk2_tips", st);
  toast(ok ? "👍 进阶成功！" : "👎 退回阶段1，明天再练");
  rkTipsHome();
}
