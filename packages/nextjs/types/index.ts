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

export type Urgency = "urgent" | "high" | "medium" | "low";
export type ServiceType = "on-site" | "workshop";
export type Status = "open" | "assigned" | "completed" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: Urgency;
  skills: string[];
  postedBy: string;
  postedTime: string;
  timeEstimate: string;
  rating: number;
  reviews: number;
  budget: number;
  serviceType: ServiceType;
  status?: Status;
}
