import { useState } from 'react'
import axios from 'axios'
import StudyCard from '../cards/StudyCard'

export default function StudyTab({ notes, onSaved, user }) {
  const [form, setForm] = useState({ title: '', subject: '', duration: '' })
  const [loading, setLoading] = useState(false)

  const authHeader = () => ({ headers: { Authorization: `Bearer ${user.token}` } })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      await axios.post('/api/notes', {
        ...form,
        noteType: 'study',
      }, authHeader())
      setForm({ title: '', subject: '', duration: '' })
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

  return (
    <div>
      <form onSubmit={handleSubmit} className="note-form">
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Topic / Chapter"
          className="form-input"
          required
        />
        <input
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
          placeholder="Subject (e.g. React)"
          className="form-input"
        />
        <input
          type="number"
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
          placeholder="Duration (hours)"
          className="form-input"
          style={{ maxWidth: '160px' }}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : '+ Log Session'}
        </button>
      </form>

      {notes.length === 0 && (
        <p className="empty-state">No study sessions yet. Log one above!</p>
      )}

      {notes.length > 0 && (
        <>
          <p className="section-label">Recent Sessions ({notes.length})</p>
          <div className="cards-grid">
            {notes.map(n => (
              <StudyCard
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