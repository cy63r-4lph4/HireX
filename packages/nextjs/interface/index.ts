import { UserRole } from "~~/types";

export interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}
