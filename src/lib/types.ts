// Simple types matching your backend API exactly

// Auth types
export interface LoginRequest {
  role: 'admin' | 'team';
  username: string; // For admin: email, For team: scc_id 
  password: string; // For admin: password, For team: scc_password
}

export interface LoginResponse {
  message: string;
  role: 'admin' | 'team';
  userID: number;
  token: string;
}

// User types
export interface User {
  id: number;
  role: 'admin' | 'team';
  email?: string;    // For admin users
  scc_id?: string;   // For team users (e.g., "SCC001")
}

// Team types  
export interface Team {
  id: number;
  scc_id: string;           // Team's SCC ID (e.g., "SCC001")
  title: string;            // Team name (e.g., "Green Farmers")
  ps_id: number;           // Problem statement ID
  gallery_images: string[]; // Array of image URLs
  problem_statement?: ProblemStatement;
  team_members?: Member[];  // Note: called 'members' in backend
  tasks?: Task[];
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  department?: string;
  college_name: string;
  year_of_study?: number;
  attendance: number;
}

export interface ProblemStatement {
  id: number;
  psId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  round_num: number;
  points: number;
  status: 'Pending' | 'InReview' | 'Completed';
  completed: boolean;
  in_review: boolean;
  timestamp: string;
  created_at: string;
  teamNotes?: string;
  reviewNotes?: string;
  teamId?: number;
  team?: {
    id: number;
    title: string;
  };
}

// Leaderboard
export interface LeaderboardEntry {
  teamId: number;
  teamName: string;
  totalPoints: number;
  completedTasks: number;
  rank: number;
}

// Request types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  round_num: number;
  points?: number;
  teamId: string | number;
}

export interface TaskSubmissionRequest {
  teamNotes: string;
}