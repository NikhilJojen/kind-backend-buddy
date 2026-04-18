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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-glass-border shadow-[0_4px_20px_-8px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center justify-start shrink-0">
          <img
            src="/images/logo.png"
            alt="Academy Logo"
            className="h-7 sm:h-9 md:h-10 w-auto object-contain"
          />
        </div>

        <div className="flex-1 flex items-center justify-center min-w-0 px-1">
          <img
            src="/images/aipl-logo.svg"
            alt="AI Premier League"
            className="h-9 sm:h-12 md:h-14 w-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] object-contain"
          />
        </div>

        <div className="text-right shrink-0">
          <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground leading-tight">
            Last Updated
          </p>
          <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-foreground leading-tight">
            {formatted}
          </p>
        </div>
      </div>
    </header>
  );
}
