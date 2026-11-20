import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, User } from "lucide-react";
import { authApi } from "../api/client.js";
import { Alert } from "../components/common/Alert.jsx";
import { InputField } from "../components/forms/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await authApi.updateMe({ name });
      if (res.success && res.user) {
        updateUser(res.user);
        setFeedback({ type: "success", message: "Profile updated successfully." });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-navy-500">
          Manage your personal account credentials and security settings
        </p>
      </div>

      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-700 font-black text-xl flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">{user?.name}</h3>
            <p className="text-xs text-navy-400 font-mono">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-navy-700">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <InputField
            label="Email Address (Locked)"
            name="email"
            value={user?.email || ""}
            disabled
            helperText="Email cannot be modified directly once verified."
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
