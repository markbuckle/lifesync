import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../../components/ai/ChatMessage';
import TypingIndicator from '../../components/ai/TypingIndicator';
import SuggestedPrompts from '../../components/ai/SuggestedPrompts';
import { Send, Trash2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple response generator (replace with actual AI API later)
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('appointment') || lowerMessage.includes('meeting')) {
      return "You have 5 appointments this week:\n\n• Team Standup (Today, 10:00 AM)\n• Client Call (Today, 2:00 PM)\n• Dentist Appointment (Monday, 9:00 AM)\n• Project Review (Monday, 3:00 PM)\n• Gym Session (Next week, 6:00 PM)\n\nWould you like me to reschedule any of these?";
    }

    if (lowerMessage.includes('task') && lowerMessage.includes('create')) {
      return "I've created a task: 'Review the Q4 report'\n\n📋 Task Details:\n• Priority: High\n• Due: Tomorrow\n• Category: Work\n\nWould you like me to add any additional details or subtasks?";
    }

    if (lowerMessage.includes('project')) {
      return "Here are your projects that need attention:\n\n⚠️ Mobile App Launch (40% complete)\n• Status: At Risk\n• 8/20 tasks completed\n• Due in 2 weeks\n\nThis project is falling behind schedule. Would you like me to suggest ways to get back on track?";
    }

    if (lowerMessage.includes('productivity') || lowerMessage.includes('tips')) {
      return "Here are some productivity tips for tomorrow:\n\n1. **Start with your highest-priority task** - You have 'Review Q4 budget proposal' due tomorrow. Tackle it first thing in the morning.\n\n2. **Block focus time** - Schedule 2 hours of uninterrupted work between your appointments.\n\n3. **Take breaks** - You have a light afternoon. Perfect for a midday walk!\n\n4. **Prepare for Monday** - You have 3 appointments on Monday. Review agendas tonight.\n\nWould you like me to block these times on your calendar?";
    }

    return "I'm here to help you manage your schedule, tasks, and projects! I can:\n\n• Show your upcoming appointments\n• Create and manage tasks\n• Track project progress\n• Provide productivity insights\n• Schedule events and reminders\n\nWhat would you like to do?";
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-gray-600 mt-1">Your personal productivity companion</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  How can I help you today?
                </h2>
                <p className="text-sm text-gray-600">
                  Ask me anything about your schedule, tasks, or projects
                </p>
              </div>

              <div className="w-full max-w-2xl">
                <SuggestedPrompts onSelectPrompt={handleSuggestedPrompt} />
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything... (Press Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              style={{
                minHeight: '40px',
                maxHeight: '100px',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="font-medium text-sm">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI responses are simulated. Backend integration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;