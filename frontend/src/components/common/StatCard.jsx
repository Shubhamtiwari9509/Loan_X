import React from "react";

export function StatCard({ title, value, icon: Icon, trend, subtitle, color = "orange" }) {
  const iconColors = {
    orange: "bg-orange-50 text-brand-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const selectedColor = iconColors[color] || iconColors.orange;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-wider text-navy-500 uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${selectedColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl lg:text-3xl font-bold text-navy-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-navy-500 font-medium">{subtitle}</p>}
    </div>
  );
}
