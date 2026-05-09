import { useState } from 'react'
import axios from 'axios'
import TomorrowCard from '../cards/TomorrowCard'

export default function TomorrowTab({ notes, onSaved, user }) {
  const [form, setForm] = useState({ title: '', priority: 'medium' })
  const [loading, setLoading] = useState(false)

  const authHeader = () => ({ headers: { Authorization: `Bearer ${user.token}` } })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      await axios.post('/api/notes', {
        ...form,
        noteType: 'tomorrow',
      }, authHeader())
      setForm({ title: '', priority: 'medium' })
      onSaved()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`, authHeader())
      onSaved()
    } catch (err) {
      console.error(err)
    }
  }

  const sorted = [...notes].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div>
      <form onSubmit={handleSubmit} className="note-form">
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="What do you want to do tomorrow?"
          className="form-input"
          required
        />
        <select
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
          className="form-input"
          style={{ maxWidth: '160px' }}
        >
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Plan'}
        </button>
      </form>

      {notes.length === 0 && (
        <p className="empty-state">No plans yet. Add what you want to do tomorrow!</p>
      )}

      {sorted.length > 0 && (
        <>
          <p className="section-label">Tomorrow's Plan ({sorted.length})</p>
          <div className="cards-grid">
            {sorted.map(n => (
              <TomorrowCard
                key={n._id}
                note={n}
                onDelete={() => handleDelete(n._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}