import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, CheckCircle2 } from 'lucide-react';

export function Analytics() {
  const [taskData, setTaskData] = useState([
    { name: 'Mon', completed: 45, failed: 3, pending: 5 },
    { name: 'Tue', completed: 52, failed: 2, pending: 8 },
    { name: 'Wed', completed: 48, failed: 4, pending: 6 },
    { name: 'Thu', completed: 61, failed: 1, pending: 4 },
    { name: 'Fri', completed: 58, failed: 2, pending: 7 },
    { name: 'Sat', completed: 42, failed: 1, pending: 3 },
    { name: 'Sun', completed: 38, failed: 0, pending: 2 },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', cpu: 45, memory: 62, tasks: 12 },
    { time: '04:00', cpu: 38, memory: 58, tasks: 8 },
    { time: '08:00', cpu: 52, memory: 65, tasks: 18 },
    { time: '12:00', cpu: 68, memory: 72, tasks: 24 },
    { time: '16:00', cpu: 71, memory: 75, tasks: 28 },
    { time: '20:00', cpu: 55, memory: 68, tasks: 15 },
  ]);

  const [agentActivity] = useState([
    { name: 'Planner', value: 156, color: '#3b82f6' },
    { name: 'Builder', value: 342, color: '#a855f7' },
    { name: 'Tester', value: 289, color: '#10b981' },
    { name: 'Repairer', value: 45, color: '#f97316' },
    { name: 'Learner', value: 98, color: '#eab308' },
  ]);

  const [stats] = useState({
    totalTasks: 1247,
    tasksChange: '+12.5%',
    avgResponseTime: '1.2s',
    responseChange: '-8.3%',
    successRate: '98.4%',
    successChange: '+2.1%',
    activeAgents: 5,
    agentsChange: '0%',
  });

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
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              {stats.tasksChange} from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
              <TrendingDown className="w-3 h-3" />
              {stats.responseChange} improvement
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}</div>
            <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              {stats.successChange} increase
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              All systems operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Task Completion by Day</CardTitle>
            <CardDescription>Last 7 days performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#eab308" name="Pending" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Agent Activity Distribution</CardTitle>
            <CardDescription>Tasks processed by each agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentActivity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agentActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Over Time */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle>System Performance (24h)</CardTitle>
          <CardDescription>CPU, Memory, and Task Load</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCpu)"
                name="CPU %"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#a855f7"
                fillOpacity={1}
                fill="url(#colorMemory)"
                name="Memory %"
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTasks)"
                name="Active Tasks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>System milestones and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: '1000+ Tasks Completed', description: 'Reached milestone on Feb 3, 2026', badge: '🎉' },
                { title: '99.5% Uptime This Month', description: 'Record high availability', badge: '⚡' },
                { title: 'Zero Critical Errors', description: 'Last 30 days without failures', badge: '✅' },
                { title: 'Learning Rate Improved', description: '40% faster pattern recognition', badge: '🧠' },
              ].map((achievement, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl">{achievement.badge}</div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Top Tasks This Week</CardTitle>
            <CardDescription>Most frequently executed operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: 'Code Generation', count: 142, change: '+18%' },
                { task: 'Data Analysis', count: 98, change: '+12%' },
                { task: 'File Operations', count: 87, change: '+8%' },
                { task: 'API Development', count: 76, change: '+22%' },
                { task: 'Testing & Validation', count: 64, change: '+15%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.task}</p>
                    <p className="text-sm text-slate-400">{item.count} executions</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {item.change}
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
