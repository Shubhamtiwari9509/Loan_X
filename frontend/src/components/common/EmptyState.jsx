import React from "react";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyState({
  title = "No records found",
  description = "Get started by submitting a new loan eligibility prediction.",
  actionText = "New Prediction",
  actionLink = "/new-prediction",
  icon: Icon = Inbox,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-600 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-sm mb-6">{description}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
