import { useState, useEffect, useRef } from 'react';
import { apiClient, Session, Message } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Plus, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClaurstChat = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  useEffect(() => {
    loadSessions();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await apiClient.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Unable to connect to Claurst backend. Please ensure the server is running on localhost:8080",
        variant: "destructive",
      });
    }
  };

  const loadSessions = async () => {
    try {
      const response = await apiClient.listSessions();
      setSessions(response.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createSession = async (title?: string) => {
    try {
      const response = await apiClient.createSession({ title });
      const newSession = response.session;
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: "Error",
        description: "Failed to create new session",
        variant: "destructive",
      });
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await apiClient.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentSession || isLoading) return;

    setIsLoading(true);
    const userMessage = message.trim();
    setMessage('');

    try {
      const response = await apiClient.sendMessage({
        message: userMessage,
        session_id: currentSession.id,
      });

      // Update current session with new messages
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, response.message],
          updated_at: new Date().toISOString(),
        };
      });

      // Update sessions list
      await loadSessions();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (content: string | any[]) => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  const renderMessage = (msg: Message, index: number) => {
    const isUser = msg.role === 'user';
    
    return (
      <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        )}
        
        <Card className={`max-w-[80%] p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            <Badge variant="secondary" className="text-xs">
              {isUser ? 'You' : 'Claurst'}
            </Badge>
          </div>
          <div className="text-sm whitespace-pre-wrap">
            {formatMessageContent(msg.content)}
          </div>
        </Card>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sessions Sidebar */}
      <Card className="w-80 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Sessions
          </h3>
          <Button size="sm" onClick={() => createSession()} className="gap-1">
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-colors ${
                  currentSession?.id === session.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => setCurrentSession(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {session.title || `Session ${session.id.slice(0, 8)}`}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.updated_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.messages.length} messages
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col p-4">
        {currentSession ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {currentSession.title || `Session ${currentSession.id.slice(0, 8)}`}
              </h3>
              <Badge variant="outline">
                {currentSession.messages.length} messages
              </Badge>
            </div>

            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 p-4">
                {currentSession.messages.map((msg, index) => renderMessage(msg, index))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Welcome to Claurst</h3>
              <p className="text-muted-foreground mb-4">
                Start a new session or select an existing one to begin chatting with your AI coding assistant.
              </p>
              <Button onClick={() => createSession()} className="gap-2">
                <Plus className="w-4 h-4" />
                Start New Session
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClaurstChat;
