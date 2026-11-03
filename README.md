# Jigsaw Grid Lab v0.7 — 主玩法配置版

## 启动

```bash
npm install
npm run dev
```

## 本轮改动

- 第一章 **26 个可玩关卡**，仅前 **25 个**对应首页 5×5 拼图；第 26 关是额外关卡，不增加章节碎片。
- 难度值严格使用用户确认的 26 项序列；1–2 为 4×4，3–4 为 6×6，5–6 为 8×8。
- 编辑器配置 `editor/chapter01.json`，节奏模板 `2+1` 和 `3+2` 作为可选标注，不会覆盖逐关难度表。
- 入选关卡快速通关后，点击「下一关」向右展开完整续图，再进入 8×8 金拼图。完成后本关章节碎片获得金边。
- 当前资格判定使用可调整的**本地时间阈值**（`localStorage` 键 `jigsaw-lab-bonus-thresholds-v1`，例如 `{"1":90}`），不伪装成真实玩家前 20% 排名。
- 双击锁定单片或整个组合；再次双击解锁。锁定片不能被移动或推挤。
- 连击达到 ×6 显示持续计数，×10 强化特效；3、4、5、8、11、15、20 级触发渐进式赞语及浏览器合成语音（依赖设备语音支持）。

## 尚待完善 / 已知限制

1. **核心组合推挤仍是候选算法**，尚未逐帧验证与原作一致。
2. **难度为策划目标值**，关卡布局目前是 seeded shuffle，尚未通过求解器验证可解性与难度。
3. 经典主题的隐藏关由 editor/chapter01.json 的 bonus.enabled 指定，使用 public/levels/gold 中的对应右图。
4. 第26关不增加首页进度，需后续决定它的专属结算表现。
5. 首页章节切换的第二章资源/逻辑尚需独立调试整合。
6. 无法在当前环境完成 npm install，构建与移动端实测尚未通过。

## 配置与代码位置

- `src/core/levels.ts`：26关难度和节奏模板
- `src/core/bonus.ts`：金拼图资格、金边存档、连击赞语
- `src/core/engine.ts`：拼图操作和锁定限制
- `src/components/BoardView.tsx`：双击锁定交互
- `src/App.tsx`：三页面流程、Bonus邀请、结算和连击
- `editor/chapter01.json`：策划可读关卡配置

## v0.8 结果页设计

- 参照用户提供的结算截图：完成图片白色叠卡、三列成绩卡、S/A 角标、绿色下一关按钮。
- 难度 1–2 青蓝色成绩板；难度 3–6 紫色渐变成绩板。
- 全 S 时，三列成绩板统一闪光一次；Full Combo 达成时，独立金色字样、扩散光环与星屑动画。
- 无真实玩家分位数据时不展示虚构百分位，使用鼓励文案。
- 评级阈值在 `src/App.tsx` 的 `gradeFor` 中，目前为**演示用的临时数值**，上线前须通过实测调优。
- Full Combo 当前定义为：至少三次产生正确连接的操作，且本局所有有效移动均增加正确连接；这只是临时规则，需要结合最终 Combo 定义确认。
- 支持 `prefers-reduced-motion` 减少动画。


## v0.9: 26 portrait level images
- `public/levels/level-01.jpg` through `level-26.jpg` and `manifest.json` map 1:1 to levels.
- On entering/restarting a level the artwork is selected by level ID; user-uploaded override still works for the current play.
- Portrait canvas is 720×960 (3:4), adapted from the generated **montage**. Since the original was a collage of landscape thumbnails, top/bottom extensions are blurred, NOT newly painted full-detail imagery. Replace with individually generated portrait originals for production.
- Board is 3:4 portrait; logical grid remains 4×4 / 6×6 / 8×8 and uses the same per-piece image-position logic. Pieces are rectangular, not distorted from their underlying image regions.
- Only selected classic levels unlock the authored right-hand panorama panel.
