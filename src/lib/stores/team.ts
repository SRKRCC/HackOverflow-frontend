import { create } from 'zustand';
import { ApiService } from '../api';
import { auth } from '../auth';
import type { Team, Task, ProblemStatement, TaskSubmissionRequest } from '../types';

interface TeamStore {
  team: Team | null;
  tasks: Task[];
  problemStatements: ProblemStatement[];
  loading: boolean;
  error: string | null;
  
  fetchTeam: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  submitTask: (taskId: number, submission: TaskSubmissionRequest) => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  
  clearError: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  tasks: [],
  problemStatements: [],
  loading: false,
  error: null,
  
  fetchTeam: async () => {
    const user = auth.getUser();
    if (!user || user.role !== 'team') return;
    
    try {
      set({ loading: true, error: null });
      const team = await ApiService.team.getDetails(user.id);
      set({ team, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchTasks: async () => {
    const user = auth.getUser();
    if (!user || user.role !== 'team') return;
    
    try {
      set({ loading: true, error: null });
      const tasks = await ApiService.team.getTasks(user.id);
      set({ tasks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  submitTask: async (taskId, submission) => {
    const user = auth.getUser();
    if (!user || user.role !== 'team') return;
    
    try {
      set({ loading: true, error: null });
      const result = await ApiService.team.submitTask(user.id, taskId, submission);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? result.task : task
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  fetchProblemStatements: async () => {
    try {
      set({ loading: true, error: null });
      const problemStatements = await ApiService.team.getProblemStatements();
      set({ problemStatements, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));