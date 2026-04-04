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

  const inputBox = (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 hover:border-terracotta focus-within:border-gray-400 transition-all">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Do anything with AI..."
        rows={2}
        className="flex-1 resize-none focus:outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
        style={{
          minHeight: '48px',
          maxHeight: '160px',
        }}
      />
      <button
        onClick={() => handleSendMessage()}
        disabled={!inputValue.trim() || isTyping}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                How can I help you today?
              </h2>
              <p className="text-base text-gray-500">
                Ask me anything about your schedule, tasks, or projects
              </p>
            </div>

            {/* Input above prompts */}
            <div className="w-full max-w-2xl mb-6">
              {inputBox}
            </div>

            <div className="w-full max-w-2xl">
              <SuggestedPrompts onSelectPrompt={handleSuggestedPrompt} />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear chat
              </button>
            </div>
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
          </div>
        )}
      </div>

      {/* Bottom input — only shown when chat is active */}
      {messages.length > 0 && (
        <div className="border-t border-gray-100 py-4 px-6">
          <div className="max-w-2xl mx-auto">
            {inputBox}
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI responses are simulated. Backend integration coming soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;