import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Settings2, Brain, Mic, Database, Bell, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wakeWord, setWakeWord] = useState('hey jarvis');
  const [aiModel, setAiModel] = useState('ollama');
  const [autoStart, setAutoStart] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [cpuLimit, setCpuLimit] = useState([75]);
  const [memoryLimit, setMemoryLimit] = useState([80]);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [backupInterval, setBackupInterval] = useState('daily');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl bg-slate-900/50 border border-blue-500/20">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-500/20">
            <Settings2 className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-blue-500/20">
            <Brain className="w-4 h-4 mr-2" />
            AI
          </TabsTrigger>
          <TabsTrigger value="voice" className="data-[state=active]:bg-blue-500/20">
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-500/20">
            <Database className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-start on Boot</Label>
                  <p className="text-sm text-slate-400">
                    Start JARVIS automatically when system boots
                  </p>
                </div>
                <Switch checked={autoStart} onCheckedChange={setAutoStart} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-slate-400">
                    Show system notifications for important events
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark (Iron Man)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Configure AI models and routing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ai-model">Primary AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger id="ai-model" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    <SelectItem value="claude">Claude API</SelectItem>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                    <SelectItem value="auto">Auto-route</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-400">
                  Current: Ollama - Running locally for privacy and speed
                </p>
              </div>

              <div className="space-y-4">
                <Label>Model Status</Label>
                <div className="space-y-2">
                  {[
                    { name: 'Ollama (llama3.2)', status: 'active', latency: '120ms' },
                    { name: 'Claude API', status: 'standby', latency: '450ms' },
                    { name: 'GPT-4', status: 'standby', latency: '380ms' },
                  ].map((model, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-slate-400">Latency: {model.latency}</p>
                      </div>
                      <Badge
                        className={
                          model.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {model.status === 'active' ? '●' : '◐'} {model.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Failover</Label>
                  <p className="text-sm text-slate-400">
                    Automatically switch to backup AI if primary fails
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Multi-model Consensus</Label>
                  <p className="text-sm text-slate-400">
                    Use multiple AIs for complex tasks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Settings */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Voice Interface</CardTitle>
              <CardDescription>Configure voice recognition and synthesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Voice Control</Label>
                  <p className="text-sm text-slate-400">
                    Allow voice commands and responses
                  </p>
                </div>
                <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wake-word">Wake Word</Label>
                <Input
                  id="wake-word"
                  value={wakeWord}
                  onChange={(e) => setWakeWord(e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                  placeholder="hey jarvis"
                />
                <p className="text-sm text-slate-400">
                  Say this phrase to activate voice recognition
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-language">Voice Language</Label>
                <Select defaultValue="en-US">
                  <SelectTrigger id="voice-language" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Voice Speed: {0.9}</Label>
                <Slider defaultValue={[90]} max={150} min={50} step={10} className="mt-2" />
              </div>

              <div className="space-y-2">
                <Label>Voice Pitch: {1.0}</Label>
                <Slider defaultValue={[100]} max={150} min={50} step={10} className="mt-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Continuous Listening</Label>
                  <p className="text-sm text-slate-400">
                    Stay active without repeating wake word
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Configure resource limits and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>CPU Limit</Label>
                  <span className="text-sm text-slate-400">{cpuLimit[0]}%</span>
                </div>
                <Slider
                  value={cpuLimit}
                  onValueChange={setCpuLimit}
                  max={100}
                  min={20}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-slate-400">
                  Maximum CPU usage allowed for JARVIS
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Memory Limit</Label>
                  <span className="text-sm text-slate-400">{memoryLimit[0]}%</span>
                </div>
                <Slider
                  value={memoryLimit}
                  onValueChange={setMemoryLimit}
                  max={100}
                  min={30}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-slate-400">
                  Maximum memory usage allowed for JARVIS
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-update</Label>
                  <p className="text-sm text-slate-400">
                    Automatically install system updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select defaultValue="info">
                  <SelectTrigger id="log-level" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug (Verbose)</SelectItem>
                    <SelectItem value="info">Info (Normal)</SelectItem>
                    <SelectItem value="warning">Warning (Important)</SelectItem>
                    <SelectItem value="error">Error (Critical only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Data & Backup</CardTitle>
              <CardDescription>Configure backup and data retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Backups</Label>
                  <p className="text-sm text-slate-400">
                    Automatically backup memory and configuration
                  </p>
                </div>
                <Switch checked={backupEnabled} onCheckedChange={setBackupEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-interval">Backup Interval</Label>
                <Select value={backupInterval} onValueChange={setBackupInterval}>
                  <SelectTrigger id="backup-interval" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention" className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>Configure security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Authentication</Label>
                  <p className="text-sm text-slate-400">
                    Require password to access control panel
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Privacy Mode</Label>
                  <p className="text-sm text-slate-400">
                    Don't send data to cloud AI services
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encrypt Memory</Label>
                  <p className="text-sm text-slate-400">
                    Encrypt all stored data and memories
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Keys</Label>
                <div className="space-y-2">
                  <Input
                    id="claude-key"
                    type="password"
                    placeholder="Claude API Key"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="OpenAI API Key"
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  API keys are encrypted and stored securely
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Remote Access</Label>
                  <p className="text-sm text-slate-400">
                    Enable access from other devices on network
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          Save Changes
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
