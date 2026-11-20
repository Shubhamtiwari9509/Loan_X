import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChartColumn,
  RefreshCw,
  ShieldCheck,
  Wallet,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { adminApi } from "../../api/client.js";
import { Skeleton } from "../../components/common/Skeleton.jsx";

function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="space-y-5 pt-5">
              {[1, 2, 3, 4].map((row) => (
                <div key={row}>
                  <div className="flex justify-between gap-3 mb-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}

        {/* Information Panel Skeleton */}
        <div className="rounded-2xl bg-[#101F48] p-6 sm:p-7 min-h-[280px] flex flex-col justify-between">
          <div>
            <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
            <Skeleton className="h-3 w-40 mt-5 bg-white/10" />
            <Skeleton className="h-6 w-64 max-w-full mt-3 bg-white/10" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-3 w-full bg-white/10" />
              <Skeleton className="h-3 w-full bg-white/10" />
              <Skeleton className="h-3 w-4/5 bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-5 mt-6 border-t border-white/10">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-7 w-16 bg-white/10" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 bg-white/10" />
              <Skeleton className="h-7 w-16 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionCard({ title, subtitle, icon: Icon, items, color }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-emerald-500",
    purple: "bg-violet-500",
  };

  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>

      {items.length === 0 || total === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          No data available yet.
        </div>
      ) : (
        <div className="space-y-5 pt-5">
          {items.map((item) => {
            const percentage = (item.count / total) * 100;

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-slate-600">
                    {item.label}
                  </span>

                  <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                    {item.count.toLocaleString("en-IN")}
                    <span className="text-slate-400 font-medium ml-1">
                      ({Math.round(percentage)}%)
                    </span>
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-5 mt-5 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400">Total records</span>
        <span className="text-sm font-bold text-slate-800">
          {total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-3">{value}</p>
          <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    const minimumDelay = new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    try {
      setLoading(true);
      setError(null);

      const [results] = await Promise.all([
        Promise.allSettled([
          adminApi.getStats(),
          adminApi.getPredictions({ limit: 100 }),
        ]),
        minimumDelay,
      ]);

      const [statsResult, predResult] = results;

      if (statsResult.status === "rejected") {
        throw statsResult.reason;
      }

      if (predResult.status === "rejected") {
        throw predResult.reason;
      }

      const statsRes = statsResult.value;
      const predRes = predResult.value;

      if (!statsRes.success) {
        throw new Error("Unable to load analytics statistics.");
      }

      setStats(statsRes.stats);

      if (predRes.success) {
        setPredictions(predRes.predictions || []);
      }
    } catch (err) {
      await minimumDelay;
      setError(err.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const analytics = useMemo(() => {
    const purposeCounts = {};
    const creditTiers = {
      "Excellent (750+)": 0,
      "Good (700–749)": 0,
      "Fair (600–699)": 0,
      "Poor (Below 600)": 0,
    };
    const propertyCounts = {};

    predictions.forEach((prediction) => {
      const features = prediction.inputFeatures || {};

      const purpose = features.Loan_Purpose || "Other";
      purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;

      const score = Number(features.Credit_Score || 0);

      if (score >= 750) creditTiers["Excellent (750+)"]++;
      else if (score >= 700) creditTiers["Good (700–749)"]++;
      else if (score >= 600) creditTiers["Fair (600–699)"]++;
      else creditTiers["Poor (Below 600)"]++;

      const area = features.Property_Area || "Unknown";
      propertyCounts[area] = (propertyCounts[area] || 0) + 1;
    });

    return {
      purposeItems: Object.entries(purposeCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),

      creditItems: Object.entries(creditTiers).map(([label, count]) => ({
        label,
        count,
      })),

      propertyItems: Object.entries(propertyCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
    };
  }, [predictions]);

  if (loading) {
    return <AdminAnalyticsSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600 mb-4">
          {error || "Unable to load analytics."}
        </p>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight text-slate-900">
            Risk Analytics
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Understand applicant profiles and loan distribution across LoanX.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Recalculate
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <SummaryCard
          title="Average Loan Amount"
          value={`₹${Number(stats.avgLoanAmount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
          subtitle="Mean requested loan amount"
          icon={Wallet}
          color="blue"
        />

        <SummaryCard
          title="Approval Rate"
          value={`${Number(stats.approvalRate || 0)}%`}
          subtitle="Share of approved predictions"
          icon={TrendingUp}
          color="green"
        />

        <SummaryCard
          title="Total Evaluated Applications"
          value={Number(stats.totalPredictions || 0).toLocaleString("en-IN")}
          subtitle="All stored platform predictions"
          icon={ChartColumn}
          color="blue"
        />
      </div>

      {/* Distribution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistributionCard
          title="Credit Score Breakdown"
          subtitle="Applicant credit score segments"
          icon={ShieldCheck}
          items={analytics.creditItems}
          color="blue"
        />

        <DistributionCard
          title="Loan Purpose Distribution"
          subtitle="Applications grouped by loan purpose"
          icon={Building2}
          items={analytics.purposeItems}
          color="green"
        />

        <DistributionCard
          title="Property Area Distribution"
          subtitle="Applicant property location categories"
          icon={MapPin}
          items={analytics.propertyItems}
          color="purple"
        />

        {/* Information Panel */}
        <div className="rounded-2xl bg-[#101F48] p-6 sm:p-7 text-white shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <ChartColumn className="w-6 h-6 text-blue-300" />
            </div>

            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              LoanX Platform Insights
            </p>

            <h3 className="text-xl font-bold mt-2">
              Applicant Portfolio Overview
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mt-3">
              These distributions are calculated from the latest prediction
              records retrieved from the platform. They describe the
              available applicant data and do not represent model accuracy
              or independent model validation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-5 mt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400">Records analyzed</p>
              <p className="text-2xl font-bold mt-1">
                {predictions.length.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Total applications</p>
              <p className="text-2xl font-bold mt-1">
                {Number(stats.totalPredictions || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
