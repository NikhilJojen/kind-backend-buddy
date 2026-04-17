import { motion } from "framer-motion";
import type { LatestPlayer } from "@/lib/external-supabase";

interface PodiumProps {
  top3: LatestPlayer[];
}

const medals = [
  { label: "🥇", glowColor: "var(--gold)", shadowSize: "0 0 50px 12px" },
  { label: "🥈", glowColor: "var(--silver)", shadowSize: "0 0 35px 8px" },
  { label: "🥉", glowColor: "var(--bronze)", shadowSize: "0 0 30px 7px" },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length < 3) return null;
  const order = [top3[1], top3[0], top3[2]];
  const medalOrder = [1, 0, 2];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 px-3 sm:px-4 py-6 sm:py-8 overflow-hidden">
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
            className="flex flex-col items-center flex-1 min-w-0 max-w-[180px]"
          >
            <div
              className={[
                "relative rounded-2xl backdrop-blur-xl bg-glass border border-glass-border text-center w-full",
                isFirst ? "p-4 sm:p-6 md:p-7" : "p-3 sm:p-4 md:p-5",
              ].join(" ")}
              style={{
                boxShadow: `${medal.shadowSize} ${medal.glowColor}`,
                transform: isFirst ? "scale(1.1)" : "scale(1)",
              }}
            >
              <div className={isFirst ? "text-4xl sm:text-5xl md:text-6xl mb-2" : "text-3xl sm:text-4xl md:text-5xl mb-2"}>
                {medal.label}
              </div>
              <p className={[
                "font-bold text-foreground truncate",
                isFirst ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm md:text-base",
              ].join(" ")}>
                {player.user_name}
              </p>
              <p className={[
                "text-gold font-black mt-1",
                isFirst ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl md:text-2xl",
              ].join(" ")}>
                {player.cumulative_runs.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">runs</p>
              <p className="text-[10px] sm:text-xs text-neon mt-1">
                SR: {player.strike_rate.toFixed(1)}
              </p>
            </div>
            <div
              className="mt-2 rounded-md w-full"
              style={{
                height: isFirst ? "70px" : mi === 1 ? "48px" : "32px",
                background: `linear-gradient(to top, ${medal.glowColor}40, transparent)`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
