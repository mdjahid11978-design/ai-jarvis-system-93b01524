import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { voiceCommandProcessor } from '../../lib/voiceCommands';
import { dataStore } from '../../lib/dataStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface VoiceInterfaceProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
}

export function VoiceInterface({ isListening, setIsListening }: VoiceInterfaceProps) {
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello, Sir. JARVIS is now online and ready. All systems operational. I can help you create tasks, check agent status, view analytics, and manage the system. How may I assist you?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example commands
  const exampleCommands = [
    'Hello JARVIS, what is the system status?',
    'Create a high priority task to optimize database',
    'How are the agents performing?',
    'Show me the Planner agent status',
    'Create task: build REST API with authentication',
    'What are the current analytics?',
    'Complete the first in-progress task',
    'How many tasks are pending?',
  ];

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
          handleVoiceCommand(finalTranscript.trim());
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('Voice recognition error: ' + event.error);
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setTranscript('');
    }
  }, [isListening]);

  // Simulate audio level
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: command,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save to voice history
    dataStore.addLog('info', `Voice command: ${command}`, 'Voice Interface');

    // Process command
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Use natural language processor
    const response = voiceCommandProcessor.processCommand(command);

    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, assistantMessage]);

    // Save response to history
    dataStore.addVoiceCommand(command, response, 'success');

    setIsProcessing(false);

    // Speak response if supported
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }
    setIsListening(!isListening);
    toast.success(isListening ? 'Voice recognition stopped' : 'Voice recognition started');
  };

  const handleExampleCommand = (command: string) => {
    handleVoiceCommand(command);
  };

  return (
    <div className="space-y-6">
      {/* Voice Control */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-400" />
            Voice Command Center
          </CardTitle>
          <CardDescription>
            Real-time voice recognition with natural language understanding. Ask about status, create tasks, or control the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Button
                size="lg"
                onClick={toggleListening}
                className={`w-32 h-32 rounded-full transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </Button>
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
              )}
            </div>

            <div className="text-center space-y-2">
              <div className="flex flex-col gap-2">
                <Badge className={isListening ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                  {isListening ? '● LISTENING' : '○ INACTIVE'}
                </Badge>
                {isSpeaking && (
                  <Badge className="bg-green-500/20 text-green-400">
                    🔊 SPEAKING
                  </Badge>
                )}
              </div>
              {isListening && (
                <p className="text-sm text-slate-400 animate-pulse">
                  Speak now... I'm listening
                </p>
              )}
              {isSpeaking && !isListening && (
                <p className="text-sm text-green-400">
                  JARVIS is responding...
                </p>
              )}
            </div>
          </div>

          {/* Audio Level Visualizer */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 h-16">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(10, (audioLevel + Math.random() * 20) * Math.sin(i / 3))}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live Transcript */}
          {transcript && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-slate-400 mb-1">Transcript:</p>
              <p className="text-lg">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-slate-500 mt-2">{message.timestamp}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Example Commands */}
      <Card className="bg-slate-900/50 border-blue-500/20">
        <CardHeader>
          <CardTitle>Try These Commands</CardTitle>
          <CardDescription>Click any command to test voice interaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border-slate-700"
                onClick={() => handleExampleCommand(command)}
              >
                <Mic className="w-4 h-4 mr-2 flex-shrink-0 text-blue-400" />
                <span className="text-sm">{command}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
