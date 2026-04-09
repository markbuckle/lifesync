import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { GET_ME } from '../../graphql/queries';
import { theme } from '../../theme';

// ─── Types ───────────────────────────────────────────────
interface MeData {
  me: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────
const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const formatMemberSince = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

// ─── Section Component ────────────────────────────────────
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

// ─── Row Component ────────────────────────────────────────
interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

function Row({
  icon,
  iconColor,
  label,
  value,
  onPress,
  destructive,
  showChevron,
}: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[
        styles.rowIcon,
        { backgroundColor: destructive ? '#FEE2E2' : theme.colors.secondaryLight },
      ]}>
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? theme.colors.error : (iconColor ?? theme.colors.primary)}
        />
      </View>
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
        {label}
      </Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {showChevron && (
        <Ionicons name="chevron-forward" size={16} color={theme.colors.text.light} />
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { data, loading, error } = useQuery<MeData>(GET_ME);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const user = data?.me;
  const initials = user
    ? getInitials(user.firstName, user.lastName)
    : '??';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Header ──────────────────────────────────────── */}
      <LinearGradient
        colors={[theme.colors.primaryDark, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        {user ? (
          <>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.memberText}>
                Member since {formatMemberSince(user.createdAt)}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.name}>Your Profile</Text>
        )}
      </LinearGradient>

      {/* ── Plan Section ─────────────────────────────────── */}
      <Section title="Plan">
        <Row
          icon="star-outline"
          iconColor="#F59E0B"
          label="Current Plan"
          value="Free"
        />
        <View style={styles.rowDivider} />
        <Row
          icon="rocket-outline"
          iconColor={theme.colors.primary}
          label="Upgrade to Pro"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Upgrade functionality coming soon!')}
        />
      </Section>

      {/* ── Account Section ──────────────────────────────── */}
      <Section title="Account">
        {user && (
          <>
            <Row
              icon="person-outline"
              label="Full Name"
              value={`${user.firstName} ${user.lastName}`}
            />
            <View style={styles.rowDivider} />
            <Row
              icon="mail-outline"
              label="Email"
              value={user.email}
            />
            <View style={styles.rowDivider} />
          </>
        )}
        <Row
          icon="lock-closed-outline"
          label="Change Password"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Password change coming soon!')}
        />
      </Section>

      {/* ── Preferences Section ───────────────────────────── */}
      <Section title="Preferences">
        <Row
          icon="notifications-outline"
          label="Notifications"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
        />
        <View style={styles.rowDivider} />
        <Row
          icon="moon-outline"
          label="Dark Mode"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Dark mode coming soon!')}
        />
        <View style={styles.rowDivider} />
        <Row
          icon="globe-outline"
          label="Language"
          value="English"
        />
      </Section>

      {/* ── About Section ────────────────────────────────── */}
      <Section title="About">
        <Row
          icon="information-circle-outline"
          label="App Version"
          value="1.0.0"
        />
        <View style={styles.rowDivider} />
        <Row
          icon="document-text-outline"
          label="Terms of Service"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Terms of service coming soon!')}
        />
        <View style={styles.rowDivider} />
        <Row
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          showChevron
          onPress={() => Alert.alert('Coming Soon', 'Privacy policy coming soon!')}
        />
      </Section>

      {/* ── Logout ───────────────────────────────────────── */}
      <Section title="">
        <Row
          icon="log-out-outline"
          label="Log Out"
          destructive
          onPress={handleLogout}
        />
      </Section>

      <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.sm,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  memberText: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },

  // Sections
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  rowLabelDestructive: {
    color: theme.colors.error,
  },
  rowValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.md + 34 + theme.spacing.md,
  },
});