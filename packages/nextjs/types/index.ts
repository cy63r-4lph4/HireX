export type UserRole = "worker" | "client";
export type CoreBalance = {
  balance: bigint;
  symbol: string;
  decimals?: number;
};
