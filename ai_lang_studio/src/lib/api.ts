const API_BASE_URL = 'http://localhost:8080';

export interface Session {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  title?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
  uuid?: string;
  cost?: MessageCost;
}

export interface ContentBlock {
  type: string;
  [key: string]: any;
}

export interface MessageCost {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  cost_usd: number;
}

export interface Tool {
  name: string;
  description: string;
  permission_level: string;
  input_schema: any;
}

export interface Config {
  model?: string;
  max_tokens?: number;
  permission_mode: string;
  theme: string;
  output_format: string;
}

export interface CreateSessionRequest {
  title?: string;
  initial_message?: string;
}

export interface SendMessageRequest {
  message: string;
  session_id: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string; version: string }>('/health');
  }

  // Session management
  async listSessions(): Promise<{ sessions: Session[] }> {
    return this.request<{ sessions: Session[] }>('/api/sessions');
  }

  async createSession(data: CreateSessionRequest): Promise<{ session: Session }> {
    return this.request<{ session: Session }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSession(sessionId: string): Promise<{ session: Session }> {
    return this.request<{ session: Session }>(`/api/sessions/${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    return this.request<void>(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async getSessionMessages(sessionId: string): Promise<{ messages: Message[]; session_id: string }> {
    return this.request<{ messages: Message[]; session_id: string }>(`/api/sessions/${sessionId}/messages`);
  }

  // Messaging
  async sendMessage(data: SendMessageRequest): Promise<{ message: Message; session_id: string }> {
    return this.request<{ message: Message; session_id: string }>('/api/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tools
  async listTools(): Promise<{ tools: Tool[] }> {
    return this.request<{ tools: Tool[] }>('/api/tools');
  }

  // Config
  async getConfig(): Promise<Config> {
    return this.request<Config>('/api/config');
  }

  // WebSocket connection
  createWebSocket(): WebSocket {
    const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
    return new WebSocket(wsUrl);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
