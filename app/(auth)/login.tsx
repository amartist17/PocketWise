import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { BrandLogo } from '@/components/ui/brand-logo';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) return;
    setLoading(true);
    try { await login(email.trim(), password); router.replace('/(tabs)'); } catch { /* Context exposes a user-friendly message. */ }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll contentStyle={styles.content}>
        <BrandLogo />
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Sign in to see where your money is going.</Text>
        </View>
        <View style={styles.form}>
          <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
          {error ? <Text style={[styles.error, { color: colors.expense }]}>{error}</Text> : null}
          <AppButton label="Sign in" onPress={submit} loading={loading} disabled={!email.trim() || !password} />
        </View>
        <Text style={[styles.footer, { color: colors.textMuted }]}>New to PocketWise? <Link href="/(auth)/register" style={{ color: colors.primary, fontWeight: '700' }}>Create account</Link></Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', gap: Spacing.xl }, heading: { gap: Spacing.sm }, title: Typography.hero, subtitle: Typography.body, form: { gap: Spacing.lg }, error: Typography.caption, footer: { ...Typography.body, textAlign: 'center' } });
