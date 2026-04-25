import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Play, Pause, RotateCw, FileText, FileSpreadsheet, FileImage, FilePieChart, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}

export function ControlPanel() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', description: 'Build REST API with JWT authentication', status: 'completed', progress: 100, createdAt: '2026-02-05 14:30' },
    { id: '2', description: 'Create data analysis dashboard', status: 'running', progress: 65, createdAt: '2026-02-05 14:45' },
    { id: '3', description: 'Generate Excel report from database', status: 'pending', progress: 0, createdAt: '2026-02-05 15:00' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [fileType, setFileType] = useState('excel');
  const [fileName, setFileName] = useState('');

  const handleCreateTask = () => {
    if (!newTask.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      description: newTask,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([task, ...tasks]);
    setNewTask('');
    toast.success('Task created successfully');

    // Simulate task execution
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'running' } : t));
    }, 1000);
  };

  const handleServiceAction = (service: string, action: string) => {
    toast.success(`${action} ${service} service`);
  };

  const handleFileOperation = () => {
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    toast.success(`Creating ${fileType} file: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-slate-900/50 border border-blue-500/20">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-500/20">
            Task Manager
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-blue-500/20">
            Services
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-blue-500/20">
            File Operations
          </TabsTrigger>
        </TabsList>

        {/* Task Manager */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>Describe what you want JARVIS to build or execute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-description">Task Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="e.g., Build a web scraper for product prices, Create a machine learning model for customer churn prediction..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                />
              </div>
              <Button 
                onClick={handleCreateTask}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Create & Execute Task
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Monitor all running and completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{task.description}</p>
                        <p className="text-sm text-slate-400">{task.createdAt}</p>
                      </div>
                      <Badge
                        className={
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          task.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {task.status === 'running' && <Clock className="w-3 h-3 mr-1" />}
                        {task.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {task.status}
                      </Badge>
                    </div>
                    {task.status === 'running' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-400">Progress</span>
                          <span className="text-sm font-medium">{task.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Control */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'JARVIS-OS', description: 'Core AI system with autonomous agents', port: 8002, status: 'running' },
              { name: 'Deployment API', description: 'File operations and automation', port: 8000, status: 'running' },
              { name: 'Visual Interface', description: 'Web-based control panel', port: 3000, status: 'running' },
              { name: 'ChromaDB', description: 'Vector database for memory', port: 8001, status: 'running' },
              { name: 'Ollama', description: 'Local AI inference engine', port: 11434, status: 'running' },
              { name: 'Redis Cache', description: 'High-speed data cache', port: 6379, status: 'running' },
            ].map((service) => (
              <Card key={service.name} className="bg-slate-900/50 border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge className="bg-green-500/20 text-green-400">
                      ● {service.status}
                    </Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-400">Port: {service.port}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleServiceAction(service.name, 'Restarting')}
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleServiceAction(service.name, 'Pausing')}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* File Operations */}
        <TabsContent value="files" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Create New File</CardTitle>
              <CardDescription>Generate documents, spreadsheets, presentations, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-type">File Type</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger id="file-type" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel Spreadsheet (.xlsx)
                      </div>
                    </SelectItem>
                    <SelectItem value="word">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Word Document (.docx)
                      </div>
                    </SelectItem>
                    <SelectItem value="powerpoint">
                      <div className="flex items-center gap-2">
                        <FilePieChart className="w-4 h-4" />
                        PowerPoint (.pptx)
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        PDF Document (.pdf)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-name">File Name</Label>
                <Input
                  id="file-name"
                  placeholder="quarterly_report"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <Button 
                onClick={handleFileOperation}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create File
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>Files created by JARVIS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'quarterly_report_Q4.xlsx', type: 'Excel', size: '2.3 MB', date: '2026-02-05 14:30' },
                  { name: 'project_proposal.docx', type: 'Word', size: '856 KB', date: '2026-02-05 13:15' },
                  { name: 'sales_presentation.pptx', type: 'PowerPoint', size: '4.1 MB', date: '2026-02-05 12:00' },
                  { name: 'invoice_template.pdf', type: 'PDF', size: '124 KB', date: '2026-02-05 10:45' },
                ].map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        {file.type === 'Excel' && <FileSpreadsheet className="w-5 h-5 text-green-400" />}
                        {file.type === 'Word' && <FileText className="w-5 h-5 text-blue-400" />}
                        {file.type === 'PowerPoint' && <FilePieChart className="w-5 h-5 text-orange-400" />}
                        {file.type === 'PDF' && <FileImage className="w-5 h-5 text-red-400" />}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-slate-400">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
