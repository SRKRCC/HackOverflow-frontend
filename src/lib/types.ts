export interface LoginRequest {
  role: 'admin' | 'team';
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: 'admin' | 'team';
  userID: number;
  token: string;
}

export interface User {
  id: number;
  role: 'admin' | 'team';
  email?: string;
  scc_id?: string;
}

export interface Team {
  id: number;
  teamId : number ;
  scc_id: string;
  title: string;
  ps_id?: number;
  gallery_images?: string[];
  category?: string;
  problem_statement?: ProblemStatement;
  members: Member[];
  paymentVerified?: boolean;
  tasks?: Task[];
  member_count?: number;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  department?: string;
  college_name: string;
  year_of_study?: number;
  location?: string;
  attendance: number;
  tShirtSize?: string;
  teamId?: number;
  certification_name?: string | null;
  roll_number?: string | null;
  gender?: string | null;
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

export interface LeaderboardEntry {
  id: number; 
  title: string;
  totalPoints: number;
  completedTasks: number;
  rank: number;
}

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

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegistrationResponse {
  success: boolean;
  teamId?: number;
  sccId?: string;
  message: string;
  errors?: ValidationError[];
}

export type Announcement = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

export interface UpdateTeamResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface UpdateMemberResponse {
  success: boolean;
  message: string;
  data: Member;
}

export interface DeleteTeamResponse {
  success: boolean;
  message: string;
}

export interface GeneralInfoResponse {
  success: boolean;
  data: {
    team: { id: number; title: string };
    members: Member[];
  };
  message: string;
}

export interface GeneralInfoUpdateRequest {
  members: Array<{
    id: number;
    certification_name: string;
    roll_number: string;
    gender: string;
  }>;
}

export interface GeneralInfoUpdateResponse {
  success: boolean;
  data: Member[];
  message: string;
}