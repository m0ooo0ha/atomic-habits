import { NextResponse } from 'next/server';
import { getTransferAlerts } from '@/lib/storage';

export async function GET() {
  try {
    const alerts = await getTransferAlerts();
    // Get only unnotified alerts
    const unnotified = alerts.filter(a => !a.notified);
    return NextResponse.json(unnotified);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
