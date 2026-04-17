const EXTERNAL_URL = "https://biubpdtjgekkwzglmeie.supabase.co";
const EXTERNAL_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdWJwZHRqZ2Vra3d6Z2xtZWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjg0MjYsImV4cCI6MjA5MTkwNDQyNn0.98Pvt921DG7FkvD-4d1f01Tgk11Po7kpqILbi_p7jE0";

export interface LatestPlayer {
  date: string;
  rank: number;
  user_id: string;
  user_name: string;
  cumulative_runs: number;
  strike_rate: number;
  delta: number;
}

export interface DailyEntry {
  date: string;
  user_id: string;
  user_name: string;
  cumulative_runs: number;
  cumulative_bonus_runs: number;
  strike_rate: number;
  rank: number;
  prev_rank: number;
  delta: number;
}

async function query<T>(table: string, params: string = ""): Promise<T[]> {
  const url = `${EXTERNAL_URL}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    headers: {
      apikey: EXTERNAL_ANON_KEY,
      Authorization: `Bearer ${EXTERNAL_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${table}`);
  return res.json();
}

export async function fetchLatestLeaderboard(): Promise<LatestPlayer[]> {
  return query<LatestPlayer>("latest_leaderboard", "order=rank.asc");
}

export async function fetchDailyByUserId(userId: string): Promise<DailyEntry[]> {
  return query<DailyEntry>(
    "daily_leaderboard",
    `user_id=eq.${encodeURIComponent(userId)}&order=date.asc`
  );
}

export async function fetchDailyByUserIds(userIds: string[]): Promise<DailyEntry[]> {
  if (userIds.length === 0) return [];
  const ids = userIds.map((id) => `"${id}"`).join(",");
  return query<DailyEntry>(
    "daily_leaderboard",
    `user_id=in.(${encodeURIComponent(ids)})&order=date.asc`
  );
}
