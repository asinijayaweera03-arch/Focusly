import React from 'react';

const StreakBadge = ({ streakCurrent, streakLongest }) => {
  const isHot = streakCurrent >= 7;

  return (
    <div className={`streak-badge-container ${isHot ? 'hot-streak' : ''}`} title={`Longest Streak: ${streakLongest || 0} days`}>
      <span className={`streak-flame ${isHot ? 'flame-animated' : ''}`}>🔥</span>
      <span className="streak-count">{streakCurrent || 0} day{streakCurrent !== 1 ? 's' : ''}</span>
      <span className="streak-tooltip">Longest Streak: {streakLongest || 0} days</span>
    </div>
  );
};

export default StreakBadge;
