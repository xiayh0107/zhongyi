// FSRS 算法封装
// 文档：https://github.com/open-spaced-repetition/ts-fsrs
// 设计依据：docs/02-features/F02-memory-strength.md

import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating,
  type Card,
  type Grade,
  State,
} from "ts-fsrs";

const params = generatorParameters({
  request_retention: 0.9,
  maximum_interval: 36500,
});

const scheduler = fsrs(params);

export { Rating, State };
export type { Card };

/**
 * 创建空白卡片（初始状态）
 */
export function emptyCard(): Card {
  return createEmptyCard();
}

/**
 * 根据 review 结果更新 card 状态
 */
export function reviewCard(card: Card, rating: Grade, now = new Date()) {
  const result = scheduler.next(card, now, rating);
  return result.card;
}

/**
 * 从 card 状态 + 当前时间派生记忆强度（0-100）
 * 纯函数 · 不写 DB · 用户每次回来时实时算
 */
export function deriveMemoryStrength(
  card: Card | null | undefined,
  now: Date = new Date(),
): number {
  if (!card || !card.last_review || card.stability == null) return 0;

  const daysSinceReview =
    (now.getTime() - new Date(card.last_review).getTime()) / 86_400_000;

  // FSRS 遗忘曲线公式：retrievability = (1 + t / (9 * S))^(-1)
  const stability = card.stability;
  const retrievability = Math.pow(
    1 + daysSinceReview / (9 * stability),
    -1,
  );

  return Math.round(retrievability * 100);
}

/**
 * 答题对错 + 用时 → FSRS Rating 映射
 * Hard 阈值：> 15s · Easy 阈值：< 5s（详见 F02 文档）
 */
export function ratingFromAttempt(opts: {
  correct: boolean;
  timeMs: number | null | undefined;
}): Grade {
  if (!opts.correct) return Rating.Again;
  const timeS = (opts.timeMs ?? 0) / 1000;
  if (timeS < 5) return Rating.Easy;
  if (timeS > 15) return Rating.Hard;
  return Rating.Good;
}
