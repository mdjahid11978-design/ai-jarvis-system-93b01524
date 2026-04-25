import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Activity, Cpu, HardDrive, Zap, Brain, Wrench, FlaskConical, BookOpen, Target } from 'lucide-react';
import { dataStore } from '../../lib/dataStore';
import { STORAGE_KEYS } from '../../lib/storage';
import type { Agent as AgentType, SystemLog } from '../../lib/types';

const agentIcons: Record<string, any> = {
  planner: Target,
  builder: Wrench,
  tester: FlaskConical,
  repairer: Zap,
  learner: BookOpen,
};

const agentColors: Record<string, string> = {
  planner: 'from-blue-500 to-cyan-500',
  builder: 'from-purple-500 to-pink-500',
  tester: 'from-green-500 to-emerald-500',
  repairer: 'from-orange-500 to-red-500',
  learner: 'from-yellow-500 to-orange-500',
};

interface DashboardProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
}

export function Dashboard({ isListening, setIsListening }: DashboardProps) {
  const [agents, setAgents] = useState<AgentType[]>(dataStore.getAgents());
  const [logs, setLogs] = useState<SystemLog[]>(dataStore.getLogs());
  const [storageUsage] = useState(38);

  useEffect(() => {
    // Subscribe to agent updates
    const unsubscribeAgents = dataStore.subscribe(STORAGE_KEYS.AGENTS, () => {
      setAgents(dataStore.getAgents());
    });

    // Subscribe to log updates
    const unsubscribeLogs = dataStore.subscribe(STORAGE_KEYS.SYSTEM_LOGS, () => {
      setLogs(dataStore.getLogs());
    });

    return () => {
      unsubscribeAgents();
      unsubscribeLogs();
    };
  }, []);

  // Calculate average CPU and memory from agents
  const avgCpu = agents.reduce((sum, agent) => sum + agent.cpu, 0) / agents.length;
  const avgMemory = agents.reduce((sum, agent) => sum + agent.memory, 0) / agents.length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasks, 0);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <div className="space-y-6">
      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
            <Progress value={avgCpu} className="mt-2" />
            <p className="text-xs text-slate-400 mt-2">{agents.length} agents active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMemory.toFixed(1)}%</div>
            <Progress value={avgMemory} className="mt-2" />
            <p className="text-xs text-slate-400 mt-2">{((avgMemory / 100) * 16).toFixed(1)} GB / 16 GB</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <Progress value={(totalTasks / 50) * 100} className="mt-2" />
            <p className="text-xs text-slate-400 mt-2">Across all agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Autonomous Agents */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Autonomous Agents
          </CardTitle>
          <CardDescription>5 specialized agents working 24/7</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {agents.map((agent) => {
              const Icon = agentIcons[agent.id] || Brain;
              const color = agentColors[agent.id] || 'from-gray-500 to-gray-600';
              return (
                <div
                  key={agent.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{agent.name}</h3>
                  <Badge
                    variant={agent.status === 'active' ? 'default' : agent.status === 'processing' ? 'secondary' : 'outline'}
                    className="mb-2"
                  >
                    {agent.status}
                  </Badge>
                  <p className="text-sm text-slate-400 mb-1">{agent.tasks} active tasks</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">CPU</span>
                      <span className="text-blue-400">{agent.cpu.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">MEM</span>
                      <span className="text-purple-400">{agent.memory.toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">{agent.lastActivity}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Logs */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Activity
          </CardTitle>
          <CardDescription>Real-time system logs - {logs.length} total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${
                  log.level === 'success' ? 'bg-green-500/10 border-green-500/30' :
                  log.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  log.level === 'error' ? 'bg-red-500/10 border-red-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-slate-400">[{formatTime(log.timestamp)}]</span>{' '}
                    <span className={
                      log.level === 'success' ? 'text-green-400' :
                      log.level === 'warning' ? 'text-yellow-400' :
                      log.level === 'error' ? 'text-red-400' :
                      'text-blue-400'
                    }>{log.level.toUpperCase()}</span>{' '}
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{log.source}</Badge>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-slate-400 py-4">No logs yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Active Services</CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'JARVIS-OS', port: 8002, status: 'online' },
                { name: 'Deployment API', port: 8000, status: 'online' },
                { name: 'Visual Interface', port: 3000, status: 'online' },
                { name: 'ChromaDB', port: 8001, status: 'online' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-slate-400">Port {service.port}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    ● {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>AI Models</CardTitle>
            <CardDescription>Multi-AI routing active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Ollama (Local)', model: 'llama3.2', status: 'active' },
                { name: 'Claude API', model: 'claude-3', status: 'standby' },
                { name: 'GPT-4', model: 'gpt-4-turbo', status: 'standby' },
              ].map((ai) => (
                <div key={ai.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium">{ai.name}</p>
                    <p className="text-sm text-slate-400">{ai.model}</p>
                  </div>
                  <Badge 
                    className={ai.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                  >
                    {ai.status === 'active' ? '●' : '◐'} {ai.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
