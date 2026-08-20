import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  getDailyScanUsage,
  releaseDailyScan,
  reserveDailyScan,
} from "@/services/scanService";

export const DAILY_SCAN_LIMIT = 5;

export default function useDailyScanLimit() {
  const { user } = useAuth();

  const [remainingScans, setRemainingScans] = useState(DAILY_SCAN_LIMIT);

  const [loading, setLoading] = useState(true);

  const loadUsage = useCallback(async () => {
    if (!user) {
      setRemainingScans(DAILY_SCAN_LIMIT);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const usage = await getDailyScanUsage(user.uid);

      setRemainingScans(usage.remaining);
    } catch (error) {
      console.error("Failed to load daily scan usage:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  const reserveScan = useCallback(async () => {
    if (!user) {
      return {
        allowed: false,
        used: 0,
        remaining: 0,
      };
    }

    const usage = await reserveDailyScan(user.uid);

    if (usage.allowed) {
      setRemainingScans(usage.remaining);
    }

    return usage;
  }, [user]);

  const releaseScan = useCallback(async () => {
    if (!user) return;

    try {
      await releaseDailyScan(user.uid);

      await loadUsage();
    } catch (error) {
      console.error("Failed to release daily scan:", error);
    }
  }, [user, loadUsage]);

  return {
    remainingScans,
    limit: DAILY_SCAN_LIMIT,
    loading,
    canScan: remainingScans > 0,
    reserveScan,
    releaseScan,
    refreshUsage: loadUsage,
  };
}
