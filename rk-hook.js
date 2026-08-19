/* ============================================================
   轻量跨页钩子（训练场用）
   供 顺序闯关/过程组闯关/输入输出闯关/开展节点闯关 四个独立页面使用：
   通关时给「项目管理修炼世界」的修炼值记账（rk2_player/rk2_games）。
   不依赖 DOM，不依赖 world.js，任意页面可安全加载。
   ============================================================ */
function rkGameDone(type, id, title, wrong) {
  try {
    var g = JSON.parse(localStorage.getItem("rk2_games") || "{}");
    if (!g.done) g.done = {};
    var key = type + ":" + id;
    var first = !g.done[key];
    g.done[key] = true;
    localStorage.setItem("rk2_games", JSON.stringify(g));
    var s = JSON.parse(localStorage.getItem("rk2_player") || "{}");
    s.xp = (s.xp || 0) + (first ? 20 : 5);
    localStorage.setItem("rk2_player", JSON.stringify(s));
  } catch (e) {}
}
