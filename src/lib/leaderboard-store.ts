import { useState, useEffect, useCallback } from "react";
import {
  fetchLatestLeaderboard,
  fetchDailyByUserId,
  type LatestPlayer,
  type DailyEntry,
} from "./external-supabase";

let cachedData: LatestPlayer[] | null = null;

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

  const top100 = fullData.slice(0, 100);
  const lastUpdated = fullData.length > 0 ? fullData[0].date : "";

  return { fullData, top100, lastUpdated, loading, error };
}

export function usePlayerDaily(userId: string | null) {
  const [data, setData] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setData([]); return; }
    setLoading(true);
    fetchDailyByUserId(userId)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading };
}
