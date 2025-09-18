import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import OTPVerification from "./components/auth/OTPVerification";

// Dashboard Pages
import Dashboard from "./components/dashboard/Dashboard";
import DocumentUpload from "./components/dashboard/DocumentUpload";
import DocumentList from "./components/dashboard/DocumentList";
import DocumentShare from "./components/dashboard/DocumentShare";
import Profile from "./components/dashboard/Profile";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <DocumentUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share"
            element={
              <ProtectedRoute>
                <DocumentShare />
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

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
