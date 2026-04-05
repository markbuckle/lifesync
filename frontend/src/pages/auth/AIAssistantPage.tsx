import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../../components/ai/ChatMessage';
import TypingIndicator from '../../components/ai/TypingIndicator';
import SuggestedPrompts from '../../components/ai/SuggestedPrompts';
import { Send, Trash2, Sparkles, MessageSquareText, MessageSquarePlus, Search } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

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

const AIAssistantPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    return [
      {
        id: 'seed-1',
        title: 'What tasks are due this week?',
        messages: [
          { id: 's1m1', role: 'user', content: 'What tasks are due this week?', timestamp: now },
          {
            id: 's1m2',
            role: 'assistant',
            content:
              "You have 6 tasks due this week:\n\n• Review Q2 report (Today, High)\n• Team standup prep (Tomorrow, Medium)\n• Send client proposal (Wednesday, High)\n• Update project docs (Thursday, Low)\n• Monthly budget review (Friday, High)\n• Team retrospective (Friday, Medium)\n\nWould you like me to prioritize or reschedule any of these?",
            timestamp: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'seed-2',
        title: 'Reschedule dentist appointment',
        messages: [
          { id: 's2m1', role: 'user', content: 'Reschedule dentist appointment', timestamp: yesterday },
          {
            id: 's2m2',
            role: 'assistant',
            content:
              "Your dentist appointment is currently set for Monday at 9:00 AM. When would you like to reschedule it?\n\nYour next available slots are:\n• Tuesday, 10:00 AM\n• Wednesday, 2:00 PM\n• Thursday, 11:00 AM",
            timestamp: yesterday,
          },
        ],
        createdAt: yesterday,
        updatedAt: yesterday,
      },
      {
        id: 'seed-3',
        title: 'Project status summary',
        messages: [
          { id: 's3m1', role: 'user', content: 'Project status summary', timestamp: twoDaysAgo },
          {
            id: 's3m2',
            role: 'assistant',
            content:
              "Here's your project status summary:\n\n📊 Website Redesign — 65% complete, On Track\n⚠️ Mobile App MVP — 40% complete, At Risk\n✅ Q2 Marketing Push — 85% complete, Nearly Done\n\nThe Mobile App MVP needs attention. Would you like suggestions to get it back on track?",
            timestamp: twoDaysAgo,
          },
        ],
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('seed-1');

  const activeMessages =
    conversations.find((c) => c.id === activeConversationId)?.messages ?? [];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const convId = activeConversationId;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setInputValue('');
    setIsTyping(true);

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const isFirst = c.messages.length === 0;
        return {
          ...c,
          title: isFirst ? (text.length > 40 ? text.slice(0, 40) + '...' : text) : c.title,
          messages: [...c.messages, userMessage],
          updatedAt: new Date(),
        };
      })
    );

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date() }
            : c
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: [], title: 'New conversation', updatedAt: new Date() }
            : c
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        style={{ minHeight: '48px', maxHeight: '160px' }}
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
    <div className="h-[calc(100vh-4rem)] flex flex-row overflow-hidden">

      {/* ── History Sidebar ───────────────────────────────────────────────── */}
      <div
        className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">Conversations</span>
          <button
            onClick={handleNewConversation}
            className="text-xs bg-primary text-white rounded-full px-3 py-1 hover:bg-primary-dark transition-colors"
          >
            + New
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-8 pr-3 py-2 w-full bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`w-full text-left px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                conv.id === activeConversationId
                  ? 'bg-secondary'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm font-medium text-gray-800 truncate">{conv.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatRelativeDate(conv.updatedAt)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col h-full">

        {/* Chat header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle history"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {sidebarOpen ? <MessageSquareText className="w-4 h-4 text-primary" /> : <MessageSquarePlus className="w-4 h-4 text-primary" />}
          </button>
          <span className="text-sm font-semibold text-gray-700">AI Assistant</span>
          {activeMessages.length > 0 ? (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {activeMessages.length === 0 ? (
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
              <div className="w-full max-w-2xl mb-6">{inputBox}</div>
              <div className="w-full max-w-2xl">
                <SuggestedPrompts onSelectPrompt={handleSuggestedPrompt} />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
              {activeMessages.map((message) => (
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
        {activeMessages.length > 0 && (
          <div className="border-t border-gray-100 py-4 px-6 flex-shrink-0">
            <div className="max-w-2xl mx-auto">
              {inputBox}
              <p className="text-xs text-gray-400 mt-2 text-center">
                AI responses are simulated. Backend integration coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPage;
