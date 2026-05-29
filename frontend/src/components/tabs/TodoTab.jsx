import { useState } from 'react';
import axios from 'axios';
import TodoCard from '../cards/TodoCard';
import PomodoroModal from '../PomodoroModal';

export default function TodoTab({ notes, onSaved, user, onViewStats }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerTask, setTimerTask] = useState(null);

  const authHeader = () => ({ headers: { Authorization: `Bearer ${user.token}` } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, {
        title,
        noteType: 'todo',
        completed: false,
      }, authHeader());
      setTitle('');
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (note) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${note._id}`, {
        completed: !note.completed,
        completedAt: !note.completed ? new Date() : null,
      }, authHeader());
      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, authHeader());
      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  const pending   = notes.filter(n => !n.completed);
  const completed = notes.filter(n =>  n.completed);

  return (
    <div>
      <form onSubmit={handleSubmit} className="note-form">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="form-input"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Task'}
        </button>
      </form>

      {pending.length === 0 && completed.length === 0 && (
        <p className="empty-state">No tasks yet. Add one above!</p>
      )}

      {pending.length > 0 && (
        <>
          <p className="section-label">Pending ({pending.length})</p>
          <div className="cards-grid">
            {pending.map(n => (
              <TodoCard
                key={n._id}
                note={n}
                              onToggle={() => handleToggle(n)}
                            onDelete={() => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this task?"
                );

                if (confirmDelete) {
                  handleDelete(n._id);
                }
              }}
                onStartTimer={() => setTimerTask(n)}
              />
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: '1.5rem' }}>
            Completed ({completed.length})
          </p>
          <div className="cards-grid">
            {completed.map(n => (
              <TodoCard
                key={n._id}
                note={n}
                onToggle={() => handleToggle(n)}
                onDelete={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this task?"
                  );

                  if (confirmDelete) {
                    handleDelete(n._id);
                  }
                }}
                onStartTimer={() => setTimerTask(n)}
              />
            ))}
          </div>
        </>
      )}

      {timerTask && (
        <PomodoroModal
          task={timerTask}
          onClose={() => setTimerTask(null)}
          onSaved={onSaved}
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
}