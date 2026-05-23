// 内容校验脚本 — CI 强制运行。失败则退出码非零。

import { loadContentGraph } from "@/lib/content/loader";

async function main() {
  console.log("→ 加载并校验内容...");
  const graph = loadContentGraph();
  console.log(`✓ 节点：${graph.nodes.size}`);
  console.log(`✓ 题目：${graph.questions.length}`);
  console.log(`✓ 边（反向索引覆盖）：${graph.backlinks.size}`);

  // 列出每个节点的简要状态
  for (const node of graph.nodes.values()) {
    const qCount = graph.questions_by_node.get(node.id)?.length ?? 0;
    const relCount = node.relations.length;
    console.log(
      `  · [${node.layer}] ${node.id.padEnd(15)} ${node.status.padEnd(10)} ${qCount} 题 · ${relCount} 关系`,
    );
  }

  console.log("\n✓ 内容校验通过");
}

main().catch((err) => {
  console.error("✗ 内容校验失败：\n", err.message);
  process.exit(1);
});
