import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, LayoutAnimation, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { buildSplitMessage, splitEqually, SplitPerson } from '@/utils/split';

const initialPeople: SplitPerson[] = [
  { id: 'you', name: 'You' },
  { id: 'friend', name: 'Friend' },
];

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export default function SplitScreen() {
  const { colors } = useAppTheme();
  const [title, setTitle] = useState('');
  const [totalText, setTotalText] = useState('');
  const [people, setPeople] = useState(initialPeople);
  const [name, setName] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [summaryScale] = useState(() => new Animated.Value(1));
  const total = Number(totalText.replace(/,/g, ''));
  const shares = useMemo(() => splitEqually(total, people), [total, people]);
  const isReady = shares.length > 0;

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion || !isReady) return;
    summaryScale.setValue(0.97);
    Animated.timing(summaryScale, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [isReady, reduceMotion, shares, summaryScale]);

  const addName = (nextName = name) => {
    const cleaned = nextName.trim();
    if (!cleaned) return;
    if (people.some((person) => person.name.toLowerCase() === cleaned.toLowerCase())) {
      Alert.alert('Already added', `${cleaned} is already in this split.`);
      return;
    }
    if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPeople((current) => [...current, { id: `${Date.now()}-${cleaned}`, name: cleaned }]);
    setName('');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const shareSplit = async () => {
    if (!isReady) return;
    await Share.share({
      title: 'PocketWise split',
      message: buildSplitMessage(title, total, shares),
    });
  };

  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={[styles.intro, { backgroundColor: colors.primarySoft }]}>
        <View style={[styles.introIcon, { backgroundColor: colors.primary }]}><Ionicons name="people" size={24} color={colors.onPrimary} /></View>
        <View style={styles.flex}>
          <Text style={[styles.introTitle, { color: colors.primaryStrong }]}>Equal, clear, ready to share</Text>
          <Text style={[styles.introText, { color: colors.textMuted }]}>We calculate to the paise, so the shares always add up to the exact total.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Expense</Text>
        <AppInput label="What was it for?" value={title} onChangeText={setTitle} placeholder="Dinner, cab, groceries…" maxLength={50} />
        <AppInput label="Total amount" value={totalText} onChangeText={(value) => setTotalText(value.replace(/[^0-9.]/g, ''))} placeholder="0.00" keyboardType="decimal-pad" inputMode="decimal" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View><Text style={[styles.sectionTitle, { color: colors.text }]}>People</Text><Text style={[styles.helper, { color: colors.textMuted }]}>{people.length} people · equal split</Text></View>
        </View>
        <View style={styles.addRow}>
          <AppInput label="Add a name" value={name} onChangeText={setName} placeholder="Name" returnKeyType="done" onSubmitEditing={() => addName()} containerStyle={styles.nameInput} />
          <Pressable accessibilityRole="button" accessibilityLabel="Add person" onPress={() => addName()} style={[styles.addButton, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </Pressable>
        </View>

        <View style={[styles.peopleList, { borderColor: colors.border }]}>
          {people.map((person, index) => {
            const share = shares[index]?.amount;
            return (
              <View key={person.id} style={[styles.personRow, index < people.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <View style={[styles.avatar, { backgroundColor: person.id === 'you' ? colors.primary : colors.surfaceMuted }]}><Text style={{ color: person.id === 'you' ? colors.onPrimary : colors.text, fontWeight: '700' }}>{person.name[0]?.toUpperCase()}</Text></View>
                <Text numberOfLines={1} style={[styles.personName, { color: colors.text }]}>{person.name}</Text>
                <Text style={[styles.shareAmount, { color: isReady ? colors.text : colors.textMuted }]}>{isReady ? money.format(share) : '—'}</Text>
                {person.id !== 'you' && people.length > 2 ? <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${person.name}`} hitSlop={10} onPress={() => { if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setPeople((current) => current.filter((item) => item.id !== person.id)); }}><Ionicons name="close-circle-outline" size={22} color={colors.textMuted} /></Pressable> : null}
              </View>
            );
          })}
        </View>
      </View>

      <Animated.View style={[styles.summary, { backgroundColor: colors.heroEnd, transform: [{ scale: summaryScale }] }]}>
        <Text style={styles.summaryLabel}>Each share</Text>
        <Text style={styles.summaryAmount}>{isReady ? money.format(shares[0].amount) : '₹0.00'}</Text>
        <Text style={styles.summaryNote}>The first few shares may differ by ₹0.01 to match the total exactly.</Text>
      </Animated.View>

      <AppButton label="Share split" onPress={() => void shareSplit()} disabled={!isReady} icon={<Ionicons name="share-social-outline" size={20} color={colors.onPrimary} />} />
      <Text style={[styles.footer, { color: colors.textMuted }]}>Choose WhatsApp or any installed app from your phone’s share sheet. No payment is sent.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: Spacing.xl, paddingTop: Spacing.lg },
  flex: { flex: 1 },
  intro: { borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  introIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  introTitle: Typography.label,
  introText: { ...Typography.caption, marginTop: Spacing.xs },
  section: { gap: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: Typography.heading,
  helper: Typography.caption,
  addRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-end' },
  nameInput: { flex: 1, minWidth: 0 },
  addButton: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
  peopleList: { borderTopWidth: 1, borderBottomWidth: 1 },
  personRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 36, height: 36, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  personName: { ...Typography.body, flex: 1 },
  shareAmount: Typography.label,
  summary: { borderRadius: Radius.lg, padding: Spacing.xl },
  summaryLabel: { ...Typography.label, color: '#D9F1EA' },
  summaryAmount: { ...Typography.hero, color: '#FFFFFF', marginVertical: Spacing.xs },
  summaryNote: { ...Typography.caption, color: '#D9F1EA' },
  footer: { ...Typography.caption, textAlign: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
});
