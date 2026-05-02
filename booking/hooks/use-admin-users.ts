"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAdminUsers, patchAdminUser } from "@/lib/services/admin-service";
import type { AdminUser } from "@/features/admin/types";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers());
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchesSearch =
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && u.is_active === 1) ||
          (statusFilter === "inactive" && u.is_active === 0);
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [users, search, roleFilter, statusFilter]
  );

  const updateRole = useCallback(async (userId: string, role: AdminUser["role"]) => {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    try {
      await patchAdminUser(userId, { role });
    } catch {
      setUsers(previous);
      setError("Failed to update user role. Please try again.");
    }
  }, [users]);

  const toggleActive = useCallback(async (userId: string, currentState: boolean) => {
    const previous = users;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: currentState ? 0 : 1 } : u))
    );
    try {
      await patchAdminUser(userId, { is_active: !currentState });
    } catch {
      setUsers(previous);
      setError("Failed to update user status. Please try again.");
    }
  }, [users]);

  return {
    users,
    filtered,
    loading,
    error,
    search,
    roleFilter,
    statusFilter,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    updateRole,
    toggleActive,
    reload: load,
  };
}
