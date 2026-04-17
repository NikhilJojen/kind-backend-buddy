import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    title: "🏏 Scoring Rules",
    points: [
      "Users earn runs through daily activity on the platform.",
      "Sessions, quizzes, and tasks contribute to cumulative_runs.",
      "Additional bonus runs may be awarded based on performance or special activities.",
      "Total score = cumulative_runs + bonus contributions (if applicable).",
    ],
  },
  {
    title: "⚡ Strike Rate",
    points: [
      "Strike Rate represents efficiency of scoring.",
      "It reflects how effectively users earn runs relative to activity.",
      "Higher strike rate indicates better performance.",
    ],
  },
  {
    title: "🏆 Ranking Logic",
    points: [
      "Users are ranked based on cumulative_runs (highest first).",
      "Rank 1 = highest total runs.",
      "If two users have the same runs, strike_rate can be used as a secondary tie-breaker (if applicable).",
    ],
  },
  {
    title: "🔄 Daily Updates",
    points: [
      "Leaderboard updates daily based on latest activity.",
      "Rankings may change depending on performance and consistency.",
    ],
  },
];

export function FAQ() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4">
      <h2
        className="text-base sm:text-lg md:text-xl font-bold text-gold mb-3 uppercase tracking-wide"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        How Scoring & Ranking Works
      </h2>
      <div className="rounded-xl border border-glass-border backdrop-blur-xl bg-glass shadow-[0_0_30px_-10px_var(--gold-glow)] overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((s, i) => (
            <AccordionItem
              key={s.title}
              value={`item-${i}`}
              className="border-b border-glass-border/60 last:border-b-0 px-4"
            >
              <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:text-gold hover:no-underline">
                {s.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="space-y-2 pl-1">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-gold mt-0.5">›</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
