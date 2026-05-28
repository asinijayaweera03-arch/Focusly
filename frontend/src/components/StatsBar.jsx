export default function StatsBar({ notes }) {
  const totalMins = notes.reduce((acc, n) => acc + (n.totalFocusedMinutes || 0), 0);
  const sessions  = Math.floor(totalMins / 25);

  const formatTime = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">{formatTime(totalMins)}</span>
        <span className="stat-label">time focused</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value">{sessions}</span>
        <span className="stat-label">sessions</span>
      </div>
    </div>
  );
}