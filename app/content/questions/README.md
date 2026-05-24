# Question Bank

题库按领域拆分在本目录的 JSON 文件中。加载器会递归读取 `content/questions/**/*.json`，再做一次全局校验，确保题目结构合法且 `id` 不重复。

`content/questions.json` 只保留为空数组，作为旧版本内容结构的兼容占位。只要本目录存在 JSON 文件，运行时不会读取旧单文件题库。
