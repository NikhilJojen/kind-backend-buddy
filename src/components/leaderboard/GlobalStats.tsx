import { motion } from "framer-motion";
import type { LatestPlayer } from "@/lib/external-supabase";

interface StatsProps {
  fullData: LatestPlayer[];
}

export function GlobalStats({ fullData }: StatsProps) {
  if (fullData.length === 0) return null;

  const topPlayer = fullData[0];
  const totalPlayers = fullData.length;
  const totalRuns = fullData.reduce((s, p) => s + p.cumulative_runs, 0);
  const avgSR = fullData.reduce((s, p) => s + p.strike_rate, 0) / totalPlayers;

  const stats = [
    { label: "Top Player", value: topPlayer.user_name, icon: "👑" },
    { label: "Total Players", value: totalPlayers.toLocaleString(), icon: "👥" },
    { label: "Total Runs", value: totalRuns.toLocaleString(), icon: "🏏" },
    { label: "Avg Strike Rate", value: avgSR.toFixed(1), icon: "⚡" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 max-w-5xl mx-auto">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="rounded-xl p-3 md:p-4 backdrop-blur-xl bg-glass border border-glass-border text-center"
        >
          <span className="text-xl">{s.icon}</span>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
            {s.label}
          </p>
          <p className="text-sm md:text-lg font-bold text-foreground mt-0.5 truncate">
            {s.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
