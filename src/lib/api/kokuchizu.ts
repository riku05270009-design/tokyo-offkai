import { OffkaiEvent } from "@/types/event";

// こくちーず → 常にモック（RSS/APIがブロックされているため）
export async function fetchKokuchizuEvents(): Promise<OffkaiEvent[]> {
  const { MOCK_EVENTS } = await import("@/lib/mock");
  return MOCK_EVENTS.filter((e) => e.source === "kokuchizu");
}
