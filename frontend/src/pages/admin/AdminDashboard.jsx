import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { adminApi } from "../../api/client.js";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { Skeleton } from "../../components/common/Skeleton.jsx";

const MIN_SKELETON_TIME = 2000;

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* --------------------------------------------------
   ADMIN DASHBOARD SKELETON
-------------------------------------------------- */

function AdminDashboardSkeleton() {
  return (
    <div
      className="space-y-6 -mt-8"
      aria-busy="true"
      aria-label="Loading admin dashboard"
    >
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="hidden h-10 w-28 rounded-xl sm:block" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* KPI Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative min-h-[205px] overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-1 items-center gap-3">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-28 max-w-full" />
                    <Skeleton className="h-2 w-24 max-w-full" />
                  </div>
                </div>

                <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
              </div>

              <div className="mt-5 space-y-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-3 w-40 max-w-full" />
              </div>

              <div className="absolute bottom-4 left-5 sm:left-6">
                <Skeleton className="h-2 w-28" />
              </div>

              <div className="absolute bottom-0 right-0 w-[45%] space-y-2 p-3">
                <Skeleton className="h-1 w-full rounded-full" />
                <Skeleton className="h-1 w-4/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Skeleton */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Application Trend */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>

            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex h-[230px] flex-col justify-between py-4">
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
            <div className="flex items-end justify-between gap-3 px-2">
              {[35, 60, 45, 85, 55, 75, 95].map((height, index) => (
                <Skeleton
                  key={index}
                  className="w-full rounded-t-md rounded-b-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-between">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Decision Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>

          <div className="flex flex-col items-center">
            <Skeleton className="h-44 w-44 rounded-full" />

            <div className="mt-7 grid w-full grid-cols-2 gap-8">
              {[0, 1].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Insights Skeleton */}
      <section>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-3 w-44 max-w-full" />
              <Skeleton className="mt-4 h-8 w-28" />
              <Skeleton className="mt-3 h-3 w-40 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Applications Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>

          <Skeleton className="h-4 w-16" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80">
                {[
                  "Applicant",
                  "Loan Amount",
                  "Purpose",
                  "Credit Score",
                  "Decision",
                  "Probability",
                  "Date",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-left">
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-2 h-2 w-36" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-20" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-20" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-12" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-16" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-3 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   PREMIUM FINTECH METRIC CARD
-------------------------------------------------- */

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  footerLabel,
}) {
  const themes = {
    blue: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      glow: "bg-blue-500",
      line: "#3B82F6",
      fill: "#3B82F6",
      badge: "bg-blue-50 text-blue-700",
      label: "PLATFORM ACTIVITY",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      glow: "bg-emerald-500",
      line: "#10B981",
      fill: "#10B981",
      badge: "bg-emerald-50 text-emerald-700",
      label: "SUCCESSFUL DECISIONS",
    },
    red: {
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      glow: "bg-rose-500",
      line: "#F43F5E",
      fill: "#F43F5E",
      badge: "bg-rose-50 text-rose-700",
      label: "DECLINED DECISIONS",
    },
    violet: {
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      glow: "bg-violet-500",
      line: "#8B5CF6",
      fill: "#8B5CF6",
      badge: "bg-violet-50 text-violet-700",
      label: "DECISION PERFORMANCE",
    },
  };

  const theme = themes[variant];

  return (
    <div className="metric-card group relative min-h-[205px] overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.09)]">
      <div
        className={`absolute -right-12 -top-16 h-40 w-40 rounded-full ${theme.glow} opacity-[0.055] blur-3xl transition-all duration-500 group-hover:opacity-[0.12]`}
      />

      <div className="absolute right-0 top-0 h-28 w-28 overflow-hidden">
        <div
          className={`absolute -right-12 -top-12 h-28 w-28 rounded-full ${theme.glow} opacity-[0.035]`}
        />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor} ring-1 ring-black/[0.025]`}
          >
            <Icon className="h-[21px] w-[21px]" strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-[13px] font-semibold tracking-wide text-slate-500">
              {title}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.13em] text-slate-400">
              {theme.label}
            </p>
          </div>
        </div>

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${theme.badge}`}
        >
          {variant === "red" ? (
            <XCircle className="h-4 w-4" strokeWidth={2.3} />
          ) : variant === "green" || variant === "violet" ? (
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.3} />
          ) : (
            <Activity className="h-4 w-4" strokeWidth={2.3} />
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <h3 className="text-[32px] font-extrabold leading-none tracking-[-1.4px] text-slate-900 sm:text-[35px]">
          {value}
        </h3>

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 h-[88px] w-[57%] opacity-90 transition-all duration-300 group-hover:opacity-100">
        <svg
          viewBox="0 0 230 88"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`metric-fill-${variant}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={theme.fill} stopOpacity="0.19" />
              <stop offset="100%" stopColor={theme.fill} stopOpacity="0" />
            </linearGradient>

            <filter
              id={`metric-glow-${variant}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M0 68 L18 59 L36 64 L54 45 L72 53 L90 37 L108 43 L126 25 L144 35 L162 18 L180 28 L198 11 L230 5 L230 88 L0 88 Z"
            fill={`url(#metric-fill-${variant})`}
          />

          <path
            className="metric-chart-line"
            d="M0 68 L18 59 L36 64 L54 45 L72 53 L90 37 L108 43 L126 25 L144 35 L162 18 L180 28 L198 11 L230 5"
            fill="none"
            stroke={theme.line}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#metric-glow-${variant})`}
          />

          <circle
            cx="230"
            cy="5"
            r="4"
            fill={theme.line}
            className="metric-chart-dot"
          />

          <circle
            cx="230"
            cy="5"
            r="8"
            fill={theme.line}
            opacity="0.13"
            className="metric-chart-pulse"
          />
        </svg>
      </div>

      <div className="absolute bottom-4 left-5 z-10 sm:left-6">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${theme.glow}`} />
          <span className="text-[9px] font-bold tracking-[0.12em] text-slate-400">
            {footerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   APPLICATION TREND
-------------------------------------------------- */

function ApplicationTrend({ predictions }) {
  const dailyData = React.useMemo(() => {
    const dates = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      dates.push({
        key: date.toDateString(),
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        count: 0,
      });
    }

    predictions.forEach((prediction) => {
      if (!prediction.createdAt) return;

      const predictionDate = new Date(prediction.createdAt);
      predictionDate.setHours(0, 0, 0, 0);

      const matchingDate = dates.find(
        (item) => item.key === predictionDate.toDateString()
      );

      if (matchingDate) matchingDate.count++;
    });

    return dates;
  }, [predictions]);

  const maxCount = Math.max(...dailyData.map((item) => item.count), 1);

  const chartPoints = dailyData.map((item, index) => ({
    x: 35 + index * 90,
    y: 155 - (item.count / maxCount) * 115,
    ...item,
  }));

  const path = chartPoints
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Loan Application Trend
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Applications recorded over the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Applications
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center text-sm text-slate-400">
          No application data available yet.
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <svg
            viewBox="0 0 600 205"
            className="h-auto w-full"
            role="img"
            aria-label="Loan application trend for the last seven days"
          >
            <defs>
              <linearGradient
                id="loanTrendGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {[40, 95, 150].map((y) => (
              <line
                key={y}
                x1="30"
                y1={y}
                x2="580"
                y2={y}
                stroke="#E9EEF6"
                strokeDasharray="4 5"
              />
            ))}

            <path
              d={`${path} L 575 175 L 35 175 Z`}
              fill="url(#loanTrendGradient)"
            />

            <path
              d={path}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chartPoints.map((point) => (
              <g key={point.key}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4.5"
                  fill="white"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <text
                  x={point.x}
                  y="195"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#94A3B8"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-2 flex items-center justify-between px-2">
            <span className="text-[11px] text-slate-400">
              Showing up to 100 recent records
            </span>
            <span className="text-[11px] font-semibold text-slate-600">
              {predictions.length} records loaded
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------
   DECISION DISTRIBUTION
-------------------------------------------------- */

function DecisionDistribution({ stats }) {
  const approved = Number(stats?.approvedPredictions || 0);
  const rejected = Number(stats?.rejectedPredictions || 0);
  const total = approved + rejected;

  const approvalRate = total > 0 ? (approved / total) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

  return (
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900">
          Decision Distribution
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Overall loan prediction results
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-full"
          style={{
            background:
              total > 0
                ? `conic-gradient(#2563EB 0% ${approvalRate}%, #F59E0B ${approvalRate}% 100%)`
                : "#E2E8F0",
          }}
        >
          <div className="flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-bold text-slate-900">
              {total > 0 ? `${Math.round(approvalRate)}%` : "—"}
            </span>
            <span className="mt-1 text-[11px] text-slate-400">
              Approval Rate
            </span>
          </div>
        </div>

        <div className="mt-7 grid w-full grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="text-xs text-slate-500">Approved</span>
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {approved.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-400">
              {approvalRate.toFixed(1)}%
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500">Rejected</span>
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {rejected.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-400">
              {rejectionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   ADMIN DASHBOARD
-------------------------------------------------- */

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    const startTime = Date.now();

    try {
      setLoading(true);
      setError(null);

      const [statsRes, predictionsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPredictions({ limit: 100 }),
      ]);

      if (!statsRes.success) {
        throw new Error("Failed to load dashboard statistics.");
      }

      setData(statsRes.stats);

      if (predictionsRes.success) {
        setPredictions(predictionsRes.predictions || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(
        0,
        MIN_SKELETON_TIME - elapsedTime
      );

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="mb-4 text-sm font-semibold text-rose-600">
          {error || "Unable to load dashboard data."}
        </p>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  const recentPredictions = predictions.slice(0, 5);

  const totalPredictions = Number(data.totalPredictions || 0);
  const approvedPredictions = Number(data.approvedPredictions || 0);
  const rejectedPredictions = Number(data.rejectedPredictions || 0);
  const approvalRate = Number(data.approvalRate || 0);

  return (
    <div className="space-y-6 -mt-8">
      <style>{`
        @keyframes loanxLineDraw {
          from {
            stroke-dashoffset: 420;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes loanxDotPulse {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.38;
            transform: scale(1.3);
          }
        }

        .metric-chart-line {
          stroke-dasharray: 420;
          stroke-dashoffset: 0;
          animation: loanxLineDraw 2.2s ease-out both;
        }

        .metric-chart-dot {
          animation: loanxDotPulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        .metric-chart-pulse {
          animation: loanxDotPulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .metric-chart-line,
          .metric-chart-dot,
          .metric-chart-pulse {
            animation: none;
          }
        }
      `}</style>

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              LoanX Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor loan applications, decisions and platform performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:flex">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">
              {Number(data.totalUsers || 0).toLocaleString("en-IN")} Users
            </span>
          </div>

          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Premium KPI Cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Platform Performance
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Key loan application indicators
            </p>
          </div>

          <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold tracking-wider text-slate-500">
            LIVE METRICS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Predictions"
            value={totalPredictions.toLocaleString("en-IN")}
            subtitle="Total applications evaluated"
            icon={FileSpreadsheet}
            variant="blue"
            footerLabel="TOTAL APPLICATIONS"
          />

          <MetricCard
            title="Approved"
            value={approvedPredictions.toLocaleString("en-IN")}
            subtitle="Applications with approved decisions"
            icon={CheckCircle2}
            variant="green"
            footerLabel="APPROVED APPLICATIONS"
          />

          <MetricCard
            title="Rejected"
            value={rejectedPredictions.toLocaleString("en-IN")}
            subtitle="Applications with rejected decisions"
            icon={XCircle}
            variant="red"
            footerLabel="REJECTED APPLICATIONS"
          />

          <MetricCard
            title="Approval Rate"
            value={`${approvalRate.toFixed(1)}%`}
            subtitle="Share of approved applications"
            icon={TrendingUp}
            variant="violet"
            footerLabel="OVERALL APPROVAL RATE"
          />
        </div>
      </section>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ApplicationTrend predictions={predictions} />
        </div>

        <div className="xl:col-span-2">
          <DecisionDistribution stats={data} />
        </div>
      </div>

      {/* Portfolio Summary */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-800">
            Portfolio Insights
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Additional statistics across evaluated applications
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2 text-slate-500">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">
                Average Approval Probability
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {Math.round(
                Number(data.avgApprovalProbability || 0) * 100
              )}
              %
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Mean model prediction probability
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2 text-slate-500">
              <BarChart3 className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-medium">
                Average Credit Score
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {Number(data.avgCreditScore || 0).toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Average applicant credit score
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">
                Average Loan Amount
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(data.avgLoanAmount)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Average requested loan amount
            </p>
          </div>
        </div>
      </section>

      {/* Recent Applications */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Applications
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Latest loan predictions processed by LoanX
            </p>
          </div>

          <Link
            to="/admin/predictions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPredictions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No applications yet"
              description="New loan predictions will appear here when applicants use LoanX."
              actionText="View Predictions"
              actionLink="/admin/predictions"
              icon={FileSpreadsheet}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4 font-semibold">Applicant</th>
                  <th className="px-5 py-4 font-semibold">Loan Amount</th>
                  <th className="px-5 py-4 font-semibold">Purpose</th>
                  <th className="px-5 py-4 font-semibold">Credit Score</th>
                  <th className="px-5 py-4 font-semibold">Decision</th>
                  <th className="px-5 py-4 font-semibold">Probability</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentPredictions.map((prediction) => {
                  const isApproved = prediction.decision === "Approved";
                  const probability = Math.round(
                    Number(prediction.approvalProbability || 0) * 100
                  );

                  return (
                    <tr
                      key={prediction._id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {prediction.userId?.name || "Anonymous Applicant"}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {prediction.userId?.email || "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">
                        {formatCurrency(
                          prediction.inputFeatures?.Loan_Amount
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {prediction.inputFeatures?.Loan_Purpose || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {prediction.inputFeatures?.Credit_Score ?? "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {prediction.decision || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                isApproved
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, probability)
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {probability}%
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDate(prediction.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <span className="text-[11px] text-slate-400">
            Showing {recentPredictions.length} recent records
          </span>

          <Link
            to="/admin/predictions"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage Applications
          </Link>
        </div>
      </div>
    </div>
  );
}
