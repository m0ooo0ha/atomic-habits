import { NextResponse } from 'next/server';
import { getSubscriptions, updateSubscription, addNewsAlert } from '@/lib/storage';
import { searchNewsUpdates } from '@/lib/ai-search';

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
        console.log(`Checking topic: ${subscription.topic}`);

        const newsInfo = await searchNewsUpdates(subscription.topic);

        // Update subscription with latest status
        await updateSubscription(subscription.id, {
          lastStatus: newsInfo.currentStatus,
          lastChecked: new Date().toISOString(),
        });

        // If there's new news, record it
        if (newsInfo.hasNews) {
          // Check if this news is already recorded
          const isDuplicate = subscription.lastStatus === newsInfo.currentStatus;

          if (!isDuplicate) {
            const alert = await addNewsAlert({
              subscriptionId: subscription.id,
              topic: newsInfo.topic,
              newsTitle: newsInfo.newsTitle,
              summary: newsInfo.summary,
              details: newsInfo.details,
              date: newsInfo.newsDate,
              importance: newsInfo.importance,
              notified: false,
            });

            results.push({
              subscription: subscription.topic,
              alert,
              status: 'new_news_found',
            });
          } else {
            results.push({
              subscription: subscription.topic,
              status: 'already_notified',
            });
          }
        } else {
          results.push({
            subscription: subscription.topic,
            status: 'no_news',
          });
        }
      } catch (error) {
        console.error(`Error checking ${subscription.topic}:`, error);
        results.push({
          subscription: subscription.topic,
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
