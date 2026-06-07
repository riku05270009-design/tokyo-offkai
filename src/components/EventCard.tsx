"use client";

import { OffkaiEvent } from "@/types/event";

const SOURCE_LABELS: Record<string, string> = {
  connpass: "connpass",
  peatix: "Peatix",
  meetup: "Meetup",
  kokuchizu: "こくちーず",
};

const SOURCE_COLORS: Record<string, string> = {
  connpass: "bg-blue-100 text-blue-700",
  peatix: "bg-red-100 text-red-700",
  meetup: "bg-purple-100 text-purple-700",
  kokuchizu: "bg-green-100 text-green-700",
};

export default function EventCard({ event }: { event: OffkaiEvent }) {
  const dateStr = new Date(event.startAt).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_COLORS[event.source]}`}>
          {SOURCE_LABELS[event.source]}
        </span>
        {event.isFree && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            無料
          </span>
        )}
      </div>

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
      >
        {event.title}
      </a>

      <div className="text-sm text-gray-500 space-y-1">
        <div>📅 {dateStr}</div>
        {event.location && <div>📍 {event.location}</div>}
        {event.organizer && <div>👤 {event.organizer}</div>}
        {event.attendeeCount !== undefined && (
          <div>
            🙋 {event.attendeeCount}人参加
            {event.capacity ? ` / ${event.capacity}人` : ""}
          </div>
        )}
      </div>

      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {event.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-center text-sm py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        詳細・申し込み
      </a>
    </div>
  );
}
