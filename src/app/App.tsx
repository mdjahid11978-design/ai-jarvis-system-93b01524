import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { ControlPanel } from "./components/ControlPanel";
import { Showcase } from "./components/Showcase";
import { VoiceInterface } from "./components/VoiceInterface";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  Mic,
  Activity,
  Terminal,
  Sparkles,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { realTimeSimulator } from "../lib/realTimeSimulator";
import { dataStore } from "../lib/dataStore";

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [systemStatus, setSystemStatus] = useState<
    "online" | "offline" | "booting"
  >("booting");

  useEffect(() => {
    // Simulate system boot
    const timer = setTimeout(() => {
      setSystemStatus("online");
      // Start real-time simulator
      realTimeSimulator.start();
      dataStore.addLog(
        "success",
        "JARVIS system initialized successfully",
        "System",
      );
      toast.success("System Online", {
        description:
          "All agents operational. Real-time monitoring active.",
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      realTimeSimulator.stop();
    };
  }, []);

  // Boot screen
  if (systemStatus === "booting") {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
              <Terminal className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              J.A.R.V.I.S
            </h1>
            <p className="text-slate-400 animate-pulse">
              Initializing system...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
            <div
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Toaster />
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                {systemStatus === "online" && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  J.A.R.V.I.S
                </h1>
                <p className="text-xs text-slate-400">
                  Just A Rather Very Intelligent System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  systemStatus === "online"
                    ? "bg-green-500/20 text-green-400"
                    : systemStatus === "booting"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                }`}
              >
                {systemStatus === "online"
                  ? "● ONLINE"
                  : systemStatus === "booting"
                    ? "◐ BOOTING"
                    : "○ OFFLINE"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl mx-auto bg-slate-900/50 border border-blue-500/20">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-500/20"
            >
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="control"
              className="data-[state=active]:bg-blue-500/20"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Control
            </TabsTrigger>
            <TabsTrigger
              value="showcase"
              className="data-[state=active]:bg-blue-500/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Showcase
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-blue-500/20"
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-500/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-500/20"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </TabsContent>

          <TabsContent value="control">
            <ControlPanel />
          </TabsContent>

          <TabsContent value="showcase">
            <Showcase />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceInterface
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-slate-400">
          <p>
            JARVIS Ultimate System v1.0.0 | Built with React +
            Tailwind CSS
          </p>
          <p className="mt-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
            Built by Jahid
          </p>
        </div>
      </footer>
    </div>
  );
}