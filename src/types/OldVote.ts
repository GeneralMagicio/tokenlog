export interface OldVote {
  org: string;
  repo: string;
  number: number;
  tokenAddress: string;
  address: string;
  amount: number;
  cost: number;
  signature: string;
  timestamp: Date;
  chainId?: number;
  closed?: boolean;
}
