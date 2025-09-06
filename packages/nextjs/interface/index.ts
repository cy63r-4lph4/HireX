import { UserRole } from "~~/types";

export interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export interface Coordinates {
  lat: string;
  lng: string;
}

// 1) Shared fields with identical types in both shapes
type TaskShared = {
  title: string;
  description: string;
  category: string;
  location: string;
  timeEstimate: string;
  urgency: string;
  serviceType: string;
  coordinates: {
    lat: string;
    lng: string;
  };
};

// 2) Form state (strings for inputs)
export type TaskFormData = TaskShared & {
  budget: string;
  skills: string;
};

export type Task = TaskShared & {
  id: number;
  budget: number;
  rating: number;
  reviews: number;
  postedBy: string;
  postedTime: string;
  status: "open" | "assigned" | "completed" | "cancelled";
  skills: string[]; // array after splitting
};

export interface TaskPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  timeEstimate?: string;
  urgency: string;
  serviceType: string;
  skills: string[];
  coordinates: { lat: string; lng: string };
}
export type TaskPosting = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  budget: number;
  timeEstimate: string;
  urgency: "urgent" | "high" | "medium" | "low";
  serviceType: "on-site" | "workshop";
  rating: number;
  reviews: number;
  postedBy: string;
  postedTime: string;
  skills: string[];
  status?: "assigned" | "completed" | "cancelled" | "open";
};
