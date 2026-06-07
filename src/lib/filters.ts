import { OffkaiEvent, EventFilters } from "@/types/event";

export function applyFilters(events: OffkaiEvent[], filters: EventFilters): OffkaiEvent[] {
  return events.filter((e) => {
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      if (
        !e.title.toLowerCase().includes(kw) &&
        !e.description.toLowerCase().includes(kw)
      )
        return false;
    }

    if (filters.isFree !== undefined && e.isFree !== filters.isFree) return false;

    if (filters.dateFrom && e.startAt < filters.dateFrom) return false;
    if (filters.dateTo && e.startAt > filters.dateTo) return false;

    if (filters.tags?.length) {
      const hasTag = filters.tags.some((t) => e.tags.includes(t));
      if (!hasTag) return false;
    }

    if (filters.sources?.length && !filters.sources.includes(e.source)) return false;

    return true;
  });
}
