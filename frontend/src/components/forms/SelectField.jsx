import React from "react";
export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
}) {
  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-bold text-navy-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-navy-900 outline-none transition-all focus:ring-2 focus:ring-orange-100 focus:border-brand-primary disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {/* Initially blank - no option name is selected */}
        <option value="">Select</option>

        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;

          const optionLabel =
            typeof option === "string" ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
