import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Plus, Share2, Sparkles, Code2, Brain, Zap, Shield, FolderOpen, MessageSquare, Terminal, Eye } from "lucide-react";
import Header from "@/components/Header";
import ClaurstChat from "@/components/ClaurstChat";
import AtaCockpit from "@/components/AtaCockpit";
import AgentWorkspace from "@/components/AgentWorkspace";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition duration-200">
              ATA Cockpit
            </TabsTrigger>
            <TabsTrigger value="workspace" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition duration-200">
              Agent Workspace
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition duration-200">
              Interactive Chat
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition duration-200">
              Task Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Custom Welcome Panel */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/20 p-8 md:p-12 mb-8">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Version 0.0.8 Released
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                  Autonomous Agentic Studio
                </h1>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  Decouple complex software engineering tasks into parallel execution workflows with the Claurst agentic engine. 
                  Operates fully autonomously with Zero Human Interruption.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setActiveTab("workspace")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2 px-6">
                    <Play className="w-4 h-4 fill-white" />
                    Spawn Agent Session
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("chat")} className="border-slate-800 text-slate-300 hover:bg-slate-900">
                    Interactive CLI Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Render the Cockpit Dashboard */}
            <AtaCockpit />
          </TabsContent>

          <TabsContent value="workspace">
            <AgentWorkspace />
          </TabsContent>

          <TabsContent value="chat">
            <ClaurstChat />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Repository Task Directories</h2>
                <p className="text-sm text-slate-400 mt-1">Select and view past autonomous runs, consolidated plans, and results.</p>
              </div>
              <Button onClick={() => setActiveTab("workspace")} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Spawn New Task
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Repository Clean Pass", status: "completed", description: "Audit dependencies and prune old WebCompiler modules from package.json", runtime: "2.5 mins" },
                { name: "Setup Dev Script Refactor", status: "completed", description: "Update start-dev.sh and docker-compose.yml directory paths to snake_case", runtime: "1.2 mins" },
                { name: "Write Integration Unit Tests", status: "completed", description: "Implement integration suites for claurst-web routing endpoints", runtime: "5.8 mins" },
                { name: "autoDream compact mapping", status: "completed", description: "Compact session workspace telemetry records into Durable memory mapping files", runtime: "45 secs" },
              ].map((project, index) => (
                <Card key={index} className="p-6 bg-slate-900/40 border-slate-850 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-semibold text-white truncate max-w-[180px]">{project.name}</h3>
                      <Badge className="bg-emerald-600 hover:bg-emerald-600/90 text-white text-[10px] uppercase font-bold">{project.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{project.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-850 pt-3 text-xs text-slate-500">
                    <span>Runtime: {project.runtime}</span>
                    <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300 font-semibold p-0">
                      Open Report
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;