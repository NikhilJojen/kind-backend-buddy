import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { LatestPlayer, DailyEntry } from "@/lib/external-supabase";
import { ComparisonChart } from "./ComparisonChart";
import { RankChart } from "./RankChart";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  player: LatestPlayer;
  dailyData: DailyEntry[];
  topDaily: DailyEntry[];
  loading: boolean;
  onClose: () => void;
}

function getRankMovement(data: DailyEntry[]) {
  if (data.length < 2) return null;
  const sorted = data.slice().sort((a, b) => a.date.localeCompare(b.date));
  const window = Math.min(5, sorted.length - 1);
  const latest = sorted[sorted.length - 1];
  const past = sorted[sorted.length - 1 - window];
  const diff = past.rank - latest.rank; // positive = moved up
  return { diff, days: window };
}

export function PlayerDetail({ player, dailyData, topDaily, loading, onClose }: Props) {
  const isTopPlayer = player.rank === 1;
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<"runs" | "rank">("runs");

  const movement = getRankMovement(dailyData);
  const movementText = movement
    ? movement.diff > 0
      ? { text: `Moved up ${movement.diff} position${movement.diff !== 1 ? "s" : ""} in last ${movement.days} day${movement.days !== 1 ? "s" : ""}`, color: "text-emerald-400" }
      : movement.diff < 0
      ? { text: `Dropped ${Math.abs(movement.diff)} position${Math.abs(movement.diff) !== 1 ? "s" : ""} in last ${movement.days} day${movement.days !== 1 ? "s" : ""}`, color: "text-red-400" }
      : { text: `No rank change in last ${movement.days} day${movement.days !== 1 ? "s" : ""}`, color: "text-muted-foreground" }
    : null;

  const chartCardClass =
    "rounded-xl border border-glass-border bg-secondary/40 backdrop-blur-md p-3 sm:p-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="max-w-5xl mx-auto px-3 sm:px-4"
    >
      <div className="rounded-2xl border border-glass-border backdrop-blur-xl bg-glass p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2
            className="text-base sm:text-lg md:text-xl font-bold text-gold uppercase tracking-wide truncate"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {player.user_name}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Rank", value: `#${player.rank}` },
            { label: "Runs", value: player.cumulative_runs.toLocaleString() },
            { label: "Strike Rate", value: player.strike_rate.toFixed(1) },
            {
              label: "Delta",
              value:
                player.delta > 0
                  ? `▲ ${player.delta}`
                  : player.delta < 0
                  ? `▼ ${Math.abs(player.delta)}`
                  : "—",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-secondary p-2 sm:p-3 text-center">
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase">{s.label}</p>
              <p className="text-xs sm:text-sm font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading history...</div>
        ) : dailyData.length > 0 ? (
          <>
            {isMobile ? (
              <div>
                <div className="flex items-center gap-1 p-1 mb-3 rounded-lg bg-secondary border border-glass-border w-full max-w-[240px] mx-auto">
                  {(["runs", "rank"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileTab(tab)}
                      className={`flex-1 text-[11px] uppercase tracking-wide font-semibold py-1.5 rounded-md transition-all ${
                        mobileTab === tab
                          ? "bg-gold/20 text-gold shadow-[0_0_8px_rgba(255,200,50,0.3)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "runs" ? "Runs" : "Rank"}
                    </button>
                  ))}
                </div>
                <div className={chartCardClass}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        {mobileTab === "runs" ? "Runs Trend" : "Rank Trend"}
                      </p>
                      {mobileTab === "runs" ? (
                        <ComparisonChart
                          userData={dailyData}
                          topData={topDaily}
                          userName={player.user_name}
                          isTopPlayer={isTopPlayer}
                        />
                      ) : (
                        <>
                          <RankChart data={dailyData} userName={player.user_name} />
                          {movementText && (
                            <p className={`text-[11px] mt-2 text-center ${movementText.color}`}>
                              {movementText.text}
                            </p>
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className={chartCardClass}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Runs Trend
                  </p>
                  <ComparisonChart
                    userData={dailyData}
                    topData={topDaily}
                    userName={player.user_name}
                    isTopPlayer={isTopPlayer}
                  />
                </div>
                <div className={chartCardClass}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Rank Trend
                  </p>
                  <RankChart data={dailyData} userName={player.user_name} />
                  {movementText && (
                    <p className={`text-[11px] mt-2 text-center ${movementText.color}`}>
                      {movementText.text}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-4">No history data available.</p>
        )}
      </div>
    </motion.div>
  );
}
