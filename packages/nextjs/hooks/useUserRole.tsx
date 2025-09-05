"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { UserRoleContextType } from "~~/interface";
import { UserRole } from "~~/types";

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("worker");

  return <UserRoleContext.Provider value={{ userRole, setUserRole }}>{children}</UserRoleContext.Provider>;
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) throw new Error("useUserRole must be used within a UserRoleProvider");
  return context;
};
