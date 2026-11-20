import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { predictionApi } from "../api/client.js";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { Skeleton } from "../components/common/Skeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Minimum skeleton display duration
const MIN_SKELETON_TIME = 1000;

// Dashboard Skeleton
function UserDashboardSkeleton() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Welcome Banner Skeleton */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full space-y-3">
          <Skeleton className="!bg-white/15 h-3 w-32" />
          <Skeleton className="!bg-white/15 h-8 sm:h-9 w-52 max-w-full" />
          <Skeleton className="!bg-white/15 h-4 w-full max-w-lg" />
        </div>

        <Skeleton className="!bg-white/15 h-12 w-full md:w-48 rounded-xl shrink-0" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative min-h-[190px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-36 max-w-full" />
              </div>

              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
            </div>

            <div className="absolute bottom-0 right-0 w-[58%] space-y-2 p-3">
              <Skeleton className="h-1 w-full rounded-full" />
              <Skeleton className="h-1 w-4/5 rounded-full" />
            </div>

            <div className="absolute bottom-3 left-5 sm:left-6">
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Predictions Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>

          <Skeleton className="h-4 w-28 hidden sm:block" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Date",
                  "Loan Amount",
                  "Term",
                  "Purpose",
                  "Verdict",
                  "Approval Prob",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4 text-left">
                    <Skeleton className="h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-100">
                  <td className="py-4 px-4">
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-3 w-24" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-3 w-12" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-3 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Premium KPI Card
function MetricCard({ title, value, subtitle, icon: Icon, variant = "blue" }) {
  const themes = {
    blue: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      glow: "from-blue-500/10",
      line: "#3B82F6",
      fill: "#3B82F6",
      label: "Overview",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      glow: "from-emerald-500/10",
      line: "#10B981",
      fill: "#10B981",
      label: "Positive",
    },
    red: {
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      glow: "from-rose-500/10",
      line: "#F43F5E",
      fill: "#F43F5E",
      label: "Negative",
    },
    orange: {
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      glow: "from-orange-500/10",
      line: "#F97316",
      fill: "#F97316",
      label: "Activity",
    },
  };

  const theme = themes[variant] || themes.blue;

  return (
    <div className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl sm:p-6">
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${theme.glow} to-transparent blur-2xl transition-transform duration-500 group-hover:scale-150`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {value}
          </h3>

          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor} ring-1 ring-black/[0.03] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 h-[76px] w-[58%] opacity-90 transition-all duration-300 group-hover:opacity-100">
        <svg
          viewBox="0 0 220 76"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`area-${variant}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={theme.fill} stopOpacity="0.20" />
              <stop offset="100%" stopColor={theme.fill} stopOpacity="0" />
            </linearGradient>

            <filter
              id={`glow-${variant}`}
              x="-30%"
              y="-100%"
              width="160%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M0 58 C18 54 23 62 42 47 S68 52 85 38 S112 46 130 27 S158 37 176 18 S201 22 220 7 V76 H0 Z"
            fill={`url(#area-${variant})`}
          />

          <path
            d="M0 58 C18 54 23 62 42 47 S68 52 85 38 S112 46 130 27 S158 37 176 18 S201 22 220 7"
            fill="none"
            stroke={theme.line}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter={`url(#glow-${variant})`}
            className="metric-line"
          />

          <circle cx="220" cy="7" r="4" fill={theme.line} />

          <circle
            cx="220"
            cy="7"
            r="7"
            fill={theme.line}
            opacity="0.18"
            className="metric-pulse"
          />
        </svg>
      </div>

      <div className="absolute bottom-3 left-5 z-10 flex items-center gap-1.5 sm:left-6">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            variant === "green"
              ? "bg-emerald-500"
              : variant === "red"
                ? "bg-rose-500"
                : variant === "orange"
                  ? "bg-orange-500"
                  : "bg-blue-500"
          }`}
        />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
          {theme.label}
        </span>
      </div>

      <style>{`
        .metric-line {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: metricDraw 1.8s ease-out forwards;
        }

        .metric-pulse {
          transform-origin: 220px 7px;
          animation: metricPulse 2s ease-in-out infinite;
        }

        @keyframes metricDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes metricPulse {
          0%, 100% {
            opacity: 0.12;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.5);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .metric-line,
          .metric-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export function UserDashboard() {
  const { user } = useAuth();

  const [predictions, setPredictions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUserPredictions() {
      const startTime = Date.now();

      try {
        const res = await predictionApi.getAll({ limit: 5 });

        if (isMounted && res.success) {
          setPredictions(res.predictions || []);
          setTotalCount(res.pagination?.total || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load prediction records.");
        }
      } finally {
        // Keep skeleton visible for at least 1 second.
        // If API takes longer, wait for the API response.
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(
          0,
          MIN_SKELETON_TIME - elapsedTime
        );

        await new Promise((resolve) => setTimeout(resolve, remainingTime));

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUserPredictions();

    return () => {
      isMounted = false;
    };
  }, []);

  const approvedCount = predictions.filter(
    (p) => p.decision === "Approved"
  ).length;

  const rejectedCount = predictions.filter(
    (p) => p.decision === "Rejected"
  ).length;

  const approvalRate =
    predictions.length > 0
      ? Math.round((approvedCount / predictions.length) * 100)
      : 0;

  if (loading) {
    return <UserDashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
            Applicant Dashboard
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name || "Applicant"}!
          </h1>

          <p className="text-xs sm:text-sm text-navy-300 max-w-lg">
            Track your personal loan evaluations, review probability scores,
            and run new scenarios anytime.
          </p>
        </div>

        <Link
          to="/new-prediction"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Loan Prediction</span>
        </Link>
      </div>

      {/* Premium KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Predictions"
          value={totalCount}
          icon={BarChart2}
          variant="orange"
          subtitle="All evaluations performed"
        />

        <MetricCard
          title="Approved Count"
          value={approvedCount}
          icon={CheckCircle2}
          variant="green"
          subtitle="Model positive outputs"
        />

        <MetricCard
          title="Rejected Count"
          value={rejectedCount}
          icon={XCircle}
          variant="red"
          subtitle="Model high-risk outputs"
        />

        <MetricCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          icon={TrendingUp}
          variant="blue"
          subtitle="Across your evaluations"
        />
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy-900">
              Recent Prediction Activity
            </h3>
            <p className="text-xs text-navy-400">
              Your latest loan evaluation requests
            </p>
          </div>

          {totalCount > 0 && (
            <Link
              to="/history"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
            >
              <span>View Full History ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : predictions.length === 0 ? (
          <EmptyState
            title="No evaluations yet"
            description="You haven't run any loan predictions yet. Fill out the application form to evaluate your approval probability."
            actionText="Start First Prediction"
            actionLink="/new-prediction"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-navy-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Loan Amount</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Approval Prob</th>
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
                              isApproved
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          ></span>
                          {p.decision}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
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
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
