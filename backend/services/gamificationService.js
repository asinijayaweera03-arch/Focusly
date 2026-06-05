const BADGES = {
  streak_3:   { name: 'Streak Starter', icon: '🔥', desc: '3-day streak', check: u => u.streakCurrent >= 3 },
  streak_7:   { name: 'Streak Master',  icon: '🔥', desc: '7-day streak', check: u => u.streakCurrent >= 7 },
  streak_30:  { name: 'Streak Legend',  icon: '🔥', desc: '30-day streak', check: u => u.streakCurrent >= 30 },
  focus_500:  { name: 'Focus Master',   icon: '🧠', desc: '500 min focused', check: u => u.totalFocusMins >= 500 },
  tasks_50:   { name: 'Task Machine',   icon: '⚡', desc: '50 tasks done', check: u => u.totalTasksDone >= 50 },
  level_10:   { name: 'Level 10',       icon: '🏆', desc: 'Reach level 10', check: u => u.level >= 10 },
};

const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function awardXP(user, amount) {
  user.xp = (user.xp || 0) + amount;
  const newLevel = Math.floor(user.xp / 100) + 1;
  user.level = newLevel;
}

function updateStreak(user) {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (user.lastActiveDate === today) {
    // Already active today, streak is safe and already updated.
    return;
  }

  // First activity of the day -> award daily streak bonus (+5 XP)
  awardXP(user, 5);

  if (user.lastActiveDate === yesterday) {
    user.streakCurrent = (user.streakCurrent || 0) + 1;
  } else {
    user.streakCurrent = 1;
  }

  user.lastActiveDate = today;

  if (user.streakCurrent > (user.streakLongest || 0)) {
    user.streakLongest = user.streakCurrent;
  }
}

function checkBadges(user) {
  const newBadges = [];
  for (const [id, badge] of Object.entries(BADGES)) {
    if (!user.badges.includes(id) && badge.check(user)) {
      user.badges.push(id);
      newBadges.push(id);
    }
  }
  return newBadges;
}

async function processTaskComplete(user) {
  awardXP(user, 10);
  user.totalTasksDone = (user.totalTasksDone || 0) + 1;
  updateStreak(user);
  const newBadges = checkBadges(user);
  await user.save();
  return { xp: user.xp, level: user.level, streakCurrent: user.streakCurrent, badges: user.badges, newBadges };
}

async function processPomodoroComplete(user, mins) {
  awardXP(user, 25);
  user.totalFocusMins = (user.totalFocusMins || 0) + mins;
  updateStreak(user);
  const newBadges = checkBadges(user);
  await user.save();
  return { xp: user.xp, level: user.level, streakCurrent: user.streakCurrent, badges: user.badges, newBadges };
}

async function processStudyLog(user, mins) {
  awardXP(user, 15);
  user.totalFocusMins = (user.totalFocusMins || 0) + mins;
  updateStreak(user);
  const newBadges = checkBadges(user);
  await user.save();
  return { xp: user.xp, level: user.level, streakCurrent: user.streakCurrent, badges: user.badges, newBadges };
}

module.exports = {
  BADGES,
  awardXP,
  updateStreak,
  checkBadges,
  processTaskComplete,
  processPomodoroComplete,
  processStudyLog
};
