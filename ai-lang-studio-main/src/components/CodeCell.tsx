import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Copy, Trash2, Sparkles, CheckCircle } from "lucide-react";

interface CodeCellProps {
  cell: {
    id: number;
    type: string;
    content: string;
    language: string;
    output: string;
  };
  onUpdate: (cell: any) => void;
}

const CodeCell = ({ cell, onUpdate }: CodeCellProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(!!cell.output);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const mockOutputs: Record<string, string> = {
        python: "Hello, Multi-language World!\n>>> Code executed successfully",
        cpp: "Hello, Multi-language World!\nCompilation successful. Runtime: 0.2s",
        java: "Hello, Multi-language World!\nBuild successful. Execution time: 0.5s",
        javascript: "Hello, Multi-language World!\n> Code executed in Node.js environment",
        rust: "Hello, Multi-language World!\nCompiled successfully. Memory safe execution.",
        go: "Hello, Multi-language World!\nBuild successful. Goroutines: 1"
      };
      
      const output = mockOutputs[cell.language] || "Code executed successfully";
      onUpdate({ ...cell, output });
      setShowOutput(true);
      setIsRunning(false);
    }, 2000);
  };

  const handleContentChange = (content: string) => {
    onUpdate({ ...cell, content });
  };

  return (
    <Card className="p-0 overflow-hidden border-border/50 hover:border-primary/30 transition-smooth">
      {/* Cell Header */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {cell.language.charAt(0).toUpperCase() + cell.language.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">Cell {cell.id}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Fix
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-4">
        <Textarea
          value={cell.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={`Enter ${cell.language} code here...`}
          className="code-editor min-h-32 font-mono text-sm resize-none border-0 bg-transparent p-4"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace"
          }}
        />
        
        <div className="flex items-center justify-between mt-4">
          <Button 
            onClick={runCode}
            disabled={isRunning || !cell.content.trim()}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          
          {showOutput && (
            <Badge variant="outline" className="gap-1 text-accent">
              <CheckCircle className="w-3 h-3" />
              Executed
            </Badge>
          )}
        </div>
      </div>

      {/* Output */}
      {showOutput && cell.output && (
        <div className="border-t bg-muted/20">
          <div className="p-4">
            <div className="text-xs text-muted-foreground mb-2">Output:</div>
            <pre className="code-editor p-3 text-sm text-accent whitespace-pre-wrap">
              {cell.output}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CodeCell;