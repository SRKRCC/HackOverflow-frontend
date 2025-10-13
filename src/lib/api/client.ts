// Axios API client that matches your backend exactly
import { type AxiosResponse } from 'axios';
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

// Helper function to extract data from axios response
const extractData = <T>(response: AxiosResponse<T>): T => response.data;

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> =>
    extractData(await apiClient.post('/auth/login', credentials)),
};

// Admin API  
export const adminAPI = {
  // Tasks
  getAllTasks: async (): Promise<Task[]> =>
    extractData(await apiClient.get('/tasks')),
  
  createTask: async (task: CreateTaskRequest): Promise<Task> =>
    extractData(await apiClient.post('/tasks', task)),
  
  updateTask: async (id: number, updates: Partial<CreateTaskRequest>): Promise<Task> =>
    extractData(await apiClient.put(`/tasks/${id}`, updates)),
  
  deleteTask: async (id: number): Promise<{ message: string }> =>
    extractData(await apiClient.delete(`/tasks/${id}`)),
  
  completeTask: async (id: number, reviewNotes?: string): Promise<Task> =>
    extractData(await apiClient.post(`/tasks/${id}/complete`, { reviewNotes })),
  
  // Leaderboard
  getLeaderboard: async (): Promise<LeaderboardEntry[]> =>
    extractData(await apiClient.get('/leaderboards')),
  
  // Problem Statements  
  getAllProblemStatements: async (): Promise<ProblemStatement[]> =>
    extractData(await apiClient.get('/problem-statements')),
  
  uploadProblemStatementsCSV: async (file: File): Promise<{ message: string; count: number }> => {
    const formData = new FormData();
    formData.append('csv-file', file);
    return extractData(await apiClient.post('/problem-statements/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  },
};

// Team API
export const teamAPI = {
  // Team details
  getTeamDetails: async (teamId: number): Promise<Team> =>
    extractData(await apiClient.get(`/teams/${teamId}`)),
  
  // Tasks
  getTeamTasks: async (teamId: number): Promise<Task[]> =>
    extractData(await apiClient.get(`/teams/${teamId}/tasks`)),
  
  getTeamTask: async (teamId: number, taskId: number): Promise<Task> =>
    extractData(await apiClient.get(`/teams/${teamId}/tasks/${taskId}`)),
  
  submitTask: async (teamId: number, taskId: number, submission: TaskSubmissionRequest): Promise<{ message: string; task: Task }> =>
    extractData(await apiClient.post(`/teams/${teamId}/tasks/${taskId}/submit`, submission)),
  
  // Problem Statements
  getProblemStatements: async (): Promise<ProblemStatement[]> =>
    extractData(await apiClient.get('/problem-statements')),
  
  getProblemStatement: async (id: number): Promise<ProblemStatement> =>
    extractData(await apiClient.get(`/problem-statements/${id}`)),
};