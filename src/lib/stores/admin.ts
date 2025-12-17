import { create } from 'zustand';
import { ApiService } from '../api';
import type { LeaderboardEntry, ProblemStatement } from '../types';

interface AdminStore {
  leaderboard: LeaderboardEntry[];
  problemStatements: ProblemStatement[];
  loading: boolean;
  error: string | null;
  
  fetchLeaderboard: () => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  leaderboard: [],
  problemStatements: [],
  loading: false,
  error: null,

  fetchLeaderboard: async () => {
    try {
      const leaderboard = await ApiService.admin.getLeaderboard();
      set({ leaderboard });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchProblemStatements: async () => {
    try {
      const problemStatements = await ApiService.admin.problemStatements.getAll();
      set({ problemStatements });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },  clearError: () => set({ error: null }),
}));