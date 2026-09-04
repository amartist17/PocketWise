import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit() {
    if (name.trim().length < 2 || !email.trim() || password.length < 8) return;
    setLoading(true);
    try { await register(name.trim(), email.trim(), password); router.replace('/(tabs)'); } catch { /* Context exposes a user-friendly message. */ }
    finally { setLoading(false); }
  }
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll contentStyle={styles.content}>
        <View style={styles.heading}><Text style={[styles.title, { color: colors.text }]}>Create your account</Text><Text style={[styles.subtitle, { color: colors.textMuted }]}>Start building a calmer relationship with your money.</Text></View>
        <View style={styles.form}>
          <AppInput label="Name" value={name} onChangeText={setName} autoComplete="name" />
          <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
          {error ? <Text style={[styles.error, { color: colors.expense }]}>{error}</Text> : null}
          <AppButton label="Create account" onPress={submit} loading={loading} disabled={name.trim().length < 2 || !email.trim() || password.length < 8} />
        </View>
        <Text style={[styles.footer, { color: colors.textMuted }]}>Already registered? <Link href="/(auth)/login" style={{ color: colors.primary, fontWeight: '700' }}>Sign in</Link></Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', gap: Spacing.xl }, heading: { gap: Spacing.sm }, title: Typography.hero, subtitle: Typography.body, form: { gap: Spacing.lg }, error: Typography.caption, footer: { ...Typography.body, textAlign: 'center' } });
