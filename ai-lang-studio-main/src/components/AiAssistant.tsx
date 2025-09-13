import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Send, Lightbulb, Code, MessageSquare, Zap } from "lucide-react";

const AiAssistant = () => {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI coding assistant powered by Gemini. I can help you with code generation, debugging, optimization, and explanations across all supported languages. What would you like to work on?",
      timestamp: new Date()
    }
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you optimize this code! Here's a more efficient approach using built-in functions...",
        "I notice a potential bug in your logic. Let me suggest a fix and explain why this happens...",
        "Great question! Here's how you can implement this algorithm with better time complexity...",
        "I can generate that function for you. Here's a clean implementation with error handling...",
      ];
      
      const aiResponse = {
        role: "assistant" as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000);
  };

  const quickActions = [
    { icon: Code, label: "Generate Code", prompt: "Generate a function that..." },
    { icon: Lightbulb, label: "Explain Code", prompt: "Explain how this code works..." },
    { icon: Zap, label: "Debug Issue", prompt: "I'm getting an error..." },
    { icon: MessageSquare, label: "Optimize", prompt: "How can I optimize this code..." },
  ];

  return (
    <Card className="p-6 gradient-secondary border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="gradient-ai rounded-lg p-2">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <Badge variant="secondary" className="text-xs">Powered by Gemini</Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="gap-2 h-auto p-3 flex-col items-center text-center"
            onClick={() => setMessage(action.prompt)}
          >
            <action.icon className="w-4 h-4" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Conversation */}
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <Avatar className="w-8 h-8 gradient-ai">
                <AvatarFallback className="bg-transparent">
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg p-3 max-w-xs ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {isThinking && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 gradient-ai">
              <AvatarFallback className="bg-transparent">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
                <Sparkles className="w-3 h-3 animate-spin" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about your code..."
          className="resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button 
          onClick={sendMessage}
          disabled={!message.trim() || isThinking}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default AiAssistant;