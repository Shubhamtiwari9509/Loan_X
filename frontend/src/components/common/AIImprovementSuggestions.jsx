import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  Lightbulb,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { improvementApi } from "../../api/client.js";

const priorityStyles = {
  High: {
    badge: "bg-red-50 text-red-600 border-red-100",
    dot: "bg-red-500",
  },
  Medium: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  Low: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
};

function SuggestionCard({ suggestion, index }) {
  const priority =
    priorityStyles[suggestion.priority] || priorityStyles.Medium;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50/70 transition-transform duration-300 group-hover:scale-125" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {index === 0 ? (
              <Target size={21} />
            ) : index === 1 ? (
              <TrendingUp size={21} />
            ) : (
              <ShieldCheck size={21} />
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${priority.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {suggestion.priority} Priority
          </span>
        </div>

        <h3 className="mb-2 text-base font-bold text-slate-900">
          {suggestion.title}
        </h3>

        <div className="mb-4 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
          <Lightbulb size={13} className="shrink-0 text-amber-500" />
          <span className="truncate">
            Related factor: {suggestion.relatedFactor}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Why it matters
            </p>
            <p className="text-sm leading-6 text-slate-600">
              {suggestion.reason}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <CheckCircle2 size={14} />
              Recommended action
            </p>
            <p className="text-sm leading-6 text-slate-700">
              {suggestion.action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIImprovementSuggestions({ predictionId }) {
  const [improvementPlan, setImprovementPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSuggestions = async () => {
    if (!predictionId) {
      setError("Prediction ID is missing. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await improvementApi.getSuggestions(predictionId);

      if (
        !response?.success ||
        !response?.improvementPlan?.summary ||
        !Array.isArray(response?.improvementPlan?.suggestions) ||
        response.improvementPlan.suggestions.length === 0
      ) {
        throw new Error("The AI returned an invalid improvement plan.");
      }

      setImprovementPlan(response.improvementPlan);
    } catch (err) {
      setError(
        err.message ||
          "Unable to generate improvement suggestions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Sparkles size={14} />
              GROQ POWERED AI
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Loan Improvement Plan
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/70">
              Discover practical steps to strengthen your financial profile
              using your loan prediction and explainable AI insights.
            </p>
          </div>

          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-blue-200 sm:flex">
            <TrendingUp size={32} />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Initial state */}
        {!improvementPlan && !loading && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-9 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Wallet size={26} />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Your personalized improvement plan is ready to generate
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Let AI analyze your financial details and important SHAP factors
              to suggest practical improvement actions.
            </p>

            <button
              type="button"
              onClick={generateSuggestions}
              disabled={loading}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={17} />
              Generate My Improvement Plan
              <ArrowUpRight size={16} />
            </button>

            <p className="mt-3 text-xs text-slate-400">
              AI-generated suggestions based on your saved prediction
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Loader2 size={28} className="animate-spin" />
            </div>

            <h3 className="font-bold text-slate-900">
              Analyzing your financial profile...
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              AI is reviewing your prediction and SHAP factors to prepare
              personalized improvement suggestions.
            </p>

            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={21} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">
                  Unable to generate improvement plan
                </h3>
                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={generateSuggestions}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated improvement plan */}
        {improvementPlan && !loading && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 size={18} />
                Your AI Analysis
              </div>

              <p className="text-sm leading-7 text-slate-700">
                {improvementPlan.summary}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Your Improvement Priorities
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Practical actions based on your available financial data.
                </p>
              </div>

              <button
                type="button"
                onClick={generateSuggestions}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
              >
                <RefreshCw size={15} />
                Regenerate Plan
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {improvementPlan.suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={`${suggestion.title}-${index}`}
                  suggestion={suggestion}
                  index={index}
                />
              ))}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <p className="text-xs leading-6 text-amber-800">
                {improvementPlan.disclaimer ||
                  "These suggestions are educational guidance, not a guarantee of loan approval or a substitute for professional financial advice."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AIImprovementSuggestions;
