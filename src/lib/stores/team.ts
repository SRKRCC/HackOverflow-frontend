import { create } from 'zustand';
import { ApiService } from '../api';
import { auth } from '../auth';
import type { Team, ProblemStatement, Announcement, GeneralInfoResponse, Member } from '../types';

interface TeamStore {
  team: Team | null;
  problemStatement: ProblemStatement | null;
  announcements: Announcement[];
  generalInfo: GeneralInfoResponse | null;
  loading: boolean;
  error: string | null;
  
  fetchTeam: () => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchGeneralInfo: () => Promise<void>;
  updateGeneralInfo: (members: Array<{ id: number; certification_name: string; roll_number: string; gender: string }>) => Promise<Member[]>;
  
  clearError: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  problemStatement: null,
  announcements: [],
  generalInfo: null,
  loading: false,
  error: null,

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
    const user = auth.getUser();
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
    const user = auth.getUser();
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
    const user = auth.getUser();
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
}));