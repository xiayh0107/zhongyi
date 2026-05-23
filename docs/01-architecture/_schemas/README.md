# Schemas（可执行参考实现）

> 这个目录放**可直接使用**的 schema 文件，配套 [`../data-model.md`](../data-model.md) 的设计。开发者直接复制到项目代码中。

## 文件清单

| 文件 | 用途 | 复制到项目位置 |
|---|---|---|
| `schema.prisma` | 完整 Prisma 数据库 schema | `prisma/schema.prisma` |
| `node.frontmatter.zod.ts` | Node Markdown frontmatter 的 Zod schema | `src/types/node.ts` |
| `question.zod.ts` | Question JSON 的 Zod schema | `src/types/question.ts` |

## Why 单独放这里

- **与设计文档保持版本同步**：schema 改动 = 文档改动
- **可被脚本直接读取**：构建期校验脚本可以 import 这些文件
- **审校友好**：所有 schema 在一处，方便 review

## 版本与生效

- schemas 的版本号在每个文件顶部注释中标注
- 与 [`../data-model.md`](../data-model.md) 的版本应保持一致（当前 0.2）
- 重大变更必须同步更新 data-model.md 的 Changelog
