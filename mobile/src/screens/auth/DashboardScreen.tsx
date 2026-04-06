import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { GET_DASHBOARD_DATA } from '../../graphql/queries';
import { theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Types ───────────────────────────────────────────────
interface DashboardData {
  me: {
    id: number;
    firstName: string;
    lastName: string;
  };
  appointments: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    type: string;
    color: string;
  }>;
  tasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    priority: string;
    dueDate: string;
    category: string;
  }>;
  // projects: Array<{
  //   id: number;
  //   name: string;
  //   progress: number;
  //   status: string;
  //   dueDate: string;
  //   tasksCompleted: number;
  //   tasksTotal: number;
  // }>;
}

// ─── Helpers ─────────────────────────────────────────────
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
    default: return theme.colors.text.light;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-track': return '#10B981';
    case 'at-risk': return '#F59E0B';
    case 'delayed': return '#EF4444';
    default: return theme.colors.text.light;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'on-track': return 'On Track';
    case 'at-risk': return 'At Risk';
    case 'delayed': return 'Delayed';
    default: return status;
  }
};

const isToday = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// ─── Component ───────────────────────────────────────────
export default function DashboardScreen() {
  const { logout } = useAuth();
  const { data, loading, error, refetch } = useQuery<DashboardData>(GET_DASHBOARD_DATA);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load dashboard</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tasks: DashboardData['tasks'] = data?.tasks ?? [];
  const appointments: DashboardData['appointments'] = data?.appointments ?? [];
  // const projects = data?.projects ?? [];

  const todayAppointments = appointments.filter(a => isToday(a.date));
  const pendingTasks = tasks.filter(t => !t.completed);
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // ── AI Insight ───────────────────────────────────────
  const getInsight = () => {
    if (appointments.length === 0 && tasks.length === 0) {
      return "You're all caught up! Great time to plan ahead or tackle something new.";
    }
    if (highPriorityTasks.length > 0) {
      return `You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length !== 1 ? 's' : ''} pending. Consider tackling those first.`;
    }
    if (todayAppointments.length > 0) {
      return `You have ${todayAppointments.length} appointment${todayAppointments.length !== 1 ? 's' : ''} today. Stay focused between them.`;
    }
    return "You have a light day. Great time to get ahead on your tasks!";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* ── Header ────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {data?.me.firstName}
          </Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* ── Stats Row ─────────────────────────────────── */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: '#B85C38' }]}>
          <Text style={styles.statNumber}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#B85C38' }]}>
          <Text style={styles.statNumber}>{todayAppointments.length}</Text>
          <Text style={styles.statLabel}>Today's Appointments</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#B85C38' }]}>
          <Text style={styles.statNumber}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
      </View>

      {/* ── Today's Appointments ──────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <Text style={styles.sectionCount}>{todayAppointments.length}</Text>
        </View>

        {todayAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color={theme.colors.text.light} />
            <Text style={styles.emptyText}>No appointments today</Text>
          </View>
        ) : (
          todayAppointments.map(apt => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={[styles.appointmentDot, { backgroundColor: apt.color || theme.colors.primary }]} />
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>{apt.title}</Text>
                <Text style={styles.appointmentTime}>{apt.time}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: theme.colors.secondaryLight }]}>
                <Text style={styles.typeBadgeText}>{apt.type}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ── High Priority Tasks ───────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>High Priority Tasks</Text>
          <Text style={styles.sectionCount}>{highPriorityTasks.length}</Text>
        </View>

        {highPriorityTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color={theme.colors.text.light} />
            <Text style={styles.emptyText}>No high priority tasks 🎉</Text>
          </View>
        ) : (
          highPriorityTasks.slice(0, 3).map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={[styles.priorityBar, { backgroundColor: getPriorityColor(task.priority) }]} />
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskCategory}>{task.category}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                <Text style={[styles.priorityBadgeText, { color: getPriorityColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
            </View>
          ))
        )}
        {highPriorityTasks.length > 3 && (
          <Text style={styles.moreText}>+{highPriorityTasks.length - 3} more tasks</Text>
        )}
      </View>

      {/* ── AI Insight ────────────────────────────────── */}
      <LinearGradient
        colors={['#6B7280', '#374151']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.insightCard}
      >
        <View style={styles.insightHeader}>
          <Ionicons name="sparkles" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.insightLabel}>AI INSIGHT</Text>
        </View>
        <Text style={styles.insightText}>{getInsight()}</Text>
      </LinearGradient>

      {/* ── Projects ──────────────────────────────────── */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <Text style={styles.sectionCount}>{projects.length}</Text>
        </View>

        {projects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-outline" size={32} color={theme.colors.text.light} />
            <Text style={styles.emptyText}>No projects yet</Text>
          </View>
        ) : (
          projects.slice(0, 3).map(proj => (
            <View key={proj.id} style={styles.projectCard}>
              <View style={styles.projectTop}>
                <Text style={styles.projectName}>{proj.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(proj.status)}20` }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(proj.status) }]}>
                    {getStatusLabel(proj.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: `${proj.progress}%` as any,
                    backgroundColor: getStatusColor(proj.status),
                  }]} />
                </View>
                <Text style={styles.progressText}>{proj.progress}%</Text>
              </View>
              <Text style={styles.projectTasks}>
                {proj.tasksCompleted}/{proj.tasksTotal} tasks
              </Text>
            </View>
          ))
        )}
      </View> */}

      {/* Bottom padding */}
      <View style={{ height: theme.spacing.xl }} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    fontWeight: theme.fontWeight.semibold,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  logoutButton: {
    padding: theme.spacing.xs,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // AI Insight
  insightCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    // borderColor: 'rgba(255,255,255,0.1)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  insightLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  insightText: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  sectionCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },

  // Empty state
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.light,
  },

  // Appointments
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  appointmentTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  typeBadgeText: {
    fontSize: 10,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'capitalize',
  },

  // Tasks
  taskCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  priorityBar: {
    width: 3,
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  taskInfo: {
    flex: 1,
    paddingLeft: theme.spacing.sm,
  },
  taskTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  taskCategory: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'capitalize',
  },
  moreText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },

  // Projects
  // projectCard: {
  //   backgroundColor: theme.colors.white,
  //   borderRadius: theme.borderRadius.md,
  //   padding: theme.spacing.md,
  //   marginBottom: theme.spacing.sm,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.04,
  //   shadowRadius: 4,
  //   elevation: 2,
  // },
  // projectTop: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: theme.spacing.sm,
  // },
  // projectName: {
  //   fontSize: theme.fontSize.sm,
  //   fontWeight: theme.fontWeight.semibold,
  //   color: theme.colors.text.primary,
  //   flex: 1,
  //   marginRight: theme.spacing.sm,
  // },
  // statusBadge: {
  //   paddingHorizontal: theme.spacing.sm,
  //   paddingVertical: 2,
  //   borderRadius: theme.borderRadius.full,
  // },
  // statusBadgeText: {
  //   fontSize: 10,
  //   fontWeight: theme.fontWeight.medium,
  // },
  // progressRow: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: theme.spacing.sm,
  //   marginBottom: theme.spacing.xs,
  // },
  // progressBar: {
  //   flex: 1,
  //   height: 6,
  //   backgroundColor: theme.colors.backgroundDark,
  //   borderRadius: theme.borderRadius.full,
  //   overflow: 'hidden',
  // },
  // progressFill: {
  //   height: '100%',
  //   borderRadius: theme.borderRadius.full,
  // },
  // progressText: {
  //   fontSize: theme.fontSize.xs,
  //   fontWeight: theme.fontWeight.semibold,
  //   color: theme.colors.text.secondary,
  //   width: 32,
  //   textAlign: 'right',
  // },
  // projectTasks: {
  //   fontSize: theme.fontSize.xs,
  //   color: theme.colors.text.secondary,
  // },
});