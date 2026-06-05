import React, { useEffect, useState } from 'react';

const XPBar = ({ level, xp, progress, xpInLevel }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (xp > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [xp]);

  return (
    <div className="xp-container glassmorphic">
      <div className="xp-header">
        <span className="xp-level-badge">
          <span className="xp-star">⚡</span> Level {level}
        </span>
        <span className="xp-fraction">
          <strong>{xpInLevel}</strong> / 100 XP
        </span>
      </div>
      <div className="xp-progress-track">
        <div 
          className={`xp-progress-fill ${pulse ? 'pulse-anim' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="xp-footer">
        <span>{100 - xpInLevel} XP to Level {level + 1}</span>
        <span>Total XP: {xp}</span>
      </div>
    </div>
  );
};

export default XPBar;
