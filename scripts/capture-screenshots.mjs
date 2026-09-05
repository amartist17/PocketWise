import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.POCKETWISE_PREVIEW_URL ?? 'http://localhost:8081';
const apiUrl = process.env.POCKETWISE_SHOWCASE_API_URL ?? 'http://localhost:4000/api';
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = resolve('docs/screenshots');
const showcase = { name: 'Aarav', email: 'showcase@pocketwise.app', password: 'ShowcaseOnly123!' };
const transactions = [
  { type: 'income', amount: 85000, category: 'Salary', description: 'Monthly salary', date: '2026-09-01' },
  { type: 'expense', amount: 12500, category: 'Bills', description: 'Apartment rent', date: '2026-09-02' },
  { type: 'expense', amount: 2450, category: 'Food', description: 'Weekend groceries', date: '2026-09-04' },
  { type: 'expense', amount: 899, category: 'Entertainment', description: 'Music subscription', date: '2026-09-03' },
  { type: 'income', amount: 12000, category: 'Freelance', description: 'Product design project', date: '2026-08-30' },
  { type: 'expense', amount: 1640, category: 'Travel', description: 'Metro and cab rides', date: '2026-08-29' },
  { type: 'expense', amount: 780, category: 'Health', description: 'Pharmacy essentials', date: '2026-08-28' },
];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, options);
  const body = await response.json();
  if (!response.ok) throw Object.assign(new Error(body.message ?? 'Showcase API request failed.'), { status: response.status });
  return body;
}

async function seedShowcase() {
  let auth;
  try {
    auth = await apiRequest('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(showcase) });
  } catch (error) {
    if (error.status !== 409) throw error;
    auth = await apiRequest('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: showcase.email, password: showcase.password }) });
  }
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` };
  const existing = await apiRequest('/transactions', { headers });
  await Promise.all(existing.transactions.map((item) => apiRequest(`/transactions/${item.id}`, { method: 'DELETE', headers })));
  for (const transaction of transactions) {
    await apiRequest('/transactions', { method: 'POST', headers, body: JSON.stringify(transaction) });
  }
}

await mkdir(outputDir, { recursive: true });
await seedShowcase();
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.getByRole('textbox').first().fill(showcase.email);
  await page.locator('input[type="password"]').fill(showcase.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(`${baseUrl}/`, { timeout: 15_000 });
  await page.getByRole('tab', { name: /Profile/ }).click();
  await page.getByRole('button', { name: 'Light' }).click();
  await page.getByRole('tab', { name: /Home/ }).click();
  await page.screenshot({ path: resolve(outputDir, 'home-light.png') });

  await page.getByRole('tab', { name: /Analytics/ }).click();
  await page.screenshot({ path: resolve(outputDir, 'analytics-light.png') });

  await page.getByRole('tab', { name: /Profile/ }).click();
  await page.getByRole('button', { name: 'Dark' }).click();
  await page.goto(`${baseUrl}/tools`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: resolve(outputDir, 'tools-dark.png') });

  await page.goto(`${baseUrl}/split`, { waitUntil: 'networkidle' });
  const inputs = page.getByRole('textbox');
  await inputs.nth(0).fill('Weekend dinner');
  await inputs.nth(1).fill('4800');
  await inputs.nth(2).fill('Riya');
  await page.getByRole('button', { name: 'Add person' }).click();
  await page.getByRole('button', { name: 'Share split' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(outputDir, 'split-dark.png') });
} finally {
  await browser.close();
}

console.log(`Saved four screenshots to ${outputDir}`);
