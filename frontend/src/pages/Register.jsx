import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Landmark,
  User,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import { Alert } from "../components/common/Alert.jsx";
import { InputField } from "../components/forms/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Register() {
  const [accountType, setAccountType] = useState("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError(null);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setInvitationCode("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (accountType === "admin" && !invitationCode.trim()) {
      setError("Admin invitation code is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (accountType === "admin") {
        const res = await registerAdmin({
          ...formData,
          invitationCode,
        });

        navigate(res.user?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        await register(formData);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-700 items-center justify-center text-white shadow-sm border border-navy-700 mx-auto">
            <Landmark className="w-6 h-6" strokeWidth={2.2} />
          </div>

          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Create Account
          </h2>

          <p className="text-xs text-navy-500">
            Start evaluating your loan eligibility with machine learning intelligence
          </p>
        </div>

        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />

        {/* Account Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-navy-700">
            Choose Account Type
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAccountTypeChange("user")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                accountType === "user"
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                  : "border-slate-200 text-navy-500 hover:border-slate-300"
              }`}
            >
              <User className="w-4 h-4" />
              User
            </button>

            <button
              type="button"
              onClick={() => handleAccountTypeChange("admin")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                accountType === "admin"
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                  : "border-slate-200 text-navy-500 hover:border-slate-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            required
            prefix={<User className="w-4 h-4 text-navy-400" />}
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
            prefix={<Mail className="w-4 h-4 text-navy-400" />}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            required
            helperText="Minimum 8 characters"
            prefix={<Lock className="w-4 h-4 text-navy-400" />}
          />

          {/* Admin Invitation Code */}
          {accountType === "admin" && (
            <div className="space-y-2">
              <InputField
                label="Admin Invitation Code"
                name="invitationCode"
                type="password"
                value={invitationCode}
                onChange={(e) => {
                  setInvitationCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your secret invitation code"
                required
                prefix={<KeyRound className="w-4 h-4 text-navy-400" />}
              />

              <p className="text-[11px] text-navy-400">
                Enter your admin invitation code to continue.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading
              ? "Creating Account..."
              : accountType === "admin"
                ? "Create Admin Account"
                : "Create Free Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-slate-100 text-xs text-navy-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-brand-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
