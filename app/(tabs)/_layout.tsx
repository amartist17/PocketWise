import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAppTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';

const iconNames = { index: 'home', transactions: 'swap-horizontal', analytics: 'bar-chart', profile: 'person' } as const;

export default function TabLayout() {
  const { colors } = useAppTheme();
  const { user, isBootstrapping } = useAuth();
  if (!isBootstrapping && !user) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.tabIconSelected,
      tabBarInactiveTintColor: colors.tabIconDefault,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 66, paddingTop: 6, paddingBottom: 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? iconNames[route.name as keyof typeof iconNames] : `${iconNames[route.name as keyof typeof iconNames]}-outline` as keyof typeof Ionicons.glyphMap} color={color} size={size} />,
    })}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
