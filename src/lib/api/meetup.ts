import { OffkaiEvent } from "@/types/event";

// Meetup は認証必須 → APIキーがあれば実API、なければモック
const API_KEY = process.env.MEETUP_API_KEY;

export async function fetchMeetupEvents(): Promise<OffkaiEvent[]> {
  if (!API_KEY) {
    const { MOCK_EVENTS } = await import("@/lib/mock");
    return MOCK_EVENTS.filter((e) => e.source === "meetup");
  }

  const QUERY = `
    query TokyoEvents {
      keywordSearch(
        filter: { query: "", lat: 35.6762, lon: 139.6503, radius: 30.0, source: EVENTS }
        input: { first: 100 }
      ) {
        edges {
          node {
            result {
              ... on Event {
                id title description dateTime endTime
                venue { name address }
                eventUrl isFree
                feeSettings { amount }
                group { name }
                topics { name }
                going maxTickets
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.meetup.com/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`Meetup API error: ${res.status}`);
  const data = await res.json();
  const edges = data?.data?.keywordSearch?.edges ?? [];

  return edges
    .map((edge: any) => {
      const e = edge?.node?.result;
      if (!e?.id) return null;
      return {
        id: `meetup-${e.id}`,
        source: "meetup" as const,
        title: e.title,
        description: e.description ?? "",
        startAt: e.dateTime,
        endAt: e.endTime ?? undefined,
        location: e.venue ? `${e.venue.name} ${e.venue.address}` : undefined,
        url: e.eventUrl,
        isFree: e.isFree ?? true,
        price: e.feeSettings?.amount ?? undefined,
        capacity: e.maxTickets ?? undefined,
        attendeeCount: e.going ?? undefined,
        tags: (e.topics ?? []).map((t: any) => t.name),
        organizer: e.group?.name ?? "",
      };
    })
    .filter(Boolean) as OffkaiEvent[];
}
