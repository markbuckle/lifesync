import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      // Step 1: Logo fades + scales in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Step 2: Text slides up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Step 3: Buttons slide up
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient circles for depth */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoSection,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LS</Text>
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={[
          styles.textSection,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <Text style={styles.appName}>LifeSync</Text>
        <Text style={styles.tagline}>
          If it's mundane,{'\n'}
          <Text style={styles.taglineAccent}>we automate it.</Text>
        </Text>
        <Text style={styles.subtext}>
          AI-powered tasks, calendar, and projects — all in one place.
        </Text>

        {/* Feature pills */}
        <View style={styles.pills}>
          {['📋 Tasks', '📅 Calendar', '🤖 AI Assistant'].map((pill) => (
            <View key={pill} style={styles.pill}>
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        style={[
          styles.buttonSection,
          {
            opacity: buttonsOpacity,
            transform: [{ translateY: buttonsTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          No credit card required
        </Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0F0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  // Background decoration
  bgCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: theme.colors.primaryDark,
    opacity: 0.15,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: theme.colors.primary,
    opacity: 0.1,
    bottom: -width * 0.1,
    left: -width * 0.1,
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },

  // Text
  textSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  appName: {
    fontSize: 36,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: theme.spacing.md,
  },
  taglineAccent: {
    color: theme.colors.primaryLight,
    fontWeight: theme.fontWeight.bold,
  },
  subtext: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },

  // Feature pills
  pills: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },

  // Buttons
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    letterSpacing: 0.3,
  },

  // Footer
  footerText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.xs,
    color: 'rgba(255,255,255,0.3)',
  },
});