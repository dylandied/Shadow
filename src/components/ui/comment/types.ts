
export type Reply = {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
};

export type CommentProps = {
  id: string;
  username: string;
  content: string;
  bitcoinAddress?: string;
  isEmployee: boolean;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
  replyTo?: string;
  replies?: Reply[];
  userReputation?: "trusted" | "new";
  className?: string;
};
