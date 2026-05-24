---
id: CONTENT-004
type: content
status: reviewed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - source-coverage-audit.md
---

# 中医.docx 考点覆盖台账

> 口径：每个显性考试点至少有一个节点或一道题覆盖。主干知识以节点为主，低频配对和疑似笔误以题库和备注兜底。

| 源行号 | 源知识点 | 覆盖方式 | 目标节点或题库 | 备注 |
|---:|---|---|---|---|
| 2 | 腹部经脉由内向外：任脉、足少阴肾经、足阳明胃经、足太阴脾经 | 题目 | `acupoints-procedures-theory.json` | 经络/针灸题库覆盖 |
| 3 | 实按灸法 | 节点 + 题目 | `shi-an-jiu`, `acupoints-procedures-theory.json` | 操作定义保留 |
| 4 | 天枢穴进针方法 | 节点 + 题目 | `tian-shu`, `acupoints-procedures-theory.json` | 穴位节点覆盖 |
| 5 | 内关主治心、胃、神志病 | 节点 + 题目 | `nei-guan`, `acupoints-procedures-theory.json` | 排除题型覆盖 |
| 6 | 舌红苔黄口干：实热证 | 节点 + 题目 | `tongue-diagnosis`, `tongue-body-colors`, `diagnostics-syndromes.json` | 舌诊与证候联动 |
| 7 | 命门火衰、补火助阳：附子 | 节点 + 题目 | `fu-zi`, `herbs.json` | 附子节点含回阳救逆/补火助阳 |
| 8 | 诊脉举按寻 | 节点 + 题目 | `pulse-diagnosis`, `diagnostics-syndromes.json` | 切诊取脉力度 |
| 9-11 | 血淋、血尿区别，血淋证候和病机 | 节点 + 题目 | `blood-strangury`, `diagnostics-syndromes.json` | 实证/虚证与下焦湿热 |
| 13-15 | 黄疸阳黄、阴黄、急黄代表方 | 节点 + 题目 | `jaundice`, `content-gap-final-formulas.json` | 阳黄新增独立题；阴黄/急黄在黄疸节点 recall 中覆盖 |
| 16 | 心悸证型与代表方 | 节点 + 题目 | `palpitation`, `content-gap-final-formulas.json` | 安神定志丸、归脾汤、天王补心丹等均覆盖 |
| 17 | 中风代表方 | 节点 + 题目 | `stroke`, `content-gap-final-stroke-formulas.json` | 7 个低频代表方均已覆盖 |
| 18-19 | 水肿阳水/阴水代表方 | 节点 + 题目 | `edema`, `content-gap-final-formulas.json` | 阳水新增独立题；阴水在水肿节点覆盖 |
| 20 | 苦杏仁、决明子、火麻仁、郁李仁对比 | 节点 + 题目 | `ku-xing-ren`, `jue-ming-zi`, `huo-ma-ren`, `yu-li-ren`, `content-gap-final-herbs.json` | 润肠通便与止咳平喘差异覆盖 |
| 21 | 山楂、鸡内金、莱菔子消食差异 | 节点 + 题目 | `shan-zha`, `ji-nei-jin`, `lai-fu-zi`, `content-gap-herbs-a.json` | 消肉食、消一切积食、行气导滞 |
| 22 | 朱砂、酸枣仁、合欢皮、远志、磁石安神药 | 节点 + 题目 | `zhu-sha`, `suan-zao-ren`, `he-huan-pi`, `yuan-zhi`, `ci-shi`, `content-gap-final-herbs.json` | 安神药组已完整覆盖 |
| 23 | 心绞痛/胸痹表现 | 节点 + 题目 | `heart-vessel-obstruction`, `diagnostics-syndromes.json` | 瘀阻、寒凝胸痛要点 |
| 24-26 | 病毒性心肌炎治疗原则与病机 | 节点 + 题目 | `viral-myocarditis`, `content-gap-final-diagnostics-syndromes.json` | 只保留中医原则：扶正祛邪，辨证论治 |
| 27-28 | 脾阳虚辨证依据 | 节点 + 题目 | `spleen-yang-deficiency`, `diagnostics-syndromes.json` | 纳呆、冷痛、畏寒、便溏等 |
| 29 | 正常脉象 | 节点 + 题目 | `pulse-diagnosis`, `diagnostics-syndromes.json` | 三部有脉、和缓有力 |
| 30 | 恶寒 | 题目 | `diagnostics-syndromes.json` | 表寒/恶寒辨析 |
| 220 | 气的基本运动：升降出入 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 气机运动覆盖 |
| 221 | 气的温煦作用 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 畏寒肢冷等失常表现 |
| 222 | 走息道以行呼吸：宗气 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 宗气功能覆盖 |
| 223 | 七情影响气机 | 节点 + 题目 | `qi`, `foundations.json` | 怒上、喜缓、悲消、恐下、思结 |
| 224 | 独语 | 节点 + 题目 | `du-yu`, `content-gap-final-diagnostics-syndromes.json` | 见人而止、心气不足等 |
| 225 | 老舌 | 节点 + 题目 | `tongue-diagnosis`, `diagnostics-syndromes.json` | 舌质纹理粗糙 |
| 226 | 畏寒 | 题目 | `diagnostics-syndromes.json` | 怕冷近火可缓解 |
| 227 | 癃 | 节点 + 题目 | `long`, `content-gap-final-diagnostics-syndromes.json` | 小便不畅、点滴而出 |
| 228 | 解表药归肺、膀胱经 | 节点 + 题目 | `ma-huang`, `fang-feng`, `meridian-tropism`, `herbs.json` | 解表药归经逻辑覆盖 |
| 229 | 桑寄生 | 节点 + 题目 | `sang-ji-sheng`, `content-gap-herbs-b.json` | 补肝肾、强筋骨、安胎、祛风湿 |
| 230 | 藿香与胃肠型感冒 | 节点 + 题目 | `huo-xiang`, `content-gap-herbs-a.json` | 化湿和中、解暑 |
| 231 | 山楂 | 节点 + 题目 | `shan-zha`, `content-gap-herbs-a.json` | 行气散瘀、消食健胃 |
| 232 | 胃寒干呕：半夏、干姜 | 节点 + 题目 | `ban-xia`, `gan-jiang`, `herbs.json` | 胃寒呕吐用药 |
| 233 | 自汗遗尿遗精：固摄 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 气的固摄作用 |
| 234 | 风性主动 | 节点 + 题目 | `wind-evil`, `six-evils.json` | 动摇不定、眩晕抽搐 |
| 235 | 生殖功能：肝、肾，重在肾 | 节点 + 题目 | `kidney`, `liver`, `zang-fu.json` | 肾藏精与肝肾相关 |
| 236 | 刺痛属瘀血 | 节点 + 题目 | `blood-stasis`, `diagnostics-syndromes.json` | 痛如针刺刀割 |
| 237 | 食滞胃脘 | 节点 + 题目 | `food-stagnation`, `content-gap-diagnostics-theory.json` | 大便酸腐、不消化 |
| 238 | 不寐相关脏腑 | 题目 | `diagnostics-syndromes.json`, `content-gap-final-herbs.json` | 心、脾、肝、肾 |
| 239 | 肺病症状排除吐血 | 节点 + 题目 | `lung`, `zang-fu.json` | 肺系症状边界 |
| 240 | 舌胖大齿痕：脾虚水湿 | 节点 + 题目 | `tongue-diagnosis`, `spleen`, `diagnostics-syndromes.json` | 舌诊与脾虚联动 |
| 241 | 肾精不足 | 节点 + 题目 | `kidney`, `zang-fu.json` | 生殖、生长、早衰 |
| 242 | 治风通用：防风 | 节点 + 题目 | `fang-feng`, `content-gap-herbs-b.json` | 风药代表 |
| 243 | 湿温潮热：身热不扬 | 节点 + 题目 | `damp-evil`, `six-evils.json` | 湿热潮热 |
| 244 | 栀子三焦泻火 | 题目 | `herbs.json` | 题库覆盖，未单独建节点 |
| 245 | 白术：健脾燥湿补气 | 节点 + 题目 | `bai-zhu`, `herbs.json` | 脾虚湿困要药 |
| 247 | 川芎治头痛 | 节点 + 题目 | `chuan-xiong`, `content-gap-herbs-b.json` | 血虚血瘀头痛均可联想 |
| 248 | 半夏功效 | 节点 + 题目 | `ban-xia`, `herbs.json` | 燥湿化痰、降逆止呕 |
| 249 | 杜仲 | 节点 + 题目 | `du-zhong`, `herbs.json` | 补肝肾、强筋骨、安胎 |
| 250 | 白芨 | 节点 + 题目 | `bai-ji`, `content-gap-herbs-b.json` | 收敛止血、消肿生肌 |
| 251 | 白芍 | 节点 + 题目 | `bai-shao`, `content-gap-herbs-b.json` | 调血养经、柔肝止痛 |
| 252 | 天麻 | 节点 + 题目 | `tian-ma`, `content-gap-herbs-b.json` | 息风止痉、平抑肝阳 |
| 253 | 生地黄 | 节点 + 题目 | `sheng-di-huang`, `content-gap-herbs-b.json` | 清热凉血、养阴生津 |
| 254 | 桔梗 | 节点 + 题目 | `jie-geng`, `content-gap-herbs-a.json` | 宣肺、祛痰、利咽、排脓 |
| 255 | 中医理论形成 | 节点 + 题目 | `tcm-history`, `content-gap-diagnostics-theory.json` | 春秋战国/黄帝内经 |
| 256 | 小肠受盛化物 | 节点 + 题目 | `small-intestine`, `zang-fu.json` | 六腑功能 |
| 257 | 浮脉 | 节点 + 题目 | `pulse-diagnosis`, `diagnostics-syndromes.json` | 举之有余、按之不足 |
| 258 | 总按 | 节点 + 题目 | `pulse-diagnosis`, `diagnostics-syndromes.json` | 三指同时用力 |
| 259 | 二陈汤 | 节点 + 题目 | `er-chen-tang`, `formulas.json` | 湿痰阻肺 |
| 260 | 瓜蒌 | 节点 + 题目 | `gua-lou`, `content-gap-herbs-b.json` | 清热涤痰、宽胸散结 |
| 261 | 远志 | 节点 + 题目 | `yuan-zhi`, `content-gap-final-herbs.json` | 宁心安神、消痈散肿 |
| 262 | 中医理论体系完成相关书目 | 节点 + 题目 | `tcm-history`, `content-gap-diagnostics-theory.json` | 黄帝内经等 |
| 263 | 胆既属六腑又属奇恒之腑 | 节点 + 题目 | `gallbladder`, `zang-fu.json` | 胆的特殊性 |
| 264 | 气的五功能 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 推动、温煦、防御、固摄、气化 |
| 265 | 元气维持生殖功能 | 节点 + 题目 | `qi`, `kidney`, `qi-blood-fluids.json` | 元气与肾精 |
| 266 | 五行“所不胜”推导 | 节点 + 题目 | `five-elements`, `foundations.json` | 五行生克推理 |
| 267 | 肝郁气滞证 | 节点 + 题目 | `liver-qi-stagnation`, `diagnostics-syndromes.json` | 胸胁胀痛、情志抑郁 |
| 268 | 薄白苔辨表里寒热 | 节点 + 题目 | `tongue-diagnosis`, `diagnostics-syndromes.json` | 舌苔辨证 |
| 269-270 | 潮热分类 | 节点 + 题目 | `damp-evil`, `eight-principles`, `diagnostics-syndromes.json` | 阳明、阴虚、湿温等 |
| 271 | 津液生成参与脏腑 | 节点 + 题目 | `body-fluids`, `qi-blood-fluids.json` | 脾胃小肠大肠 |
| 272-273 | 望神、神乱 | 节点 + 题目 | `spirit-inspection`, `diagnostics-syndromes.json` | 目光与神志 |
| 274 | 五味咸用于瘿瘤 | 节点 + 题目 | `five-flavors`, `content-gap-diagnostics-theory.json` | 咸能软坚 |
| 275 | 桂枝汤/麻黄汤辨汗 | 节点 + 题目 | `gui-zhi-tang`, `ma-huang-tang`, `formulas.json` | 风寒表虚/表实 |
| 276 | 连翘治疮 | 节点 + 题目 | `lian-qiao`, `herbs.json` | 清热解毒散结 |
| 277 | 黄连湿热泻痢 | 节点 + 题目 | `huang-lian`, `content-gap-herbs-a.json` | 清热燥湿 |
| 278 | 独活治下半身痹痛 | 节点 + 题目 | `du-huo`, `content-gap-herbs-b.json` | 下半身风寒湿痹 |
| 279 | 白芍柔肝止痛 | 节点 + 题目 | `bai-shao`, `content-gap-herbs-b.json` | 功效辨识 |
| 280 | 茯苓与脾胃虚、食少纳呆 | 节点 + 题目 | `fu-ling`, `herbs.json` | 健脾渗湿 |
| 281 | 山楂行气散瘀 | 节点 + 题目 | `shan-zha`, `content-gap-herbs-a.json` | 消食药辨析 |
| 282 | 黄芩清热安胎 | 节点 + 题目 | `huang-qin`, `content-gap-herbs-a.json` | 安胎要点 |
| 283 | 川贝母治肺热咳喘 | 节点 + 题目 | `chuan-bei-mu`, `herbs.json` | 肺热燥咳 |
| 284 | 桔梗宣肺治肺气壅遏 | 节点 + 题目 | `jie-geng`, `content-gap-herbs-a.json` | 宣肺载药上行 |
| 285 | 沙参治燥热伤肺干咳痰粘 | 节点 + 题目 | `sha-shen`, `content-gap-final-herbs.json` | 本轮新增 |
| 286 | 槐花治血热吐衄、目赤肿痛 | 节点 + 题目 | `huai-hua`, `content-gap-final-herbs.json` | 本轮新增 |
| 287 | 白术健脾燥湿 | 节点 + 题目 | `bai-zhu`, `herbs.json` | 已覆盖 |
| 288 | 山茱萸治肾虚不固 | 节点 + 题目 | `shan-zhu-yu`, `content-gap-herbs-b.json` | 固涩补益 |
| 289 | “酸杏仁”疑似笔误 | 题目 + 备注 | `content-gap-final-diagnostics-syndromes.json` | 不新建“酸杏仁”，按疑似酸枣仁处理 |
| 290 | 青蒿适应证排除 | 节点 + 题目 | `qing-hao`, `herbs.json` | 温病后期、疟疾等 |
| 291 | 肝火上亢用平肝息风药 | 节点 + 题目 | `tian-ma`, `gou-teng`, `liver-wind-stirring` | 天麻、钩藤覆盖 |
| 292 | 水火之宅：肾 | 节点 + 题目 | `kidney`, `zang-fu.json` | 肾阴肾阳 |
| 293-298 | 五脏特点 | 节点 + 题目 | `heart`, `lung`, `spleen`, `liver`, `kidney`, `zang-fu.json` | 五脏生理、五行、在志在体开窍等 |
| 299 | 虚脉特点 | 节点 + 题目 | `xu-mai`, `content-gap-diagnostics-theory.json` | 举之无力、按之空虚 |
| 300 | 阴阳互根 | 节点 + 题目 | `yin-yang`, `foundations.json` | 无热无寒的互根逻辑 |
| 301 | 心病影响肺病：相乘 | 节点 + 题目 | `five-elements`, `foundations.json` | 五行异常传变 |
| 302 | 少阳头痛 | 题目 | `diagnostics-syndromes.json` | 头痛部位辨经 |
| 303 | 气机升降相关肺脾 | 节点 + 题目 | `qi`, `lung`, `spleen`, `qi-blood-fluids.json` | 肺主降、脾主升 |
| 304 | 津液生成不足责脾 | 节点 + 题目 | `body-fluids`, `spleen`, `qi-blood-fluids.json` | 脾运化水液 |
| 305 | 罢极之本：肝 | 节点 + 题目 | `liver`, `zang-fu.json` | 肝主筋 |
| 306 | 夺汗无血：津血同源 | 节点 + 题目 | `blood`, `body-fluids`, `qi-blood-fluids.json` | 津血互化 |
| 307 | 宗气聚于气海/膻中 | 节点 + 题目 | `qi`, `qi-blood-fluids.json` | 宗气位置 |
| 308 | 艾叶治胎漏下血、手足不温 | 节点 + 题目 | `ai-ye`, `content-gap-herbs-b.json` | 温经止血 |
| 309 | 大黄斩关夺门 | 节点 + 题目 | `da-huang`, `herbs.json` | 攻下力强 |
| 310 | 饭后易困 | 节点 + 题目 | `postprandial-somnolence`, `content-gap-final-diagnostics-syndromes.json` | 先看脾气虚/清阳不升，伴寒象再看脾肾阳虚 |
| 311 | 湿邪疼痛：重痛 | 节点 + 题目 | `damp-evil`, `six-evils.json` | 湿性重浊 |
| 312 | 桔梗舟楫之剂 | 节点 + 题目 | `jie-geng`, `content-gap-herbs-a.json` | 载药上行 |
| 313 | 白及善治肺胃出血 | 节点 + 题目 | `bai-ji`, `content-gap-herbs-b.json` | 收敛止血 |
| 314 | 香附 | 节点 + 题目 | `xiang-fu`, `content-gap-herbs-b.json` | 气病之总司、女科之主帅 |
| 315 | 丹参功效 | 节点 + 题目 | `dan-shen`, `herbs.json` | 活血祛瘀、清心除烦 |
| 316 | 三七 | 节点 + 题目 | `san-qi`, `herbs.json` | 止血不留瘀 |
| 317 | 附子回阳救逆第一药 | 节点 + 题目 | `fu-zi`, `herbs.json` | 高危高频药 |
| 318-320 | 浙贝母与川贝母区别 | 节点 + 题目 | `zhe-bei-mu`, `chuan-bei-mu`, `herbs.json` | 川贝凉润、浙贝苦寒 |
| 321 | 菊花清热解毒 | 节点 + 题目 | `ju-hua`, `content-gap-herbs-b.json` | 已覆盖 |
| 322 | 柴胡 | 节点 + 题目 | `chai-hu`, `herbs.json` | 疏肝解郁、升举阳气 |
| 323-324 | 津与液分布范围 | 节点 + 题目 | `body-fluids`, `qi-blood-fluids.json` | 表格渲染已修复 |
| 325 | 独活 | 节点 + 题目 | `du-huo`, `content-gap-herbs-b.json` | 腰腿下半身痹痛 |
| 326 | 茵陈 | 节点 + 题目 | `yin-chen`, `herbs.json` | 清利湿热、利胆退黄 |
| 327 | 当归 | 节点 + 题目 | `dang-gui`, `herbs.json` | 调经止痛、活血补血 |
| 328 | 麦冬 | 节点 + 题目 | `mai-dong`, `herbs.json` | 润肺清心、养阴生津 |
| 329 | 丝状乳头与舌苔 | 节点 + 题目 | `tongue-diagnosis`, `diagnostics-syndromes.json` | 舌诊细项 |
| 330 | 艾叶 | 节点 + 题目 | `ai-ye`, `content-gap-herbs-b.json` | 温经止血、散寒止痛 |
| 331 | 石膏 | 节点 + 题目 | `shi-gao`, `herbs.json` | 清热泻火、除烦止渴 |
| 332-335 | 麻黄汤 | 节点 + 题目 | `ma-huang-tang`, `formulas.json` | 组成、功效、主治 |
| 336 | 归脾汤 | 节点 + 题目 | `gui-pi-tang`, `formulas.json`, `content-gap-final-formulas.json` | 益气补血、健脾宁心 |
| 337 | 手阳明大肠经络肺 | 节点 + 题目 | `large-intestine`, `jing-luo-basic` | 经络联系 |
| 338-339 | 血之余为发 | 节点 + 题目 | `blood-surplus-hair`, `content-gap-final-diagnostics-syndromes.json` | 本轮新增 |
| 340-345 | 五行木、气陷、气能生血等选择题 | 节点 + 题目 | `five-elements`, `qi`, `blood`, `foundations.json`, `qi-blood-fluids.json` | 基础理论题覆盖 |
| 346-458 | 后半段单选：卫气司腠理、同病异治、本草经典、五脏系统联系、肺气虚、奇恒之腑、肝气犯脾、证候定义、血行相关脏腑、中气下陷、五脏藏精气、肺脾关系、命门火、肾纳气、三焦/小肠/心脾两虚等 | 题目 | `content-gap-final-comprehensive.json` | 新增 30 道直考题覆盖该段高频选择题 |
| 459-532 | 多选前半段：心悸病因、面色白、晕针、瘀血、骨度分寸、中风阳闭、望神、六邪特点、常色客色、口臭、津液输布、脉象要素、车前子、石斛、头痛四经、秋脉、心藏神、四大经典、血行、七情、阴阳失调、肝肾关系、火邪、胃气上逆、宗气、脾胃关系、阴阳转化、肾、肝藏血、气功能和证候组成 | 节点 + 题目 | `content-gap-final-comprehensive.json`, `needle-fainting`, `bone-length-measurement`, `stroke`, `spirit-inspection`, `odor-diagnosis`, `body-fluids`, `pulse-diagnosis`, `che-qian-zi` | 原有节点覆盖操作和主干，新综合题库覆盖源文直考问法 |
| 533-559 | 合谷、神门、三阴交、关元、内关、足三里归经定位主治 | 节点 + 题目 | `he-gu`, `shen-men`, `san-yin-jiao`, `guan-yuan`, `nei-guan`, `zu-san-li`, `content-gap-final-comprehensive.json` | 新题补归经配对，节点保留定位和主治 |
| 560-590 | 大承气汤、阴水阳水鉴别、正常舌象、肾功能、要药配对、气血关系、独活寄生汤 | 节点 + 题目 | `da-cheng-qi-tang`, `edema`, `tongue-diagnosis`, `kidney`, `du-huo-ji-sheng-tang`, `qi`, `blood`, `content-gap-final-comprehensive.json` | 简答题按可复习题和节点拆解 |
| 591-641 | 正常脉、四气依据、寒热虚实转化、小柴胡汤、麻黄/青蒿/连翘/人参/酸枣仁要药、血瘀、脾气虚发展 | 节点 + 题目 | `pulse-diagnosis`, `five-flavors`, `exterior-interior-cold-heat`, `xiao-chai-hu-tang`, `ma-huang`, `qing-hao`, `lian-qiao`, `ren-shen`, `suan-zao-ren`, `blood-stasis`, `spleen`, `content-gap-final-comprehensive.json` | 腹痛转化属源文标注超纲，按八纲寒热虚实节点兜底 |
| 642-701 | 相使相杀、湿邪性质、寒热证、四气举例、气机、肺主气、心气虚、茯苓/大黄要药、神乱、中药定义、同病异治、肝气郁结、表证、药物主治、心火亢盛、黄芪、肾纳气、气的五作用、谵语、相乘、心脾两虚、补法 | 节点 + 题目 | `content-gap-final-comprehensive.json`, `formula-role-herbs`, `damp-evil`, `exterior-interior-cold-heat`, `qi`, `lung`, `heart-qi-deficiency`, `fu-ling`, `da-huang`, `spirit-inspection`, `chinese-medicine`, `syndrome-differentiation`, `liver-qi-stagnation`, `heart-fire-flaring`, `huang-qi`, `five-elements`, `gui-pi-tang`, `eight-methods-bu-fa` | 新题覆盖相使/相杀、寒热证、四气、肺主气、中药定义、语言异常等源文问法 |
| 702-724 | 川芎/半夏要药、寒热往来、腻苔、自汗、辨证、六淫详细版、病理舌色、归经和麦冬 | 节点 + 题目 | `chuan-xiong`, `ban-xia`, `xiao-chai-hu-tang`, `tongue-diagnosis`, `qi`, `syndrome-differentiation`, `wind-evil`, `cold-evil`, `summer-evil`, `damp-evil`, `dryness-evil`, `fire-evil`, `tongue-body-colors`, `meridian-tropism`, `mai-dong` | 多数已有节点覆盖，综合题库补关键配对 |
| 725-764 | 肝功能、主诉、气机、天癸、壮热、潮热、肺功能、痰阻心脉、人参、脉诊、虚者补其母、肺气虚、热证、心功能 | 节点 + 题目 | `liver`, `chief-complaint`, `qi`, `kidney`, `fire-evil`, `qing-hao`, `lung`, `heart-vessel-obstruction`, `ren-shen`, `pulse-diagnosis`, `five-elements`, `exterior-interior-cold-heat`, `heart`, `content-gap-final-comprehensive.json` | 肝主疏泄、肺主治节、心主神志等以节点为主，题库覆盖可考问法 |
| 765-824 | 茵陈/黄芪/附子/杜仲要药，郑声、得神、虚证、相须、四种肝风、脾病证型、清热药分类、肺主治节、肝主疏泄、心脉痹阻、脾功能、大黄、肝风内动、臣药 | 节点 + 题目 | `yin-chen`, `huang-qi`, `fu-zi`, `du-zhong`, `spirit-inspection`, `exterior-interior-cold-heat`, `formula-role-herbs`, `liver-wind-stirring`, `spleen`, `spleen-yang-deficiency`, `shi-gao`, `huang-qin`, `huang-lian`, `jin-yin-hua`, `lian-qiao`, `sheng-di-huang`, `qing-hao`, `lung`, `liver`, `heart-vessel-obstruction`, `da-huang`, `content-gap-final-comprehensive.json` | 新综合题库覆盖郑声/谵语、相须、四肝风、脾病、清热药、肺主治节、大黄和臣药 |
| 825-858 | 津液生成输布排泄、八纲、使药、奇恒之腑、元气、胃功能、燥邪伤肺、肝主疏泄、瘀血特点、整体观念、津血同源、六淫、内生五邪 | 节点 + 题目 | `body-fluids`, `eight-principles`, `formula-role-herbs`, `gallbladder`, `qi`, `stomach`, `dryness-evil`, `lung`, `liver`, `blood-stasis`, `holistic-view`, `blood`, `wind-evil`, `cold-evil`, `summer-evil`, `damp-evil`, `fire-evil`, `internal-five-evils`, `content-gap-final-comprehensive.json` | 结尾名词解释已由主干节点和新增综合题库共同覆盖 |
