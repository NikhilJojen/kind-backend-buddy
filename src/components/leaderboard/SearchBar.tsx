import { useState } from "react";
import type { LatestPlayer } from "@/lib/external-supabase";

interface SearchProps {
  fullData: LatestPlayer[];
  onSelect: (player: LatestPlayer) => void;
  selectedUserId: string | null;
}

export function SearchBar({ fullData, onSelect, selectedUserId }: SearchProps) {
  const [query, setQuery] = useState("");
  const results =
    query.length >= 2
      ? fullData.filter((p) =>
          p.user_name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search player by name..."
          className="w-full rounded-xl py-3 px-4 bg-glass border border-glass-border backdrop-blur-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </div>
      {results.length > 0 && (
        <div className="mt-2 rounded-xl overflow-hidden border border-glass-border backdrop-blur-xl bg-glass max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-[11px] uppercase tracking-wider">
                <th className="py-2 px-3 text-left w-14">#</th>
                <th className="py-2 px-3 text-left">Player</th>
                <th className="py-2 px-3 text-right">Runs</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr
                  key={p.user_id}
                  onClick={() => { onSelect(p); setQuery(""); }}
                  className={[
                    "border-b border-glass-border/50 cursor-pointer transition-colors hover:bg-gold/5",
                    p.user_id === selectedUserId ? "bg-gold/10" : "",
                  ].join(" ")}
                >
                  <td className="py-2 px-3 text-muted-foreground">{p.rank}</td>
                  <td className="py-2 px-3 font-semibold truncate max-w-[200px]">{p.user_name}</td>
                  <td className="py-2 px-3 text-right text-gold font-bold">
                    {p.cumulative_runs.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
