import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

export default function ToolsScreen() {
  const { colors } = useAppTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [featureScale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  const animateFeature = (value: number) => {
    if (reduceMotion) return;
    Animated.timing(featureScale, { toValue: value, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Money tools</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Useful helpers that never move money on your behalf.</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: featureScale }] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Split an expense"
          onPress={() => router.push('/split' as Href)}
          onPressIn={() => animateFeature(0.98)}
          onPressOut={() => animateFeature(1)}
          style={({ pressed }) => [styles.feature, { backgroundColor: colors.heroEnd, opacity: pressed && reduceMotion ? 0.9 : 1 }]}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="people" size={28} color={colors.primary} /></View>
          <View style={styles.featureCopy}>
            <Text style={styles.featureTitle}>Split an expense</Text>
            <Text style={styles.featureText}>Divide a bill evenly, add participant names, and share a clear summary.</Text>
            <View style={styles.openRow}><Text style={styles.openText}>Start a split</Text><Ionicons name="arrow-forward" size={18} color={colors.onHero} /></View>
          </View>
        </Pressable>
      </Animated.View>

      <View style={[styles.comingSoon, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={[styles.soonIcon, { backgroundColor: colors.surfaceMuted }]}><Ionicons name="qr-code-outline" size={25} color={colors.textMuted} /></View>
        <View style={styles.featureCopy}>
          <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}><Text style={[styles.badgeText, { color: colors.onAccentSoft }]}>COMING SOON</Text></View>
          <Text style={[styles.soonTitle, { color: colors.text }]}>QR Assist</Text>
          <Text style={[styles.soonText, { color: colors.textMuted }]}>A future helper for attaching an amount and short note to a payment QR, then sharing it with someone you trust. It will not make or confirm payments.</Text>
        </View>
      </View>

      <View style={[styles.privacy, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
        <Text style={[styles.privacyText, { color: colors.primaryStrong }]}>Split details stay in this session. PocketWise does not upload participant names.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: Spacing.xl, paddingTop: Spacing.lg },
  header: { gap: Spacing.sm },
  title: Typography.title,
  subtitle: Typography.body,
  feature: { borderRadius: Radius.lg, padding: Spacing.xl, flexDirection: 'row', gap: Spacing.lg },
  featureIcon: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  featureCopy: { flex: 1, gap: Spacing.sm },
  featureTitle: { ...Typography.heading, color: '#FFFFFF' },
  featureText: { ...Typography.body, color: '#D9F1EA' },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  openText: { ...Typography.label, color: '#FFFFFF' },
  comingSoon: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.xl, flexDirection: 'row', gap: Spacing.lg },
  soonIcon: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  badgeText: { ...Typography.caption, fontSize: 10, letterSpacing: 0.7 },
  soonTitle: Typography.heading,
  soonText: Typography.body,
  privacy: { borderRadius: Radius.md, padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  privacyText: { ...Typography.caption, flex: 1 },
});
