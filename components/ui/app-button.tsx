import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', loading, disabled }: AppButtonProps) {
  const { colors } = useAppTheme();
  const backgroundColor = variant === 'danger' ? colors.expense : variant === 'secondary' ? colors.surfaceMuted : colors.primary;
  const textColor = variant === 'secondary' ? colors.text : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 }]}>
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg },
  label: { ...Typography.label, fontSize: 16 },
});
