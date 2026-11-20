import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, Landmark } from "lucide-react";
import { Alert } from "../components/common/Alert.jsx";
import { InputField } from "../components/forms/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(formData);

      if (res.user?.role === "admin" && from === "/dashboard") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-700 items-center justify-center text-white shadow-sm border border-navy-700 mx-auto">
            <Landmark className="w-6 h-6" strokeWidth={2.2} />
          </div>

          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Welcome Back
          </h2>

          <p className="text-xs text-navy-500">
            Sign in to access your loan predictions and application history
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            required
            prefix={<Lock className="w-4 h-4 text-navy-400" />}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to LoanX"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-navy-500">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-brand-primary hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
