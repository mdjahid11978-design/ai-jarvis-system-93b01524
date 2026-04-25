import { dataStore } from './dataStore';
import { toast } from 'sonner';

// Voice command processor with natural language understanding
export class VoiceCommandProcessor {
  private static instance: VoiceCommandProcessor;

  private constructor() {}

  static getInstance(): VoiceCommandProcessor {
    if (!VoiceCommandProcessor.instance) {
      VoiceCommandProcessor.instance = new VoiceCommandProcessor();
    }
    return VoiceCommandProcessor.instance;
  }

  // Process natural language command
  processCommand(command: string): string {
    const lowerCommand = command.toLowerCase().trim();

    // Task creation commands
    if (this.isTaskCreation(lowerCommand)) {
      return this.handleTaskCreation(lowerCommand);
    }

    // Status check commands
    if (this.isStatusCheck(lowerCommand)) {
      return this.handleStatusCheck(lowerCommand);
    }

    // Agent queries
    if (this.isAgentQuery(lowerCommand)) {
      return this.handleAgentQuery(lowerCommand);
    }

    // System control
    if (this.isSystemControl(lowerCommand)) {
      return this.handleSystemControl(lowerCommand);
    }

    // Analytics queries
    if (this.isAnalyticsQuery(lowerCommand)) {
      return this.handleAnalyticsQuery(lowerCommand);
    }

    // Task management
    if (this.isTaskManagement(lowerCommand)) {
      return this.handleTaskManagement(lowerCommand);
    }

    // Greetings and general queries
    if (this.isGreeting(lowerCommand)) {
      return this.handleGreeting(lowerCommand);
    }

    return "I didn't understand that command. Try asking about system status, creating tasks, or checking agent activity.";
  }

  // Command type detection
  private isTaskCreation(cmd: string): boolean {
    const patterns = ['create task', 'add task', 'new task', 'make a task', 'create new', 'build', 'generate'];
    return patterns.some(p => cmd.includes(p));
  }

  private isStatusCheck(cmd: string): boolean {
    const patterns = ['status', 'how are', 'what\'s the', 'system check', 'health'];
    return patterns.some(p => cmd.includes(p));
  }

  private isAgentQuery(cmd: string): boolean {
    const patterns = ['agent', 'planner', 'builder', 'tester', 'repairer', 'learner'];
    return patterns.some(p => cmd.includes(p));
  }

  private isSystemControl(cmd: string): boolean {
    const patterns = ['start', 'stop', 'pause', 'resume', 'restart', 'shutdown'];
    return patterns.some(p => cmd.includes(p));
  }

  private isAnalyticsQuery(cmd: string): boolean {
    const patterns = ['analytics', 'statistics', 'stats', 'metrics', 'performance', 'how many'];
    return patterns.some(p => cmd.includes(p));
  }

  private isTaskManagement(cmd: string): boolean {
    const patterns = ['complete task', 'finish task', 'delete task', 'remove task', 'cancel task'];
    return patterns.some(p => cmd.includes(p));
  }

  private isGreeting(cmd: string): boolean {
    const patterns = ['hello', 'hi', 'hey jarvis', 'good morning', 'good afternoon', 'good evening'];
    return patterns.some(p => cmd.includes(p));
  }

  // Command handlers
  private handleTaskCreation(cmd: string): string {
    // Extract task description
    const taskDesc = this.extractTaskDescription(cmd);

    // Determine priority
    const priority = this.extractPriority(cmd);

    // Assign agent
    const agent = this.extractAgent(cmd) || 'Planner';

    dataStore.addTask({
      title: taskDesc,
      description: `Voice command: ${cmd}`,
      status: 'pending',
      priority: priority,
      assignedAgent: agent,
      progress: 0,
    });

    toast.success('Task Created', { description: taskDesc });
    return `Task created successfully: ${taskDesc}. Assigned to ${agent} agent with ${priority} priority.`;
  }

  private handleStatusCheck(cmd: string): string {
    const agents = dataStore.getAgents();
    const tasks = dataStore.getTasks();

    const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'processing').length;
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    const avgCpu = (agents.reduce((sum, a) => sum + a.cpu, 0) / agents.length).toFixed(1);
    const avgMemory = (agents.reduce((sum, a) => sum + a.memory, 0) / agents.length).toFixed(1);

    return `System status: All systems operational. ${activeAgents} of 5 agents active. ${totalTasks} total tasks: ${completed} completed, ${inProgress} in progress, ${pendingTasks} pending. Average CPU usage ${avgCpu}%, memory ${avgMemory}%.`;
  }

  private handleAgentQuery(cmd: string): string {
    const agents = dataStore.getAgents();

    // Check for specific agent
    const agentNames = ['planner', 'builder', 'tester', 'repairer', 'learner'];
    const queriedAgent = agentNames.find(name => cmd.includes(name));

    if (queriedAgent) {
      const agent = agents.find(a => a.id === queriedAgent);
      if (agent) {
        return `${agent.name}: Status ${agent.status}, CPU ${agent.cpu.toFixed(0)}%, Memory ${agent.memory.toFixed(0)}%, ${agent.tasks} active tasks. Last activity: ${agent.lastActivity}`;
      }
    }

    // General agent overview
    const activeCount = agents.filter(a => a.status === 'active' || a.status === 'processing').length;
    return `${activeCount} agents currently active. ${agents.map(a => `${a.name}: ${a.status}`).join(', ')}`;
  }

  private handleSystemControl(cmd: string): string {
    if (cmd.includes('stop') || cmd.includes('shutdown')) {
      toast.warning('System Shutdown', { description: 'Initiated shutdown sequence' });
      return 'Initiating system shutdown sequence. All agents will complete current tasks.';
    }

    if (cmd.includes('restart')) {
      toast.info('System Restart', { description: 'Restarting all services' });
      return 'Restarting system. All services will be back online shortly.';
    }

    if (cmd.includes('pause')) {
      toast.info('System Paused');
      return 'System paused. All agent activities suspended.';
    }

    if (cmd.includes('resume') || cmd.includes('start')) {
      toast.success('System Resumed');
      return 'System resumed. All agents are now operational.';
    }

    return 'System control command recognized but not executed.';
  }

  private handleAnalyticsQuery(cmd: string): string {
    const tasks = dataStore.getTasks();
    const analytics = dataStore.getAnalytics();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const failedTasks = tasks.filter(t => t.status === 'failed').length;
    const successRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0';

    const recentAnalytics = analytics.slice(-6);
    const avgCpu = (recentAnalytics.reduce((sum, d) => sum + d.cpu, 0) / recentAnalytics.length).toFixed(1);
    const totalCompleted = recentAnalytics.reduce((sum, d) => sum + d.tasksCompleted, 0);

    return `Analytics overview: ${totalTasks} total tasks with ${successRate}% success rate. ${completedTasks} completed, ${failedTasks} failed. Recent performance: average CPU ${avgCpu}%, ${totalCompleted} tasks completed in last hour.`;
  }

  private handleTaskManagement(cmd: string): string {
    const tasks = dataStore.getTasks();

    if (cmd.includes('complete') || cmd.includes('finish')) {
      const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
      if (inProgressTasks.length > 0) {
        const task = inProgressTasks[0];
        dataStore.updateTask(task.id, { status: 'completed', progress: 100 });
        toast.success('Task Completed');
        return `Marked task as completed: ${task.title}`;
      }
      return 'No tasks currently in progress to complete.';
    }

    if (cmd.includes('delete') || cmd.includes('remove') || cmd.includes('cancel')) {
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      if (pendingTasks.length > 0) {
        const task = pendingTasks[0];
        dataStore.deleteTask(task.id);
        toast.info('Task Deleted');
        return `Deleted pending task: ${task.title}`;
      }
      return 'No pending tasks to delete.';
    }

    return 'Task management command recognized.';
  }

  private handleGreeting(cmd: string): string {
    const greetings = [
      'Hello! JARVIS system ready. How can I assist you?',
      'Good to see you. All systems operational.',
      'Greetings. JARVIS at your service.',
      'Hello! Ready to execute your commands.',
      'System online and ready for your instructions.'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Helper methods
  private extractTaskDescription(cmd: string): string {
    // Remove command keywords and extract description
    let desc = cmd
      .replace(/create|add|new|make|a|task|please|can you|would you/gi, '')
      .trim();

    // Remove priority and agent mentions
    desc = desc
      .replace(/with (high|low|medium|critical) priority/gi, '')
      .replace(/assign(ed)? to (planner|builder|tester|repairer|learner)/gi, '')
      .trim();

    return desc || 'New task from voice command';
  }

  private extractPriority(cmd: string): 'low' | 'medium' | 'high' | 'critical' {
    if (cmd.includes('critical') || cmd.includes('urgent')) return 'critical';
    if (cmd.includes('high priority') || cmd.includes('important')) return 'high';
    if (cmd.includes('low priority')) return 'low';
    return 'medium';
  }

  private extractAgent(cmd: string): string | null {
    const agents = ['Planner', 'Builder', 'Tester', 'Repairer', 'Learner'];
    return agents.find(agent => cmd.toLowerCase().includes(agent.toLowerCase())) || null;
  }
}

// Export singleton
export const voiceCommandProcessor = VoiceCommandProcessor.getInstance();
