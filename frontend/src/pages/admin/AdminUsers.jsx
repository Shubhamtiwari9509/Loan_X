import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  Loader2,
  RefreshCw,
  UserRound,
  UserCog,
  Activity,
  CalendarDays,
  Shield,
} from "lucide-react";
import { adminApi } from "../../api/client.js";
import { Alert } from "../../components/common/Alert.jsx";
import { Skeleton } from "../../components/common/Skeleton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminUsersSkeleton() {
  return (
    <div className="w-full space-y-6 pb-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="w-11 h-11 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {[
                  "User Account",
                  "Access Role",
                  "Evaluations",
                  "Registered Date",
                  "Manage Access",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3.5"
                  >
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <tr key={row}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <Skeleton className="h-9 w-32 rounded-xl" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <Skeleton className="w-9 h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUsers = async () => {
    const minimumDelay = new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    try {
      setLoading(true);

      const [res] = await Promise.all([
        adminApi.getUsers({ page, limit: 10 }),
        minimumDelay,
      ]);

      if (res.success) {
        setUsers(res.users || []);
        setTotalPages(res.pagination?.pages || 1);
        setTotalCount(res.pagination?.total || 0);
      } else {
        setFeedback({
          type: "error",
          message: "Unable to retrieve users.",
        });
      }
    } catch (err) {
      await minimumDelay;

      setFeedback({
        type: "error",
        message: err.message || "Failed to load users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, refreshKey]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const actionLabel =
      newRole === "admin" ? "promote to Admin" : "demote to User";

    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} for this account?`
      )
    ) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      setFeedback(null);

      const res = await adminApi.updateUserRole(userId, newRole);

      if (res.success) {
        setFeedback({
          type: "success",
          message: `User role successfully updated to ${newRole}.`,
        });

        await fetchUsers();
      } else {
        setFeedback({
          type: "error",
          message: "Unable to update user role.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update user role.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const adminCount = users.filter((user) => user.role === "admin").length;
  const regularUserCount = users.filter(
    (user) => user.role !== "admin"
  ).length;

  if (loading) {
    return <AdminUsersSkeleton />;
  }

  return (
    <div className="w-full space-y-6 pb-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
            <Users className="w-4 h-4" />
            <span>PLATFORM MANAGEMENT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>

          <p className="text-sm text-slate-500 mt-1.5">
            Manage registered accounts, platform roles and user activity.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Users
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Registered Users
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {totalCount.toLocaleString("en-IN")}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Platform accounts
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Admin Accounts
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {adminCount}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                On this page
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Regular Users
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {regularUserCount}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                On this page
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UserRound className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Registered Accounts
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Review account details and manage access permissions.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start">
            {totalCount.toLocaleString("en-IN")} accounts
          </span>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-slate-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              No users found
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              No registered user accounts are available.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      User Account
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Access Role
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Evaluations
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Registered Date
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                      Manage Access
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isAdmin = u.role === "admin";
                    const isSelf = u._id === currentUser?._id;
                    const isUpdating = updatingUserId === u._id;

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        {/* User Account */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                                isAdmin
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {u.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {u.name || "Unknown User"}
                              </p>

                              <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[220px]">
                                {u.email || "No email available"}
                              </p>

                              {isSelf && (
                                <span className="inline-flex mt-1 text-[9px] font-bold text-blue-600 uppercase tracking-wide">
                                  Your account
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold border ${
                              isAdmin
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isAdmin ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserRound className="w-3.5 h-3.5" />
                            )}

                            <span className="capitalize">
                              {u.role || "user"}
                            </span>
                          </span>
                        </td>

                        {/* Evaluations */}
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <Activity className="w-4 h-4 text-indigo-600" />
                            </div>

                            <span className="text-sm font-bold text-slate-800 tabular-nums">
                              {u.predictionCount || 0}
                            </span>
                          </div>
                        </td>

                        {/* Registered Date */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600 whitespace-nowrap">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(u.createdAt)}
                          </div>
                        </td>

                        {/* Access Action */}
                        <td className="px-4 py-4 text-right">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold whitespace-nowrap">
                              <Shield className="w-3.5 h-3.5" />
                              Current Account
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleRoleToggle(u._id, u.role)
                              }
                              disabled={updatingUserId !== null}
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                isAdmin
                                  ? "bg-white border-rose-200 text-rose-600 hover:bg-rose-50"
                                  : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserCog className="w-3.5 h-3.5" />
                              )}

                              {isUpdating
                                ? "Updating..."
                                : isAdmin
                                  ? "Demote to User"
                                  : "Promote to Admin"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {users.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {totalCount}
                </span>{" "}
                users
                <span className="mx-2 text-slate-300">|</span>
                Page{" "}
                <span className="font-bold text-slate-800">{page}</span> of{" "}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(totalPages, current + 1)
                      )
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
