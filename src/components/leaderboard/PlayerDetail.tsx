import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { LatestPlayer, DailyEntry } from "@/lib/external-supabase";

interface Props {
  player: LatestPlayer;
  dailyData: DailyEntry[];
  loading: boolean;
  onClose: () => void;
}

export function PlayerDetail({ player, dailyData, loading, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="max-w-5xl mx-auto px-4"
    >
      <div className="rounded-2xl border border-glass-border backdrop-blur-xl bg-glass p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg md:text-xl font-bold text-gold uppercase tracking-wide"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {player.user_name}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Rank", value: `#${player.rank}` },
            { label: "Runs", value: player.cumulative_runs.toLocaleString() },
            { label: "Strike Rate", value: player.strike_rate.toFixed(1) },
            { label: "Delta", value: player.delta > 0 ? `▲ ${player.delta}` : player.delta < 0 ? `▼ ${Math.abs(player.delta)}` : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
              <p className="text-sm font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading history...</div>
        ) : dailyData.length > 0 ? (
          <>
            <div className="h-48 md:h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v: string) =>
                      new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                    }
                  />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15,20,40,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative_runs"
                    stroke="var(--gold)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl overflow-hidden border border-glass-border max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary">
                  <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-right">Runs</th>
                    <th className="py-2 px-3 text-right">Rank</th>
                    <th className="py-2 px-3 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((d) => (
                    <tr key={d.date} className="border-t border-glass-border/50">
                      <td className="py-2 px-3">
                        {new Date(d.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-2 px-3 text-right text-gold font-bold">
                        {d.cumulative_runs.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">#{d.rank}</td>
                      <td className="py-2 px-3 text-right">
                        {d.delta > 0 ? (
                          <span className="text-delta-up">▲ {d.delta}</span>
                        ) : d.delta < 0 ? (
                          <span className="text-delta-down">▼ {Math.abs(d.delta)}</span>
                        ) : (
                          <span className="text-delta-neutral">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-4">No history data available.</p>
        )}
      </div>
    </motion.div>
  );
}
