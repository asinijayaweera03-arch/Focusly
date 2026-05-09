import WeeklyCard from '../cards/WeeklyCard'

export default function WeeklyLogTab({ notes }) {

  const getStartOfWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.setDate(diff))
  }

  const thisWeek = notes.filter(n => {
    if (!n.completedAt) return false
    return new Date(n.completedAt) >= getStartOfWeek()
  })

  return (
    <div>
      <div className="weekly-header">
        <p className="section-label">
          Week of {getStartOfWeek().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </p>
        <span className="streak">✅ {thisWeek.length} tasks completed</span>
      </div>

      {thisWeek.length === 0 && (
        <p className="empty-state">
          No completed tasks this week yet. <br />
          Complete a To-Do task and it will appear here automatically!
        </p>
      )}

      {thisWeek.length > 0 && (
        <div className="cards-grid">
          {thisWeek.map(n => (
            <WeeklyCard key={n._id} note={n} />
          ))}
        </div>
      )}
    </div>
  )
}