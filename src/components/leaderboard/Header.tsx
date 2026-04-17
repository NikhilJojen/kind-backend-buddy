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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 grid grid-cols-3 items-center gap-2">
        <div className="flex items-center justify-start min-w-0">
          <img
            src="/images/logo.png"
            alt="Academy Logo"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain"
          />
        </div>

        <div className="text-center min-w-0">
          <h1
            className="text-sm sm:text-lg md:text-2xl font-black tracking-wider text-gold uppercase truncate"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            AI Premier League
          </h1>
          <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase">
            Leaderboard
          </p>
        </div>

        <div className="text-right min-w-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Last Updated</p>
          <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-foreground truncate">
            {formatted}
          </p>
        </div>
      </div>
    </header>
  );
}
