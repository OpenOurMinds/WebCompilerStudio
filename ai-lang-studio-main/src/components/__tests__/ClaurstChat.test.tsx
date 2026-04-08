import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/hooks/use-toast';
import ClaurstChat from '@/components/ClaurstChat';
import { apiClient } from '@/lib/api';

// Mock the API client
jest.mock('@/lib/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock WebSocket
class MockWebSocket {
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  
  constructor(url: string) {
    // Mock WebSocket constructor
  }
  
  send(data: string) {
    // Mock send method
  }
  
  close() {
    // Mock close method
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// @ts-ignore
global.WebSocket = MockWebSocket;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {component}
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('ClaurstChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message when no session is selected', () => {
    mockApiClient.healthCheck.mockResolvedValue({
      status: 'healthy',
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.0.8'
    });

    mockApiClient.listSessions.mockResolvedValue({ sessions: [] });

    renderWithProviders(<ClaurstChat />);

    expect(screen.getByText('Welcome to Claurst')).toBeInTheDocument();
    expect(screen.getByText('Start New Session')).toBeInTheDocument();
  });

  test('displays connection status', async () => {
    mockApiClient.healthCheck.mockResolvedValue({
      status: 'healthy',
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.0.8'
    });

    mockApiClient.listSessions.mockResolvedValue({ sessions: [] });

    renderWithProviders(<ClaurstChat />);

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  test('creates a new session', async () => {
    mockApiClient.healthCheck.mockResolvedValue({
      status: 'healthy',
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.0.8'
    });

    const mockSession = {
      id: 'test-session-id',
      title: 'Test Session',
      messages: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    mockApiClient.listSessions.mockResolvedValue({ sessions: [] });
    mockApiClient.createSession.mockResolvedValue({ session: mockSession });

    renderWithProviders(<ClaurstChat />);

    const newSessionButton = screen.getByText('New');
    fireEvent.click(newSessionButton);

    await waitFor(() => {
      expect(mockApiClient.createSession).toHaveBeenCalledWith({});
    });

    await waitFor(() => {
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });
  });

  test('sends a message in a session', async () => {
    mockApiClient.healthCheck.mockResolvedValue({
      status: 'healthy',
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.0.8'
    });

    const mockSession = {
      id: 'test-session-id',
      title: 'Test Session',
      messages: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    const mockResponse = {
      message: {
        role: 'assistant' as const,
        content: 'I received your message!',
        uuid: 'test-uuid',
        cost: {
          input_tokens: 10,
          output_tokens: 5,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
          cost_usd: 0.0001
        }
      },
      session_id: 'test-session-id'
    };

    mockApiClient.listSessions.mockResolvedValue({ sessions: [mockSession] });
    mockApiClient.sendMessage.mockResolvedValue(mockResponse);

    renderWithProviders(<ClaurstChat />);

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });

    // Type and send a message
    const messageInput = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(messageInput, { target: { value: 'Hello, Claurst!' } });
    fireEvent.keyPress(messageInput, { key: 'Enter' });

    await waitFor(() => {
      expect(mockApiClient.sendMessage).toHaveBeenCalledWith({
        message: 'Hello, Claurst!',
        session_id: 'test-session-id'
      });
    });

    await waitFor(() => {
      expect(screen.getByText('I received your message!')).toBeInTheDocument();
    });
  });

  test('deletes a session', async () => {
    mockApiClient.healthCheck.mockResolvedValue({
      status: 'healthy',
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.0.8'
    });

    const mockSession = {
      id: 'test-session-id',
      title: 'Test Session',
      messages: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    mockApiClient.listSessions.mockResolvedValue({ sessions: [mockSession] });
    mockApiClient.deleteSession.mockResolvedValue(undefined);

    renderWithProviders(<ClaurstChat />);

    await waitFor(() => {
      expect(screen.getByText('Test Session')).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockApiClient.deleteSession).toHaveBeenCalledWith('test-session-id');
    });
  });

  test('displays error when connection fails', async () => {
    mockApiClient.healthCheck.mockRejectedValue(new Error('Connection failed'));

    renderWithProviders(<ClaurstChat />);

    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });
  });
});
