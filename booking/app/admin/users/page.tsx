"use client";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: "customer" | "organiser" | "provider" | "admin";
  is_active: number;
  is_verified: number;
  created_at: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

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

  const handleRoleChange = async (userId: string, role: UserRow["role"], name: string) => {
    if (role === "admin") {
      const ok = window.confirm(`Are you sure you want to grant admin access to ${name}?`);
      if (!ok) return;
    }

    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      setUsers(previous);
      setError("Failed to update user role. Please try again.");
    }
  };

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    const previous = users;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_active: currentState ? 0 : 1 } : u
      )
    );

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentState }),
    });

    if (!res.ok) {
      setUsers(previous);
      setError("Failed to update user status. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="h-10 px-3 border border-slate-200 rounded-lg text-[13px] w-full md:w-80 focus:outline-none focus:border-[#378ADD]"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#378ADD]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="organiser">Organiser</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#378ADD]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100">
              <tr>
                <th className="py-2 text-[13px] text-slate-500">Name</th>
                <th className="py-2 text-[13px] text-slate-500">Email</th>
                <th className="py-2 text-[13px] text-slate-500">Role</th>
                <th className="py-2 text-[13px] text-slate-500">Status</th>
                <th className="py-2 text-[13px] text-slate-500">Joined</th>
                <th className="py-2 text-[13px] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-3"><span className="inline-block h-4 w-24 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-32 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-20 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-20 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-20 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-20 bg-slate-100 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px] text-slate-500">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isSelf = false; // excluded by API, kept for guard parity
                  return (
                    <tr key={user.id} className="border-b border-slate-50">
                      <td className="py-3 text-[13px] text-slate-800">{user.full_name}</td>
                      <td className="py-3 text-[13px] text-slate-600">{user.email}</td>
                      <td className="py-3">
                        <select
                          value={user.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            void handleRoleChange(
                              user.id,
                              e.target.value as UserRow["role"],
                              user.full_name
                            )
                          }
                          className="text-[13px] border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#378ADD] disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="organiser">Organiser</option>
                          <option value="provider">Provider</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
                            user.is_active
                              ? "bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]"
                              : "bg-[#F1EFE8] text-[#5F5E5A] border-[#D3D1C7]"
                          }`}
                        >
                          {user.is_active ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-[13px] text-slate-600">
                        {new Date(user.created_at * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {!isSelf && (
                          <button
                            onClick={() =>
                              void handleToggleActive(user.id, user.is_active === 1)
                            }
                            className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${
                              user.is_active
                                ? "bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97] hover:bg-[#C0DD97]"
                                : "bg-[#F1EFE8] text-[#5F5E5A] border-[#D3D1C7] hover:bg-[#D3D1C7]"
                            }`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
