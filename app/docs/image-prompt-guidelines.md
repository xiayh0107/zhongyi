# Image Prompt Guidelines

This app is a TCM knowledge map and spaced-repetition system. Images should help users remember concepts, relationships, and recall structures. They should not act as decorative hero art.

## Best-Fit Image Types

Use `gpt-image-2` mainly for these prompt families:

1. Knowledge structure diagrams
   - Best for single nodes such as `heart`, `liver`, `wind-evil`, `chai-hu`.
   - Show core functions, attributes, relationships, and clinical cues.

2. Relationship maps
   - Best for `five-elements`, `yin-yang`, `heart-kidney-相交`, `liver-kidney-同源`.
   - Show arrows, dependency, opposition, generation, restraint, or paired relationships.

3. Recall scaffold cards
   - Best for review and white-paper recall flows.
   - Show the structure users should recall: functions, attributes, relations, disease patterns, clinical application.
   - Avoid revealing too much answer detail when used before recall.

Avoid these image types unless a feature explicitly needs them:

- Commercial posters.
- Character design sheets.
- Decorative landing-page hero images.
- Mystical or fantasy-style TCM art.
- Realistic anatomy images, especially for organs.
- Dense text posters that compete with the app content.

## Visual Direction

Match the current UI tokens in `src/design/tokens.ts`:

- Background: warm paper, `#f6f2e9`.
- Surface: rice paper / card, `#fbf8f1` or white.
- Text: deep ink, `#1f1c17`.
- Accent: pine green, `#365240`.
- Secondary accents: muted blue-green, ochre, low-saturation red.

The output should feel like a modern study diagram, not a medical advertisement or a fantasy illustration.

## General Prompt Template

```text
一张干净、克制、适合中医学习 App 使用的教育类知识结构图，讲解「{知识节点标题}」。

整体风格：
- 现代极简信息图
- 温润纸感背景 #f6f2e9
- 白色或米白卡片 #fbf8f1
- 深墨色文字 #1f1c17
- 点缀色使用松绿色 #365240、低饱和蓝绿、赭色
- 不要卡通，不要玄幻，不要廉价国风，不要过度装饰

内容要求：
- 根据该知识点自动组织信息结构
- 优先表现“关系”和“记忆线索”，而不是堆文字
- 中文文字必须简短、清晰、可读
- 每个模块只放标题 + 1 行说明
- 保留大量留白，层级清楚

布局要求：
- 如果是概念类：中心概念 + 4 到 6 个环绕模块
- 如果是五行/阴阳类：使用环形或对称关系图
- 如果是脏腑类：使用主功能 + 系统联系 + 临床提示三层结构
- 如果是病邪类：使用性质、致病特点、常见表现、辨别线索四组模块

输出比例：
- 16:9 横版，适合嵌入网页节点页
```

## Example: Five Elements

```text
一张中医学习用的五行关系信息图，主题是「五行学说」。

画面中心是一个清晰的五行环形图：
木、火、土、金、水五个节点均匀分布。
使用实线箭头表示相生：木 → 火 → 土 → 金 → 水 → 木。
使用细虚线箭头表示相克：木 → 土 → 水 → 火 → 金 → 木。
每个五行节点旁标注对应五脏：
木=肝，火=心，土=脾，金=肺，水=肾。

右侧或下方加入两个小模块：
- 相乘：相克太过
- 相侮：反向克制

风格：现代极简中医知识图谱，温润纸感背景，克制配色，适合长期学习阅读。
中文文字简短清楚，不要复杂纹样，不要神秘玄学风，不要人物插画。
16:9 横版。
```

## Example: Zang-Fu Node

```text
一张中医脏腑知识卡，主题是「心」。

中心放置「心」作为主节点，周围分成三组信息：
1. 主要功能：主血脉、主神志
2. 系统联系：五行属火、在志为喜、在液为汗、在体合脉、其华在面、开窍于舌、通应夏季
3. 关系节点：与小肠相表里，火生土关联脾，水火既济关联肾，火克金关联肺

要求：
- 像知识地图，不像医学海报
- 文字短，层级强，适合复习扫读
- 背景使用温润纸色，卡片使用米白色
- 使用松绿色、赭色、低饱和蓝色区分关系
- 不要真实心脏照片，不要血腥，不要卡通人物
16:9 横版。
```

## Example: Recall Scaffold

```text
一张白纸召回前使用的中医学习框架图，主题是「{知识节点标题}」。

这张图不是答案图，而是召回提示框架。
画面分为五个空白记忆区域：
1. 功能
2. 属性
3. 关系
4. 病机 / 表现
5. 临床应用

每个区域只放标题和一个淡色图标，不填具体答案。
整体像安静的学习工作纸，适合用户开始回忆前观看。
温润纸感背景，深墨色标题，松绿色细线，留白充足。
不要装饰性插画，不要密集文字，不要给出答案。
16:9 横版。
```

