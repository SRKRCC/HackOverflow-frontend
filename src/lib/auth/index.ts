import type { User } from '../types';

const STORAGE_KEYS = {
  USER: 'hackoverflow_user',
  ROLE: 'hackoverflow_role',
  TEAM_ID: 'hackoverflow_team_id',
};

export const storage = {
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ROLE, user.role);
    if (user.role === 'team') {
      localStorage.setItem(STORAGE_KEYS.TEAM_ID, user.id.toString());
    }
  },
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getRole: (): 'admin' | 'team' | null => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) as 'admin' | 'team' | null;
  },
  
  getTeamId: (): number | null => {
    const teamId = localStorage.getItem(STORAGE_KEYS.TEAM_ID);
    return teamId ? parseInt(teamId) : null;
  },
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.TEAM_ID);
  },
};

let currentUser: User | null = storage.getUser();
let authListeners: ((user: User | null) => void)[] = [];

export const auth = {
  getUser: () => currentUser,
  
  isAuthenticated: () => !!currentUser,
  
  isAdmin: () => currentUser?.role === 'admin',
  isTeam: () => currentUser?.role === 'team',
  
  setUser: (user: User) => {
    currentUser = user;
    storage.setUser(user);
    authListeners.forEach(listener => listener(user));
  },
  
  logout: () => {
    currentUser = null;
    storage.clear();
    authListeners.forEach(listener => listener(null));
  },
  
  subscribe: (listener: (user: User | null) => void) => {
    authListeners.push(listener);
    return () => {
      authListeners = authListeners.filter(l => l !== listener);
    };
  },
  
  init: () => {
    currentUser = storage.getUser();
  },
};