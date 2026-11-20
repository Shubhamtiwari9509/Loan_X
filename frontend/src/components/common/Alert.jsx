import React from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

export function Alert({ type = "error", message, onClose }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    },
  };

  const style = styles[type] || styles.error;

  return (
    <div className={`p-4 rounded-xl border ${style.bg} ${style.border} flex items-start gap-3 my-3`}>
      {style.icon}
      <div className={`text-sm font-medium ${style.text} flex-1`}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-navy-400 hover:text-navy-600 text-sm font-semibold ml-2"
        >
          &times;
        </button>
      )}
    </div>
  );
}
