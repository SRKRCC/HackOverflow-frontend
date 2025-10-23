import { create } from 'zustand';
import { ApiService } from '../api';
import type { Task, LeaderboardEntry, ProblemStatement, CreateTaskRequest } from '../types';

interface AdminStore {
  tasks: Task[];
  leaderboard: LeaderboardEntry[];
  problemStatements: ProblemStatement[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: number, updates: Partial<CreateTaskRequest>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  completeTask: (id: number, reviewNotes?: string) => Promise<Task>;
  
  fetchLeaderboard: () => Promise<void>;
  fetchProblemStatements: () => Promise<void>;
  
  clearError: () => void;
}
export const useAdminStore = create<AdminStore>((set) => ({
  tasks: [],
  leaderboard: [],
  problemStatements: [],
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const tasks = await ApiService.admin.getAllTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTask: async (task: CreateTaskRequest) => {
    try {
      const newTask = await ApiService.admin.createTask(task);
      set((state) => ({
        tasks: [newTask, ...state.tasks]
      }));
      return newTask;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateTask: async (id: number, updates: Partial<CreateTaskRequest>) => {
    try {
      const updatedTask = await ApiService.admin.updateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? updatedTask : task
        )
      }));
      return updatedTask;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    try {
      await ApiService.admin.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  completeTask: async (id: number, reviewNotes?: string) => {
    try {
      const completedTask = await ApiService.admin.completeTask(id, reviewNotes);
      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? completedTask : task
        )
      }));
      return completedTask;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

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
      const problemStatements = await ApiService.admin.getAllProblemStatements();
      set({ problemStatements });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },  clearError: () => set({ error: null }),
}));