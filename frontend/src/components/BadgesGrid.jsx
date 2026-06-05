import React from 'react';

const BADGE_DEFS = {
  streak_3:   { name: 'Streak Starter', icon: '🔥', desc: '3-day streak', max: 3, unit: 'days', getVal: u => u.streakCurrent },
  streak_7:   { name: 'Streak Master',  icon: '⚡', desc: '7-day streak', max: 7, unit: 'days', getVal: u => u.streakCurrent },
  streak_30:  { name: 'Streak Legend',  icon: '🏆', desc: '30-day streak', max: 30, unit: 'days', getVal: u => u.streakCurrent },
  focus_500:  { name: 'Focus Master',   icon: '🧠', desc: '500 min focused', max: 500, unit: 'mins', getVal: u => u.totalFocusMins },
  tasks_50:   { name: 'Task Machine',   icon: '🎯', desc: '50 tasks done', max: 50, unit: 'tasks', getVal: u => u.totalTasksDone },
  level_10:   { name: 'Level 10',       icon: '👑', desc: 'Reach level 10', max: 10, unit: 'level', getVal: u => u.level },
};

const BadgesGrid = ({ earnedBadges = [], userStats = {} }) => {
  return (
    <div className="badges-section">
      <h3 className="section-title">🏆 Focusly Achievements</h3>
      <div className="badges-grid">
        {Object.entries(BADGE_DEFS).map(([id, def]) => {
          const isUnlocked = earnedBadges.includes(id);
          const currentVal = def.getVal(userStats) || 0;
          const progressPercent = Math.min(Math.round((currentVal / def.max) * 100), 100);

          return (
            <div 
              key={id} 
              className={`badge-card glassmorphic ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-icon-wrapper">
                <span className="badge-icon">{def.icon}</span>
                {!isUnlocked && <span className="badge-lock-icon">🔒</span>}
              </div>
              <div className="badge-info">
                <h4 className="badge-name">{def.name}</h4>
                <p className="badge-desc">{def.desc}</p>
                
                {!isUnlocked ? (
                  <div className="badge-progress-container">
                    <div className="badge-progress-bar">
                      <div className="badge-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="badge-progress-text">
                      {currentVal}/{def.max} {def.unit}
                    </span>
                  </div>
                ) : (
                  <span className="badge-unlocked-tag">Completed! ✅</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesGrid;
