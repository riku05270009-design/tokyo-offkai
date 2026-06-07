import { OffkaiEvent } from "@/types/event";

const API_KEY = process.env.CONNPASS_API_KEY;
const BASE_URL = "https://connpass.com/api/v2/events/";

interface ConnpassV2Event {
  id: number;
  title: string;
  catch: string;
  description: string;
  event_url: string;
  started_at: string;
  ended_at: string;
  limit: number;
  accepted: number;
  place: string;
  address: string;
  owner_display_name: string;
  logo: string;
  tags: string[];
  fee_required: boolean;
  fee: number;
}

interface ConnpassV2Response {
  items: ConnpassV2Event[];
}

export async function fetchConnpassEvents(): Promise<OffkaiEvent[]> {
  if (!API_KEY) {
    // APIキー未設定 → モックで代替
    const { MOCK_EVENTS } = await import("@/lib/mock");
    return MOCK_EVENTS.filter((e) => e.source === "connpass");
  }

  const params = new URLSearchParams({
    prefectures: "tokyo",
    count: "100",
    order: "started_at",
  });

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`Connpass API error: ${res.status}`);
  const data: ConnpassV2Response = await res.json();

  return data.items.map((e) => ({
    id: `connpass-${e.id}`,
    source: "connpass" as const,
    title: e.title,
    description: e.catch || e.description,
    startAt: e.started_at,
    endAt: e.ended_at,
    location: e.place || e.address,
    url: e.event_url,
    imageUrl: e.logo || undefined,
    isFree: !e.fee_required,
    price: e.fee || undefined,
    capacity: e.limit || undefined,
    attendeeCount: e.accepted,
    tags: e.tags ?? [],
    organizer: e.owner_display_name,
  }));
}
