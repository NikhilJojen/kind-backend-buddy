import type { LatestPlayer } from "@/lib/external-supabase";

interface HeaderProps {
  lastUpdated: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-glass border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center shrink-0">
          <img
            src="/images/logo.png"
            alt="Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        <div className="text-center flex-1 min-w-0">
          <h1
            className="text-lg md:text-2xl font-black tracking-wider text-gold uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            AI Premier League
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase">
            Leaderboard
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] md:text-xs text-muted-foreground">Last Updated</p>
          <p className="text-xs md:text-sm font-semibold text-foreground">{formatted}</p>
        </div>
      </div>
    </header>
  );
}
