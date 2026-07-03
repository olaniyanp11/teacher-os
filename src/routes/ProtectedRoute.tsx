import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] p-4">
        <div className="text-center rounded-3xl border border-[#E8E4D9] bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 w-12 h-12 border-4 border-[#4A5D4E]/20 border-t-[#4A5D4E] rounded-full animate-spin" />
          <p className="text-sm text-[#4A5D4E] font-semibold">Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
