import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer.jsx";
import { Navbar } from "./Navbar.jsx";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
