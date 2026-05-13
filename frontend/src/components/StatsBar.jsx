export default function StatsBar({ notes }) {
  const totalMins = notes.reduce((acc, n) => acc + (n.totalFocusedMinutes || 0), 0);
  const sessions  = Math.floor(totalMins / 25);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">{totalMins}</span>
        <span className="stat-label">mins focused</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">{sessions}</span>
        <span className="stat-label">sessions</span>
      </div>
    </div>
  );
}