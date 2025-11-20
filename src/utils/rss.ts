import { XMLParser } from 'fast-xml-parser';

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
}

const RSS_FEED_URL = 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml';

export async function fetchAnthropicNews(limit?: number): Promise<RSSItem[]> {
  try {
    const response = await fetch(RSS_FEED_URL, {
      cache: 'default', // Use browser cache when available
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseRSSFeed(xmlText);

    // Return limited items if specified
    return limit ? items.slice(0, limit) : items;
  } catch (error) {
    console.error('Error fetching Anthropic news:', error);
    throw error;
  }
}

function parseRSSFeed(xmlText: string): RSSItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const result = parser.parse(xmlText);

  // Navigate to the items array
  const items = result?.rss?.channel?.item || [];

  // Ensure items is always an array (fast-xml-parser returns single object if only one item)
  const itemsArray = Array.isArray(items) ? items : [items];

  // Map RSS items to our interface
  const rssItems: RSSItem[] = itemsArray.map((item: any) => ({
    title: item.title || '',
    link: item.link || '',
    description: item.description || '',
    pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
    category: item.category || undefined,
  }));

  // Sort by date (newest first)
  return rssItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
