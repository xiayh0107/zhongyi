// 白纸召回的关键词匹配评分
// 设计依据：docs/02-features/F05-active-recall.md

import type { LoadedNode } from "./types";

export type Keypoint = {
  id: number;
  text: string;
  aliases: string[];
};

export type RecallMatchResult = {
  /** 用户写出且命中关键点的部分 */
  hit: Array<{ keypointId: number; text: string; matchedBy: string }>;
  /** 关键点中用户未写出的（重要遗漏） */
  missedRequired: Keypoint[];
  /** 选填关键点中遗漏的（次要） */
  missedOptional: Keypoint[];
  /** 用户写出但未匹配任何关键点的 */
  extra: string[];
  /** 覆盖率（hit / required.length） */
  coverage: number;
  /** 总命中数 / 总关键点数 */
  totalHits: number;
  totalRequired: number;
};

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\s,，；;。、:：·\-—]+/g, "");
}

/**
 * 把用户的自由文本切成"切片"（按行 + 标点）。
 */
function splitChunks(text: string): string[] {
  const lines = text
    .split(/\n+/)
    .flatMap((line) =>
      line.split(/[，,;；。、·]+/).map((s) => s.trim()).filter(Boolean),
    )
    .filter((s) => s.length > 0);
  // 去掉单纯的列表标记
  return lines.map((l) => l.replace(/^[-*·\d.)、\s]+/, "").trim()).filter(Boolean);
}

/**
 * 判断切片是否匹配关键点（含 aliases）。
 * 匹配规则：normalize 后切片包含关键点的 normalize 形式
 *           或 关键点的 normalize 形式包含切片（处理用户写得简略的情况）
 */
function chunkMatchesKeypoint(chunk: string, kp: Keypoint): string | null {
  const cn = normalize(chunk);
  const candidates = [kp.text, ...kp.aliases].map((s) => normalize(s));
  for (const cand of candidates) {
    if (!cand) continue;
    if (cn.includes(cand) || cand.includes(cn)) {
      return cand;
    }
  }
  return null;
}

export function matchRecall(
  userText: string,
  node: LoadedNode,
): RecallMatchResult {
  const required = node.recall_keypoints?.required ?? [];
  const optional = node.recall_keypoints?.optional ?? [];
  const chunks = splitChunks(userText);

  const allKp = [...required, ...optional];
  const hit: RecallMatchResult["hit"] = [];
  const hitKpIds = new Set<number>();
  const matchedChunkIdx = new Set<number>();

  // 对每个切片，找最先匹配的关键点
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    for (const kp of allKp) {
      if (hitKpIds.has(kp.id)) continue;
      const matched = chunkMatchesKeypoint(chunk, kp);
      if (matched) {
        hit.push({ keypointId: kp.id, text: kp.text, matchedBy: chunk });
        hitKpIds.add(kp.id);
        matchedChunkIdx.add(i);
        break;
      }
    }
  }

  const missedRequired = required.filter((kp) => !hitKpIds.has(kp.id));
  const missedOptional = optional.filter((kp) => !hitKpIds.has(kp.id));
  const extra = chunks.filter((_, i) => !matchedChunkIdx.has(i));

  const requiredHits = required.filter((kp) => hitKpIds.has(kp.id)).length;
  const coverage = required.length > 0 ? requiredHits / required.length : 0;

  return {
    hit,
    missedRequired,
    missedOptional,
    extra,
    coverage,
    totalHits: hit.length,
    totalRequired: required.length,
  };
}
