export default function StudyCard({ note, onDelete }) {
  return (
    <div className="card study-card">
      <span className="card-badge badge-blue">{note.subject || 'General'}</span>
      <h3 className="card-title">{note.title}</h3>
      <p className="card-meta">{note.duration? note.duration >= 60? `${Math.floor(note.duration / 60)}h ${note.duration % 60}m`: `${note.duration} hours`
: 'No duration set'}
</p>
      <p className="card-meta">📅 {new Date(note.createdAt).toLocaleDateString()}</p>
      <div className="card-actions">
        <button className="btn-delete" onClick={onDelete}>🗑</button>
      </div>
    </div>
  )
}