import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

// ─── Types ───────────────────────────────────────────────
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

// ─── Suggested Prompts ────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { icon: 'calendar-outline', text: "What's on my schedule today?" },
  { icon: 'checkmark-circle-outline', text: 'What are my high priority tasks?' },
  { icon: 'bulb-outline', text: 'Give me productivity tips for today' },
  { icon: 'time-outline', text: 'Help me plan my week' },
];

// ─── Helpers ─────────────────────────────────────────────
const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const formatRelativeDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ─── Message Bubble ───────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[bubbleStyles.container, isUser && bubbleStyles.containerUser]}>
      {!isUser && (
        <View style={bubbleStyles.avatar}>
          <Ionicons name="sparkles" size={14} color={theme.colors.white} />
        </View>
      )}
      <View style={[bubbleStyles.bubble, isUser ? bubbleStyles.userBubble : bubbleStyles.assistantBubble]}>
        <Text style={[bubbleStyles.text, isUser && bubbleStyles.userText]}>
          {message.content}
        </Text>
        <Text style={[bubbleStyles.timestamp, isUser && bubbleStyles.userTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

// ─── Typing Indicator ─────────────────────────────────────
function TypingIndicator() {
  return (
    <View style={bubbleStyles.container}>
      <View style={bubbleStyles.avatar}>
        <Ionicons name="sparkles" size={14} color={theme.colors.white} />
      </View>
      <View style={[bubbleStyles.bubble, bubbleStyles.assistantBubble, { paddingVertical: 14 }]}>
        <View style={typingStyles.dots}>
          <View style={[typingStyles.dot, { opacity: 0.4 }]} />
          <View style={[typingStyles.dot, { opacity: 0.7 }]} />
          <View style={typingStyles.dot} />
        </View>
      </View>
    </View>
  );
}

const getAIResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('appointment') || msg.includes('meeting')) {
    return "You have 5 appointments this week:\n\n• Team Standup (Today, 10:00 AM)\n• Client Call (Today, 2:00 PM)\n• Dentist Appointment (Monday, 9:00 AM)\n• Project Review (Monday, 3:00 PM)\n• Gym Session (Next week, 6:00 PM)\n\nWould you like me to reschedule any of these?";
  }
  if (msg.includes('task') && msg.includes('create')) {
    return "I've created a task: 'Review the Q4 report'\n\n📋 Task Details:\n• Priority: High\n• Due: Tomorrow\n• Category: Work\n\nWould you like me to add any additional details or subtasks?";
  }
  if (msg.includes('project')) {
    return "Here are your projects that need attention:\n\n⚠️ Mobile App Launch (40% complete)\n• Status: At Risk\n• 8/20 tasks completed\n• Due in 2 weeks\n\nThis project is falling behind schedule. Would you like me to suggest ways to get back on track?";
  }
  if (msg.includes('productivity') || msg.includes('tips')) {
    return "Here are some productivity tips for today:\n\n1. Start with your highest-priority task first thing in the morning.\n\n2. Block 2 hours of uninterrupted focus time between appointments.\n\n3. You have a light afternoon — perfect for a midday walk!\n\n4. Review your appointments for tomorrow tonight.\n\nWould you like me to block these times on your calendar?";
  }
  if (msg.includes('task') || msg.includes('todo')) {
    return "Here's a summary of your tasks:\n\n🔴 High Priority: 3 pending\n🟡 Medium Priority: 2 pending\n🟢 Low Priority: 1 pending\n\nWould you like me to help you prioritize or create a new task?";
  }
  if (msg.includes('schedule') || msg.includes('today') || msg.includes('week')) {
    return "Here's your schedule overview:\n\n📅 Today: 2 appointments, 3 high-priority tasks\n📅 Tomorrow: 2 appointments\n📅 This week: 5 total appointments\n\nYou have a busy morning — would you like me to suggest ways to stay on track?";
  }
  return "I'm here to help you manage your schedule, tasks, and projects! Try asking me about your appointments, tasks, or productivity tips.";
};

// ─── Main Screen ──────────────────────────────────────────
export default function AIAssistantScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversation?.messages ?? [];

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [activeMessages, isTyping]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setShowSidebar(false);
  };

  // const handleSend = async (messageText?: string) => { // bring this back when we switch to the Anthropic API
  const handleSend = (messageText?: string) => {  
    const text = messageText ?? inputValue.trim();
    if (!text || isTyping) return;

    // Create conversation if none active
    let convId = activeConversationId;
    if (!convId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: text.length > 40 ? text.slice(0, 40) + '...' : text,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      convId = newConv.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setInputValue('');
    setIsTyping(true);

    // Add user message and update title if first message
    setConversations(prev =>
      prev.map(c => {
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

//     try {
//       const response = await fetch('https://api.anthropic.com/v1/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
//           'anthropic-version': '2023-06-01',
//         },
//         body: JSON.stringify({
//           model: 'claude-sonnet-4-20250514',
//           max_tokens: 1024,
//           system: `You are LifeSync AI, a personal life management assistant. 
// You help users manage their tasks, appointments, and projects. 
// Be concise, friendly, and practical. Use emojis sparingly but effectively.
// Keep responses focused and actionable.`,
//           messages: currentMessages.map(m => ({
//             role: m.role,
//             content: m.content,
//           })),
//         }),
//       });

//       const data = await response.json();
//       const aiContent = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response. Please try again.";

//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: aiContent,
//         timestamp: new Date(),
//       };

//       setConversations(prev =>
//         prev.map(c =>
//           c.id === convId
//             ? { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date() }
//             : c
//         )
//       );
//     } catch (error) {
//       Alert.alert('Error', 'Failed to get a response. Please check your connection.');
//     } finally {
//       setIsTyping(false);
//     }
//   };

// const currentMessages = [
//   ...(conversations.find(c => c.id === convId)?.messages ?? []),
//   userMessage,
// ];

  setTimeout(() => {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(text),
      timestamp: new Date(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === convId
          ? { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date() }
          : c
      )
    );
    setIsTyping(false);
  }, 1500);
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setConversations(prev =>
              prev.map(c =>
                c.id === activeConversationId
                  ? { ...c, messages: [], title: 'New conversation', updatedAt: new Date() }
                  : c
              )
            );
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <LinearGradient
        colors={[theme.colors.primaryDark, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowSidebar(!showSidebar)}
        >
          <Ionicons
            name={showSidebar ? 'close' : 'time-outline'}
            size={22}
            color={theme.colors.white}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Ionicons name="sparkles" size={16} color={theme.colors.white} />
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>

        <View style={styles.headerRight}>
          {activeMessages.length > 0 && (
            <TouchableOpacity style={styles.headerButton} onPress={handleClearChat}>
              <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton} onPress={createNewConversation}>
            <Ionicons name="add-circle-outline" size={22} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Sidebar Overlay ──────────────────────────────── */}
      {showSidebar && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Conversations</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {conversations.length === 0 ? (
              <Text style={styles.sidebarEmpty}>No conversations yet</Text>
            ) : (
              conversations.map(conv => (
                <TouchableOpacity
                  key={conv.id}
                  style={[
                    styles.sidebarItem,
                    conv.id === activeConversationId && styles.sidebarItemActive,
                  ]}
                  onPress={() => {
                    setActiveConversationId(conv.id);
                    setShowSidebar(false);
                  }}
                >
                  <Text style={styles.sidebarItemTitle} numberOfLines={1}>
                    {conv.title}
                  </Text>
                  <Text style={styles.sidebarItemDate}>
                    {formatRelativeDate(conv.updatedAt)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* ── Chat Area ────────────────────────────────────── */}
      {activeMessages.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyState}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.emptyIcon}>
            <Ionicons name="sparkles" size={32} color={theme.colors.white} />
          </View>
          <Text style={styles.emptyTitle}>How can I help you today?</Text>
          <Text style={styles.emptySubtitle}>
            Ask me anything about your schedule, tasks, or projects
          </Text>

          {/* Suggested prompts */}
          <View style={styles.promptsGrid}>
            {SUGGESTED_PROMPTS.map(prompt => (
              <TouchableOpacity
                key={prompt.text}
                style={styles.promptCard}
                onPress={() => handleSend(prompt.text)}
              >
                <Ionicons
                  name={prompt.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.promptText}>{prompt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeMessages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <View style={{ height: theme.spacing.md }} />
        </ScrollView>
      )}

      {/* ── Input Bar ────────────────────────────────────── */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor={theme.colors.text.light}
          value={inputValue}
          onChangeText={setInputValue}
          multiline
          maxLength={1000}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputValue.trim() || isTyping) && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
        >
          {isTyping ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Ionicons name="send" size={18} color={theme.colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Sidebar
  sidebar: {
    position: 'absolute',
    top: 110,
    left: 0,
    bottom: 0,
    width: '75%',
    backgroundColor: theme.colors.white,
    zIndex: 10,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sidebarTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  sidebarEmpty: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  sidebarItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  sidebarItemActive: {
    backgroundColor: theme.colors.secondaryLight,
  },
  sidebarItemTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  sidebarItemDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
    marginTop: 2,
  },

  // Empty state
  emptyState: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },

  // Suggested prompts
  promptsGrid: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  promptText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.medium,
    flex: 1,
  },

  // Messages
  messagesContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

// ─── Bubble Styles ────────────────────────────────────────
const bubbleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  containerUser: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  userText: {
    color: theme.colors.white,
  },
  timestamp: {
    fontSize: 10,
    color: theme.colors.text.light,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
});

// ─── Typing Styles ────────────────────────────────────────
const typingStyles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.light,
  },
});