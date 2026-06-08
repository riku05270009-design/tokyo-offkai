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

    if (filters.dateFrom && e.startAt.slice(0, 10) < filters.dateFrom) return false;
    if (filters.dateTo && e.startAt.slice(0, 10) > filters.dateTo) return false;

    if (filters.timeFrom || filters.timeTo) {
      const time = new Date(e.startAt).toTimeString().slice(0, 5);
      if (filters.timeFrom && time < filters.timeFrom) return false;
      if (filters.timeTo && time > filters.timeTo) return false;
    }

    if (filters.tags?.length) {
      const hasTag = filters.tags.some((t) => e.tags.includes(t));
      if (!hasTag) return false;
    }

    if (filters.sources?.length && !filters.sources.includes(e.source)) return false;

    return true;
  });
}
