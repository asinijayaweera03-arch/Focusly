import { useEffect, useState } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function Analytics({ user }) {
  const [focusData, setFocusData] = useState([])
  const [taskData, setTaskData]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user.token}` }
    const base = import.meta.env.VITE_API_URL || ''

    Promise.all([
      fetch(`${base}/api/stats/weekly`, { headers }).then(r => r.json()),
      fetch(`${base}/api/stats/tasks-per-day`, { headers }).then(r => r.json())
    ])
      .then(([focus, tasks]) => {
        const fmt = iso => new Date(iso).toLocaleDateString('en', { weekday: 'short' })
        setFocusData(focus.map(d => ({ ...d, date: fmt(d.date) })))
        setTaskData(tasks.map(d => ({ ...d, date: fmt(d.date) })))
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load analytics')
        setLoading(false)
      })
  }, [user])

  if (loading) return <div className="analytics-loading">Loading analytics…</div>
  if (error)   return <div className="analytics-error">{error}</div>

  const totalMinutes = focusData.reduce((sum, d) => sum + d.minutes, 0)
  const totalTasks   = taskData.reduce((sum, d) => sum + d.count, 0)

  const formatTime = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="analytics">
     <div className="analytics-summary">
      <div className="summary-pill">
         <span className="summary-value">{formatTime(totalMinutes)}</span>
         <span className="summary-label">focused this week</span>
      </div>
        <div className="summary-pill">
          <span className="summary-value">{totalTasks}</span>
          <span className="summary-label">tasks completed</span>
       </div>
    </div>

      <section className="chart-card">
        <h3>Weekly focus time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={focusData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}/>
            <YAxis unit="m" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}/>
            <Tooltip
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8 }}
              formatter={v => [`${v} min`, 'Focus']}
            />
            <Area type="monotone" dataKey="minutes" stroke="var(--accent)" strokeWidth={2} fill="url(#focusGrad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-card">
        <h3>Tasks completed per day</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={taskData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}/>
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}/>
            <Tooltip
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8 }}
              formatter={v => [v, 'Tasks']}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
