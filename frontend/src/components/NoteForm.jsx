import { useState } from "react"
import { useNotesContext } from "../hooks/useNotesContext"

const NoteForm = () => {
  const { dispatch } = useNotesContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const note = { title, content, subject }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields || [])
    }
    if (response.ok) {
      setTitle('')
      setContent('')
      setSubject('')
      setError(null)
      setEmptyFields([])
      console.log('new note added', json)
      dispatch({ type: 'CREATE_NOTE', payload: json })
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Note</h3>

      <label>Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Content:</label>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className={emptyFields.includes('content') ? 'error' : ''}
        rows="4"
      />

      <label>Subject:</label>
      <input
        type="text"
        onChange={(e) => setSubject(e.target.value)}
        value={subject}
        className={emptyFields.includes('subject') ? 'error' : ''}
      />

      <button>Add Note</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default NoteForm