import { promises as fs } from 'fs';
import path from 'path';

export interface Subscription {
  id: string;
  type: 'player' | 'team';
  name: string;
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  subscriptionId: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  date: string;
  details: string;
  notified: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const TRANSFERS_FILE = path.join(DATA_DIR, 'transfers.json');

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

export async function getTransfers(): Promise<Transfer[]> {
  return readJSON<Transfer[]>(TRANSFERS_FILE, []);
}

export async function addTransfer(transfer: Omit<Transfer, 'id'>): Promise<Transfer> {
  const transfers = await getTransfers();
  const newTransfer: Transfer = {
    ...transfer,
    id: Date.now().toString(),
  };
  transfers.push(newTransfer);
  await writeJSON(TRANSFERS_FILE, transfers);
  return newTransfer;
}

export async function markTransferNotified(id: string): Promise<void> {
  const transfers = await getTransfers();
  const index = transfers.findIndex(t => t.id === id);
  if (index !== -1) {
    transfers[index].notified = true;
    await writeJSON(TRANSFERS_FILE, transfers);
  }
}
