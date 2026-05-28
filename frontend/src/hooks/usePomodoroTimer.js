import { useState, useEffect, useRef, useCallback } from 'react';

const MODES = {
  '20': 20 * 60,
  '30': 30 * 60,
  '45': 45 * 60,
  'free': null,   // count-up, no end
};

export function usePomodoroTimer() {
  const [mode, setMode]         = useState('20');
  const [secondsLeft, setSec]   = useState(MODES['20'] ?? 0);
  const [elapsed, setElapsed]   = useState(0);
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);
  const [sessions, setSessions] = useState(0);   // 0-3, fills 4 dots
  const intervalRef             = useRef(null);

  const tick = useCallback(() => {
    if (mode === 'free') {
      setElapsed(e => e + 1);
    } else {
      setSec(s => {
        if (s <= 1) { finish(); return 0; }
        return s - 1;
      });
    }
  }, [mode]);

  const finish = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(true);
    setSessions(s => Math.min(s + 1, 4));

    const minutesLogged = mode === 'free'
    ? Math.floor(elapsed / 60)
    : Math.floor((MODES[mode] - secondsLeft) / 60);  // how far they got

  if (minutesLogged > 0) {   // don't save if they bailed immediately
    const token = localStorage.getItem('token');
    const base = import.meta.env.VITE_API_URL || ''
      fetch(`${base}/api/stats/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        duration: minutesLogged,
        subject: 'general',   // swap in a subject prop later
        label: ''
      })
    }).catch(err => console.error('Failed to save session:', err));
  }
}, [mode, elapsed, secondsLeft]);
 

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const selectMode = (m) => {
    clearInterval(intervalRef.current);
    setMode(m);
    setSec(MODES[m] ?? 0);
    setElapsed(0);
    setRunning(false);
    setDone(false);
  };

  const totalSeconds = MODES[mode] ?? elapsed;
  const progress = mode === 'free'
    ? 1                                      // ring stays full in free mode
    : totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  return {
    mode, selectMode,
    secondsLeft, elapsed,
    running, setRunning,
    done, sessions,
    progress,        // 1→0 as time drains
    minutesLogged: mode === 'free'
      ? Math.floor(elapsed / 60)
      : Math.floor((totalSeconds - secondsLeft) / 60),
    finish,
  };
}