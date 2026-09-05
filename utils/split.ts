export interface SplitPerson {
  id: string;
  name: string;
}

export function splitEqually(total: number, people: SplitPerson[]) {
  if (!Number.isFinite(total) || total <= 0 || people.length === 0) return [];
  const totalPaise = Math.round(total * 100);
  const base = Math.floor(totalPaise / people.length);
  const remainder = totalPaise - base * people.length;
  return people.map((person, index) => ({
    ...person,
    amount: (base + (index < remainder ? 1 : 0)) / 100,
  }));
}

export function buildSplitMessage(title: string, total: number, people: ReturnType<typeof splitEqually>) {
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
  return [
    `PocketWise split: ${title.trim() || 'Shared expense'}`,
    `Total: ${money.format(total)}`,
    '',
    ...people.map((person) => `${person.name}: ${money.format(person.amount)}`),
    '',
    'Please send your share when convenient. This is a payment request, not a payment confirmation.',
  ].join('\n');
}
