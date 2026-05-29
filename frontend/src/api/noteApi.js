const BASE = `${import.meta.env.VITE_API_URL}/api/notes`;

export const getNotes = async (token) => {
  const res = await fetch(BASE, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const createNote = async (data, token) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteNote = async (id, token) => {
  await fetch(`${BASE}/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const logFocusTime = async (noteId, minutes, token) => {
  const res = await fetch(`${BASE}/${noteId}/focus`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ minutes }),
  });
  return res.json();
};