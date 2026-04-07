import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { GET_TASKS } from '../../graphql/queries';
import {
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from '../../graphql/mutations';
import { theme } from '../../theme';

// ─── Types ───────────────────────────────────────────────
type Priority = 'high' | 'medium' | 'low';
type FilterType = 'all' | 'active' | 'completed';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  category: string;
  notes?: string;
}

interface TasksData {
  tasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    priority: string;
    dueDate: string;
    category: string;
    notes?: string;
  }>;
}

// ─── Helpers ─────────────────────────────────────────────
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
    default: return theme.colors.text.light;
  }
};

const formatDueDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (dateStr: string, completed: boolean) => {
  if (completed) return false;
  return new Date(dateStr) < new Date();
};

// ─── Task Modal ───────────────────────────────────────────
interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  editingTask?: Task | null;
}

function TaskModal({ visible, onClose, onSave, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [category, setCategory] = useState(editingTask?.category ?? '');
  const [notes, setNotes] = useState(editingTask?.notes ?? '');

  React.useEffect(() => {
    if (visible) {
      setTitle(editingTask?.title ?? '');
      setPriority(editingTask?.priority ?? 'medium');
      setCategory(editingTask?.category ?? '');
      setNotes(editingTask?.notes ?? '');
    }
  }, [visible, editingTask]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    onSave({
      title: title.trim(),
      completed: editingTask?.completed ?? false,
      priority,
      dueDate: editingTask?.dueDate ?? new Date().toISOString(),
      category: category.trim() || 'General',
      notes: notes.trim() || undefined,
    });
  };

  const priorities: Priority[] = ['high', 'medium', 'low'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={modalStyles.container}>

          {/* Header */}
          <View style={modalStyles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={modalStyles.headerTitle}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={modalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={modalStyles.content} showsVerticalScrollIndicator={false}>

            {/* Title */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Title *</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="What needs to be done?"
                placeholderTextColor={theme.colors.text.light}
                value={title}
                onChangeText={setTitle}
                autoFocus
                multiline
              />
            </View>

            {/* Priority */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Priority</Text>
              <View style={modalStyles.priorityRow}>
                {priorities.map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      modalStyles.priorityButton,
                      priority === p && {
                        backgroundColor: getPriorityColor(p),
                        borderColor: getPriorityColor(p),
                      },
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[
                      modalStyles.priorityButtonText,
                      priority === p && { color: theme.colors.white },
                    ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Category</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="e.g. Work, Personal, Health"
                placeholderTextColor={theme.colors.text.light}
                value={category}
                onChangeText={setCategory}
              />
            </View>

            {/* Notes */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Notes</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                placeholder="Add any additional notes..."
                placeholderTextColor={theme.colors.text.light}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────
export default function TasksScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery<TasksData>(GET_TASKS);

  const [createTask] = useMutation(CREATE_TASK_MUTATION, {
    onCompleted: () => { refetch(); setModalVisible(false); },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => { refetch(); setModalVisible(false); },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    onCompleted: () => refetch(),
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSave = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask({
        variables: {
          id: parseInt(editingTask.id),
          taskInput: {
            title: taskData.title,
            completed: taskData.completed,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            category: taskData.category,
            notes: taskData.notes ?? null,
          },
        },
      });
    } else {
      createTask({
        variables: {
          taskInput: {
            title: taskData.title,
            completed: false,
            priority: taskData.priority,
            dueDate: new Date().toISOString(),
            category: taskData.category,
            notes: taskData.notes ?? null,
          },
        },
      });
    }
  };

  const handleToggle = (task: Task) => {
    updateTask({
      variables: {
        id: parseInt(task.id),
        taskInput: {
          title: task.title,
          completed: !task.completed,
          priority: task.priority,
          dueDate: task.dueDate,
          category: task.category,
          notes: task.notes ?? null,
        },
      },
    });
  };

  const handleDelete = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask({ variables: { id: parseInt(task.id) } }),
        },
      ]
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load tasks</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Data Processing ──────────────────────────────────
  const allTasks: Task[] = (data?.tasks ?? [] as TasksData['tasks']).map((t: TasksData['tasks'][number]) => ({
    id: String(t.id),
    title: t.title,
    completed: t.completed,
    priority: t.priority as Priority,
    dueDate: t.dueDate,
    category: t.category,
    notes: t.notes,
  }));

  const filteredTasks = allTasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.completed && !b.completed) {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  const allCount = allTasks.length;
  const activeCount = allTasks.filter(t => !t.completed).length;
  const completedCount = allTasks.filter(t => t.completed).length;

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>{activeCount} pending</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleNewTask}>
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* ── Filter Tabs ──────────────────────────────── */}
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterTabText, filter === f.id && styles.filterTabTextActive]}>
                {f.label} ({f.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Task List ────────────────────────────────── */}
        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.text.light} />
            <Text style={styles.emptyTitle}>
              {filter === 'active' ? 'No active tasks' :
               filter === 'completed' ? 'No completed tasks' :
               'No tasks yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' ? 'Tap + to create your first task' : ''}
            </Text>
          </View>
        ) : (
          sortedTasks.map(task => (
            <View
              key={task.id}
              style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
            >
              {/* Priority bar */}
              <View style={[styles.priorityBar, { backgroundColor: task.completed ? theme.colors.border : getPriorityColor(task.priority) }]} />

              {/* Checkbox */}
              <TouchableOpacity style={styles.checkbox} onPress={() => handleToggle(task)}>
                <View style={[
                  styles.checkboxInner,
                  task.completed && styles.checkboxChecked,
                ]}>
                  {task.completed && (
                    <Ionicons name="checkmark" size={14} color={theme.colors.white} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Task Info */}
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={[styles.categoryBadge]}>
                    <Text style={styles.categoryText}>{task.category}</Text>
                  </View>
                  <Text style={[
                    styles.dueDateText,
                    isOverdue(task.dueDate, task.completed) && styles.overdueText,
                  ]}>
                    {isOverdue(task.dueDate, task.completed) ? '⚠ Overdue' : formatDueDate(task.dueDate)}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => handleEdit(task)} style={styles.actionButton}>
                  <Ionicons name="pencil-outline" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(task)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>

      {/* Task Modal */}
      <TaskModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingTask(null); }}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </View>
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
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // Filter
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  filterTabTextActive: {
    color: theme.colors.white,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.light,
  },

  // Task Card
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
  taskCardCompleted: {
    opacity: 0.6,
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },

  // Checkbox
  checkbox: {
    padding: 2,
    marginLeft: theme.spacing.xs,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  // Task Info
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.light,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: 10,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.medium,
  },
  dueDateText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
  },
  overdueText: {
    color: theme.colors.error,
    fontWeight: theme.fontWeight.medium,
  },

  // Actions
  taskActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
});

// ─── Modal Styles ─────────────────────────────────────────
const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  saveText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  content: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  priorityButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
});