import React from "react";

export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  helperText,
  prefix,
  suffix,
  required = false,
  min,
  max,
  step,
  disabled = false,
  extraLabelAction,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="block text-xs font-semibold text-navy-700 tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {extraLabelAction}
      </div>

      <div className="relative rounded-xl shadow-2xs">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400 text-sm font-semibold">
            {prefix}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full text-sm rounded-xl border bg-white px-3.5 py-2.5 transition-all text-navy-900 placeholder:text-navy-300 focus:outline-hidden ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-8" : ""} ${
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-orange-100"
          } ${disabled ? "bg-slate-50 cursor-not-allowed text-navy-400" : ""}`}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-navy-400 text-xs font-semibold">
            {suffix}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-navy-400">{helperText}</p>
      ) : null}
    </div>
  );
}
