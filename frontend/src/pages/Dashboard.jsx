import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import TabNav from '../components/TabNav';
import TodoTab from '../components/tabs/TodoTab';
import StudyTab from '../components/tabs/StudyTab';
import WeeklyLogTab from '../components/tabs/WeeklyLogTab';
import TomorrowTab from '../components/tabs/TomorrowTab';
import StatsBar from '../components/StatsBar';
import Analytics from '../components/Analytics';
import StudyAssistant from '../components/StudyAssistant';

import { useGamification } from '../hooks/useGamification';
import XPBar from '../components/XPBar';
import StreakBadge from '../components/StreakBadge';
import LevelUpToast from '../components/LevelUpToast';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('todo');
  const [notes, setNotes] = useState([]);
  const { user } = useAuthContext();
  const [levelUpTo, setLevelUpTo] = useState(null);

  const handleLevelUp = useCallback((newLevel) => {
    setLevelUpTo(newLevel);
  }, []);

  const {
    xp,
    level,
    streakCurrent,
    streakLongest,
    badges,
    totalTasksDone,
    totalFocusMins,
    progress,
    xpInLevel,
    refresh: refreshGamification
  } = useGamification(handleLevelUp);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const handleSaved = () => {
    fetchNotes();
    refreshGamification();
  };

  const byType = (type) => notes.filter(n => n.noteType === type);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Focusly 🎯</h1>
        <StreakBadge streakCurrent={streakCurrent} streakLongest={streakLongest} />
      </div>

      <XPBar level={level} xp={xp} progress={progress} xpInLevel={xpInLevel} />

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <StatsBar notes={notes} level={level} xpInLevel={xpInLevel} />

      <div className="tab-content">
        {activeTab === 'todo'     && (<TodoTab     notes={byType('todo')}    onSaved={handleSaved} user={user} onViewStats={() => setActiveTab('analytics')} />)}
        {activeTab === 'study'    && (<StudyTab    notes={byType('study')}   onSaved={handleSaved} user={user} />)}
        {activeTab === 'weekly'   && (<WeeklyLogTab notes={notes.filter(n => n.noteType === 'todo' && n.completed)} />)}
        {activeTab === 'tomorrow' && (<TomorrowTab  notes={byType('tomorrow')} onSaved={handleSaved} user={user} />)}
        {activeTab === 'analytics' && (
          <Analytics 
            user={user} 
            xp={xp}
            level={level}
            badges={badges}
            streakCurrent={streakCurrent}
            totalTasksDone={totalTasksDone}
            totalFocusMins={totalFocusMins}
          />
        )}
        {activeTab === 'aiAssistant' && (<StudyAssistant />)}
      </div>

      <LevelUpToast level={levelUpTo} onClose={() => setLevelUpTo(null)} />
    </div>
  );
}