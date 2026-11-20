import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-500 mb-2`} />
      {text && <p className="text-sm text-navy-500 font-medium">{text}</p>}
    </div>
  );
}
