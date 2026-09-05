import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AppThemeProvider, useAppTheme } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { TransactionProvider } from '@/contexts/transaction-context';

function Navigation() {
  const { colors, isDark } = useAppTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: { ...baseTheme.colors, background: colors.background, card: colors.surface, border: colors.border, primary: colors.primary, text: colors.text },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transaction-form" options={{ presentation: 'modal', title: 'Add transaction' }} />
        <Stack.Screen name="split" options={{ title: 'Split an expense' }} />
        <Stack.Screen name="security" options={{ title: 'Password & security' }} />
        <Stack.Screen name="legal" options={{ title: 'Privacy & terms' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <SafeAreaProvider><AppThemeProvider><AuthProvider><TransactionProvider><Navigation /></TransactionProvider></AuthProvider></AppThemeProvider></SafeAreaProvider>;
}
