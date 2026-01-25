import { kv } from '@vercel/kv';

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

const SUBSCRIPTIONS_KEY = 'subscriptions';
const NEWS_ALERTS_KEY = 'news-alerts';

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const subscriptions = await kv.get<Subscription[]>(SUBSCRIPTIONS_KEY);
    return subscriptions || [];
  } catch (error) {
    console.error('Error getting subscriptions from KV:', error);
    return [];
  }
}

export async function addSubscription(subscription: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> {
  const subscriptions = await getSubscriptions();
  const newSubscription: Subscription = {
    ...subscription,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  subscriptions.push(newSubscription);
  await kv.set(SUBSCRIPTIONS_KEY, subscriptions);
  return newSubscription;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>): Promise<void> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index !== -1) {
    subscriptions[index] = { ...subscriptions[index], ...updates };
    await kv.set(SUBSCRIPTIONS_KEY, subscriptions);
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  const subscriptions = await getSubscriptions();
  const filtered = subscriptions.filter(sub => sub.id !== id);
  await kv.set(SUBSCRIPTIONS_KEY, filtered);
}

export async function getNewsAlerts(): Promise<NewsAlert[]> {
  try {
    const alerts = await kv.get<NewsAlert[]>(NEWS_ALERTS_KEY);
    return alerts || [];
  } catch (error) {
    console.error('Error getting news alerts from KV:', error);
    return [];
  }
}

export async function addNewsAlert(alert: Omit<NewsAlert, 'id'>): Promise<NewsAlert> {
  const alerts = await getNewsAlerts();
  const newAlert: NewsAlert = {
    ...alert,
    id: Date.now().toString(),
  };
  alerts.push(newAlert);
  await kv.set(NEWS_ALERTS_KEY, alerts);
  return newAlert;
}

export async function markAlertNotified(id: string): Promise<void> {
  const alerts = await getNewsAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index].notified = true;
    await kv.set(NEWS_ALERTS_KEY, alerts);
  }
}
