import { useEffect, useState } from 'react';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';
import { useNotifications } from '../hooks/useNotifications';
import { logFocusTime } from '../api/noteApi';  // you'll add this below

import { useAuthContext } from '../hooks/useAuthContext';

const RADIUS = 90;
const CIRC   = 2 * Math.PI * RADIUS;

export default function PomodoroModal({ task, onClose, onSaved, onViewStats }) {
  const timer = usePomodoroTimer();
  const { requestPermission, notify } = useNotifications();
  const { user } = useAuthContext();
  const [banner, setBanner] = useState(false);

  // Ask for notification permission when modal opens
  useEffect(() => { requestPermission(); }, []);

  // When timer finishes — ring turns green, show banner, fire bell+OS notif, log to DB
  useEffect(() => {
    if (!timer.done || !user) return;
    setBanner(true);
    notify(task.title);
    logFocusTime(task._id, timer.minutesLogged, user.token).then(() => {
      if (onSaved) onSaved();
    });
  }, [timer.done, user]);

  const fmt = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const display = timer.mode === 'free'
    ? fmt(timer.elapsed)
    : fmt(timer.secondsLeft);

  const strokeColor = timer.done ? '#22c55e' : '#a855f7';  // green : purple
  const dashOffset  = CIRC * (1 - timer.progress);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pomodoro-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="pm-header">
          <span className="pm-task-title">{task.title}</span>
          <button className="pm-close" onClick={onClose}>✕</button>
        </div>

        {/* Mode selector */}
        <div className="pm-modes">
          {['20', '30', '45', 'free'].map(m => (
            <button
              key={m}
              className={`pm-mode-btn ${timer.mode === m ? 'active' : ''}`}
              onClick={() => timer.selectMode(m)}
            >
              {m === 'free' ? '∞ Free' : `${m} min`}
            </button>
          ))}
        </div>

        {/* SVG Ring */}
        <div className="pm-ring-wrap">
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Track */}
            <circle cx="110" cy="110" r={RADIUS}
              fill="none" stroke="#e2d9f3" strokeWidth="12"/>
            {/* Progress ring */}
            <circle cx="110" cy="110" r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
            {/* Time display */}
            <text x="110" y="105" textAnchor="middle"
              fontSize="36" fontWeight="600"
              fill={timer.done ? '#22c55e' : '#a855f7'}>
              {display}
            </text>
            <text x="110" y="132" textAnchor="middle"
              fontSize="13" fill="#9ca3af">
              {timer.done ? 'Done!' : timer.running ? 'focusing' : 'paused'}
            </text>
          </svg>
        </div>

        {/* Finish button — only shown in free mode while running or paused */}
        {timer.mode === 'free' && !timer.done && (
          <button
            className="pm-finish-btn"
            onClick={() => timer.finish()}
          >
            ✅ Finish Session
          </button>
        )}

        {/* Play / Pause */}
        <button
          className="pm-play-btn"
          onClick={() => timer.setRunning(r => !r)}
          disabled={timer.done}
        >
          {timer.running ? '⏸ Pause' : '▶ Start'}
        </button>

        {/* Session dots */}
        <div className="pm-dots">
          {[0,1,2,3].map(i => (
            <div key={i}
              className={`pm-dot ${i < timer.sessions ? 'filled' : ''}`}/>
          ))}
        </div>

        {/* In-app banner */}
       {banner && (
    <div className="pm-banner">
    🎉 Session complete! {timer.minutesLogged} min logged.
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => { onClose(); onViewStats?.(); }}>
        📊 View Stats
      </button>
      <button onClick={() => setBanner(false)}>✕</button>
    </div>
  </div>
        )}
      </div>
    </div>
  );
}