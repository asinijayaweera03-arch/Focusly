const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/userModel');

router.use(requireAuth);

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const xp = user.xp || 0;
    const level = user.level || 1;
    const streakCurrent = user.streakCurrent || 0;
    const streakLongest = user.streakLongest || 0;
    const badges = user.badges || [];
    const totalTasksDone = user.totalTasksDone || 0;
    const totalFocusMins = user.totalFocusMins || 0;

    const prevLevelXP = (level - 1) * 100;
    const nextLevelXP = level * 100;
    const xpInLevel = xp - prevLevelXP;
    const progress = Math.min(Math.max(xpInLevel, 0), 100); // 0-100%

    res.status(200).json({
      xp,
      level,
      streakCurrent,
      streakLongest,
      badges,
      totalTasksDone,
      totalFocusMins,
      prevLevelXP,
      nextLevelXP,
      xpInLevel,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
