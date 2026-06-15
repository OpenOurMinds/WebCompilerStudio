import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Square, Terminal, Code2, Brain, Sparkles, CheckCircle2, 
  Settings2, RefreshCw, Layers, ShieldCheck, ChevronRight, FileCode
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ToolTrace {
  tool: string;
  args: string;
  output: string;
  status: "success" | "error" | "running";
}

interface Step {
  title: string;
  status: "pending" | "running" | "completed";
  thinking?: string;
  toolTraces?: ToolTrace[];
}

const AgentWorkspace = () => {
  const { toast } = useToast();
  const [task, setTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.5-sonnet");
  const [permissionMode, setPermissionMode] = useState("Default");
  const [thinkingBudget, setThinkingBudget] = useState("4000");

  const [steps, setSteps] = useState<Step[]>([
    {
      title: "Research Phase",
      status: "pending",
      thinking: "Analyzing workspace structure to find unnecessary files. I will run a glob command to locate folders and inspect package.json to identify old references.",
      toolTraces: [
        { tool: "GlobTool", args: '{"pattern": "**/*"}', output: "Found 124 files across multiple directories. Detected old 'WebCompiler' notebook structures.", status: "success" },
        { tool: "FileReadTool", args: '{"path": "package.json"}', output: "Read package.json. Detected obsolete modules: mock-compiler, compiler-runtime, jupyter-notebook-cell.", status: "success" }
      ]
    },
    {
      title: "Planning & Synthesis",
      status: "pending",
      thinking: "Creating a plan to migrate from manual compilation layout to the Autonomous Task Agent dashboard. I will draft changes to Index.tsx, delete old Notebook files, and add the Cockpit.",
      toolTraces: [
        { tool: "EnterPlanModeTool", args: '{"purpose": "refactor_web_compiler_to_ata_studio"}', output: "Entered Plan Mode. Spawned background plan verification. Safe state established.", status: "success" }
      ]
    },
    {
      title: "Implementation Phase",
      status: "pending",
      thinking: "Now applying modifications. I will delete NotebookInterface.tsx and write AtaCockpit.tsx and AgentWorkspace.tsx. Editing main routing entries next.",
      toolTraces: [
        { tool: "FileDeleteTool", args: '{"path": "src/components/NotebookInterface.tsx"}', output: "Successfully deleted file.", status: "success" },
        { tool: "FileWriteTool", args: '{"path": "src/components/AtaCockpit.tsx"}', output: "Created file. Wrote 240 lines of React components.", status: "success" },
        { tool: "FileEditTool", args: '{"path": "src/pages/Index.tsx", "diff": "@@ -20,10 +20,14 @@..."}', output: "Applied code diff successfully.", status: "success" }
      ]
    },
    {
      title: "Verification & Compaction",
      status: "pending",
      thinking: "I will run integration builds to ensure no compiler warnings exist and then run autoDream to compact history down to MEMORY.md.",
      toolTraces: [
        { tool: "BashTool", args: '{"command": "npm run build"}', output: "Vite v5.2.1 build completed in 1.4s. Zero errors, zero warnings.", status: "success" },
        { tool: "SyntheticOutputTool", args: '{"outcome": "success"}', output: "Task completed autonomously.", status: "success" }
      ]
    }
  ]);

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentStepIdx, isRunning]);

  const startTaskSimulation = () => {
    if (!task.trim()) {
      toast({
        title: "Task is empty",
        description: "Please specify a high-level task for the agent to perform.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setCurrentStepIdx(0);
    setProgress(5);
    
    // Reset all steps to pending
    setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));

    toast({
      title: "Autonomous Agent Initialized",
      description: "Coordinator agent has spawned workers. Beginning task execution without human interruption.",
    });
  };

  // Simulated query loop ticking
  useEffect(() => {
    if (!isRunning) return;

    if (currentStepIdx >= steps.length) {
      setIsRunning(false);
      setProgress(100);
      toast({
        title: "Task Completed Successfully",
        description: "Claurst finished execution with zero errors. Repository is fully consolidated.",
      });
      return;
    }

    // Set current step to running
    setSteps(prev => {
      const copy = [...prev];
      copy[currentStepIdx].status = "running";
      return copy;
    });

    const timeout = setTimeout(() => {
      // Complete current step and advance
      setSteps(prev => {
        const copy = [...prev];
        copy[currentStepIdx].status = "completed";
        return copy;
      });
      setCurrentStepIdx(prev => prev + 1);
      setProgress(Math.round(((currentStepIdx + 1) / steps.length) * 100));
    }, 4500); // 4.5 seconds per phase

    return () => clearTimeout(timeout);
  }, [isRunning, currentStepIdx]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Task Console (Left panel) */}
      <Card className="p-6 lg:col-span-2 bg-slate-900/40 backdrop-blur-md border-slate-800/80 flex flex-col justify-between h-[calc(100vh-12rem)]">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white font-mono">Agent Console</h3>
            </div>
            {isRunning && (
              <Badge className="bg-amber-600 animate-pulse text-xs text-white">
                EXECUTING LOOP
              </Badge>
            )}
          </div>

          {/* Prompt input */}
          {!isRunning ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Autonomous Task Goal</label>
                <Input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g. Analyze repository structure, remove old notebook code-cell modules, and wire cockpit dashboards"
                  className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 h-11 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Model Selection</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full h-9 bg-slate-950/60 border border-slate-800 rounded px-2 text-xs text-slate-300 focus:border-indigo-500"
                  >
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                    <option value="google/gemini-2.5-flash">Gemini 2.5 Flash</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Permission Mode</label>
                  <select 
                    value={permissionMode}
                    onChange={(e) => setPermissionMode(e.target.value)}
                    className="w-full h-9 bg-slate-950/60 border border-slate-800 rounded px-2 text-xs text-slate-300 focus:border-indigo-500"
                  >
                    <option value="Default">Default (Prompts)</option>
                    <option value="AcceptEdits">Accept Edits</option>
                    <option value="YOLO">YOLO (No Prompts)</option>
                    <option value="Plan">Plan Mode</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Reasoning Budget</label>
                  <select 
                    value={thinkingBudget}
                    onChange={(e) => setThinkingBudget(e.target.value)}
                    className="w-full h-9 bg-slate-950/60 border border-slate-800 rounded px-2 text-xs text-slate-300 focus:border-indigo-500"
                  >
                    <option value="2000">2,000 Tokens</option>
                    <option value="4000">4,000 Tokens</option>
                    <option value="8000">8,000 Tokens</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={startTaskSimulation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex gap-2 items-center justify-center py-5 rounded-lg transition"
              >
                <Play className="w-4 h-4 fill-white" />
                Spawn Autonomous Agent
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <ScrollArea className="flex-1 max-h-[360px] pr-4">
                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const isActive = step.status === "running";
                    const isDone = step.status === "completed";
                    
                    if (step.status === "pending") return null;

                    return (
                      <Card key={idx} className={`p-4 bg-slate-950/30 border-slate-900 ${
                        isActive ? "border-indigo-500/30 bg-indigo-950/5" : ""
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold font-mono text-indigo-400">{step.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isDone ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10 animate-pulse"
                          }`}>
                            {step.status.toUpperCase()}
                          </span>
                        </div>

                        {step.thinking && (
                          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded text-xs text-slate-300 font-mono leading-relaxed mb-3">
                            <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1 font-sans">
                              <Brain className="w-3.5 h-3.5 text-indigo-400" />
                              REASONING
                            </div>
                            {step.thinking}
                          </div>
                        )}

                        <div className="space-y-2">
                          {step.toolTraces?.map((trace, tIdx) => (
                            <div key={tIdx} className="bg-slate-950/40 p-2.5 rounded border border-slate-900">
                              <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                                <span className="text-slate-400 flex items-center gap-1">
                                  <Code2 className="w-3 h-3 text-sky-400" />
                                  {trace.tool}
                                </span>
                                <span className="text-slate-500">{trace.args}</span>
                              </div>
                              <pre className="text-[10px] text-slate-300 overflow-x-auto font-mono bg-slate-950/20 p-2 rounded">
                                {trace.output}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                  <div ref={consoleEndRef} />
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-4">
                <Progress value={progress} className="flex-1 bg-slate-800" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsRunning(false)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Square className="w-3.5 h-3.5 mr-1 fill-red-400" />
                  Abort
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isRunning && (
          <div className="border-t border-slate-800/50 mt-4 pt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>LLM Endpoint: localhost:8080/api/send</span>
            <span>Security context: User Sandbox</span>
          </div>
        )}
      </Card>

      {/* Configuration & Connected tools sidebar */}
      <div className="space-y-6">
        {/* Connected Tools & MCP Capabilities */}
        <Card className="p-6 bg-slate-900/40 backdrop-blur-md border-slate-800/80">
          <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Registered Agent Tools
          </h3>
          
          <div className="space-y-2">
            {[
              { name: "BashTool", desc: "Sandbox shell execution (with prctl protection)", risk: "HIGH" },
              { name: "FileEditTool", desc: "Performs contiguous/multi-line code replacements", risk: "MEDIUM" },
              { name: "GlobTool / GrepTool", desc: "Finds paths and search patterns natively via ugrep/bfs", risk: "LOW" },
              { name: "WebBrowserTool", desc: "Fetches and interacts with raw web pages via chromium", risk: "MEDIUM" },
              { name: "AgentTool", desc: "Coordinator tool to spawn worker subagents async", risk: "MEDIUM" }
            ].map(tool => (
              <div key={tool.name} className="p-3 rounded bg-slate-950/20 border border-slate-900 flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">{tool.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{tool.desc}</p>
                </div>
                <span className={`text-[9px] font-bold font-mono px-1 rounded ${
                  tool.risk === 'HIGH' ? 'text-red-400 bg-red-500/10' :
                  tool.risk === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 bg-slate-800'
                }`}>
                  {tool.risk}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sandboxed Protection details */}
        <Card className="p-6 bg-slate-900/40 backdrop-blur-md border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">ATA Safety Guards</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            To prevent traversal vulnerabilities or system compromise during headless turns, the Claurst agent utilizes path verification, protected system directories (`.gitconfig`, `.bashrc`), and strict budget checks.
          </p>
          <div className="text-[10px] text-slate-500 font-mono space-y-1">
            <div>• Path Traversal Guardian: Enabled</div>
            <div>• Process memory protection (ptrace lock): Enabled</div>
            <div>• ML-based YOLO transcript filter: Active</div>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default AgentWorkspace;
