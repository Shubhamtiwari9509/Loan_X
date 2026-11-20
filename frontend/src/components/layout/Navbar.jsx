import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  History,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  User,
  X,
  Play,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setDemoError("");

    try {
      const res = await demoLogin();

      if (res.user) {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);

        // Always redirect to User Dashboard after demo login
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Unable to access the demo dashboard.");
      }
    } catch (err) {
      setDemoError(err.message || "Unable to open demo dashboard.");
    } finally {
      setDemoLoading(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? "text-brand-primary bg-orange-50/80"
        : "text-navy-700 hover:text-brand-primary hover:bg-slate-100/60"
    }`;

  const demoButtonClass =
    "inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center text-white shadow-sm border border-navy-700">
              <Landmark className="w-5 h-5" strokeWidth={2.2} />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-navy-900 leading-none">
                Loan<span className="text-brand-primary">X</span>
              </span>
              <span className="text-[10px] font-semibold text-navy-400 tracking-wider uppercase mt-0.5">
                AI Credit Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/new-prediction" className={navLinkClass}>
                  New Prediction
                </NavLink>

                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/history" className={navLinkClass}>
                  History
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className="text-sm font-semibold px-3 py-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1.5 border border-amber-200"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Buttons / Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-navy-900 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-navy-400 font-medium capitalize">
                      {user?.role}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-navy-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-navy-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-xs font-bold text-navy-900 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-navy-400" />
                      User Dashboard
                    </Link>

                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition-colors"
                    >
                      <History className="w-4 h-4 text-navy-400" />
                      Prediction History
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-navy-400" />
                      Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-brand-600 bg-orange-50/50 hover:bg-orange-50 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-brand-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-bold text-navy-700 hover:text-navy-900 transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl transition-colors"
                >
                  Get Started
                </Link>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className={demoButtonClass}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {demoLoading ? "Opening..." : "Explore Demo"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-navy-700"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
          >
            Home
          </Link>

          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
          >
            How It Works
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
          >
            About
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/new-prediction"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-brand-primary bg-orange-50"
              >
                New Loan Prediction
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>

              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
              >
                Prediction History
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-slate-50"
              >
                Profile Settings
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-700 bg-amber-50"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold text-navy-700 border border-slate-200 rounded-xl"
              >
                Log In
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold bg-slate-100 text-navy-800 rounded-xl"
              >
                Get Started Free
              </Link>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className={`${demoButtonClass} w-full py-2.5`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {demoLoading ? "Opening Demo Dashboard..." : "Explore Demo Dashboard"}
              </button>

              {demoError && (
                <p role="alert" className="text-xs text-rose-600 text-center px-2">
                  {demoError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
