import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/main/HomeScreen';
import DashboardScreen from '../screens/auth/DashboardScreen';
// import TasksScreen from '../screens/archive/TasksScreen';
import CalendarScreen from '../screens/auth/CalendarScreen';
import AIAssistantScreen from '../screens/auth/AIAssistantScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

// ─── Types ───────────────────────────────────────────────
export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  // Tasks: undefined;
  Appointments: undefined;
  Assistant: undefined;
  Profile: undefined;
};

// ─── Navigators ──────────────────────────────────────────
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ─── Auth Stack (Login / Signup) ─────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Home" component={HomeScreen} /> 
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Main Tab Bar ─────────────────────────────────────────
function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          paddingBottom: 24,
          paddingTop: 8,
          height: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          // } else if (route.name === 'Tasks') {
          //   iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Assistant') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTab.Screen name="Dashboard" component={DashboardScreen} />
      <MainTab.Screen name="Appointments" component={CalendarScreen} />
      {/* <MainTab.Screen name="Tasks" component={TasksScreen} /> */}
      <MainTab.Screen name="Assistant" component={AIAssistantScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────
// We'll swap between Auth and Main once real auth is wired up.
// For now we'll show Auth so we can build and test those screens.
export default function RootNavigator() {
  const { token, isLoading } = useAuth();

  // Show spinner while checking stored token on launch
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}