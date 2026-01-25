import { promises as fs } from 'fs';
import path from 'path';

export interface Subscription {
  id: string;
  topic: string; // الموضوع المراد تتبعه (مثل: "ضربة أمريكا لإيران", "علاج الربو")
  description: string; // وصف اختياري
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
}

export interface NewsAlert {
  id: string;
  subscriptionId: string;
  topic: string;
  newsTitle: string;
  summary: string;
  details: string;
  date: string;
  importance: 'عاجل' | 'مهم' | 'عادي';
  notified: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const NEWS_ALERTS_FILE = path.join(DATA_DIR, 'news-alerts.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJSON<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return readJSON<Subscription[]>(SUBSCRIPTIONS_FILE, []);
}

export async function addSubscription(subscription: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> {
  const subscriptions = await getSubscriptions();
  const newSubscription: Subscription = {
    ...subscription,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  subscriptions.push(newSubscription);
  await writeJSON(SUBSCRIPTIONS_FILE, subscriptions);
  return newSubscription;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>): Promise<void> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index !== -1) {
    subscriptions[index] = { ...subscriptions[index], ...updates };
    await writeJSON(SUBSCRIPTIONS_FILE, subscriptions);
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  const subscriptions = await getSubscriptions();
  const filtered = subscriptions.filter(sub => sub.id !== id);
  await writeJSON(SUBSCRIPTIONS_FILE, filtered);
}

export async function getNewsAlerts(): Promise<NewsAlert[]> {
  return readJSON<NewsAlert[]>(NEWS_ALERTS_FILE, []);
}

export async function addNewsAlert(alert: Omit<NewsAlert, 'id'>): Promise<NewsAlert> {
  const alerts = await getNewsAlerts();
  const newAlert: NewsAlert = {
    ...alert,
    id: Date.now().toString(),
  };
  alerts.push(newAlert);
  await writeJSON(NEWS_ALERTS_FILE, alerts);
  return newAlert;
}

export async function markAlertNotified(id: string): Promise<void> {
  const alerts = await getNewsAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index].notified = true;
    await writeJSON(NEWS_ALERTS_FILE, alerts);
  }
}
