import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useLeaderboardData, usePlayerDaily } from "@/lib/leaderboard-store";
import { Header } from "@/components/leaderboard/Header";
import { Podium } from "@/components/leaderboard/Podium";
import { GlobalStats } from "@/components/leaderboard/GlobalStats";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { SearchBar } from "@/components/leaderboard/SearchBar";
import { PlayerDetail } from "@/components/leaderboard/PlayerDetail";
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
  const { fullData, top100, lastUpdated, loading, error } = useLeaderboardData();
  const [selectedPlayer, setSelectedPlayer] = useState<LatestPlayer | null>(null);
  const { data: dailyData, loading: dailyLoading } = usePlayerDaily(
    selectedPlayer?.user_id ?? null
  );
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelect = (player: LatestPlayer) => {
    setSelectedPlayer(player);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold text-lg animate-pulse" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Loading Leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/images/stadium-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-background/85 z-0" />

      <div className="relative z-10">
        <Header lastUpdated={lastUpdated} />

        <main className="space-y-8 pb-16 pt-4">
          <Podium top3={fullData.slice(0, 3)} />
          <GlobalStats fullData={fullData} />
          <SearchBar
            fullData={fullData}
            onSelect={handleSelect}
            selectedUserId={selectedPlayer?.user_id ?? null}
          />

          <AnimatePresence>
            {selectedPlayer && (
              <div ref={detailRef}>
                <PlayerDetail
                  player={selectedPlayer}
                  dailyData={dailyData}
                  loading={dailyLoading}
                  onClose={() => setSelectedPlayer(null)}
                />
              </div>
            )}
          </AnimatePresence>

          <LeaderboardTable
            players={top100}
            onRowClick={handleSelect}
            selectedUserId={selectedPlayer?.user_id}
            title="Top 100 Rankings"
          />
        </main>
      </div>
    </div>
  );
}
