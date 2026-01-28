import { NextResponse } from 'next/server';
import { getSubscriptions, updateSubscription, addTransferAlert } from '@/lib/storage';
import { searchPlayerTransfers } from '@/lib/ai-search';

export const maxDuration = 300; // 5 minutes timeout for this endpoint

export async function POST(request: Request) {
  try {
    // Verify the request is authorized (simple security token)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-secret-change-me';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await getSubscriptions();
    const results = [];

    for (const subscription of subscriptions) {
      try {
        console.log(`Checking ${subscription.type}: ${subscription.name}`);

        const transferInfo = await searchPlayerTransfers(subscription.name, subscription.type);

        // Update subscription with latest status
        await updateSubscription(subscription.id, {
          lastStatus: transferInfo.currentStatus,
          lastChecked: new Date().toISOString(),
        });

        // If there's a new transfer, record it
        if (transferInfo.hasTransfer) {
          // Check if this transfer is already recorded
          const isDuplicate = subscription.lastStatus === transferInfo.currentStatus;

          if (!isDuplicate) {
            const alert = await addTransferAlert({
              subscriptionId: subscription.id,
              playerName: transferInfo.playerName,
              fromTeam: transferInfo.fromTeam,
              toTeam: transferInfo.toTeam,
              transferType: transferInfo.transferType,
              transferFee: transferInfo.transferFee,
              contractLength: transferInfo.contractLength,
              date: transferInfo.transferDate,
              details: transferInfo.details,
              source: transferInfo.source,
              importance: transferInfo.importance,
              notified: false,
            });

            results.push({
              subscription: subscription.name,
              alert,
              status: 'new_transfer_found',
            });
          } else {
            results.push({
              subscription: subscription.name,
              status: 'already_notified',
            });
          }
        } else {
          results.push({
            subscription: subscription.name,
            status: 'no_transfer',
          });
        }
      } catch (error) {
        console.error(`Error checking ${subscription.name}:`, error);
        results.push({
          subscription: subscription.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      checked: subscriptions.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in check-news:', error);
    return NextResponse.json(
      { error: 'Failed to check news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Allow manual trigger via GET (for testing)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET || 'default-secret-change-me';

  if (secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create a new request with authorization header
  const newRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${cronSecret}`,
    },
  });

  return POST(newRequest);
}
