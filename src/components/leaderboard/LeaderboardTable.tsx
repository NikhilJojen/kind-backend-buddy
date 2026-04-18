import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LatestPlayer, DailyEntry } from "@/lib/external-supabase";
import { ComparisonChart } from "./ComparisonChart";

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0)
    return <span className="text-delta-up font-semibold text-xs">▲ {delta}</span>;
  if (delta < 0)
    return <span className="text-delta-down font-semibold text-xs">▼ {Math.abs(delta)}</span>;
  return <span className="text-delta-neutral text-xs">—</span>;
}

interface TableProps {
  players: LatestPlayer[];
  expandedUserId: string | null;
  onRowClick: (player: LatestPlayer) => void;
  expandedDaily: DailyEntry[];
  expandedLoading: boolean;
  topDaily: DailyEntry[];
  title?: string;
}

export function LeaderboardTable({
  players,
  expandedUserId,
  onRowClick,
  expandedDaily,
  expandedLoading,
  topDaily,
  title,
}: TableProps) {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4">
      {title && (
        <h2
          className="text-base sm:text-lg md:text-xl font-bold text-gold mb-3 uppercase tracking-wide"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {title}
        </h2>
      )}
      <div className="overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-white/15 text-muted-foreground text-[10px] sm:text-[11px] uppercase tracking-wider">
              <th className="py-3 px-2 sm:px-3 text-left w-10 sm:w-14">#</th>
              <th className="py-3 px-2 sm:px-3 text-left">Player</th>
              <th className="py-3 px-2 sm:px-3 text-right w-16 sm:w-20">Runs</th>
              <th className="py-3 px-2 sm:px-3 text-right hidden sm:table-cell w-16">SR</th>
              <th className="py-3 px-2 sm:px-3 text-right w-14 sm:w-16">Δ</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const isTop3 = p.rank <= 3;
              const isExpanded = p.user_id === expandedUserId;
              const isTopPlayer = p.rank === 1;
              return (
                <Fragment key={p.user_id}>
                  <tr
                    onClick={() => onRowClick(p)}
                    className={[
                      "border-b border-white/10 cursor-pointer transition-all duration-200",
                      "hover:bg-gold/10 hover:shadow-[inset_0_0_20px_0_var(--gold-glow)]",
                      isTop3 ? "bg-gold/[0.04]" : "",
                      isExpanded ? "!bg-gold/15" : "",
                    ].join(" ")}
                  >
                    <td className="py-2.5 px-2 sm:px-3 font-bold text-muted-foreground">
                      {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : p.rank}
                    </td>
                    <td className="py-2.5 px-2 sm:px-3 font-semibold text-foreground truncate">
                      {p.user_name}
                    </td>
                    <td className="py-2.5 px-2 sm:px-3 text-right font-bold text-gold">
                      {p.cumulative_runs.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 sm:px-3 text-right hidden sm:table-cell text-neon">
                      {p.strike_rate.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 sm:px-3 text-right">
                      <DeltaBadge delta={p.delta} />
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr className="bg-background/60 backdrop-blur-md">
                        <td colSpan={5} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 sm:p-4 border-t border-white/10">
                              {expandedLoading ? (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                  Loading history...
                                </div>
                              ) : expandedDaily.length > 0 ? (
                                <ComparisonChart
                                  userData={expandedDaily}
                                  topData={topDaily}
                                  userName={p.user_name}
                                  isTopPlayer={isTopPlayer}
                                />
                              ) : (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                  No history data available.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
