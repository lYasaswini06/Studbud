export interface StudyPlan {
  id: string;
  title: string;
  type: 'exam' | 'project' | 'subject';
  subject: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  completedHours: number;
  tasks: Task[];
  weaknesses: string[];
  learningMethods: string[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

export interface StudySession {
  id: string;
  planId: string;
  taskId: string;
  date: string;
  duration: number;
  notes?: string;
}

export interface PlanFormData {
  title: string;
  type: 'exam' | 'project' | 'subject';
  subject: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  weaknesses: string[];
  learningMethods: string[];
  goals: string;
}