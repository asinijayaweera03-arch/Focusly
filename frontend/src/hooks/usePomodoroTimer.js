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
  const [sessions, setSessions] = useState(0);
  const intervalRef             = useRef(null);

  // Keep track of time reliably even if browser throttles intervals
  const startTimeRef = useRef(null);
  const expectedEndTimeRef = useRef(null);
  
  // Refs to access current state inside callbacks without causing re-renders
  const elapsedRef = useRef(elapsed);
  const secondsLeftRef = useRef(secondsLeft);
  
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);
  useEffect(() => { secondsLeftRef.current = secondsLeft; }, [secondsLeft]);

  const finish = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(true);
    setSessions(s => Math.min(s + 1, 4));

    startTimeRef.current = null;
    expectedEndTimeRef.current = null;

    const currElapsed = elapsedRef.current;
    const currSecsLeft = secondsLeftRef.current;

    const minutesLogged = mode === 'free'
      ? Math.ceil(currElapsed / 60)
      : Math.ceil((MODES[mode] - currSecsLeft) / 60);

    if (minutesLogged > 0) {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const base = import.meta.env.VITE_API_URL || ''
      fetch(`${base}/api/stats/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          duration: minutesLogged,
          subject: 'general',
          label: ''
        })
      }).catch(err => console.error('Failed to save session:', err));
    }
  }, [mode]);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = Date.now();
    
    if (mode === 'free') {
      const newElapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsed(newElapsed);
    } else {
      const newSecsLeft = Math.max(0, Math.ceil((expectedEndTimeRef.current - now) / 1000));
      setSec(newSecsLeft);
      if (newSecsLeft <= 0) {
        finish();
      }
    }
  }, [mode, finish]);

  useEffect(() => {
    if (running) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - (elapsedRef.current * 1000);
      }
      if (mode !== 'free' && !expectedEndTimeRef.current) {
         expectedEndTimeRef.current = Date.now() + (secondsLeftRef.current * 1000);
      }
      intervalRef.current = setInterval(tick, 500); // 500ms to be more responsive when waking up
    } else {
      clearInterval(intervalRef.current);
      startTimeRef.current = null;
      expectedEndTimeRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick, mode]);

  const selectMode = (m) => {
    clearInterval(intervalRef.current);
    startTimeRef.current = null;
    expectedEndTimeRef.current = null;
    setMode(m);
    setSec(MODES[m] ?? 0);
    setElapsed(0);
    setRunning(false);
    setDone(false);
  };

  const totalSeconds = MODES[mode] ?? elapsed;
  const progress = mode === 'free'
    ? 1
    : totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  return {
    mode, selectMode,
    secondsLeft, elapsed,
    running, setRunning,
    done, sessions,
    progress,
    minutesLogged: mode === 'free'
      ? Math.floor(elapsed / 60)
      : Math.floor((totalSeconds - secondsLeft) / 60),
    finish,
  };
}