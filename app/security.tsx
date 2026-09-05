import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { getErrorMessage } from '@/services/api';
import { authService } from '@/services/auth.service';

export default function SecurityScreen() {
  const { colors } = useAppTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const valid = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;
  async function submit() {
    setLoading(true); setMessage('');
    try { const result = await authService.changePassword({ currentPassword, newPassword }); setMessage(result.message); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    catch (error) { setMessage(getErrorMessage(error)); }
    finally { setLoading(false); }
  }
  return <Screen scroll contentStyle={styles.screen}><Text style={[styles.title, { color: colors.text }]}>Password & security</Text><Text style={[styles.body, { color: colors.textMuted }]}>Use at least eight characters and avoid reusing a password from another service.</Text><View style={styles.form}><AppInput label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry /><AppInput label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry /><AppInput label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={confirmPassword && confirmPassword !== newPassword ? 'Passwords do not match.' : undefined} /><AppButton label="Update password" onPress={submit} loading={loading} disabled={!valid} />{message ? <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text> : null}</View><AppButton label="Back to profile" variant="secondary" onPress={() => router.back()} /></Screen>;
}
const styles = StyleSheet.create({ screen: { gap: Spacing.xl, paddingTop: Spacing.md }, title: Typography.title, body: Typography.body, form: { gap: Spacing.lg }, message: Typography.caption });
