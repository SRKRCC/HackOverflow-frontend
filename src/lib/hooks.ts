import { useState, useEffect } from 'react';
import { useTeamStore } from './stores/team';
import { ApiService } from './api';
import type { LoginRequest } from './types';

// Auth hook
export function useAuth() {
  const { user, isAuthenticated, sessionChecked, setUser, logout: storeLogout, initAuth } = useTeamStore();
  const [loading, setLoading] = useState(!sessionChecked);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize auth on mount
  useEffect(() => {
    if (!sessionChecked) {
      initAuth().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionChecked, initAuth]);
  
  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.auth.login(credentials);
      
      const user = {
        id: response.userID,
        role: response.role,
        email: credentials.role === 'admin' ? credentials.username : undefined,
        scc_id: credentials.role === 'team' ? credentials.username : undefined,
      };
      
      setUser(user);
      setLoading(false);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };
  
  const logout = () => {
    storeLogout();
    setError(null);
  };
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isTeam: user?.role === 'team',
    clearError: () => setError(null),
  };
}