import { kv } from '@vercel/kv';

export interface Subscription {
  id: string;
  type: 'player' | 'team'; // نوع المتابعة: لاعب أو فريق
  name: string; // اسم اللاعب أو الفريق
  league: string; // الدوري (اختياري)
  position: string; // المركز (للاعبين فقط)
  description: string; // وصف اختياري
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
}

export interface TransferAlert {
  id: string;
  subscriptionId: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferType: 'انتقال دائم' | 'إعارة' | 'انتقال حر' | 'تجديد عقد';
  transferFee: string; // قيمة الصفقة
  contractLength: string; // مدة العقد
  date: string; // تاريخ الانتقال
  details: string; // تفاصيل إضافية
  source: string; // المصدر
  importance: 'عاجل' | 'مهم' | 'عادي';
  notified: boolean;
}

const SUBSCRIPTIONS_KEY = 'subscriptions';
const TRANSFER_ALERTS_KEY = 'transfer-alerts';

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

export async function getTransferAlerts(): Promise<TransferAlert[]> {
  try {
    const alerts = await kv.get<TransferAlert[]>(TRANSFER_ALERTS_KEY);
    return alerts || [];
  } catch (error) {
    console.error('Error getting transfer alerts from KV:', error);
    return [];
  }
}

export async function addTransferAlert(alert: Omit<TransferAlert, 'id'>): Promise<TransferAlert> {
  const alerts = await getTransferAlerts();
  const newAlert: TransferAlert = {
    ...alert,
    id: Date.now().toString(),
  };
  alerts.push(newAlert);
  await kv.set(TRANSFER_ALERTS_KEY, alerts);
  return newAlert;
}

export async function markAlertNotified(id: string): Promise<void> {
  const alerts = await getTransferAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index].notified = true;
    await kv.set(TRANSFER_ALERTS_KEY, alerts);
  }
}
