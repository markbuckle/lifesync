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
import { Calendar } from 'react-native-calendars';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { GET_APPOINTMENTS } from '../../graphql/queries';
import {
  CREATE_APPOINTMENT_MUTATION,
  UPDATE_APPOINTMENT_MUTATION,
  DELETE_APPOINTMENT_MUTATION,
} from '../../graphql/mutations';
import { theme } from '../../theme';

// ─── Types ───────────────────────────────────────────────
type AppointmentType = 'meeting' | 'doctor' | 'personal' | 'work';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: AppointmentType;
  color: string;
  notes?: string;
}

interface AppointmentsData {
  appointments: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    type: string;
    color: string;
    notes?: string;
  }>;
}

// ─── Helpers ─────────────────────────────────────────────
const TYPE_COLORS: Record<AppointmentType, string> = {
  meeting: '#3B82F6',
  doctor: '#10B981',
  personal: '#8B5CF6',
  work: theme.colors.primary,
};

const getTypeColor = (type: string) =>
  TYPE_COLORS[type as AppointmentType] ?? theme.colors.primary;

const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'meeting': return 'people-outline';
    case 'doctor': return 'medical-outline';
    case 'personal': return 'person-outline';
    case 'work': return 'briefcase-outline';
    default: return 'calendar-outline';
  }
};

const formatDisplayDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isToday = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toDateString() === new Date().toDateString();
};

const isPast = (dateStr: string) => new Date(dateStr) < new Date();

// ─── Calendar Strip ───────────────────────────────────────
interface CalendarStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  appointmentDates: Set<string>;
}

function CalendarStrip({ selectedDate, onSelectDate, appointmentDates }: CalendarStripProps) {
  const days = [];
  const today = new Date();

  for (let i = -2; i <= 9; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={stripStyles.container}
    >
      {days.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const isSelected = selectedDate === dateStr;
        const hasAppointment = appointmentDates.has(dateStr);
        const todayDate = isToday(date.toISOString());

        return (
          <TouchableOpacity
            key={dateStr}
            style={[
              stripStyles.dayButton,
              isSelected && stripStyles.dayButtonSelected,
              todayDate && !isSelected && stripStyles.dayButtonToday,
            ]}
            onPress={() => onSelectDate(dateStr)}
          >
            <Text style={[
              stripStyles.dayName,
              isSelected && stripStyles.dayTextSelected,
            ]}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={[
              stripStyles.dayNumber,
              isSelected && stripStyles.dayTextSelected,
              todayDate && !isSelected && stripStyles.todayText,
            ]}>
              {date.getDate()}
            </Text>
            {hasAppointment && (
              <View style={[
                stripStyles.dot,
                isSelected && stripStyles.dotSelected,
              ]} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Appointment Modal ────────────────────────────────────
interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (apt: Omit<Appointment, 'id'>) => void;
  editingAppointment?: Appointment | null;
  selectedDate?: string;
}

function AppointmentModal({
  visible,
  onClose,
  onSave,
  editingAppointment,
  selectedDate,
}: AppointmentModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<AppointmentType>('meeting');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (visible) {
      setTitle(editingAppointment?.title ?? '');
      setTime(editingAppointment?.time ?? '');
      setType((editingAppointment?.type ?? 'meeting') as AppointmentType);
      setNotes(editingAppointment?.notes ?? '');
    }
  }, [visible, editingAppointment]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!time.trim()) {
      Alert.alert('Error', 'Please enter a time');
      return;
    }
    onSave({
      title: title.trim(),
      date: editingAppointment?.date ?? selectedDate ?? new Date().toISOString(),
      time: time.trim(),
      type,
      color: getTypeColor(type),
      notes: notes.trim() || undefined,
    });
  };

  const types: AppointmentType[] = ['meeting', 'work', 'personal', 'doctor'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
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
              {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={modalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={modalStyles.content}
            showsVerticalScrollIndicator={false}
          >

            {/* Title */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Title *</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="What's the appointment?"
                placeholderTextColor={theme.colors.text.light}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            {/* Time */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Time *</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="e.g. 10:00 AM"
                placeholderTextColor={theme.colors.text.light}
                value={time}
                onChangeText={setTime}
              />
            </View>

            {/* Type */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Type</Text>
              <View style={modalStyles.typeGrid}>
                {types.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      modalStyles.typeButton,
                      type === t && {
                        backgroundColor: getTypeColor(t),
                        borderColor: getTypeColor(t),
                      },
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Ionicons
                      name={getTypeIcon(t)}
                      size={16}
                      color={type === t ? theme.colors.white : theme.colors.text.secondary}
                    />
                    <Text style={[
                      modalStyles.typeButtonText,
                      type === t && { color: theme.colors.white },
                    ]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Notes</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                placeholder="Any additional details..."
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
export default function AppointmentsScreen() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery<AppointmentsData>(GET_APPOINTMENTS);

  const [createAppointment] = useMutation(CREATE_APPOINTMENT_MUTATION, {
    onCompleted: () => { refetch(); setModalVisible(false); },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT_MUTATION, {
    onCompleted: () => { refetch(); setModalVisible(false); },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT_MUTATION, {
    onCompleted: () => refetch(),
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSave = (aptData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      updateAppointment({
        variables: {
          id: parseInt(editingAppointment.id),
          appointmentInput: {
            title: aptData.title,
            date: aptData.date,
            time: aptData.time,
            type: aptData.type,
            color: aptData.color,
            notes: aptData.notes ?? null,
          },
        },
      });
    } else {
      createAppointment({
        variables: {
          appointmentInput: {
            title: aptData.title,
            date: selectedDate,
            time: aptData.time,
            type: aptData.type,
            color: getTypeColor(aptData.type),
            notes: aptData.notes ?? null,
          },
        },
      });
    }
  };

  const handleDelete = (apt: Appointment) => {
    Alert.alert(
      'Delete Appointment',
      `Are you sure you want to delete "${apt.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAppointment({ variables: { id: parseInt(apt.id) } }),
        },
      ]
    );
  };

  const handleEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setModalVisible(true);
  };

  const handleNew = () => {
    setEditingAppointment(null);
    setModalVisible(true);
  };

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load appointments</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Data Processing ──────────────────────────────────
  const allAppointments: Appointment[] = (data?.appointments ?? [] as AppointmentsData['appointments']).map((a: AppointmentsData['appointments'][number]) => ({
    id: String(a.id),
    title: a.title,
    date: a.date,
    time: a.time,
    type: a.type as AppointmentType,
    color: a.color,
    notes: a.notes,
  }));

  const appointmentDates = new Set(
    allAppointments.map(a => new Date(a.date).toISOString().split('T')[0])
  );

  const selectedAppointments = allAppointments
    .filter(a => new Date(a.date).toISOString().split('T')[0] === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = allAppointments
    .filter(a => !isPast(a.date) && new Date(a.date).toISOString().split('T')[0] !== selectedDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView
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
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.subtitle}>
              {allAppointments.length} total appointments
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleNew}>
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* ── Calendar Strip ───────────────────────────── */}
        <View style={styles.stripContainer}>
          <CalendarStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointmentDates={appointmentDates}
          />
        </View>

        {/* ── Selected Date Appointments ───────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {formatDisplayDate(selectedDate + 'T00:00:00')}
          </Text>

          {selectedAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No appointments</Text>
              <TouchableOpacity onPress={handleNew}>
                <Text style={styles.emptyAction}>+ Add one</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedAppointments.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={() => handleEdit(apt)}
                onDelete={() => handleDelete(apt)}
              />
            ))
          )}
        </View>

        {/* ── Upcoming ─────────────────────────────────── */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingAppointments.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={() => handleEdit(apt)}
                onDelete={() => handleDelete(apt)}
                showDate
              />
            ))}
          </View>
        )}

        {/* ── Month Calendar ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Month View</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={{
                ...Array.from(appointmentDates).reduce<Record<string, object>>((acc, date) => {
                  acc[date] = {
                    marked: true,
                    dotColor: date === selectedDate ? theme.colors.white : theme.colors.primary,
                    selected: date === selectedDate,
                    selectedColor: theme.colors.primary,
                  };
                  return acc;
                }, {}),
                ...(appointmentDates.has(selectedDate)
                  ? {}
                  : {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: theme.colors.primary,
                      },
                    }),
              }}
              theme={{
                backgroundColor: theme.colors.white,
                calendarBackground: theme.colors.white,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: theme.colors.white,
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.text.primary,
                textDisabledColor: theme.colors.text.light,
                dotColor: theme.colors.primary,
                selectedDotColor: theme.colors.white,
                arrowColor: theme.colors.primary,
                monthTextColor: theme.colors.text.primary,
                textMonthFontWeight: theme.fontWeight.semibold,
                textDayFontSize: theme.fontSize.sm,
                textMonthFontSize: theme.fontSize.md,
                textDayHeaderFontSize: theme.fontSize.xs,
              }}
            />
          </View>
        </View>

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>

      <AppointmentModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingAppointment(null); }}
        onSave={handleSave}
        editingAppointment={editingAppointment}
        selectedDate={selectedDate}
      />
    </View>
  );
}

// ─── Appointment Card ─────────────────────────────────────
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
  showDate?: boolean;
}

function AppointmentCard({ appointment, onEdit, onDelete, showDate }: AppointmentCardProps) {
  return (
    <View style={styles.appointmentCard}>
      <View style={[styles.colorBar, { backgroundColor: getTypeColor(appointment.type) }]} />
      <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor(appointment.type)}20` }]}>
        <Ionicons
          name={getTypeIcon(appointment.type)}
          size={18}
          color={getTypeColor(appointment.type)}
        />
      </View>
      <View style={styles.aptInfo}>
        <Text style={styles.aptTitle}>{appointment.title}</Text>
        <View style={styles.aptMeta}>
          <Ionicons name="time-outline" size={12} color={theme.colors.text.light} />
          <Text style={styles.aptTime}>{appointment.time}</Text>
          {showDate && (
            <>
              <Text style={styles.aptMetaDot}>·</Text>
              <Text style={styles.aptDate}>{formatShortDate(appointment.date)}</Text>
            </>
          )}
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(appointment.type)}15` }]}>
            <Text style={[styles.typeBadgeText, { color: getTypeColor(appointment.type) }]}>
              {appointment.type}
            </Text>
          </View>
        </View>
        {appointment.notes && (
          <Text style={styles.aptNotes} numberOfLines={1}>{appointment.notes}</Text>
        )}
      </View>
      <View style={styles.aptActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: theme.spacing.lg,
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

  // Calendar Strip
  stripContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },

  // Sections
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  // Empty state
  emptyState: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.light,
  },
  emptyAction: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  // Month Calendar
  calendarContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  // Appointment Card
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
    overflow: 'hidden',
  },
  colorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  aptInfo: {
    flex: 1,
  },
  aptTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  aptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  aptTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  aptMetaDot: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
  },
  aptDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  typeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
    marginLeft: 2,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'capitalize',
  },
  aptNotes: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
    marginTop: 2,
  },
  aptActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
});

// ─── Strip Styles ─────────────────────────────────────────
const stripStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  dayButton: {
    width: 48,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  dayButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayButtonToday: {
    backgroundColor: theme.colors.secondaryLight,
  },
  dayName: {
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  dayTextSelected: {
    color: theme.colors.white,
  },
  todayText: {
    color: theme.colors.primary,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  dotSelected: {
    backgroundColor: theme.colors.white,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  typeButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
});