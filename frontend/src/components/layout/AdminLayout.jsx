import React, { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  FileSpreadsheet,
  History,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const navigationItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/predictions",
    label: "All Predictions",
    icon: FileSpreadsheet,
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    to: "/admin/users",
    label: "User Management",
    icon: Users,
  },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const filteredItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItemClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#203D91] text-white shadow-lg shadow-blue-950/20"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Brand Header */}
      <div className="h-[90px] px-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <Link
          to="/"
          onClick={() => mobile && setSidebarOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 border border-white/15 flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-5 h-5" strokeWidth={2.2} />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              Loan<span className="text-blue-400">X</span>
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-semibold mt-1">
              Admin Console
            </p>
          </div>
        </Link>

        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7 overflow-y-auto">
        <p className="px-3 mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => mobile && setSidebarOpen(false)}
                className={navItemClass}
              >
                <Icon className="w-[19px] h-[19px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {filteredItems.length === 0 && (
            <p className="px-3 py-4 text-xs text-slate-400">
              No matching pages found.
            </p>
          )}
        </nav>

        <div className="pt-9">
          <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Navigation
          </p>

          <Link
            to="/dashboard"
            onClick={() => mobile && setSidebarOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            Back to User App
          </Link>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-bold text-sm flex items-center justify-center shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F6FC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[246px] bg-[#0B1940] shrink-0 min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[76px] bg-white border-b border-slate-200/80 px-4 sm:px-7 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-[460px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admin pages..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[#F3F5FC] border border-transparent focus:border-blue-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm text-slate-700 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Admin Identity + Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-5 ml-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Admin Session
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileDropdownOpen((previous) => !previous)
                }
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>

                <div className="hidden md:flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Administrator
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={closeProfileDropdown}
                  />

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-xs font-bold text-slate-900 truncate mt-1">
                        {user?.email || "Admin Account"}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      User Dashboard
                    </Link>

                    <Link
                      to="/history"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      Prediction History
                    </Link>

                    <Link
                      to="/profile"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>

                    <Link
                      to="/admin"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-50 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-blue-600" />
                      Admin Dashboard
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-0 w-full px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <aside className="relative z-10 w-[280px] max-w-[85vw] bg-[#0B1940] h-full flex flex-col shadow-2xl">
            <SidebarContent mobile />
          </aside>
        </div>
      )}
    </div>
  );
}
