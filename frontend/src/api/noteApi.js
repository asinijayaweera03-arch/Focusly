const BASE = '/api/notes';

export const getNotes = async () => {
  const res = await fetch(BASE);
  return res.json();
};

export const createNote = async (data) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteNote = async (id) => {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
};

export const logFocusTime = async (noteId, minutes) => {
  const res = await fetch(`${BASE}/${noteId}/focus`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes }),
  });
  return res.json();
};