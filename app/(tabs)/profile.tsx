import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { colors, preference, setPreference } = useAppTheme();
  const { user, logout, deleteAccount } = useAuth();
  const initials = user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'U';
  return (
    <Screen scroll contentStyle={styles.screen}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      <Card style={styles.user}><View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}><Text style={[styles.initials, { color: colors.primary }]}>{initials}</Text></View><View><Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text><Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text></View></Card>
      <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text><Card><View style={styles.themeRow}>{(['system', 'light', 'dark'] as const).map((item) => <Pressable accessibilityRole="button" accessibilityState={{ selected: preference === item }} key={item} onPress={() => setPreference(item)} style={[styles.themeButton, { backgroundColor: preference === item ? colors.primary : colors.surfaceMuted }]}><Text style={[styles.themeText, { color: preference === item ? colors.onPrimary : colors.text }]}>{item[0].toUpperCase() + item.slice(1)}</Text></Pressable>)}</View></Card></View>
      <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text><AppButton label="Password & security" variant="secondary" onPress={() => router.push('/security')} /><AppButton label="Privacy policy & terms" variant="secondary" onPress={() => router.push('/legal')} /></View>
      <AppButton label="Log out" variant="secondary" onPress={() => { void logout().then(() => router.replace('/(auth)/login')); }} />
      <AppButton label="Delete account permanently" variant="danger" onPress={() => Alert.alert('Delete your account?', 'This permanently removes your account and every transaction. This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete permanently', style: 'destructive', onPress: () => { void deleteAccount().then(() => router.replace('/(auth)/login')); } }])} />
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { gap: Spacing.xl, paddingTop: Spacing.md }, title: Typography.title, user: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }, avatar: { width: 58, height: 58, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' }, initials: { fontSize: 20, fontWeight: '800' }, name: Typography.heading, email: Typography.body, section: { gap: Spacing.md }, sectionTitle: Typography.heading, themeRow: { flexDirection: 'row', gap: Spacing.sm }, themeButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, borderRadius: Radius.sm }, themeText: Typography.label });
