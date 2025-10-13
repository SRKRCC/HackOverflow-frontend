import { useState, useEffect } from 'react';
import { auth } from './auth';
import { ApiService } from './api/service';
import type { User, LoginRequest } from './types';

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    auth.init();
    setUser(auth.getUser());
    
    const unsubscribe = auth.subscribe((newUser: User | null) => {
      setUser(newUser);
    });
    
    return unsubscribe;
  }, []);
  
  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.auth.login(credentials);
      
      const user: User = {
        id: response.userID,
        role: response.role,
        email: credentials.role === 'admin' ? credentials.username : undefined,
        scc_id: credentials.role === 'team' ? credentials.username : undefined,
      };
      
      auth.setUser(user);
      setLoading(false);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };
  
  const logout = () => {
    auth.logout();
    setError(null);
  };
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeam: user?.role === 'team',
    clearError: () => setError(null),
  };
}