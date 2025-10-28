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

/**
 * Unified API Service with organized namespaces for different roles
 * Usage: ApiService.auth.login(), ApiService.admin.getAllTasks(), ApiService.team.getDetails()
 */
export class ApiService {
  static auth = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },

    logout: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },
  };

  static admin = {
    getDashboard: async (): Promise<any> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },

    getAllTasks: async (): Promise<Task[]> => {
      const response = await apiClient.get('/admin/tasks');
      return response.data;
    },
    
    createTask: async (task: CreateTaskRequest): Promise<Task> => {
      const response = await apiClient.post('/admin/tasks', task);
      return response.data;
    },

    updateTask: async (id: number, updates: Partial<CreateTaskRequest>): Promise<Task> => {
      const response = await apiClient.put(`/admin/tasks/${id}`, updates);
      return response.data;
    },

    deleteTask: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/admin/tasks/${id}`);
      return response.data;
    },

    completeTask: async (id: number, reviewNotes?: string): Promise<Task> => {
      const response = await apiClient.post(`/admin/tasks/${id}/complete`, { reviewNotes });
      return response.data;
    },

    getAllTeams: async (): Promise<Team[]> => {
      const response = await apiClient.get('/admin/teams');
      return response.data;
    },

    getTeamById: async (id: number): Promise<Team> => {
      const response = await apiClient.get(`/admin/teams/${id}`);
      return response.data;
    },

    getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
      const response = await apiClient.get('/admin/leaderboards');
      return response.data;
    },

    updateLeaderboard: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/admin/leaderboard/update');
      return response.data;
    },

    getAllProblemStatements: async (): Promise<ProblemStatement[]> => {
      const response = await apiClient.get('/admin/problem-statements');
      return response.data;
    },

    createProblemStatement: async (ps: Omit<ProblemStatement, 'id'>): Promise<ProblemStatement> => {
      const response = await apiClient.post('/admin/problem-statements', ps);
      return response.data;
    },

    updateProblemStatement: async (id: number, updates: Partial<ProblemStatement>): Promise<ProblemStatement> => {
      const response = await apiClient.put(`/admin/problem-statements/${id}`, updates);
      return response.data;
    },

    deleteProblemStatement: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete(`/admin/problem-statements/${id}`);
      return response.data;
    },

    uploadProblemStatementsCSV: async (file: File): Promise<{ message: string; count: number }> => {
      const formData = new FormData();
      formData.append('csv-file', file);
      const response = await apiClient.post('/admin/problem-statements/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    getAnnouncements: async (): Promise<any[]> => {
      const response = await apiClient.get('/admin/announcements');
      return response.data.data;
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
    },

    uploadImagesForTeam: async (teamId: number, images: File[]): Promise<any> => {
      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));

      const response = await apiClient.put(
        `/admin/gallery/${teamId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },

    deleteTeamImage: async (teamId: number, imageUrl: string): Promise<any> => {
      const response = await apiClient.put(`/admin/gallery/${teamId}/remove-image`, {
        imageUrl ,
      });
      return response.data;
    },

    getTeamImages: async (teamId: number): Promise<string[]> => {
      const response = await apiClient.get(`/admin/gallery/${teamId}/images`);
      return response.data.images;
    },

    logout: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/admin/logout');
      return response.data;
    }
  };

  static team = {
    getDetails: async (): Promise<Team> => {
      const response = await apiClient.get(`/teams/team`);
      return response.data;
    },

    getTeamImages: async (): Promise<string[]> => {
      const response = await apiClient.get(`/teams/gallery`);
      return response.data;
    },

    getTasks: async (): Promise<Task[]> => {
      const response = await apiClient.get(`/teams/tasks`);
      return response.data;
    },

    getTask: async (taskId: number): Promise<Task> => {
      const response = await apiClient.get(`/teams/tasks/${taskId}`);
      return response.data;
    },

    submitTask: async (taskId: number, submission: TaskSubmissionRequest): Promise<{ message: string; task: Task }> => {
      const response = await apiClient.post(`/teams/tasks/${taskId}/submit`, submission);
      return response.data;
    },

    getProblemStatement: async (): Promise<ProblemStatement> => {
      const response = await apiClient.get(`/teams/problem-statement`);
      console.log(response);
      return response.data.data;
    },

    getAnnouncements: async (): Promise<any[]> => {
      const response = await apiClient.get('/announcements');
      return response.data;
    },

    logout: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/teams/logout');
      return response.data;
    }
  };

  static public = {
    getProblemStatements: async (): Promise<ProblemStatement[]> => {
      const response = await apiClient.get('/public/problem-statements');
      return response.data;
    },
  };
}

export const authAPI = ApiService.auth;
export const adminAPI = ApiService.admin;
export const teamAPI = ApiService.team;

export default ApiService;