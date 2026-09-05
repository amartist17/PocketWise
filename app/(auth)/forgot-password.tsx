import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { BrandLogo } from '@/components/ui/brand-logo';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { getErrorMessage } from '@/services/api';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function requestCode() {
    setLoading(true); setMessage('');
    try {
      const result = await authService.forgotPassword(email.trim());
      setSent(true);
      setMessage(result.developmentCode ? `${result.message} Local code: ${result.developmentCode}` : result.message);
    } catch (error) { setMessage(getErrorMessage(error)); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    setLoading(true); setMessage('');
    try {
      const result = await authService.resetPassword({ email: email.trim(), code: code.trim(), newPassword: password });
      setMessage(result.message);
      router.replace('/(auth)/login');
    } catch (error) { setMessage(getErrorMessage(error)); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll contentStyle={styles.content}>
        <BrandLogo />
        <View style={styles.heading}><Text style={[styles.title, { color: colors.text }]}>Reset password</Text><Text style={[styles.body, { color: colors.textMuted }]}>We’ll email a six-digit code that expires in 15 minutes.</Text></View>
        <View style={styles.form}>
          <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" editable={!sent} />
          {sent ? <><AppInput label="Reset code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} /><AppInput label="New password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" /><AppButton label="Set new password" onPress={resetPassword} loading={loading} disabled={code.length !== 6 || password.length < 8} /></> : <AppButton label="Send reset code" onPress={requestCode} loading={loading} disabled={!email.trim()} />}
          {message ? <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text> : null}
        </View>
        <Link href="/(auth)/login" style={[styles.link, { color: colors.primary }]}>Back to sign in</Link>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', gap: Spacing.xl }, heading: { gap: Spacing.sm }, title: Typography.hero, body: Typography.body, form: { gap: Spacing.lg }, message: Typography.caption, link: { ...Typography.label, textAlign: 'center' } });
