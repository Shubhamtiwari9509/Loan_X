import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Filter,
  X,
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  CalendarDays,
  UserRound,
  Wallet,
  Clock3,
  CreditCard,
  Percent,
} from "lucide-react";
import { adminApi } from "../../api/client.js";
import { Skeleton } from "../../components/common/Skeleton.jsx";

function AdminPredictionsSkeleton() {
  return (
    <div className="w-full space-y-6 pb-4">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Predictions Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>

        <div className="overflow-hidden">
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-9 gap-4 px-4 py-4 bg-slate-50/80 border-b border-slate-200">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16" />
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-9 gap-4 items-center px-4 py-5"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-28" />
                    </div>
                  </div>

                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-52 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <Skeleton className="w-9 h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decisionFilter, setDecisionFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function fetchPredictions() {
      const minimumDelay = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      try {
        setLoading(true);
        setError(null);

        const params = { page, limit: 12 };

        if (decisionFilter) params.decision = decisionFilter;
        if (purposeFilter) params.loanPurpose = purposeFilter;

        const [res] = await Promise.all([
          adminApi.getPredictions(params),
          minimumDelay,
        ]);

        if (!isActive) return;

        if (res.success) {
          setPredictions(res.predictions || []);
          setTotalPages(res.pagination?.pages || 1);
          setTotalCount(res.pagination?.total || 0);
        } else {
          setError("Unable to retrieve predictions.");
        }
      } catch (err) {
        await minimumDelay;

        if (isActive) {
          setError(err.message || "Failed to load predictions.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchPredictions();

    return () => {
      isActive = false;
    };
  }, [page, decisionFilter, purposeFilter, refreshKey]);

  const clearFilters = () => {
    setDecisionFilter("");
    setPurposeFilter("");
    setPage(1);
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getFeatureLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const activeFilters = Boolean(decisionFilter || purposeFilter);

  if (loading) {
    return <AdminPredictionsSkeleton />;
  }

  return (
    <div className="w-full space-y-6 pb-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>PLATFORM MANAGEMENT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Loan Predictions
          </h1>

          <p className="text-sm text-slate-500 mt-1.5">
            Monitor and inspect loan applications evaluated across the platform.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Applications
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {totalCount.toLocaleString("en-IN")}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Platform prediction records
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current View
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {predictions.length}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Records on this page
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Filter Applications
              </h3>
              <p className="text-xs text-slate-500">
                Narrow down prediction records
              </p>
            </div>
          </div>

          {activeFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start sm:self-auto"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Prediction Decision
            </label>

            <select
              value={decisionFilter}
              onChange={(e) => {
                setDecisionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="">All Decisions</option>
              <option value="Approved">Approved Only</option>
              <option value="Rejected">Rejected Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Loan Purpose
            </label>

            <select
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="">All Loan Purposes</option>
              <option value="Home">Home Loan</option>
              <option value="Business">Business</option>
              <option value="Car">Car</option>
              <option value="Education">Education</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        {activeFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Active filters:</span>

            {decisionFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                {decisionFilter}
                <button
                  onClick={() => {
                    setDecisionFilter("");
                    setPage(1);
                  }}
                  aria-label="Remove decision filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {purposeFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                {purposeFilter}
                <button
                  onClick={() => {
                    setPurposeFilter("");
                    setPage(1);
                  }}
                  aria-label="Remove purpose filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Predictions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Application Records
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Detailed overview of evaluated loan applications
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start">
            {totalCount.toLocaleString("en-IN")} records
          </span>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Unable to load predictions
            </h3>

            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {error}
            </p>

            <button
              onClick={() => setRefreshKey((key) => key + 1)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              No applications found
            </h3>

            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No prediction records match the selected filters.
            </p>

            {activeFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    {[
                      "Applicant",
                      "Loan Amount",
                      "Term",
                      "Purpose",
                      "Credit Score",
                      "DTI Ratio",
                      "Decision",
                      "Probability",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {predictions.map((p) => {
                    const isApproved = p.decision === "Approved";
                    const probPercent = Math.round(
                      (p.approvalProbability || 0) * 100
                    );

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <UserRound className="w-4 h-4 text-slate-500" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 whitespace-nowrap">
                                {p.userId?.name || "Anonymous Applicant"}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">
                                {p.userId?.email || "No email available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-xs font-bold text-slate-900 whitespace-nowrap">
                          ₹ {formatCurrency(p.inputFeatures?.Loan_Amount)}
                        </td>

                        <td className="px-4 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          {p.inputFeatures?.Loan_Term ?? "—"} months
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold whitespace-nowrap">
                            {p.inputFeatures?.Loan_Purpose || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-xs font-bold text-slate-800 tabular-nums">
                          {p.inputFeatures?.Credit_Score ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-xs font-semibold text-slate-700 tabular-nums">
                          {Math.round(
                            (p.inputFeatures?.DTI_Ratio || 0) * 100
                          )}%
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold border ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {p.decision || "Unknown"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(0, probPercent))}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-800 tabular-nums">
                              {probPercent}%
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedPrediction(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-[10px] font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect
                          </button>
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
                  {predictions.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {totalCount}
                </span>{" "}
                applications
                <span className="mx-2 text-slate-300">|</span>
                Page{" "}
                <span className="font-bold text-slate-800">{page}</span> of{" "}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
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

      {/* Prediction Details Modal */}
      {selectedPrediction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setSelectedPrediction(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 sm:px-6 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Prediction Inspection
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 break-all">
                  Loan Prediction #{selectedPrediction._id}
                </h3>

                <p className="text-xs text-slate-500 mt-1 break-words">
                  {selectedPrediction.userId?.name || "Anonymous Applicant"}
                  {selectedPrediction.userId?.email
                    ? ` · ${selectedPrediction.userId.email}`
                    : ""}
                </p>
              </div>

              <button
                onClick={() => setSelectedPrediction(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 shrink-0 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Result Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Predicted Decision
                  </div>

                  <p
                    className={`text-xl font-bold mt-2 ${
                      selectedPrediction.decision === "Approved"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {selectedPrediction.decision || "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Percent className="w-4 h-4" />
                    Approval Probability
                  </div>

                  <p className="text-xl font-bold text-slate-900 mt-2">
                    {Math.round(
                      (selectedPrediction.approvalProbability || 0) * 100
                    )}%
                  </p>
                </div>
              </div>

              {/* Application Information */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Application Information
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Wallet className="w-3 h-3" />
                      Loan Amount
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      ₹ {formatCurrency(selectedPrediction.inputFeatures?.Loan_Amount)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Clock3 className="w-3 h-3" />
                      Loan Term
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {selectedPrediction.inputFeatures?.Loan_Term ?? "—"} months
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <CreditCard className="w-3 h-3" />
                      Credit Score
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {selectedPrediction.inputFeatures?.Credit_Score ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Snapshot */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Feature Snapshot
                  </h4>

                  <span className="text-[10px] text-slate-400">
                    Input values used for this prediction
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(selectedPrediction.inputFeatures || {}).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="min-w-0 p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <span className="text-[10px] text-slate-500 block font-semibold mb-1.5">
                          {getFeatureLabel(key)}
                        </span>

                        <span className="text-xs font-bold text-slate-800 break-words">
                          {typeof val === "number" && key.includes("Income")
                            ? `₹ ${val.toLocaleString("en-IN")}`
                            : String(val ?? "—")}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Record Date */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <CalendarDays className="w-4 h-4" />
                <span>
                  Application date:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatDate(selectedPrediction.createdAt)}
                  </span>
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 sm:px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedPrediction(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
