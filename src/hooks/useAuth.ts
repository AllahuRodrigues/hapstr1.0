'use client'

import { useState, useEffect } from 'react'
import { AuthService, User } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await AuthService.signIn(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      } else {
        setError(result.message)
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await AuthService.signUp(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      } else {
        setError(result.message)
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    AuthService.signOut()
    setUser(null)
    setError(null)
  }

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }
} 