export default function WeeklyCard({ note }) {
  return (
    <div className="card weekly-card">
      <span className="card-badge badge-pink">
        ✅ {new Date(note.completedAt).toLocaleDateString('en-US', { weekday: 'long' })}
      </span>
      <h3 className="card-title">{note.title}</h3>
      <p className="card-meta">📅 Completed {new Date(note.completedAt).toLocaleDateString()}</p>
    </div>
  )
}