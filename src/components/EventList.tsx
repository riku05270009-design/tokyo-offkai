"use client";

import { useEffect, useState, useCallback } from "react";
import { OffkaiEvent, EventFilters } from "@/types/event";
import EventCard from "./EventCard";
import FilterBar from "./FilterBar";

export default function EventList() {
  const [events, setEvents] = useState<OffkaiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(() => {
    const now = new Date();
    const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      dateFrom: now.toISOString().slice(0, 10),
      dateTo: week.toISOString().slice(0, 10),
    };
  });

  const fetchEvents = useCallback(async (f: EventFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.keyword) params.set("keyword", f.keyword);
      if (f.isFree !== undefined) params.set("isFree", String(f.isFree));
      if (f.dateFrom) params.set("dateFrom", f.dateFrom);
      if (f.dateTo) params.set("dateTo", f.dateTo);
      if (f.timeFrom) params.set("timeFrom", f.timeFrom);
      if (f.timeTo) params.set("timeTo", f.timeTo);
      if (f.tags?.length) params.set("tags", f.tags.join(","));
      if (f.sources?.length) params.set("sources", f.sources.join(","));

      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setEvents(data.events);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <div className="text-center text-gray-400 py-16">読み込み中...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && events.length === 0 && (
        <div className="text-center text-gray-400 py-16">イベントが見つかりませんでした</div>
      )}
      {!loading && !error && events.length > 0 && (
        <div className="text-sm text-gray-500">{events.length}件のイベント</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
