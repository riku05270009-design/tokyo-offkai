import { NextRequest, NextResponse } from "next/server";
import { fetchConnpassEvents } from "@/lib/api/connpass";
import { fetchKokuchizuEvents } from "@/lib/api/kokuchizu";
import { fetchMeetupEvents } from "@/lib/api/meetup";
import { fetchPeatixEvents } from "@/lib/api/peatix";
import { applyFilters } from "@/lib/filters";
import { EventFilters, EventSource } from "@/types/event";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const filters: EventFilters = {
    keyword: searchParams.get("keyword") ?? undefined,
    isFree: searchParams.has("isFree")
      ? searchParams.get("isFree") === "true"
      : undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    tags: searchParams.get("tags")?.split(",").filter(Boolean) ?? undefined,
    sources: (searchParams.get("sources")?.split(",").filter(Boolean) as EventSource[]) ?? undefined,
  };

  const results = await Promise.allSettled([
    fetchConnpassEvents(),
    fetchKokuchizuEvents(),
    fetchMeetupEvents(),
    fetchPeatixEvents(),
  ]);

  const events = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  const filtered = applyFilters(events, filters);
  filtered.sort((a, b) => a.startAt.localeCompare(b.startAt));

  return NextResponse.json({ events: filtered });
}
