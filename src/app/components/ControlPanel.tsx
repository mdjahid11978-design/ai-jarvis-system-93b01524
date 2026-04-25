import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Play, Pause, RotateCw, FileText, Trash2, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { dataStore } from '../../lib/dataStore';
import { STORAGE_KEYS } from '../../lib/storage';
import type { Task } from '../../lib/types';

export function ControlPanel() {
  const [tasks, setTasks] = useState<Task[]>(dataStore.getTasks());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newTaskAgent, setNewTaskAgent] = useState('Planner');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(STORAGE_KEYS.TASKS, () => {
      setTasks(dataStore.getTasks());
    });

    return unsubscribe;
  }, []);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    dataStore.addTask({
      title: newTaskTitle,
      description: newTaskDesc || 'No description provided',
      status: 'pending',
      priority: newTaskPriority,
      assignedAgent: newTaskAgent,
      progress: 0,
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    toast.success('Task created successfully');
  };

  const handleStartTask = (taskId: string) => {
    dataStore.updateTask(taskId, { status: 'in-progress', progress: 5 });
    toast.success('Task started');
  };

  const handleCompleteTask = (taskId: string) => {
    dataStore.updateTask(taskId, { status: 'completed', progress: 100 });
    toast.success('Task completed');
  };

  const handleDeleteTask = (taskId: string) => {
    dataStore.deleteTask(taskId);
    toast.success('Task deleted');
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 w-4 text-yellow-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold">{pendingTasks}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Task */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Describe what you want JARVIS agents to execute</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g., Optimize database queries"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-agent">Assign to Agent</Label>
              <Select value={newTaskAgent} onValueChange={setNewTaskAgent}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planner">Planner Agent</SelectItem>
                  <SelectItem value="Builder">Builder Agent</SelectItem>
                  <SelectItem value="Tester">Tester Agent</SelectItem>
                  <SelectItem value="Repairer">Repairer Agent</SelectItem>
                  <SelectItem value="Learner">Learner Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Detailed description of the task..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="bg-slate-800/50 border-slate-700 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreateTask} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Play className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle>Task Queue</CardTitle>
          <CardDescription>Manage and monitor all active tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No tasks yet. Create one above!</p>
            ) : (
              sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Agent: {task.assignedAgent}</span>
                        <span>•</span>
                        <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                      </div>
                      {task.status === 'in-progress' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-blue-400">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {task.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStartTask(task.id)} className="bg-blue-500/20 hover:bg-blue-500/30">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button size="sm" onClick={() => handleCompleteTask(task.id)} className="bg-green-500/20 hover:bg-green-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
