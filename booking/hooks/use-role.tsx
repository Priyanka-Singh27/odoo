"use client";

import { useState, useEffect, createContext, useContext } from "react";

export type Role = "customer" | "organiser" | "admin";

interface RoleContextType {
  role: Role;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("customer");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this might fetch from /api/auth/me
    // For now, we'll try to read it from a cookie or a simple API call
    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/role");
        if (res.ok) {
          const data = await res.json();
          setRole(data.role || "customer");
        }
      } catch (e) {
        console.error("Failed to fetch role", e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Alias for the requested naming pattern
export const useService = (serviceName: string) => {
  if (serviceName === 'appointment.role') {
    return useRole();
  }
  throw new Error(`Service ${serviceName} not found`);
};
