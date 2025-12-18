import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiService } from '../api';
import type { Team, ProblemStatement, Announcement, GeneralInfoResponse, Member, User } from '../types';

interface TeamStore {
  team: Team | null;
  problemStatement: ProblemStatement | null;
  announcements: Announcement[];
  generalInfo: GeneralInfoResponse | null;
  loading: boolean;
  error: string | null;
  

  user: User | null;
  isAuthenticated: boolean;
  sessionChecked: boolean;
  
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  
  fetchTeam: () => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchGeneralInfo: () => Promise<void>;
  updateGeneralInfo: (members: Array<{ id: number; certification_name: string; roll_number: string; gender: string }>) => Promise<Member[]>;
  
  clearError: () => void;
}

export const useTeamStore = create<TeamStore>()(persist((set, get) => ({
  team: null,
  problemStatement: null,
  announcements: [],
  generalInfo: null,
  loading: false,
  error: null,
  
  user: null,
  isAuthenticated: false,
  sessionChecked: false,
  
  setUser: (user: User) => {
    set({ user, isAuthenticated: true, sessionChecked: true });
  },
  
  logout: () => {
    // Clear cookies
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'team_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    set({ 
      user: null, 
      isAuthenticated: false,
      sessionChecked: true,
      team: null,
      problemStatement: null,
      generalInfo: null,
      announcements: [],
      error: null
    });
  },

  initAuth: async () => {
    const { sessionChecked } = get();
    if (sessionChecked) return;

    try {
      const result = await ApiService.auth.verifySession();
      if (result.valid && result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          sessionChecked: true 
        });
      } else {
        set({ sessionChecked: true });
      }
    } catch (error) {
      set({ sessionChecked: true });
    }
  },

  fetchAnnouncements: async () => {
    try {
      set({ loading: true, error: null });
      const announcements = await ApiService.team.getAnnouncements();
      set({ announcements, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchTeam: async () => {
    const { user } = get();
    if (!user || user.role !== 'team') return;
    
    try {
      set({ loading: true, error: null });
      const team = await ApiService.team.getDetails();
      const problemStatement = team.problem_statement || null;
      set({ team, problemStatement, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchProblemStatements: async () => {
    const state = useTeamStore.getState();
    if (state.problemStatement) {
      return;
    }
    
    try {
      set({ loading: true, error: null });
      const problemStatement = await ApiService.team.getProblemStatement();
      set({ problemStatement, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGeneralInfo: async () => {
    const { user } = get();
    if (!user || user.role !== 'team') return;
    
    try {
      set({ loading: true, error: null });
      const generalInfo = await ApiService.team.getGeneralInfo();
      set({ generalInfo, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateGeneralInfo: async (members) => {
    const { user } = get();
    if (!user || user.role !== 'team') throw new Error('Unauthorized');
    
    try {
      set({ loading: true, error: null });
      const result = await ApiService.team.updateGeneralInfo({ members });
      
      const generalInfo = await ApiService.team.getGeneralInfo();
      set({ generalInfo, loading: false });
      
      return result.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}), {
  name: 'hackoverflow-auth',
  partialize: (state) => ({ 
    user: state.user, 
    isAuthenticated: state.isAuthenticated,
    sessionChecked: state.sessionChecked 
  }),
}));