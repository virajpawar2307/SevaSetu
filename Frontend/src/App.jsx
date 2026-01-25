// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import all pages
import Frontpage from "./components/Frontpage";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";
import IssueReportPage from "./components/IssueReportPage";
import MyReports from "./components/My-reports";
import AdminLogin from "./components/AdminLogin"; // Admin Login
import AdminDashboard from "./components/Admin-Dashboard"; // Admin Dashboard

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Frontpage />} />

          {/* Authentication */}
          <Route path="/auth" element={<AuthPage />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Issue Reporting Page */}
          <Route path="/report" element={<IssueReportPage />} />

          {/* User's Reported Issues */}
          <Route path="/My-reports" element={<MyReports />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Catch-all route */}
          <Route path="*" element={<Frontpage />} />
        </Routes>
      </Router>

      {/* Global Toast Notifications 
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: "linear-gradient(135deg, #f9fafb, #e0e7ff)",
            color: "#1f2937",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "1rem",
            fontWeight: "500",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            border: "1px solid #c7d2fe",
          },
          success: {
            iconTheme: {
              primary: "#34D399", // green
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#F87171", // red
              secondary: "#fff",
            },
          },
        }}
      />
      */}
    </>
  );
}

export default App;
