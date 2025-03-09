
export type Company = {
  id: string;
  name: string;
  ticker: string;
  logo: string;
  description: string;
  industry: string;
  insidersCount: number;
  postsCount: number;
  isHot: boolean;
  isNew: boolean;
  activityLevel: number;
  lastUpdate: Date;
};

export type Comment = {
  id: string;
  companyId: string;
  username: string;
  content: string;
  isEmployee: boolean;
  bitcoinAddress?: string;
  upvotes: number;
  downvotes: number;
  tipAmount: number;
  timestamp: Date;
  replies: string[];
  userReputation?: "trusted" | "new";
  userVote?: "up" | "down" | null;
};

export type InsightType = "sales" | "traffic" | "satisfaction" | "news";
export type ChangeDirection = "up" | "down" | "neutral";
export type VoteType = "up" | "down" | null;
export type UserType = "trader" | "employee" | "admin";

export type Insight = {
  type: InsightType;
  title: string;
  value: string;
  change: ChangeDirection;
  sourcesCount: number;
  lastUpdated: string;
};

export type SortOption = "newest" | "oldest" | "most_upvoted" | "most_discussed";
