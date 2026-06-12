import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NotesContextProvider } from './context/NotesContext';
import { AuthContextProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <NotesContextProvider>
          <App />
        </NotesContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
