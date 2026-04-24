import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DailyEntry } from "@/lib/external-supabase";

interface RankChartProps {
  data: DailyEntry[];
  userName: string;
}

export function RankChart({ data, userName }: RankChartProps) {
  const chartData = data
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({ date: d.date, rank: d.rank }));

  const maxRank = Math.max(...chartData.map((d) => d.rank), 1);

  return (
    <div className="h-48 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(v: string) =>
              new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
            }
          />
          <YAxis
            reversed
            domain={[1, maxRank]}
            allowDecimals={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(v: number) => `#${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,20,40,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`#${value}`, userName]}
            labelFormatter={(label) =>
              new Date(String(label)).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="rank"
            name={userName}
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
