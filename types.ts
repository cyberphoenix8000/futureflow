
import { LucideIcon } from 'lucide-react';

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  dueDate: string;
  subject: string;
  completed: boolean;
  createdAt: string; // ISO string
}

export interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string; // ISO string
}

export interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  category: string;
  createdAt: string; // ISO string
}

export interface TaskFormState {
  title: string;
  priority: Priority;
  dueDate: string;
  subject: string;
}

export interface NoteFormState {
  title: string;
  content: string;
  subject: string;
}

export interface GoalFormState {
  title: string;
  target: string; // Input is string, will be parsed to number
  current: number; // Default to 0
  category: string;
}

export type ActiveTab = 'tasks' | 'notes' | 'pomodoro' | 'goals' | 'analytics';

export interface TabDefinition {
  id: ActiveTab;
  label: string;
  icon: LucideIcon; // Lucide icons are components (React.ElementType)
}
