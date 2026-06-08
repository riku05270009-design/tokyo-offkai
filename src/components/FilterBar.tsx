"use client";

import { EventFilters, EventSource } from "@/types/event";

interface Props {
  filters: EventFilters;
  onChange: (f: EventFilters) => void;
}

const GENRE_TAGS = ["人脈", "交流会", "異業種交流会"];

const SOURCES: { value: EventSource; label: string }[] = [
  { value: "connpass", label: "connpass" },
  { value: "peatix", label: "Peatix" },
  { value: "meetup", label: "Meetup" },
  { value: "kokuchizu", label: "こくちーず" },
];

export default function FilterBar({ filters, onChange }: Props) {
  function toggleSource(src: EventSource) {
    const current = filters.sources ?? [];
    const next = current.includes(src)
      ? current.filter((s) => s !== src)
      : [...current, src];
    onChange({ ...filters, sources: next.length ? next : undefined });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
      <input
        type="text"
        placeholder="キーワードで検索..."
        value={filters.keyword ?? ""}
        onChange={(e) =>
          onChange({ ...filters, keyword: e.target.value || undefined })
        }
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500">ジャンルで探す：</span>
        {GENRE_TAGS.map((tag) => {
          const active = filters.tags?.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => {
                const current = filters.tags ?? [];
                const next = active
                  ? current.filter((t) => t !== tag)
                  : [...current, tag];
                onChange({ ...filters, tags: next.length ? next : undefined });
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                active
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500">日付：</span>
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) =>
              onChange({ ...filters, dateFrom: e.target.value || undefined })
            }
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-xs text-gray-400">〜</span>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) =>
              onChange({ ...filters, dateTo: e.target.value || undefined })
            }
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {[
            { label: "今日", offset: 0 },
            { label: "明日", offset: 1 },
          ].map(({ label, offset }) => {
            const t = new Date();
            t.setDate(t.getDate() + offset);
            const dateStr = t.toISOString().slice(0, 10);
            const active = filters.dateFrom === dateStr && filters.dateTo === dateStr;
            return (
              <button
                key={label}
                onClick={() =>
                  onChange({
                    ...filters,
                    dateFrom: active ? undefined : dateStr,
                    dateTo: active ? undefined : dateStr,
                  })
                }
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500">時間：</span>
          <input
            type="time"
            value={filters.timeFrom ?? ""}
            onChange={(e) =>
              onChange({ ...filters, timeFrom: e.target.value || undefined })
            }
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-xs text-gray-400">〜</span>
          <input
            type="time"
            value={filters.timeTo ?? ""}
            onChange={(e) =>
              onChange({ ...filters, timeTo: e.target.value || undefined })
            }
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {(filters.timeFrom || filters.timeTo) && (
            <button
              onClick={() => onChange({ ...filters, timeFrom: undefined, timeTo: undefined })}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500">参加費：</span>
        <button
          onClick={() =>
            onChange({
              ...filters,
              isFree: filters.isFree === true ? undefined : true,
            })
          }
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            filters.isFree === true
              ? "bg-yellow-400 border-yellow-400 text-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          無料のみ
        </button>
        <button
          onClick={() =>
            onChange({
              ...filters,
              isFree: filters.isFree === false ? undefined : false,
            })
          }
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            filters.isFree === false
              ? "bg-orange-400 border-orange-400 text-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          有料のみ
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500">サービス：</span>
        {SOURCES.map((s) => (
          <button
            key={s.value}
            onClick={() => toggleSource(s.value)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              !filters.sources || filters.sources.includes(s.value)
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 text-gray-400 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
