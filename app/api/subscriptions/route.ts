import { NextResponse } from 'next/server';
import { getSubscriptions, addSubscription, deleteSubscription } from '@/lib/storage';

export async function GET() {
  try {
    const subscriptions = await getSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name } = body;

    if (!type || !name) {
      return NextResponse.json({ error: 'Type and name are required' }, { status: 400 });
    }

    if (type !== 'player' && type !== 'team') {
      return NextResponse.json({ error: 'Type must be "player" or "team"' }, { status: 400 });
    }

    const subscription = await addSubscription({
      type,
      name,
      lastStatus: 'لم يتم الفحص بعد',
      lastChecked: new Date().toISOString(),
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteSubscription(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}
