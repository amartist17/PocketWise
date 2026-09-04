import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

export function EmptyState({ title, message }: { title: string; message: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="receipt-outline" size={42} color={colors.textMuted} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.xxl }, title: Typography.heading, message: { ...Typography.body, textAlign: 'center' } });
