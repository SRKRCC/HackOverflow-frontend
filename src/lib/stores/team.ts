import { create } from 'zustand';
import { ApiService } from '../api';
import { auth } from '../auth';
import type { Team, Task, ProblemStatement, TaskSubmissionRequest, Announcement, GeneralInfoResponse, Member } from '../types';

interface TeamStore {
  team: Team | null;
  tasks: Task[];
  problemStatements: ProblemStatement[];
  announcements: Announcement[];
  generalInfo: GeneralInfoResponse | null;
  loading: boolean;
  error: string | null;
  
  fetchTeam: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  submitTask: (taskId: number, submission: TaskSubmissionRequest) => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchGeneralInfo: () => Promise<void>;
  updateGeneralInfo: (members: Array<{ id: number; certification_name: string; roll_number: string; gender: string }>) => Promise<Member[]>;
  
  clearError: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  tasks: [],
  problemStatements: [],
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
      const tasks = await ApiService.team.getTasks();
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
      const result = await ApiService.team.submitTask(taskId, submission);
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
      const problemStatements = await ApiService.public.getProblemStatements();
      set({ problemStatements, loading: false });
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