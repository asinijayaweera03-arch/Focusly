import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import TabNav from '../components/TabNav';
import TodoTab from '../components/tabs/TodoTab';
import StudyTab from '../components/tabs/StudyTab';
import WeeklyLogTab from '../components/tabs/WeeklyLogTab';
import TomorrowTab from '../components/tabs/TomorrowTab';
import StatsBar from '../components/StatsBar';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('todo');
  const [notes, setNotes] = useState([]);
  const { user } = useAuthContext();

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes', {
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

  const byType = (type) => notes.filter(n => n.noteType === type);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Focusly 🎯</h1>
        <span className="streak">🔥 Keep going!</span>
      </div>

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

       <StatsBar notes={notes} />

      <div className="tab-content">
        {activeTab === 'todo'     && (<TodoTab     notes={byType('todo')}    onSaved={fetchNotes} user={user} />)}
        {activeTab === 'study'    && (<StudyTab    notes={byType('study')}   onSaved={fetchNotes} user={user} />)}
        {activeTab === 'weekly'   && (<WeeklyLogTab notes={notes.filter(n => n.noteType === 'todo' && n.completed)} />)}
        {activeTab === 'tomorrow' && (<TomorrowTab  notes={byType('tomorrow')} onSaved={fetchNotes} user={user} />)}
      </div>
    </div>
  );
}