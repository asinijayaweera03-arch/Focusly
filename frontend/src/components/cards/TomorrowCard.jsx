export default function TomorrowCard({ note, onDelete, onMoveTodo }) {
  const priorityStyles = {
    high:   { badge: 'badge-red',    dot: '#E24B4A', label: 'High' },
    medium: { badge: 'badge-amber',  dot: '#EF9F27', label: 'Medium' },
    low:    { badge: 'badge-green',  dot: '#639922', label: 'Low' },
  }

  const style = priorityStyles[note.priority] || priorityStyles.medium

  return (
    <div className="card tomorrow-card">
      <div className="priority-row">
        <span className="priority-dot" style={{ background: style.dot }}></span>
        <span className={`card-badge ${style.badge}`}>{style.label}</span>
      </div>
      <h3 className="card-title">{note.title}</h3>
      <p className="card-meta">🌅 Planned for tomorrow</p>
      <div className="card-actions">
        <button className="btn-move" onClick={onMoveTodo}> → To-Do</button>
        <button className="btn-delete" onClick={onDelete}>🗑</button>
      </div>
    </div>
  )
}