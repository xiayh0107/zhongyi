// 客户端传给 QuizPlayer 的题目形态（脱壳掉 zod 校验后的纯数据）
// 与 src/types/question.ts 的 Question 一致，但是只保留前端用得着的字段

export type PlayableQuestion =
  | {
      id: string;
      type: "single_choice";
      stem: string;
      options: string[];
    }
  | {
      id: string;
      type: "multiple_choice";
      stem: string;
      options: string[];
    }
  | {
      id: string;
      type: "fill_in_blank";
      stem: string;
    }
  | {
      id: string;
      type: "match";
      stem: string;
      options: { left: string[]; right: string[] };
    }
  | {
      id: string;
      type: "sort";
      stem: string;
      options: string[];
    };

export type QuestionType = PlayableQuestion["type"];

export const TYPE_LABEL: Record<QuestionType, string> = {
  single_choice: "单选 · SINGLE CHOICE",
  multiple_choice: "多选 · MULTIPLE CHOICE",
  fill_in_blank: "填空 · FILL IN BLANK",
  match: "匹配 · MATCH",
  sort: "排序 · SORT",
};
