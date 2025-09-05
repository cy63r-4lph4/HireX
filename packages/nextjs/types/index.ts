import { ReactNode } from "react";

export type UserRole = "worker" | "client";
export type CoreBalance = {
  balance: bigint;
  symbol: string;
  decimals?: number;
};
export type InfiniteScrollerProps = {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
};
