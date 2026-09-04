import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

export default function Index() {
  const { user, isBootstrapping } = useAuth();
  const { colors } = useAppTheme();
  if (isBootstrapping) return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} size="large" /></View>;
  return <Redirect href={user ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
