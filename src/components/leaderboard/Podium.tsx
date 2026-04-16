import { motion } from "framer-motion";
import type { LatestPlayer } from "@/lib/external-supabase";

interface PodiumProps {
  top3: LatestPlayer[];
}

const medals = [
  { label: "🥇", glowColor: "var(--gold)", shadowSize: "0 0 40px 8px", scale: 1.08 },
  { label: "🥈", glowColor: "var(--silver)", shadowSize: "0 0 30px 6px", scale: 1 },
  { label: "🥉", glowColor: "var(--bronze)", shadowSize: "0 0 25px 5px", scale: 1 },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length < 3) return null;
  const order = [top3[1], top3[0], top3[2]];
  const medalOrder = [1, 0, 2];

  return (
    <div className="flex items-end justify-center gap-3 md:gap-6 px-4 py-8">
      {order.map((player, i) => {
        const mi = medalOrder[i];
        const medal = medals[mi];
        const isFirst = mi === 0;
        return (
          <motion.div
            key={player.user_id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="flex flex-col items-center"
            style={{ transform: `scale(${medal.scale})` }}
          >
            <div
              className="relative rounded-2xl p-4 md:p-6 backdrop-blur-xl bg-glass border border-glass-border text-center"
              style={{
                boxShadow: `${medal.shadowSize} ${medal.glowColor}`,
                minWidth: isFirst ? "140px" : "120px",
              }}
            >
              <div className="text-3xl md:text-4xl mb-2">{medal.label}</div>
              <p className="text-sm md:text-base font-bold text-foreground truncate max-w-[120px]">
                {player.user_name}
              </p>
              <p className="text-gold font-black text-xl md:text-2xl mt-1">
                {player.cumulative_runs.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">runs</p>
              <p className="text-xs text-neon mt-1">
                SR: {player.strike_rate.toFixed(1)}
              </p>
            </div>
            <div
              className="mt-2 rounded-md w-full"
              style={{
                height: isFirst ? "60px" : mi === 1 ? "40px" : "28px",
                background: `linear-gradient(to top, ${medal.glowColor}33, transparent)`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
