import { useState, useRef, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useLeaderboardData, usePlayerDaily } from "@/lib/leaderboard-store";
import { Header } from "@/components/leaderboard/Header";
import { Podium } from "@/components/leaderboard/Podium";
import { GlobalStats } from "@/components/leaderboard/GlobalStats";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SearchBar } from "@/components/leaderboard/SearchBar";
import { PlayerDetail } from "@/components/leaderboard/PlayerDetail";
import { FAQ } from "@/components/leaderboard/FAQ";
import type { LatestPlayer } from "@/lib/external-supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Premier League — Leaderboard" },
      { name: "description", content: "Live rankings, stats & player insights for the AI Premier League cricket competition." },
      { property: "og:title", content: "AI Premier League — Leaderboard" },
      { property: "og:description", content: "Live rankings, stats & player insights." },
    ],
  }),
  component: Index,
});

function Index() {
  const { fullData, top50, lastUpdated, loading, error } = useLeaderboardData();

  // Two separate selection states
  const [searchSelected, setSearchSelected] = useState<LatestPlayer | null>(null);
  const [tableExpanded, setTableExpanded] = useState<LatestPlayer | null>(null);

  // Daily history (one at a time depending on which is active)
  const activeUserId = searchSelected?.user_id ?? tableExpanded?.user_id ?? null;
  const { data: activeDaily, loading: activeLoading } = usePlayerDaily(activeUserId);

  // Top player daily (for comparison)
  const topPlayerId = useMemo(() => fullData.find((p) => p.rank === 1)?.user_id ?? null, [fullData]);
  const { data: topDaily } = usePlayerDaily(topPlayerId);

  const detailRef = useRef<HTMLDivElement>(null);

  const handleSearchSelect = (player: LatestPlayer) => {
    setSearchSelected(player);
    setTableExpanded(null);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleTableClick = (player: LatestPlayer) => {
    setTableExpanded((cur) => (cur?.user_id === player.user_id ? null : player));
    setSearchSelected(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-gold text-lg animate-pulse" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Loading Leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/stadium-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-background/85 z-0" />

      <div className="relative z-10 w-full">
        <Header lastUpdated={lastUpdated} />

        <main className="space-y-6 sm:space-y-8 pb-16 pt-4 w-full">
          <Podium top3={fullData.slice(0, 3)} />
          <GlobalStats fullData={fullData} />
          <SearchBar
            fullData={fullData}
            onSelect={handleSearchSelect}
            selectedUserId={searchSelected?.user_id ?? null}
          />

          <AnimatePresence>
            {searchSelected && (
              <div ref={detailRef}>
                <PlayerDetail
                  player={searchSelected}
                  dailyData={activeDaily}
                  topDaily={topDaily}
                  loading={activeLoading}
                  onClose={() => setSearchSelected(null)}
                />
              </div>
            )}
          </AnimatePresence>

          <LeaderboardTable
            players={top50}
            expandedUserId={tableExpanded?.user_id ?? null}
            onRowClick={handleTableClick}
            expandedDaily={tableExpanded ? activeDaily : []}
            expandedLoading={tableExpanded ? activeLoading : false}
            topDaily={topDaily}
            title="Top 50 Rankings"
          />

          <FAQ />
        </main>
      </div>
    </div>
  );
}
