import { storage, STORAGE_KEYS } from './storage';
import type { Agent, Task, AnalyticsData, SystemLog, FileItem, VoiceCommand, UserSettings } from './types';

// Initialize default data
const defaultAgents: Agent[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    status: 'active',
    cpu: 45,
    memory: 62,
    tasks: 12,
    uptime: '48h 23m',
    lastActivity: 'Planning task sequence',
    description: 'Strategic planning and task orchestration'
  },
  {
    id: 'builder',
    name: 'Builder Agent',
    status: 'processing',
    cpu: 78,
    memory: 85,
    tasks: 8,
    uptime: '48h 23m',
    lastActivity: 'Compiling React components',
    description: 'Code generation and system construction'
  },
  {
    id: 'tester',
    name: 'Tester Agent',
    status: 'active',
    cpu: 34,
    memory: 45,
    tasks: 15,
    uptime: '48h 23m',
    lastActivity: 'Running integration tests',
    description: 'Automated testing and quality assurance'
  },
  {
    id: 'repairer',
    name: 'Repairer Agent',
    status: 'idle',
    cpu: 12,
    memory: 28,
    tasks: 3,
    uptime: '48h 23m',
    lastActivity: 'Monitoring for errors',
    description: 'Error detection and automated fixes'
  },
  {
    id: 'learner',
    name: 'Learner Agent',
    status: 'active',
    cpu: 56,
    memory: 71,
    tasks: 6,
    uptime: '48h 23m',
    lastActivity: 'Analyzing user patterns',
    description: 'Pattern recognition and optimization'
  }
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Optimize Database Queries',
    description: 'Analyze and optimize slow database queries for better performance',
    status: 'in-progress',
    priority: 'high',
    assignedAgent: 'Learner',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 65
  },
  {
    id: '2',
    title: 'Deploy Security Patches',
    description: 'Apply latest security updates to all system components',
    status: 'pending',
    priority: 'critical',
    assignedAgent: 'Builder',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0
  },
  {
    id: '3',
    title: 'Run System Diagnostics',
    description: 'Comprehensive health check of all agents and subsystems',
    status: 'completed',
    priority: 'medium',
    assignedAgent: 'Tester',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    progress: 100
  }
];

const defaultSettings: UserSettings = {
  theme: 'dark',
  voiceEnabled: true,
  notificationsEnabled: true,
  autoUpdate: true,
  language: 'en',
  apiEndpoint: 'https://api.jarvis-system.dev'
};

// Data Store Class
export class DataStore {
  private static instance: DataStore;
  private listeners: Map<string, Set<() => void>> = new Map();

  private constructor() {
    this.initializeData();
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private initializeData() {
    // Initialize storage with defaults if empty
    if (!storage.get(STORAGE_KEYS.AGENTS, null)) {
      storage.set(STORAGE_KEYS.AGENTS, defaultAgents);
    }
    if (!storage.get(STORAGE_KEYS.TASKS, null)) {
      storage.set(STORAGE_KEYS.TASKS, defaultTasks);
    }
    if (!storage.get(STORAGE_KEYS.SETTINGS, null)) {
      storage.set(STORAGE_KEYS.SETTINGS, defaultSettings);
    }
    if (!storage.get(STORAGE_KEYS.ANALYTICS, null)) {
      storage.set(STORAGE_KEYS.ANALYTICS, this.generateInitialAnalytics());
    }
    if (!storage.get(STORAGE_KEYS.SYSTEM_LOGS, null)) {
      storage.set(STORAGE_KEYS.SYSTEM_LOGS, []);
    }
    if (!storage.get(STORAGE_KEYS.VOICE_HISTORY, null)) {
      storage.set(STORAGE_KEYS.VOICE_HISTORY, []);
    }
  }

  private generateInitialAnalytics(): AnalyticsData[] {
    const data: AnalyticsData[] = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--) {
      data.push({
        timestamp: new Date(now - i * 60 * 60 * 1000).toISOString(),
        cpu: 30 + Math.random() * 50,
        memory: 40 + Math.random() * 40,
        network: 20 + Math.random() * 60,
        tasksCompleted: Math.floor(Math.random() * 10),
        errors: Math.floor(Math.random() * 3)
      });
    }
    return data;
  }

  // Subscribe to data changes
  subscribe(key: string, callback: () => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach(callback => callback());
  }

  // Agents
  getAgents(): Agent[] {
    return storage.get(STORAGE_KEYS.AGENTS, defaultAgents);
  }

  updateAgent(id: string, updates: Partial<Agent>) {
    const agents = this.getAgents();
    const index = agents.findIndex(a => a.id === id);
    if (index !== -1) {
      agents[index] = { ...agents[index], ...updates };
      storage.set(STORAGE_KEYS.AGENTS, agents);
      this.notify(STORAGE_KEYS.AGENTS);
    }
  }

  // Tasks
  getTasks(): Task[] {
    return storage.get(STORAGE_KEYS.TASKS, defaultTasks);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    storage.set(STORAGE_KEYS.TASKS, tasks);
    this.notify(STORAGE_KEYS.TASKS);
    this.addLog('info', `Task created: ${newTask.title}`, 'System');
  }

  updateTask(id: string, updates: Partial<Task>) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      if (updates.status === 'completed') {
        tasks[index].completedAt = new Date().toISOString();
      }
      storage.set(STORAGE_KEYS.TASKS, tasks);
      this.notify(STORAGE_KEYS.TASKS);
    }
  }

  deleteTask(id: string) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    storage.set(STORAGE_KEYS.TASKS, filtered);
    this.notify(STORAGE_KEYS.TASKS);
  }

  // Analytics
  getAnalytics(): AnalyticsData[] {
    return storage.get(STORAGE_KEYS.ANALYTICS, this.generateInitialAnalytics());
  }

  addAnalyticsData(data: AnalyticsData) {
    const analytics = this.getAnalytics();
    analytics.push(data);
    // Keep only last 24 hours
    if (analytics.length > 24) {
      analytics.shift();
    }
    storage.set(STORAGE_KEYS.ANALYTICS, analytics);
    this.notify(STORAGE_KEYS.ANALYTICS);
  }

  // System Logs
  getLogs(): SystemLog[] {
    return storage.get(STORAGE_KEYS.SYSTEM_LOGS, []);
  }

  addLog(level: SystemLog['level'], message: string, source: string) {
    const logs = this.getLogs();
    const newLog: SystemLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    };
    logs.unshift(newLog);
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.pop();
    }
    storage.set(STORAGE_KEYS.SYSTEM_LOGS, logs);
    this.notify(STORAGE_KEYS.SYSTEM_LOGS);
  }

  // Voice History
  getVoiceHistory(): VoiceCommand[] {
    return storage.get(STORAGE_KEYS.VOICE_HISTORY, []);
  }

  addVoiceCommand(command: string, response: string, status: 'success' | 'failed') {
    const history = this.getVoiceHistory();
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      command,
      response,
      status
    };
    history.unshift(newCommand);
    // Keep only last 50 commands
    if (history.length > 50) {
      history.pop();
    }
    storage.set(STORAGE_KEYS.VOICE_HISTORY, history);
    this.notify(STORAGE_KEYS.VOICE_HISTORY);
  }

  // Settings
  getSettings(): UserSettings {
    return storage.get(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  updateSettings(updates: Partial<UserSettings>) {
    const settings = this.getSettings();
    const newSettings = { ...settings, ...updates };
    storage.set(STORAGE_KEYS.SETTINGS, newSettings);
    this.notify(STORAGE_KEYS.SETTINGS);
  }
}

// Export singleton instance
export const dataStore = DataStore.getInstance();
