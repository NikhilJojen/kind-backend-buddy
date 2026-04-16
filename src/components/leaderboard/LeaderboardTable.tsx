import type { LatestPlayer } from "@/lib/external-supabase";

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0)
    return <span className="text-delta-up font-semibold text-xs">▲ {delta}</span>;
  if (delta < 0)
    return <span className="text-delta-down font-semibold text-xs">▼ {Math.abs(delta)}</span>;
  return <span className="text-delta-neutral text-xs">—</span>;
}

interface TableProps {
  players: LatestPlayer[];
  onRowClick: (player: LatestPlayer) => void;
  selectedUserId?: string | null;
  title?: string;
}

export function LeaderboardTable({ players, onRowClick, selectedUserId, title }: TableProps) {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {title && (
        <h2
          className="text-lg md:text-xl font-bold text-gold mb-3 uppercase tracking-wide"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {title}
        </h2>
      )}
      <div className="rounded-xl overflow-hidden border border-glass-border backdrop-blur-xl bg-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 text-left w-14">#</th>
                <th className="py-3 px-3 text-left">Player</th>
                <th className="py-3 px-3 text-right">Runs</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">SR</th>
                <th className="py-3 px-3 text-right">Delta</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const isTop3 = p.rank <= 3;
                const isSelected = p.user_id === selectedUserId;
                return (
                  <tr
                    key={`${p.user_id}-${p.rank}`}
                    onClick={() => onRowClick(p)}
                    className={[
                      "border-b border-glass-border/50 cursor-pointer transition-all duration-200",
                      "hover:bg-gold/5 hover:shadow-[inset_0_0_20px_0_var(--gold-glow)]",
                      isTop3 ? "bg-gold/[0.03]" : "",
                      isSelected ? "!bg-gold/10 ring-1 ring-gold/30" : "",
                    ].join(" ")}
                  >
                    <td className="py-2.5 px-3 font-bold text-muted-foreground">
                      {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : p.rank}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-foreground truncate max-w-[180px]">
                      {p.user_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-gold">
                      {p.cumulative_runs.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right hidden sm:table-cell text-neon">
                      {p.strike_rate.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <DeltaBadge delta={p.delta} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
