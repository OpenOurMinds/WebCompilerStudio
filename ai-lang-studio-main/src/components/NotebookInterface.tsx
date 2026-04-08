import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Plus, Sparkles, Code, Terminal, Save, Download } from "lucide-react";
import CodeCell from "@/components/CodeCell";
import AiAssistant from "@/components/AiAssistant";

const NotebookInterface = () => {
  const [language, setLanguage] = useState("python");
  const [cells, setCells] = useState([
    { id: 1, type: "code", content: "# Welcome to CodeIDE Cloud!\nprint('Hello, Multi-language World!')", language: "python", output: "Hello, Multi-language World!" },
  ]);

  const addCell = () => {
    const newCell = {
      id: cells.length + 1,
      type: "code",
      content: "",
      language: language,
      output: ""
    };
    setCells([...cells, newCell]);
  };

  const languages = [
    { value: "python", label: "Python", icon: "🐍" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "rust", label: "Rust", icon: "🦀" },
    { value: "go", label: "Go", icon: "🐹" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Notebook Header */}
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Untitled Notebook</h2>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    {lang.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Notebook Cells */}
      <div className="space-y-4">
        {cells.map((cell, index) => (
          <CodeCell
            key={cell.id}
            cell={cell}
            onUpdate={(updatedCell) => {
              const newCells = [...cells];
              newCells[index] = updatedCell;
              setCells(newCells);
            }}
          />
        ))}
        
        {/* Add Cell Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={addCell}
            className="gap-2 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            Add {language.charAt(0).toUpperCase() + language.slice(1)} Cell
          </Button>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AiAssistant />
    </div>
  );
};

export default NotebookInterface;