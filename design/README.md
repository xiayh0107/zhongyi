# Design · 设计交付物

> 设计团队对 Fast Memory · 中医卷 的首轮设计探索。两个视觉方向（A / B），各覆盖桌面 + 手机。

## 这是什么

一份**可交互**的设计稿——不是 Figma 静态图，而是用 React + Babel-in-browser 跑起来的真实 HTML。你可以在浏览器里看到所有页面、切换变体、对比 A/B。

设计师明显深读了 [`../docs/_meta/design-brief.md`](../docs/_meta/design-brief.md)，**反模式都自觉避开**（代码注释里直接写 "NO timer, NO score, NOT percentage"）。

## 怎么打开看

```bash
# 在 Mac 上最简单
cd design
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

或者直接双击 `index.html`（部分浏览器会拦截 CDN 加载，建议用 server）。

打开后右侧有 **Tweaks 面板**：
- 切换是否显示变体 A / B / Design System
- 切换桌面 / 手机视图
- 拖拽抓手可重排画板
- 双击任一画板可全屏聚焦

## 文件结构

```
design/
├── README.md             ← 你在这里
├── REVIEW.md             ← 对照 design-brief 的逐项评审
├── index.html            ← 入口，挂载所有变体
│
├── tokens.jsx            ← 设计 tokens（两套色板共用 4 档 tier 语义）
├── design-system.jsx     ← 设计系统总览页（色板 / 字体 / 状态条 / 组件基元）
├── design-canvas.jsx     ← 多画板布局容器
├── tweaks-panel.jsx      ← 右侧可调节面板
│
├── a-home.jsx            ← 变体 A · F04 主页（桌面 + 手机）
├── a-node.jsx            ← 变体 A · F01 节点页（桌面 + 手机）
├── a-quiz.jsx            ← 变体 A · F03 题目流（桌面 + 手机）
│
├── b-home.jsx            ← 变体 B · F04 主页（桌面 + 手机）
├── b-node.jsx            ← 变体 B · F01 节点页（桌面 + 手机）
└── b-quiz.jsx            ← 变体 B · F03 题目流（桌面 + 手机）
```

**注**：`uploads/` 目录是设计师上传到 AI 工具的文档副本（design-brief 等），已被 `.gitignore` 排除——避免与 `docs/` 重复。

## 两个变体的差异

| 维度 | 变体 A · 含蓄专业 | 变体 B · 古典书页 |
|---|---|---|
| 整体调性 | 现代、克制、专业 | 古籍、典雅、中式 |
| 主色 | 松绿 `#365240` | 朱砂 `#8c2e1f` |
| 底色 | 暖米黄 `#f6f2e9` | 宣纸色 `#ece2c9` |
| 中文字体 | 标题宋体 + 正文黑体 | 全宋体 |
| 数字字体 | JetBrains Mono | JetBrains Mono（共用） |
| 排版风格 | 现代网格、对称 | 古籍非对称、竖向中文标签 |
| 应用名 | Fast Memory · 中医 | 速记 · 中医卷 |
| 题号 | 阿拉伯数字 | 中文数字（一、二、三...） |

**两者共用**：
- 4 档状态系统（未学/学过/熟练/衰减中）
- 状态条形（横向，长度即强度，色 + ▼ 双重编码）
- 7 种题型的反馈机制
- F01/F03/F04 三个页面的信息架构

详细对比和推荐见 [`REVIEW.md`](REVIEW.md)。

## 状态可视化系统（升级版）

设计师在 design-brief 基础上做了一个**升级**：

**design-brief 原定**：状态用 ○ ● 等符号 + 颜色双重编码
**设计师交付**：横向**强度条**（length = strength）+ 颜色 + 衰减附 ▼

升级的好处：
- 信息密度更高——一眼看到具体强度，不只是档位
- 网格列表对齐更整齐
- 仍然色盲友好（▼ 是非颜色编码）

我们决定**采用设计师的升级版**——更符合"信息密度高"的视觉风格方向。

`design-brief.md` 中的符号系统将在下一版更新中同步。

## 给开发的关键文件

实现时 **直接复用** 的：

1. **`tokens.jsx`** — 完整设计 tokens（两套色板 + 4 档 tier 定义）
   - 复制到 `src/design/tokens.ts`，转 TypeScript 即可
2. **`StatusBar` / `TierDot` / `StrengthRow` 组件**（在 tokens.jsx 末尾）
   - 这三个组件是状态系统的核心，原样移植
3. **`design-system.jsx`** 中的 `PrimaryBtn` / `SecondaryBtn` / `GhostBtn` / `LinkBtn` / `NodeCard` / `WikiLink`
   - 组件基元，按需迁移到 Tailwind + Radix
4. **`tierFromStrength(s, everReached)`** 函数
   - 强度 → 档位映射，可直接复用

## 这不是终稿

这是首轮设计探索，目的是：
1. 确认整体视觉方向（A / B / 其他）
2. 验证关键组件（状态条、节点卡、双向链接）
3. 测试 design-brief 的可执行性

后续可能的迭代：
- 确认变体后，做更多状态（空状态、错误态、加载态）
- 白纸召回（F05）UI——本轮未覆盖
- 知识地图的高密度版（节点 > 100 时的呈现）
- 暗色模式（MVP 后）

## 评审 / 反馈

完整评审在 [`REVIEW.md`](REVIEW.md)。

如果你想反馈，请在评审文档对应章节加批注，或在仓库开 issue。
