import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout.jsx";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Public & User Pages
import { About } from "./pages/About.jsx";
import { Home } from "./pages/Home.jsx";
import { HowItWorks } from "./pages/HowItWorks.jsx";
import { Login } from "./pages/Login.jsx";
import { NewPrediction } from "./pages/NewPrediction.jsx";
import { PredictionHistory } from "./pages/PredictionHistory.jsx";
import { PredictionResult } from "./pages/PredictionResult.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Register } from "./pages/Register.jsx";
import { UserDashboard } from "./pages/UserDashboard.jsx";

// Admin Pages
import { AdminAnalytics } from "./pages/admin/AdminAnalytics.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminPredictions } from "./pages/admin/AdminPredictions.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";
import ScrollToTop from "./components/ScrollToTop";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       <ScrollToTop/>
        <Routes>
          {/* Public & User Routes with AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-prediction"
              element={
                <ProtectedRoute>
                  <NewPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prediction-result/:id"
              element={
                <ProtectedRoute>
                  <PredictionResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <PredictionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Protected Routes with AdminLayout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="predictions" element={<AdminPredictions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
