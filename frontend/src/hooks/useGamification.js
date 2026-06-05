import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from './useAuthContext';

export const useGamification = (onLevelUp) => {
  const { user } = useAuthContext();
  const [data, setData] = useState({
    xp: 0,
    level: 1,
    streakCurrent: 0,
    streakLongest: 0,
    badges: [],
    totalTasksDone: 0,
    totalFocusMins: 0,
    prevLevelXP: 0,
    nextLevelXP: 100,
    xpInLevel: 0,
    progress: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevLevelRef = useRef(null);

  const fetchProfile = useCallback(async () => {
    if (!user || !user.token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gamification/profile`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        return;
      }

      if (prevLevelRef.current !== null && json.level > prevLevelRef.current) {
        if (onLevelUp) {
          onLevelUp(json.level);
        }
      }

      prevLevelRef.current = json.level;
      setData(json);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]); // ✅ fetchProfile removed from deps

  return { ...data, isLoading, error, refresh: fetchProfile };
};