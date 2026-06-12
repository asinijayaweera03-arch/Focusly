import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useGoogleAuth = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const googleLogin = async (credential) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      })

      const json = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        setError(json.error)
      } else {
        localStorage.setItem('user', JSON.stringify(json))
        dispatch({ type: 'LOGIN', payload: json })
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
    }
  }

  return { googleLogin, isLoading, error }
}
