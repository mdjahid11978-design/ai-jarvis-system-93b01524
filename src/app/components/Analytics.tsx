import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { dataStore } from '../../lib/dataStore';
import { STORAGE_KEYS } from '../../lib/storage';
import type { AnalyticsData, Task } from '../../lib/types';

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>(dataStore.getAnalytics());
  const [tasks, setTasks] = useState<Task[]>(dataStore.getTasks());

  useEffect(() => {
    const unsubscribeAnalytics = dataStore.subscribe(STORAGE_KEYS.ANALYTICS, () => {
      setAnalyticsData(dataStore.getAnalytics());
    });

    const unsubscribeTasks = dataStore.subscribe(STORAGE_KEYS.TASKS, () => {
      setTasks(dataStore.getTasks());
    });

    return () => {
      unsubscribeAnalytics();
      unsubscribeTasks();
    };
  }, []);

  // Process data for charts
  const chartData = analyticsData.slice(-12).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    cpu: Math.round(d.cpu),
    memory: Math.round(d.memory),
    network: Math.round(d.network),
    tasks: d.tasksCompleted
  }));

  // Task status distribution
  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#eab308' },
    { name: 'Failed', value: tasks.filter(t => t.status === 'failed').length, color: '#ef4444' },
  ];

  // Agent task distribution
  const agentData = tasks.reduce((acc, task) => {
    const existing = acc.find(a => a.name === task.assignedAgent);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: task.assignedAgent, value: 1, color: getAgentColor(task.assignedAgent) });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const successRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';
  const avgCpu = analyticsData.length > 0
    ? (analyticsData.reduce((sum, d) => sum + d.cpu, 0) / analyticsData.length).toFixed(1)
    : '0.0';
  const avgMemory = analyticsData.length > 0
    ? (analyticsData.reduce((sum, d) => sum + d.memory, 0) / analyticsData.length).toFixed(1)
    : '0.0';
  const activeAgents = dataStore.getAgents().filter(a => a.status === 'active' || a.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              {completedTasks} completed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu}%</div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <Activity className="w-3 h-3" />
              Across all agents
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              System reliability
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}/5</div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              Currently operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU & Memory usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#colorCpu)" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#a855f7" fill="url(#colorMemory)" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current task breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Task Distribution */}
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Agent Workload</CardTitle>
            <CardDescription>Tasks assigned to each agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="value" name="Tasks">
                  {agentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Activity */}
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Network Activity</CardTitle>
            <CardDescription>Data transfer over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="network" stroke="#10b981" strokeWidth={2} name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task Priority Stats */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle>Task Priorities</CardTitle>
          <CardDescription>Breakdown by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{tasks.filter(t => t.priority === 'critical').length}</div>
              <div className="text-sm text-slate-400">Critical</div>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400">{tasks.filter(t => t.priority === 'high').length}</div>
              <div className="text-sm text-slate-400">High</div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">{tasks.filter(t => t.priority === 'medium').length}</div>
              <div className="text-sm text-slate-400">Medium</div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.priority === 'low').length}</div>
              <div className="text-sm text-slate-400">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getAgentColor(agent: string): string {
  const colors: Record<string, string> = {
    'Planner': '#3b82f6',
    'Builder': '#a855f7',
    'Tester': '#10b981',
    'Repairer': '#f97316',
    'Learner': '#eab308',
  };
  return colors[agent] || '#6b7280';
}
