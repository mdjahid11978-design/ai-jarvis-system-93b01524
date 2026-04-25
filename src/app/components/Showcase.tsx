import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Zap, Brain, Shield, Gauge, Globe, Code2, FileStack, MessageSquare, Eye, Cog } from 'lucide-react';

export function Showcase() {
  const features = [
    {
      icon: Brain,
      title: 'Autonomous Intelligence',
      description: '5 specialized AI agents work together 24/7, planning, building, testing, repairing, and learning autonomously.',
      color: 'from-blue-500 to-cyan-500',
      demos: ['Task decomposition', 'Automatic code generation', 'Self-testing & validation']
    },
    {
      icon: Zap,
      title: 'Multi-AI Routing',
      description: 'Intelligent routing between local AI (Ollama), Claude, and GPT-4 with automatic failover for optimal performance.',
      color: 'from-purple-500 to-pink-500',
      demos: ['Local-first processing', 'Cloud AI fallback', 'Model consensus']
    },
    {
      icon: Shield,
      title: 'Self-Healing',
      description: 'Automatically detects errors, repairs corrupted data, and recovers from failures without human intervention.',
      color: 'from-green-500 to-emerald-500',
      demos: ['Error detection', 'Automatic recovery', 'Data repair']
    },
    {
      icon: FileStack,
      title: 'File Operations',
      description: 'Create, edit, and repair Excel, Word, PowerPoint, and PDF files with intelligent data validation.',
      color: 'from-orange-500 to-red-500',
      demos: ['Document generation', 'Data validation', 'Format conversion']
    },
    {
      icon: Gauge,
      title: 'Real-Time Monitoring',
      description: 'Complete system observability with resource monitoring, logging, and performance analytics.',
      color: 'from-yellow-500 to-orange-500',
      demos: ['CPU/Memory tracking', 'Service health', 'Activity logs']
    },
    {
      icon: MessageSquare,
      title: 'Voice Interaction',
      description: 'Natural language processing with wake word activation and continuous conversation capabilities.',
      color: 'from-indigo-500 to-purple-500',
      demos: ['Wake word detection', 'Voice commands', 'Speech synthesis']
    },
  ];

  const useCases = [
    {
      title: 'Web Development',
      description: 'Build complete web applications with REST APIs, authentication, and databases',
      example: '"Create a task management app with user authentication and real-time updates"',
      icon: Code2,
    },
    {
      title: 'Data Analysis',
      description: 'Generate insights, create visualizations, and automate reporting',
      example: '"Analyze sales data and create a PowerPoint presentation with key insights"',
      icon: FileStack,
    },
    {
      title: 'Automation',
      description: 'Automate repetitive tasks, web scraping, and system operations',
      example: '"Scrape product prices from e-commerce sites and save to Excel"',
      icon: Cog,
    },
    {
      title: 'Content Creation',
      description: 'Generate documents, presentations, reports, and more',
      example: '"Create a quarterly business report with charts and analysis"',
      icon: FileStack,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-500/30">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
              JARVIS Ultimate System v1.0.0
            </Badge>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Just A Rather Very Intelligent System
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A complete AI operating system with autonomous agents, multi-AI routing, and production-ready features.
              Built for developers who want true AI assistance.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">5</p>
                <p className="text-sm text-slate-400">Autonomous Agents</p>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">24/7</p>
                <p className="text-sm text-slate-400">Operation</p>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">∞</p>
                <p className="text-sm text-slate-400">Possibilities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/50 transition-all">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-400">Capabilities:</p>
                    <ul className="space-y-1">
                      {feature.demos.map((demo, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {demo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card key={index} className="bg-slate-900/50 border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <CardTitle>{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <p className="text-sm text-slate-300 italic">
                      "{useCase.example}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Architecture */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-center">System Architecture</CardTitle>
          <CardDescription className="text-center">
            Complete stack with containerized services and microservices architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visual Interface Layer */}
            <div className="text-center">
              <div className="inline-block p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="font-semibold">Visual Interface</p>
                <p className="text-sm text-slate-400">Port 3000</p>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
            </div>

            {/* Core Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Brain className="w-8 h-8 text-purple-400 mb-2" />
                <p className="font-semibold mb-1">JARVIS-OS Core</p>
                <p className="text-sm text-slate-400 mb-3">Port 8002</p>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• 5 Autonomous Agents</li>
                  <li>• Multi-AI Router</li>
                  <li>• 3-Tier Memory System</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <FileStack className="w-8 h-8 text-green-400 mb-2" />
                <p className="font-semibold mb-1">Deployment API</p>
                <p className="text-sm text-slate-400 mb-3">Port 8000</p>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• File Operations</li>
                  <li>• Document Generation</li>
                  <li>• Data Validation</li>
                </ul>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-center gap-12">
              <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
              <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
            </div>

            {/* Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="font-semibold">Ollama AI</p>
                <p className="text-xs text-slate-400">Local inference</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                <FileStack className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="font-semibold">ChromaDB</p>
                <p className="text-xs text-slate-400">Vector memory</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="bg-gradient-to-br from-slate-900 to-blue-950 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Get Started in 3 Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto text-2xl font-bold text-blue-400">
                1
              </div>
              <h4 className="font-semibold">Download & Extract</h4>
              <p className="text-sm text-slate-400">
                Extract the ZIP file to your desired location
              </p>
              <code className="block text-xs bg-slate-800/50 p-2 rounded">
                tar -xzf jarvis.tar.gz
              </code>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto text-2xl font-bold text-purple-400">
                2
              </div>
              <h4 className="font-semibold">Run Installer</h4>
              <p className="text-sm text-slate-400">
                One command installs everything automatically
              </p>
              <code className="block text-xs bg-slate-800/50 p-2 rounded">
                ./install
              </code>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto text-2xl font-bold text-green-400">
                3
              </div>
              <h4 className="font-semibold">Start Using</h4>
              <p className="text-sm text-slate-400">
                Browser opens automatically, say "Hey Jarvis"
              </p>
              <code className="block text-xs bg-slate-800/50 p-2 rounded">
                http://localhost:3000
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
