import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  PlusCircle,
} from "lucide-react";
import { predictionApi } from "../api/client.js";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { Skeleton } from "../components/common/Skeleton.jsx";

function PredictionHistorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Date",
                  "Loan Amount",
                  "Term",
                  "Purpose",
                  "Credit Score",
                  "DTI",
                  "Verdict",
                  "Probability",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 7 }).map((_, index) => (
                <tr key={index}>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-10" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-7 w-14 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decisionFilter, setDecisionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchHistory() {
      const minimumDelay = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      try {
        setLoading(true);
        setError(null);

        const params = { page, limit: 10 };
        if (decisionFilter) params.decision = decisionFilter;

        const [res] = await Promise.all([
          predictionApi.getAll(params),
          minimumDelay,
        ]);

        if (res.success) {
          setPredictions(res.predictions || []);
          setTotalPages(res.pagination?.pages || 1);
          setTotalCount(res.pagination?.total || 0);
        }
      } catch (err) {
        await minimumDelay;
        setError(err.message || "Failed to load prediction history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [page, decisionFilter]);

  const handleFilterChange = (decision) => {
    setDecisionFilter(decision);
    setPage(1);
  };

  if (loading) {
    return <PredictionHistorySkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Review all previous loan evaluations stored for your account ({totalCount} total)
          </p>
        </div>

        <Link
          to="/new-prediction"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Prediction</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Filter className="w-4 h-4 text-navy-400 mr-1" />

        <button
          onClick={() => handleFilterChange("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            decisionFilter === ""
              ? "bg-navy-900 text-white"
              : "text-navy-600 hover:bg-slate-100"
          }`}
        >
          All Decisions
        </button>

        <button
          onClick={() => handleFilterChange("Approved")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            decisionFilter === "Approved"
              ? "bg-emerald-600 text-white"
              : "text-navy-600 hover:bg-slate-100"
          }`}
        >
          Approved Only
        </button>

        <button
          onClick={() => handleFilterChange("Rejected")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            decisionFilter === "Rejected"
              ? "bg-rose-600 text-white"
              : "text-navy-600 hover:bg-slate-100"
          }`}
        >
          Rejected Only
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        {error ? (
          <div className="py-8 text-center">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        ) : predictions.length === 0 ? (
          <EmptyState
            title="No records found"
            description={
              decisionFilter
                ? `No ${decisionFilter} predictions found matching your filter.`
                : "You have not run any loan evaluations yet."
            }
            actionText="New Loan Evaluation"
            actionLink="/new-prediction"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-navy-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Loan Amount</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Credit Score</th>
                    <th className="py-3 px-4">DTI</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4">Probability</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {predictions.map((p) => {
                    const isApproved = p.decision === "Approved";
                    const probPercent = Math.round(
                      p.approvalProbability * 100
                    );

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-navy-500 font-medium">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-navy-900">
                          &#8377;{" "}
                          {Number(
                            p.inputFeatures?.Loan_Amount || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="py-3.5 px-4 text-navy-600 font-medium">
                          {p.inputFeatures?.Loan_Term} mos
                        </td>

                        <td className="py-3.5 px-4 text-navy-600 font-medium">
                          {p.inputFeatures?.Loan_Purpose}
                        </td>

                        <td className="py-3.5 px-4 text-navy-600 font-medium">
                          {p.inputFeatures?.Credit_Score}
                        </td>

                        <td className="py-3.5 px-4 text-navy-600 font-medium">
                          {Math.round(
                            (p.inputFeatures?.DTI_Ratio || 0) * 100
                          )}%
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isApproved ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            ></span>
                            {p.decision}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isApproved
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${probPercent}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-navy-800">
                              {probPercent}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/prediction-result/${p._id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-bold text-navy-700 transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-navy-500 font-medium">
                  Page {page} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 text-navy-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 text-navy-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
