export default function TodoCard({ note, onToggle, onDelete, onStartTimer }) {
  return (
    <div
      className={`card todo-card ${note.completed ? 'card-done' : ''}`}
      onClick={onStartTimer}
      style={{ cursor: 'pointer' }}
    >
      <h3 className={`card-title ${note.completed ? 'text-done' : ''}`}>
        {note.title}
      </h3>
      <p className="card-meta">
        {note.completed ? '✅ Completed' : '🕐 Pending'}
      </p>
      {note.totalFocusedMinutes > 0 && (
        <p className="card-meta">⏱ {note.totalFocusedMinutes} min focused</p>
      )}
      <div className="card-actions">
        <button
          className={note.completed ? 'btn-undo' : 'btn-done'}
          onClick={e => { e.stopPropagation(); onToggle(); }}
        >
          {note.completed ? 'Undo' : '✓ Done'}
        </button>
        <button
          className="btn-delete"
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}