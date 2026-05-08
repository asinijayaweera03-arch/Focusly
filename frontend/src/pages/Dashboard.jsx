import { useState, useEffect } from 'react';
import axios from 'axios';
import TabNav from '../components/TabNav';
import TodoTab from '../components/tabs/TodoTab';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('todo');
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const byType = (type) => notes.filter(n => n.noteType === type);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Focusly 🎯</h1>
        <span className="streak">🔥 7 day streak</span>
      </div>

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === 'todo'     && (<TodoTab notes={byType('todo')} onSaved={fetchNotes} />)}
        {activeTab === 'study'    && <p>Study tab coming soon...</p>}
        {activeTab === 'weekly'   && <p>Weekly log coming soon...</p>}
        {activeTab === 'tomorrow' && <p>Tomorrow tab coming soon...</p>}
      </div>
    </div>
  );
}