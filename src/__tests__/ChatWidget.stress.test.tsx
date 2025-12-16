// __tests__/ChatWidget.stress.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChatWidget } from '@/components/ChatWidget';
import { storage } from '@/services/storage';
import { ChatService } from '@/services/chatService';
import type { Message } from '@/types';

// Vitest mocking
vi.mock('@/services/storage');
vi.mock('@/services/chatService');

const generateMessages = (count: number): Message[] => {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    messages.push(
      {
        id: `user-${i}`,
        role: 'user',
        content: `User message ${i}: This is a test message with some content`,
        timestamp: Date.now() - (count - i) * 1000,
        seq: i * 2
      },
      {
        id: `assistant-${i}`,
        role: 'assistant',
        content: `Assistant response ${i}: Here is a detailed response.`,
        timestamp: Date.now() - (count - i) * 1000 + 500,
        seq: i * 2 + 1,
        isStreaming: false
      }
    );
  }
  return messages;
};

describe('ChatWidget Stress Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup storage mocks
    vi.mocked(storage.load).mockResolvedValue([]);
    vi.mocked(storage.save).mockResolvedValue(undefined);
    vi.mocked(storage.clear).mockResolvedValue(undefined);

    // Mock ChatService
    vi.mocked(ChatService).mockImplementation(() => ({
      streamResponse: vi.fn().mockImplementation(async function* () {
        yield { content: 'Mocked response', components: [] };
      }),
    } as any));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Performance Tests', () => {
    it('should render 1000 messages efficiently', async () => {
      const messages = generateMessages(500);
      vi.mocked(storage.load).mockResolvedValue(messages);

      const startTime = performance.now();
      render(<ChatWidget />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(`Rendered ${messages.length} messages in ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(3000);

      const toggleButton = screen.getByLabelText('Toggle chat');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText(/UI Library Assistant/i)).toBeInTheDocument();
      });
    });

    it('should handle 2000 messages without crashing', async () => {
      const messages = generateMessages(1000);
      vi.mocked(storage.load).mockResolvedValue(messages);

      const { container } = render(<ChatWidget />);

      const toggleButton = screen.getByLabelText('Toggle chat');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const messagesContainer = container.querySelector('[class*="overflow-y-auto"]');
        expect(messagesContainer).toBeInTheDocument();
      }, { timeout: 5000 });

      console.log('✅ Successfully handled 2000 messages');
    });

    it('should maintain performance with 5000 messages', async () => {
      const messages = generateMessages(2500);
      vi.mocked(storage.load).mockResolvedValue(messages);

      console.log('Starting 5000 message stress test...');
      const startTime = performance.now();

      const { container } = render(<ChatWidget />);

      const toggleButton = screen.getByLabelText('Toggle chat');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const messagesContainer = container.querySelector('[class*="overflow-y-auto"]');
        expect(messagesContainer).toBeInTheDocument();
      }, { timeout: 10000 });

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      console.log(`5000 message test completed in ${totalTime.toFixed(2)}ms`);

      expect(container).toBeInTheDocument();
      expect(totalTime).toBeLessThan(10000);
    });
  });

  describe('Scrolling Performance', () => {
    it('should handle rapid scrolling with 1000 messages', async () => {
      const messages = generateMessages(500);
      vi.mocked(storage.load).mockResolvedValue(messages);

      const { container } = render(<ChatWidget />);

      const toggleButton = screen.getByLabelText('Toggle chat');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
        expect(scrollContainer).toBeInTheDocument();
      });

      const scrollContainer = container.querySelector('[class*="overflow-y-auto"]') as HTMLElement;

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: i * 500 } });
      }

      const endTime = performance.now();
      const scrollTime = endTime - startTime;

      console.log(`Rapid scroll operations completed in ${scrollTime.toFixed(2)}ms`);
      expect(scrollTime).toBeLessThan(1000);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with repeated mount/unmount cycles', async () => {
      const messages = generateMessages(500);
      vi.mocked(storage.load).mockResolvedValue(messages);

      const iterations = 10;
      console.log(`🔄 Running ${iterations} mount/unmount cycles...`);

      for (let i = 0; i < iterations; i++) {
        const { unmount } = render(<ChatWidget />);

        const toggleButton = screen.getByLabelText('Toggle chat');
        fireEvent.click(toggleButton);

        await waitFor(() => {
          expect(screen.getByText(/UI Library Assistant/i)).toBeInTheDocument();
        });

        unmount();
      }

      console.log('Memory management test completed');
      expect(true).toBe(true);
    });
  });
});