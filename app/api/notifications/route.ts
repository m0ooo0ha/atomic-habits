import { NextResponse } from 'next/server';
import { getTransfers } from '@/lib/storage';

export async function GET() {
  try {
    const transfers = await getTransfers();
    // Get only unnotified transfers
    const unnotified = transfers.filter(t => !t.notified);
    return NextResponse.json(unnotified);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
