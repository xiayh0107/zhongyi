---
id: CONTENT-003
type: content
status: reviewed
version: 0.3
created: 2026-05-23
updated: 2026-05-23
related:
  - content-pipeline.md
  - node-catalog.md
  - exam-point-coverage-ledger.md
  - ../05-progress/milestones.md
---

# 中医.docx 覆盖审计

> 目标：回答“`中医.docx` 的考试知识点是否已经进入 app”。这里的“进入”指可被 app 内容 loader 加载，并以节点或题目形式可复习，不等于把原文逐字逐句搬进页面。

## 结论

截至 2026-05-23，本轮按“考试不丢点”的标准完成补齐：源文档中已经识别出的主干理论、病证、方药、针灸、诊断术语和本轮残余显性考点，均已通过节点或题库覆盖。

当前 app 内容校验通过：

| 指标 | 当前值 |
|---|---:|
| 节点 | 186 |
| 题目 | 589 |
| 题库文件 | 18 个 `content/questions/*.json` |
| 反向索引覆盖边 | 98 |

源文档抽取结果：

| 指标 | 当前值 |
|---|---:|
| 源文件 | `/Users/xiayh/Projects/fast-memory/中医.docx` |
| 抽取文本 | `/private/tmp/fast-memory-zhongyi.txt` |
| 行数 | 858 |
| 字数 | 约 36,213 |

## 处理原则

1. 高频主干、可串联的知识点做成节点，例如脏腑、气血津液、六淫、病证、常用方药、针灸操作。
2. 低频但可能考试的名词或配对，至少进入题库，例如代表方、诊断术语、单味药对比。
3. 源文疑似笔误不硬造新节点，写入题目解析或台账备注，例如“酸杏仁”按疑似“酸枣仁”处理。
4. 所有新增内容必须通过 content loader 校验，避免“文件存在但 app 实际加载失败”。

## 本轮补齐

最终补齐批次新增 32 个节点、147 道题，重点覆盖之前残余的显性考试点，以及源文 346-858 行后半段直考问法：

| 范围 | 新增节点 | 新增题目 |
|---|---:|---:|
| 安神药、润肠药、沙参、槐花 | 8 | 18 |
| 心悸、黄疸、水肿代表方 | 12 | 24 |
| 病毒性心肌炎、独语、癃、饭后易困、血之余为发 | 5 | 14 |
| 中风代表方 | 7 | 10 |
| 346-858 行综合直考题 | 0 | 81 |

新增题库文件：

| 文件 | 题量 | 覆盖重点 |
|---|---:|---|
| `content-gap-final-herbs.json` | 18 | 朱砂、合欢皮、磁石、决明子、火麻仁、郁李仁、沙参、槐花 |
| `content-gap-final-formulas.json` | 24 | 心悸、黄疸、水肿的证型-代表方配对 |
| `content-gap-final-diagnostics-syndromes.json` | 14 | 病毒性心肌炎、独语、癃、饭后易困、血之余为发、酸杏仁疑点 |
| `content-gap-final-stroke-formulas.json` | 10 | 大秦艽汤、镇肝熄风汤、至宝丹、羚角钩藤汤、苏合香丸、涤痰汤、参附汤 |
| `content-gap-final-comprehensive.json` | 81 | 源文 346-858 行单选、多选、简答和名词解释中的直考问法 |

## 已覆盖主干

### 基础理论

- 阴阳：互根、转化、壮水制阳、阴阳失调。
- 五行：相生、相克、相乘、相侮、培土生金、水能涵木。
- 整体观念、辨证论治、同病异治、异病同治。
- 八纲：表、里、寒、热、虚、实、阴、阳。

代表节点：`yin-yang`, `five-elements`, `holistic-view`, `syndrome-differentiation`, `eight-principles`, `exterior-interior-cold-heat`。

### 脏腑与关系

- 五脏：心、肝、脾、肺、肾。
- 六腑重点：胃、小肠、大肠、胆、膀胱、三焦。
- 心肾相交、肝肾同源、心肺、肺脾、肺肾、肝肺、脾肾等关系。

代表节点：`heart`, `liver`, `spleen`, `lung`, `kidney`, `stomach`, `small-intestine`, `large-intestine`, `gallbladder`, `bladder`, `san-jiao`, `heart-kidney-相交`, `liver-kidney-同源`。

### 气血津液

- 气的推动、温煦、防御、固摄、气化。
- 气机升降出入、宗气、营气、卫气、元气。
- 气血关系、津血同源、津液生成输布排泄。

代表节点：`qi`, `blood`, `body-fluids`。

### 六淫

- 风、寒、暑、湿、燥、火六淫性质与致病特点。
- 风为百病之长、寒主疼痛、暑多夹湿、湿性重浊黏滞、燥易伤肺、火易生风动血。

代表节点：`wind-evil`, `cold-evil`, `summer-evil`, `damp-evil`, `dryness-evil`, `fire-evil`。

### 诊断与证候

- 舌诊、脉诊、望神、面色、气味、小儿指纹、虚脉。
- 肝气郁结、心火亢盛、脾阳虚、血瘀、心脉痹阻、肝风内动。
- 黄疸、水肿、中风、心悸、痹证、鼓胀、血淋、病毒性心肌炎。
- 独语、癃、饭后易困、血之余为发等低频显性考点。

代表节点：`tongue-diagnosis`, `pulse-diagnosis`, `spirit-inspection`, `complexion-diagnosis`, `odor-diagnosis`, `pediatric-diagnostics`, `xu-mai`, `jaundice`, `edema`, `stroke`, `palpitation`, `viral-myocarditis`, `du-yu`, `long`, `postprandial-somnolence`, `blood-surplus-hair`。

### 方药与针灸

- 高频中药：附子、麻黄、柴胡、黄芪、肉桂、陈皮、石膏、白术、大黄、酸枣仁、金银花、连翘、人参、当归、川芎、半夏、茯苓、茵陈、车前子、青蒿、川贝母、苦杏仁、丹参、独活、麦冬、艾叶、三七、杜仲等。
- 低频补齐中药：朱砂、合欢皮、磁石、决明子、火麻仁、郁李仁、沙参、槐花等。
- 方剂：麻黄汤、小柴胡汤、归脾汤、大承气汤、茵陈蒿汤、补阳还五汤、四物汤、二陈汤、五苓散、理中丸、龙胆泻肝汤、越鞠丸、血府逐瘀汤、川芎茶调散、生脉散，以及心悸、黄疸、水肿、中风补充代表方。
- 针灸：合谷、天枢、内关、中脘、太冲、肾俞、足三里、神门、三阴交、关元、实按灸、温针灸、拔罐、晕针处理、骨度分寸、十二经脉流注、经络基础。

## 追溯台账

细粒度追溯见 `docs/03-content/exam-point-coverage-ledger.md`。该台账按源行号记录显性考点对应的 app 节点或题库，重点覆盖所有本轮补齐项和主干范围。

## 验证记录

- `pnpm content:validate`：通过。沙箱内 `tsx` 创建 IPC pipe 会报 `listen EPERM`，已在沙箱外运行同一命令验证通过。最新输出为 186 个节点、589 道题、98 条反向索引覆盖边。
- `pnpm typecheck`：通过。
- `git diff --check`：通过。
- 轻量交叉检查：18 个题库 JSON，589 道题，186 个节点，题号重复数 0，题目节点引用无缺失输出。

## 当前判断

按备考标准，当前可以回答：**`中医.docx` 中已经识别出的考试知识点已经进入 app，可通过节点或题目复习。**

需要保留的边界说明：这不是逐字复刻源文档。对考试而言更合适的结构是“主干节点 + 低频题库 + 源行追溯”，这样既不丢考点，也不会把 app 变成难背的电子书。
