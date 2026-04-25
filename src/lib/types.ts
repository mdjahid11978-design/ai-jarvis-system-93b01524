// Type definitions for JARVIS system

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'processing';
  cpu: number;
  memory: number;
  tasks: number;
  uptime: string;
  lastActivity: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progress: number;
}

export interface AnalyticsData {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  tasksCompleted: number;
  errors: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  modified: string;
  path: string;
}

export interface VoiceCommand {
  id: string;
  timestamp: string;
  command: string;
  response: string;
  status: 'success' | 'failed';
}

export interface UserSettings {
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  autoUpdate: boolean;
  language: string;
  apiEndpoint: string;
}
