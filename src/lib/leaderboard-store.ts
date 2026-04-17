import { useState, useEffect } from "react";
import {
  fetchLatestLeaderboard,
  fetchDailyByUserId,
  type LatestPlayer,
  type DailyEntry,
} from "./external-supabase";

let cachedData: LatestPlayer[] | null = null;
const dailyCache = new Map<string, DailyEntry[]>();

export function useLeaderboardData() {
  const [fullData, setFullData] = useState<LatestPlayer[]>(cachedData ?? []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedData) return;
    setLoading(true);
    fetchLatestLeaderboard()
      .then((data) => {
        cachedData = data;
        setFullData(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const top50 = fullData.slice(0, 50);
  const lastUpdated = fullData.length > 0 ? fullData[0].date : "";

  return { fullData, top50, lastUpdated, loading, error };
}

export function usePlayerDaily(userId: string | null) {
  const [data, setData] = useState<DailyEntry[]>(
    userId && dailyCache.has(userId) ? dailyCache.get(userId)! : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setData([]); return; }
    if (dailyCache.has(userId)) {
      setData(dailyCache.get(userId)!);
      return;
    }
    setLoading(true);
    fetchDailyByUserId(userId)
      .then((d) => {
        dailyCache.set(userId, d);
        setData(d);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading };
}
