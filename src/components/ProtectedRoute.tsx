// Simple protected route components
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'team';
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requireRole="admin">{children}</ProtectedRoute>;
}

export function TeamRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requireRole="team">{children}</ProtectedRoute>;
}