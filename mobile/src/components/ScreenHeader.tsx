import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  // 'xxl' (32px) for page titles, 'xl' (24px) for greeting-style headers
  titleSize?: 'xl' | 'xxl';
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    // Renders as a filled circle button — use for primary add/create actions
    primary?: boolean;
  };
}

export default function ScreenHeader({
  title,
  subtitle,
  titleSize = 'xxl',
  rightAction,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={[styles.title, titleSize === 'xl' && styles.titleMd]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightAction && (
        rightAction.primary ? (
          <TouchableOpacity style={styles.primaryButton} onPress={rightAction.onPress}>
            <Ionicons name={rightAction.icon} size={24} color={theme.colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} onPress={rightAction.onPress}>
            <Ionicons name={rightAction.icon} size={22} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  titleMd: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  primaryButton: {
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
  iconButton: {
    padding: theme.spacing.xs,
  },
});
