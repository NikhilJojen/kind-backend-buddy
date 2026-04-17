import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { DailyEntry } from "@/lib/external-supabase";

interface ComparisonChartProps {
  userData: DailyEntry[];
  topData: DailyEntry[];
  userName: string;
  isTopPlayer: boolean;
}

export function ComparisonChart({ userData, topData, userName, isTopPlayer }: ComparisonChartProps) {
  // Merge by date
  const dateMap = new Map<string, { date: string; you?: number; top?: number }>();
  userData.forEach((d) => {
    dateMap.set(d.date, { ...(dateMap.get(d.date) ?? { date: d.date }), you: d.cumulative_runs });
  });
  if (!isTopPlayer) {
    topData.forEach((d) => {
      dateMap.set(d.date, { ...(dateMap.get(d.date) ?? { date: d.date }), top: d.cumulative_runs });
    });
  }
  const merged = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="h-48 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={merged} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              backgroundColor: "rgba(15,20,40,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Line
            type="monotone"
            dataKey="you"
            name={isTopPlayer ? `${userName} (Top)` : "You"}
            stroke="var(--neon)"
            strokeWidth={2.5}
            dot={false}
          />
          {!isTopPlayer && (
            <Line
              type="monotone"
              dataKey="top"
              name="Top Performer"
              stroke="var(--gold)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
