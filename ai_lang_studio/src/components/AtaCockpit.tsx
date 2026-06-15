import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Zap, Shield, Eye, Database, Sparkles, Play, CheckCircle2, AlertTriangle, 
  Terminal, ArrowRight, RefreshCw, FileText, ChevronRight, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AtaCockpit = () => {
  const { toast } = useToast();
  const [kairosActive, setKairosActive] = useState(true);
  const [dreaming, setDreaming] = useState(false);
  const [dreamProgress, setDreamProgress] = useState(0);
  
  // Simulated Swarm State
  const [workers, setWorkers] = useState([
    { id: "W-109", name: "Research Agent", status: "completed", task: "Analyze codebase dependencies", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: "W-110", name: "Planner Agent", status: "completed", task: "Design API endpoints and module flow", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { id: "W-111", name: "Writer Agent", status: "active", task: "Implement claurst-web integration", color: "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse" },
    { id: "W-112", name: "Tester Agent", status: "idle", task: "Pending code write completion", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
  ]);

  // Simulated KAIROS Proactive Observations
  const [observations, setObservations] = useState([
    { time: "15:20:10", msg: "Watched file change in start-dev.sh (renamed paths)" },
    { time: "15:19:42", msg: "Updated daily task log files for session tracking" },
    { time: "15:18:05", msg: "Scanning workspace root for redundant compiler configurations" },
    { time: "15:15:30", msg: "KAIROS Daemon initialized successfully. Watcher active." }
  ]);

  // Simulated Ultraplan
  const [pendingPlans, setPendingPlans] = useState([
    {
      id: "UP-984",
      title: "Teleport Refactoring Plan for ATA service",
      details: "Spawning Opus 4.6 remote container to perform deep structural refactoring on claurst crates.",
      budget: "15-second local blocking budget, 30-min remote thinking budget",
      status: "pending_approval"
    }
  ]);

  // Simulated autoDream Memory
  const [memoryFiles, setMemoryFiles] = useState([
    { name: "MEMORY.md", size: "12 KB", lines: 142, lastUpdate: "Last consolidated: 2 hours ago" },
    { name: "AGENTS.md", size: "4 KB", lines: 48, lastUpdate: "Last consolidated: 1 day ago" }
  ]);

  const runTriggerDream = () => {
    if (dreaming) return;
    setDreaming(true);
    setDreamProgress(5);
    toast({
      title: "autoDream Triggered",
      description: "Acquired consolidation lock. Beginning reflective pass...",
    });
  };

  useEffect(() => {
    if (!dreaming) return;
    const interval = setInterval(() => {
      setDreamProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDreaming(false);
          toast({
            title: "autoDream Completed",
            description: "Durable memory files updated and compacted under 200 lines.",
          });
          return 0;
        }
        return prev + 15;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [dreaming]);

  const approvePlan = (planId: string) => {
    setPendingPlans(prev => prev.filter(p => p.id !== planId));
    toast({
      title: "Ultraplan Approved",
      description: "Teleporting remote planning results to local workspace (__ULTRAPLAN_TELEPORT_LOCAL__)",
    });
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700/80 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">ATA Service Mode</p>
              <h4 className="text-2xl font-bold mt-2 text-white">Autonomous</h4>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">Zero Human Interruption</span>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700/80 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">KAIROS Daemon</p>
              <h4 className="text-2xl font-bold mt-2 text-white">
                {kairosActive ? "Watching" : "Paused"}
              </h4>
            </div>
            <button 
              onClick={() => setKairosActive(!kairosActive)}
              className={`p-2 rounded-lg border transition duration-200 ${
                kairosActive 
                  ? "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20" 
                  : "bg-slate-800/50 border-slate-700/50 text-slate-500 hover:bg-slate-800"
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex justify-between items-center">
            <span>Blocking budget: 15s</span>
            <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">Proactive</Badge>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700/80 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Deep Reasoning</p>
              <h4 className="text-2xl font-bold mt-2 text-white">ULTRAPLAN</h4>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex justify-between">
            <span>Remote CCR Session: Ready</span>
            <span className="text-purple-400 font-semibold">{pendingPlans.length} Pending</span>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700/80 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Memory Pass</p>
              <h4 className="text-2xl font-bold mt-2 text-white">autoDream</h4>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Pruned & Compacted</span>
            <button 
              onClick={runTriggerDream}
              disabled={dreaming}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${dreaming ? "animate-spin" : ""}`} />
              Dream
            </button>
          </div>
        </Card>
      </div>

      {/* autoDream Progress bar */}
      {dreaming && (
        <Card className="p-4 bg-amber-950/20 border-amber-500/20">
          <div className="flex justify-between items-center text-xs text-amber-400 mb-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Consolidating session drift into durable MEMORY.md file...
            </span>
            <span>{dreamProgress}%</span>
          </div>
          <Progress value={dreamProgress} className="bg-amber-950/50" />
        </Card>
      )}

      {/* Main Grid: Swarm & Ultraplan / KAIROS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Swarm Visualizer */}
        <Card className="p-6 lg:col-span-2 bg-slate-900/40 backdrop-blur-md border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Multi-Agent Swarm Registry</h3>
              </div>
              <Badge variant="outline" className="text-xs text-indigo-400 border-indigo-400/20">
                Coordinator Mode
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/25 text-indigo-400 animate-pulse">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-white">Coordinator Agent</h5>
                    <p className="text-xs text-slate-400">Orchestrating concurrent workspace subagents</p>
                  </div>
                </div>
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-[10px] text-white">ACTIVE</Badge>
              </div>

              <div className="pl-6 border-l border-slate-800 space-y-3">
                {workers.map((worker) => (
                  <div key={worker.id} className="p-3 rounded-lg border border-slate-900 bg-slate-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${worker.color}`}>
                        {worker.id}
                      </span>
                      <div>
                        <h6 className="text-xs font-medium text-slate-300">{worker.name}</h6>
                        <p className="text-[11px] text-slate-500">{worker.task}</p>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      worker.status === 'completed' 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : worker.status === 'active'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-500 bg-slate-800'
                    }`}>
                      {worker.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Communications managed via &lt;task-notification&gt; XML messages</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Shared scratchpad activated
            </span>
          </div>
        </Card>

        {/* KAIROS & Memory files sidebar */}
        <div className="space-y-6">
          {/* ULTRAPLAN Review Card */}
          <Card className="p-6 bg-slate-900/40 backdrop-blur-md border-slate-800/80">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              ULTRAPLAN Deep Reasoning
            </h3>
            
            {pendingPlans.length > 0 ? (
              pendingPlans.map(plan => (
                <div key={plan.id} className="space-y-3 p-3.5 rounded-lg border border-purple-500/20 bg-purple-950/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {plan.id}
                    </span>
                    <span className="text-[10px] text-slate-400">Needs Review</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white">{plan.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{plan.details}</p>
                  <p className="text-[10px] text-slate-500 italic">{plan.budget}</p>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => approvePlan(plan.id)}
                      className="w-full text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1"
                    >
                      Approve & Teleport
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/55 mx-auto mb-2" />
                No pending reasoning plans.
              </div>
            )}
          </Card>

          {/* autoDream Files */}
          <Card className="p-6 bg-slate-900/40 backdrop-blur-md border-slate-800/80">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Durable Memory Passes
            </h3>
            <div className="space-y-3">
              {memoryFiles.map(file => (
                <div key={file.name} className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-xs font-medium text-slate-200">{file.name}</span>
                      <p className="text-[10px] text-slate-500">{file.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">{file.size}</span>
                    <p className="text-[9px] text-slate-500">{file.lines} lines</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* KAIROS Proactive Observations list */}
      <Card className="p-6 bg-slate-900/40 backdrop-blur-md border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            KAIROS Proactive Telemetry Logs
          </h3>
          <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/25">Always-On</Badge>
        </div>
        <ScrollArea className="h-44">
          <div className="space-y-2.5 font-mono text-xs text-slate-300">
            {observations.map((obs, idx) => (
              <div key={idx} className="flex gap-4 p-1.5 hover:bg-slate-800/30 rounded transition duration-150">
                <span className="text-slate-500 select-none">[{obs.time}]</span>
                <span className="text-slate-400 select-none">KAIROS_SYS:</span>
                <span className="text-slate-200 flex-1">{obs.msg}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AtaCockpit;
