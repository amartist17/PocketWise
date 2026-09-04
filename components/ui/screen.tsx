import { PropsWithChildren } from 'react';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, scroll = false, contentStyle }: ScreenProps) {
  const { colors } = useAppTheme();
  if (scroll) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return <SafeAreaView edges={['top']} style={[styles.safe, styles.content, { backgroundColor: colors.background }, contentStyle]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl } });
