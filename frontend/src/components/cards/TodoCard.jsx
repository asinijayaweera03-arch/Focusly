export default function TodoCard({ note, onToggle, onDelete }) {
  return (
    <div className={`card todo-card ${note.completed ? 'card-done' : ''}`}>
      <h3 className={`card-title ${note.completed ? 'text-done' : ''}`}>
        {note.title}
      </h3>
      <p className="card-meta">
        {note.completed ? '✅ Completed' : '🕐 Pending'}
      </p>
      <div className="card-actions">
        <button
          className={note.completed ? 'btn-undo' : 'btn-done'}
          onClick={onToggle}
        >
          {note.completed ? 'Undo' : '✓ Done'}
        </button>
        <button className="btn-delete" onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}