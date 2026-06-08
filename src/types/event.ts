export type EventSource = "connpass" | "peatix" | "meetup" | "kokuchizu";

export interface OffkaiEvent {
  id: string;
  source: EventSource;
  title: string;
  description: string;
  startAt: string;
  endAt?: string;
  location?: string;
  url: string;
  imageUrl?: string;
  isFree: boolean;
  price?: number;
  capacity?: number;
  attendeeCount?: number;
  tags: string[];
  organizer: string;
}

export interface EventFilters {
  keyword?: string;
  tags?: string[];
  isFree?: boolean;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  sources?: EventSource[];
}
