import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Plus, Share2, Sparkles, Code2, Brain, Zap, Users, Cloud, Settings, FolderOpen, MessageSquare } from "lucide-react";
import NotebookInterface from "@/components/NotebookInterface";
import Header from "@/components/Header";
import ClaurstChat from "@/components/ClaurstChat";

const Index = () => {
  const [activeTab, setActiveTab] = useState("notebook");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="notebook">Notebook</TabsTrigger>
            <TabsTrigger value="claurst">Claurst AI</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Hero Section */}
            <section className="text-center py-16 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center glow-primary">
                  <Code2 className="w-10 h-10 text-primary-foreground" />
                </div>
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CodeIDE Cloud
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Multi-language cloud development with AI-powered assistance. Code, compile, and collaborate across Python, C++, Java, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="hero" size="lg" onClick={() => setActiveTab("notebook")} className="gap-2">
                    <Play className="w-5 h-5" />
                    Start Coding
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 gradient-secondary border-border/50 hover:border-primary/50 transition-smooth">
                <div className="gradient-ai rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Assistance</h3>
                <p className="text-muted-foreground">
                  Integrated Gemini API for intelligent code generation, auto-correction, and debugging support.
                </p>
              </Card>

              <Card className="p-6 gradient-secondary border-border/50 hover:border-primary/50 transition-smooth">
                <div className="bg-primary/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Language Support</h3>
                <p className="text-muted-foreground">
                  Execute Python, C++, Java, JavaScript, and more in our cloud-based notebook environment.
                </p>
              </Card>

              <Card className="p-6 gradient-secondary border-border/50 hover:border-primary/50 transition-smooth">
                <div className="bg-accent/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Collaboration</h3>
                <p className="text-muted-foreground">
                  Share notebooks, collaborate in real-time, and build together with your team.
                </p>
              </Card>
            </section>

            {/* Recent Projects */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Machine Learning Basics", language: "Python", lastModified: "2 hours ago" },
                  { name: "Data Structures in C++", language: "C++", lastModified: "1 day ago" },
                  { name: "Spring Boot API", language: "Java", lastModified: "3 days ago" },
                ].map((project, index) => (
                  <Card key={index} className="p-4 hover:border-primary/50 transition-smooth cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant="secondary">{project.language}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.lastModified}</p>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="notebook">
            <NotebookInterface />
          </TabsContent>

          <TabsContent value="claurst">
            <ClaurstChat />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <Button variant="hero" className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "AI Chatbot", language: "Python", description: "Building a conversational AI with Gemini API" },
                { name: "Game Engine", language: "C++", description: "3D game engine development" },
                { name: "Web API", language: "Java", description: "RESTful API with Spring Boot" },
                { name: "React Dashboard", language: "JavaScript", description: "Admin dashboard with real-time data" },
              ].map((project, index) => (
                <Card key={index} className="p-6 hover:border-primary/50 transition-smooth cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <Badge variant="secondary">{project.language}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Open</Button>
                    <Button size="sm" variant="ghost">
                      <Share2 className="w-4 h-4" />
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