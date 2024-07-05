export const APP_TYPE_MAP: Record<number, string> = {
  0: "得分类",
  1: "测评类",
};

export const SCORING_STRATEGY_MAP: Record<number, string> = {
  0: "自定义",
  1: "AI",
};
export const REVIEW_STATUS_MAP: Record<number, string> = {
  0: "待审核",
  1: "通过",
  2: "拒绝",
};

export const REVIEW_STATUS_ENUM: Record<string, number> = {
  WAIT: 0,
  PASS: 1,
  REJECT: 2,
};
