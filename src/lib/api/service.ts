// Main API service class with all endpoints organized
import { apiClient } from './config';
import type { 
  LoginRequest, 
  LoginResponse, 
  Team, 
  Task, 
  LeaderboardEntry, 
  ProblemStatement,
  CreateTaskRequest,
  TaskSubmissionRequest
} from '../types';

export class ApiService {
  // Auth endpoints
  static auth = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },

    logout: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },

    validateToken: async (): Promise<{ valid: boolean; user?: any }> => {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    }
  };

  // Admin endpoints
  static admin = {
    // Dashboard
    getDashboard: async (): Promise<any> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },

    // Tasks management
    getAllTasks: async (): Promise<Task[]> => {
      const response = await apiClient.get('/tasks');
      return response.data;
    },

    createTask: async (task: CreateTaskRequest): Promise<Task> => {
      const response = await apiClient.post('/tasks', task);
      return response.data;
    },

    updateTask: async (id: number, updates: Partial<CreateTaskRequest>): Promise<Task> => {
      const response = await apiClient.put(`/tasks/${id}`, updates);
      return response.data;
    },

    deleteTask: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    },

    completeTask: async (id: number, reviewNotes?: string): Promise<Task> => {
      const response = await apiClient.post(`/tasks/${id}/complete`, { reviewNotes });
      return response.data;
    },

    // Teams management
    getAllTeams: async (): Promise<Team[]> => {
      const response = await apiClient.get('/admin/teams');
      return response.data;
    },

    getTeamById: async (id: number): Promise<Team> => {
      const response = await apiClient.get(`/admin/teams/${id}`);
      return response.data;
    },

    // Leaderboard
    getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
      const response = await apiClient.get('/leaderboards');
      return response.data;
    },

    updateLeaderboard: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/admin/leaderboard/update');
      return response.data;
    },

    // Problem Statements
    getAllProblemStatements: async (): Promise<ProblemStatement[]> => {
      const response = await apiClient.get('/problem-statements');
      return response.data;
    },

    createProblemStatement: async (ps: Omit<ProblemStatement, 'id'>): Promise<ProblemStatement> => {
      const response = await apiClient.post('/problem-statements', ps);
      return response.data;
    },

    updateProblemStatement: async (id: number, updates: Partial<ProblemStatement>): Promise<ProblemStatement> => {
      const response = await apiClient.put(`/problem-statements/${id}`, updates);
      return response.data;
    },

    deleteProblemStatement: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/problem-statements/${id}`);
      return response.data;
    },

    uploadProblemStatementsCSV: async (file: File): Promise<{ message: string; count: number }> => {
      const formData = new FormData();
      formData.append('csv-file', file);
      const response = await apiClient.post('/problem-statements/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    // Announcements
    getAnnouncements: async (): Promise<any[]> => {
      const response = await apiClient.get('/admin/announcements');
      return response.data;
    },

    createAnnouncement: async (announcement: any): Promise<any> => {
      const response = await apiClient.post('/admin/announcements', announcement);
      return response.data;
    },

    updateAnnouncement: async (id: number, updates: any): Promise<any> => {
      const response = await apiClient.put(`/admin/announcements/${id}`, updates);
      return response.data;
    },

    deleteAnnouncement: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/admin/announcements/${id}`);
      return response.data;
    }
  };

  // Team endpoints
  static team = {
    // Team details
    getDetails: async (teamId: number): Promise<Team> => {
      const response = await apiClient.get(`/teams/${teamId}`);
      return response.data;
    },

    updateProfile: async (teamId: number, updates: Partial<Team>): Promise<Team> => {
      const response = await apiClient.put(`/teams/${teamId}`, updates);
      return response.data;
    },

    // Team tasks
    getTasks: async (teamId: number): Promise<Task[]> => {
      const response = await apiClient.get(`/teams/${teamId}/tasks`);
      return response.data;
    },

    getTask: async (teamId: number, taskId: number): Promise<Task> => {
      const response = await apiClient.get(`/teams/${teamId}/tasks/${taskId}`);
      return response.data;
    },

    submitTask: async (teamId: number, taskId: number, submission: TaskSubmissionRequest): Promise<{ message: string; task: Task }> => {
      const response = await apiClient.post(`/teams/${teamId}/tasks/${taskId}/submit`, submission);
      return response.data;
    },

    // Problem statements for teams
    getProblemStatements: async (): Promise<ProblemStatement[]> => {
      const response = await apiClient.get('/problem-statements');
      return response.data;
    },

    getProblemStatement: async (id: number): Promise<ProblemStatement> => {
      const response = await apiClient.get(`/problem-statements/${id}`);
      return response.data;
    },

    // Team announcements
    getAnnouncements: async (): Promise<any[]> => {
      const response = await apiClient.get('/announcements');
      return response.data;
    },

    // Gallery/Images
    uploadGalleryImage: async (teamId: number, image: File): Promise<{ message: string; imageUrl: string }> => {
      const formData = new FormData();
      formData.append('image', image);
      const response = await apiClient.post(`/teams/${teamId}/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    removeGalleryImage: async (teamId: number, imageUrl: string): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/teams/${teamId}/gallery`, {
        data: { imageUrl }
      });
      return response.data;
    }
  };
}

// Export individual API modules for backwards compatibility
export const authAPI = ApiService.auth;
export const adminAPI = ApiService.admin;
export const teamAPI = ApiService.team;

// Default export
export default ApiService;