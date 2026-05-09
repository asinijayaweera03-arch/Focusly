import { useNotesContext } from "../hooks/useNotesContext"
import { useAuthContext } from "../hooks/useAuthContext"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const NoteDetails = ({ note }) => {
  const { dispatch } = useNotesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) return

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/` + note._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_NOTE', payload: json })
    }
  }

  return (
    <div className="workout-details">
      <h4>{note.title}</h4>
      <p><strong>Content:</strong>{note.content}</p>
      <p><strong>Subject: </strong>{note.subject}</p>
      <p>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete </span>
    </div>
  )
}

export default NoteDetails
