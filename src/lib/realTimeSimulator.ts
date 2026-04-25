import { dataStore } from './dataStore';
import type { Agent } from './types';

// Real-time data simulator for JARVIS system
export class RealTimeSimulator {
  private intervals: NodeJS.Timeout[] = [];
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Update agent stats every 3 seconds
    const agentInterval = setInterval(() => {
      this.updateAgentStats();
    }, 3000);

    // Add analytics data every 30 seconds
    const analyticsInterval = setInterval(() => {
      this.addAnalyticsPoint();
    }, 30000);

    // Random agent activities every 5 seconds
    const activityInterval = setInterval(() => {
      this.simulateAgentActivity();
    }, 5000);

    // Occasional task updates every 10 seconds
    const taskInterval = setInterval(() => {
      this.updateTaskProgress();
    }, 10000);

    this.intervals.push(agentInterval, analyticsInterval, activityInterval, taskInterval);

    dataStore.addLog('success', 'Real-time simulator started', 'System');
  }

  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
    dataStore.addLog('info', 'Real-time simulator stopped', 'System');
  }

  private updateAgentStats() {
    const agents = dataStore.getAgents();
    agents.forEach(agent => {
      // Slightly vary CPU and memory
      const cpuDelta = (Math.random() - 0.5) * 10;
      const memoryDelta = (Math.random() - 0.5) * 8;

      dataStore.updateAgent(agent.id, {
        cpu: Math.max(10, Math.min(95, agent.cpu + cpuDelta)),
        memory: Math.max(20, Math.min(90, agent.memory + memoryDelta))
      });
    });
  }

  private addAnalyticsPoint() {
    const agents = dataStore.getAgents();
    const avgCpu = agents.reduce((sum, a) => sum + a.cpu, 0) / agents.length;
    const avgMemory = agents.reduce((sum, a) => sum + a.memory, 0) / agents.length;

    dataStore.addAnalyticsData({
      timestamp: new Date().toISOString(),
      cpu: avgCpu,
      memory: avgMemory,
      network: 20 + Math.random() * 60,
      tasksCompleted: Math.floor(Math.random() * 5),
      errors: Math.random() < 0.1 ? 1 : 0
    });
  }

  private simulateAgentActivity() {
    const agents = dataStore.getAgents();
    const activities: Record<string, string[]> = {
      planner: [
        'Analyzing task dependencies',
        'Optimizing execution order',
        'Allocating resources',
        'Planning task sequence',
        'Reviewing agent workload'
      ],
      builder: [
        'Compiling React components',
        'Bundling application assets',
        'Generating API endpoints',
        'Building Docker containers',
        'Optimizing build pipeline'
      ],
      tester: [
        'Running unit tests',
        'Executing integration tests',
        'Performing load testing',
        'Validating API responses',
        'Checking code coverage'
      ],
      repairer: [
        'Monitoring for errors',
        'Analyzing error patterns',
        'Applying automated fixes',
        'Validating repairs',
        'System health check'
      ],
      learner: [
        'Analyzing user patterns',
        'Training ML models',
        'Processing feedback data',
        'Optimizing algorithms',
        'Learning from system logs'
      ]
    };

    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const agentActivities = activities[randomAgent.id] || [];
    const randomActivity = agentActivities[Math.floor(Math.random() * agentActivities.length)];

    if (randomActivity) {
      dataStore.updateAgent(randomAgent.id, {
        lastActivity: randomActivity
      });
    }

    // Occasionally change agent status
    if (Math.random() < 0.15) {
      const statuses: Agent['status'][] = ['active', 'processing', 'idle'];
      const currentStatus = randomAgent.status;
      const newStatus = statuses.filter(s => s !== currentStatus)[Math.floor(Math.random() * 2)];
      dataStore.updateAgent(randomAgent.id, {
        status: newStatus
      });

      if (newStatus === 'processing') {
        dataStore.addLog('info', `${randomAgent.name} started processing`, randomAgent.name);
      }
    }
  }

  private updateTaskProgress() {
    const tasks = dataStore.getTasks();
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

    inProgressTasks.forEach(task => {
      if (task.progress < 100) {
        const progressIncrease = Math.floor(Math.random() * 15);
        const newProgress = Math.min(100, task.progress + progressIncrease);

        dataStore.updateTask(task.id, {
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'in-progress'
        });

        if (newProgress === 100) {
          dataStore.addLog('success', `Task completed: ${task.title}`, task.assignedAgent);
        }
      }
    });

    // Occasionally start pending tasks
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length > 0 && Math.random() < 0.2) {
      const task = pendingTasks[0];
      dataStore.updateTask(task.id, {
        status: 'in-progress',
        progress: 5
      });
      dataStore.addLog('info', `Task started: ${task.title}`, task.assignedAgent);
    }
  }
}

// Export singleton instance
export const realTimeSimulator = new RealTimeSimulator();
