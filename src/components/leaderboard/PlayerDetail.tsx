import { motion } from "framer-motion";
import type { LatestPlayer, DailyEntry } from "@/lib/external-supabase";
import { ComparisonChart } from "./ComparisonChart";

interface Props {
  player: LatestPlayer;
  dailyData: DailyEntry[];
  topDaily: DailyEntry[];
  loading: boolean;
  onClose: () => void;
}

export function PlayerDetail({ player, dailyData, topDaily, loading, onClose }: Props) {
  const isTopPlayer = player.rank === 1;

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
          <ComparisonChart
            userData={dailyData}
            topData={topDaily}
            userName={player.user_name}
            isTopPlayer={isTopPlayer}
          />
        ) : (
          <p className="text-center text-muted-foreground py-4">No history data available.</p>
        )}
      </div>
    </motion.div>
  );
}
