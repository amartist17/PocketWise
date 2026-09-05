import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

const sections = [
  ['Privacy policy', 'PocketWise stores your account details and finance records only to provide the service. Records are scoped to your account, protected in transit with HTTPS, and are not sold. Split participant names remain on your device and are not uploaded. You can permanently delete your account and its transactions from Profile.'],
  ['Terms of use', 'PocketWise is a budgeting aid, not financial, tax, or investment advice. You are responsible for the accuracy of entries and for keeping your login secure. The service is provided as-is and may change as it improves. Do not use PocketWise for unlawful activity.'],
  ['Data retention', 'Account and transaction data remain until you delete them. A deletion request removes the account and associated transaction records. Operational hosting logs may be retained temporarily by infrastructure providers for security and reliability.'],
  ['Support', 'For privacy, account, or security questions, open an issue in the PocketWise GitHub repository. Never include passwords, reset codes, or financial records in a public issue.'],
] as const;

export default function LegalScreen() {
  const { colors } = useAppTheme();
  return <Screen scroll contentStyle={styles.screen}><Text style={[styles.title, { color: colors.text }]}>Privacy & terms</Text><Text style={[styles.updated, { color: colors.textMuted }]}>Effective 5 September 2026</Text>{sections.map(([title, body]) => <Card key={title} style={styles.card}><Text style={[styles.heading, { color: colors.text }]}>{title}</Text><Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text></Card>)}</Screen>;
}
const styles = StyleSheet.create({ screen: { gap: Spacing.lg, paddingTop: Spacing.md }, title: Typography.title, updated: Typography.caption, card: { gap: Spacing.sm }, heading: Typography.heading, body: Typography.body });
