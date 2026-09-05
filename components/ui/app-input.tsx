import { ComponentProps } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

interface AppInputProps extends ComponentProps<typeof TextInput> {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function AppInput({ label, error, style, containerStyle, ...props }: AppInputProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.surface, borderColor: error ? colors.expense : colors.border, color: colors.text }, style]}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: colors.expense }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.sm },
  label: Typography.label,
  input: { minHeight: 52, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.lg, fontSize: 16 },
  error: Typography.caption,
});
