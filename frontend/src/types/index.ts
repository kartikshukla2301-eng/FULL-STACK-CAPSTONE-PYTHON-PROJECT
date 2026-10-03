export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  key: string;
  owner_id: number;
  created_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assignee_id?: number;
  creator_id: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assignee?: User;
}

export interface AnalyticsData {
  total_tasks: number;
  completion_rate: number;
  status_breakdown: Record<string, number>;
  velocity: Array<{ sprint: string; completed_points: number; target_points: number }>;
  burndown: Array<{ day: string; remaining_hours: number; ideal_hours: number }>;
}
