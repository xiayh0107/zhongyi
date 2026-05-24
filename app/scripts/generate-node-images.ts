import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import dotenv from "dotenv";

type NodeMatter = {
  id: string;
  title: string;
  layer: string;
  category?: string;
  summary: string;
  template?: Record<string, unknown>;
  relations?: Array<{ type: string; target: string; note?: string }>;
};

type GeneratedRecord = {
  id: string;
  title: string;
  output: string;
  prompt: string;
  generatedAt: string;
};

type FailedRecord = {
  id: string;
  title: string;
  error: string;
  failedAt: string;
};

const APP_ROOT = process.cwd();
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const ENV_PATH = path.join(REPO_ROOT, "gpt-image-2", ".env");
const NODES_DIR = path.join(APP_ROOT, "content", "nodes");
const OUTPUT_DIR = path.join(APP_ROOT, "public", "node-images");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const FAILURE_PATH = path.join(OUTPUT_DIR, "failures.json");

const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2";
const SIZE = process.env.IMAGE_SIZE ?? "1536x1024";
const QUALITY = process.env.IMAGE_QUALITY ?? "medium";
const WEBP_QUALITY = process.env.WEBP_QUALITY ?? "82";
const LIMIT = Number(process.env.IMAGE_LIMIT ?? "0");
const CONCURRENCY = Math.max(1, Number(process.env.IMAGE_CONCURRENCY ?? "3"));
const ONLY = new Set(
  (process.env.IMAGE_ONLY ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

dotenv.config({ path: ENV_PATH });

function walkMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function loadNodes(): NodeMatter[] {
  return walkMarkdownFiles(NODES_DIR)
    .map((file) => matter(fs.readFileSync(file, "utf8")).data as NodeMatter)
    .filter((node) => !ONLY.size || ONLY.has(node.id));
}

function compactValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join("、");
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .slice(0, 6)
      .map(([k, v]) => `${k}:${compactValue(v)}`)
      .join("；");
  }
  return String(value ?? "");
}

function templateLines(node: NodeMatter): string {
  if (!node.template) return "无固定模板，按摘要和关系组织。";
  return Object.entries(node.template)
    .slice(0, 8)
    .map(([key, value]) => `- ${key}: ${compactValue(value)}`)
    .join("\n");
}

function relationLines(node: NodeMatter): string {
  const relations = node.relations ?? [];
  if (relations.length === 0) return "无显式关系，使用概念内在结构。";
  return relations
    .slice(0, 8)
    .map((rel) => `- ${rel.type} → ${rel.target}${rel.note ? `（${rel.note}）` : ""}`)
    .join("\n");
}

function layoutHint(node: NodeMatter): string {
  if (node.layer === "L3") return "关系类节点：使用中心双节点或三节点关系图，重点表现箭头、依赖、互根或转化。";
  if (node.category === "zang-fu") return "脏腑类节点：使用主功能、系统联系、临床提示三层结构。";
  if (node.category === "six-evils") return "病邪类节点：使用性质、致病特点、常见表现、辨别线索四组模块。";
  if (node.category === "herbs") return "中药类节点：使用四气五味、归经、核心功效、主治线索四组模块。";
  if (node.category === "formulas") return "方剂类节点：使用组成结构、君药、功效、主治与辨证线索。";
  if (node.category === "acupoints") return "穴位类节点：使用归经、定位、主治范围、操作提示四组模块，不画真实人体解剖。";
  return "概念类节点：中心概念 + 4 到 6 个环绕模块，强调关系和记忆线索。";
}

function buildPrompt(node: NodeMatter): string {
  return [
    `一张干净、克制、适合中医学习 App 使用的教育类知识结构图，讲解「${node.title}」。`,
    "",
    "整体风格：",
    "- 现代极简信息图",
    "- 温润纸感背景 #f6f2e9",
    "- 白色或米白卡片 #fbf8f1",
    "- 深墨色文字 #1f1c17",
    "- 点缀色使用松绿色 #365240、低饱和蓝绿、赭色、低饱和红",
    "- 不要卡通，不要玄幻，不要廉价国风，不要过度装饰",
    "",
    "内容要求：",
    `- 主题：${node.title}`,
    `- 摘要：${node.summary}`,
    `- 层级：${node.layer}${node.category ? ` / ${node.category}` : ""}`,
    "- 根据该知识点自动组织信息结构",
    "- 优先表现关系和记忆线索，而不是堆文字",
    "- 中文文字必须简短、清晰、可读",
    "- 每个模块只放标题 + 1 行说明",
    "- 保留大量留白，层级清楚",
    "",
    "模板线索：",
    templateLines(node),
    "",
    "关系线索：",
    relationLines(node),
    "",
    "布局要求：",
    `- ${layoutHint(node)}`,
    "- 16:9 横版，适合嵌入网页节点页",
    "- 不要写英文，不要密集小字，不要水印，不要真实器官照片，不要血腥医学海报",
  ].join("\n");
}

function readJsonArray<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T[];
}

function writeJson(filePath: string, value: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  return [...items.filter((existing) => existing.id !== item.id), item];
}

function isWebpFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const header = fs.readFileSync(filePath).subarray(0, 12);
  return (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function writeCompressedWebp(image: Buffer, outputPath: string) {
  const rawPath = outputPath.replace(/\.webp$/, ".raw.png");
  fs.writeFileSync(rawPath, image);
  try {
    execFileSync("cwebp", ["-quiet", "-q", WEBP_QUALITY, rawPath, "-o", outputPath], {
      stdio: "pipe",
    });
  } finally {
    if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  }
}

async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error(`OPENAI_API_KEY not found in ${ENV_PATH}`);

  const baseUrl = (process.env.base_url || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1")
    .replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size: SIZE,
      quality: QUALITY,
      n: 1,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Image API ${response.status}: ${body.slice(0, 800)}`);
  }

  const json = (await response.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image API response did not contain data[0].b64_json");
  return Buffer.from(b64, "base64");
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let manifest = readJsonArray<GeneratedRecord>(MANIFEST_PATH);
  let failures = readJsonArray<FailedRecord>(FAILURE_PATH);
  const generatedIds = new Set(
    manifest
      .filter((item) => isWebpFile(path.join(APP_ROOT, item.output)))
      .map((item) => item.id),
  );
  const nodes = loadNodes().filter((node) => {
    if (generatedIds.has(node.id)) return false;
    return !isWebpFile(path.join(OUTPUT_DIR, `${node.id}.webp`));
  });
  const queue = LIMIT > 0 ? nodes.slice(0, LIMIT) : nodes;

  console.log(`Nodes queued: ${queue.length}`);
  console.log(`Output: ${path.relative(APP_ROOT, OUTPUT_DIR)}`);
  console.log(`Concurrency: ${CONCURRENCY}`);

  let cursor = 0;
  let completed = 0;

  async function worker(workerId: number) {
    while (cursor < queue.length) {
      const index = cursor;
      cursor += 1;
      const node = queue[index];
      await generateOne(node, index, workerId);
    }
  }

  async function generateOne(node: NodeMatter, index: number, workerId: number) {
    const outputPath = path.join(OUTPUT_DIR, `${node.id}.webp`);
    const prompt = buildPrompt(node);
    process.stdout.write(
      `[${index + 1}/${queue.length} w${workerId}] ${node.id} ${node.title} ... `,
    );
    try {
      const image = await generateImage(prompt);
      writeCompressedWebp(image, outputPath);
      manifest = upsertById(manifest, {
        id: node.id,
        title: node.title,
        output: path.relative(APP_ROOT, outputPath),
        prompt,
        generatedAt: new Date().toISOString(),
      });
      failures = failures.filter((failure) => failure.id !== node.id);
      writeJson(MANIFEST_PATH, manifest);
      writeJson(FAILURE_PATH, failures);
      completed += 1;
      process.stdout.write("ok\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures = upsertById(failures, {
        id: node.id,
        title: node.title,
        error: message,
        failedAt: new Date().toISOString(),
      });
      writeJson(FAILURE_PATH, failures);
      completed += 1;
      process.stdout.write("failed\n");
      console.error(message);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, (_, index) =>
      worker(index + 1),
    ),
  );

  console.log(`Done: ${completed}/${queue.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
