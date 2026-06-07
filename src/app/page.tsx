import EventList from "@/components/EventList";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">東京オフ会まとめ</h1>
          <p className="text-xs text-gray-500">
            connpass・Peatix・Meetup・こくちーずを一括検索
          </p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto w-full px-4 py-6">
        <EventList />
      </main>
    </div>
  );
}
