import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, AccessibilityInfo, Animated, Platform, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: PropsWithChildren['children'];
  style?: StyleProp<ViewStyle>;
}

export function AppButton({ label, onPress, variant = 'primary', loading, disabled, icon, style }: AppButtonProps) {
  const { colors } = useAppTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  const animateTo = (value: number) => {
    if (reduceMotion) return;
    Animated.timing(scale, { toValue: value, duration: 110, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress();
  };
  const backgroundColor = variant === 'danger' ? colors.expense : variant === 'secondary' ? colors.surfaceMuted : colors.primary;
  const textColor = variant === 'secondary' ? colors.text : variant === 'danger' ? colors.white : colors.onPrimary;
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled || loading}
        onPress={handlePress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [styles.button, { backgroundColor, opacity: disabled ? 0.45 : pressed && reduceMotion ? 0.78 : 1 }]}>
        {loading ? <ActivityIndicator color={textColor} /> : <>{icon}<Text style={[styles.label, { color: textColor }]}>{label}</Text></>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
  label: { ...Typography.label, fontSize: 16 },
});
