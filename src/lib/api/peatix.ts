import { OffkaiEvent } from "@/types/event";

// Peatix は公開APIなし → 常にモック
export async function fetchPeatixEvents(): Promise<OffkaiEvent[]> {
  const { MOCK_EVENTS } = await import("@/lib/mock");
  return MOCK_EVENTS.filter((e) => e.source === "peatix");
}
