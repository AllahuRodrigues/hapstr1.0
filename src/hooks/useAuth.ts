"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs"
import toast from 'react-hot-toast'

/* ---------- Types ---------- */
export interface AuthResult {
  success: boolean
  error?: string
  verificationCode?: string   // demo-only for UI
}

/* ---------- Hook ---------- */
export function useAuth() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  /* demo – simple 6-digit code storage */
  const verificationCodeRef = useRef<string | null>(null)

  /* keep session in sync */
  useEffect(() => {
    const sync = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    sync()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null)
      })

    return () => subscription.unsubscribe()
  }, [supabase])

  /* ---------- helpers ---------- */
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true)
    try {
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      toast.success('Signed in successfully!')
      return { success: true }
    } catch (err: any) {
      const message = err.message || 'Failed to sign in'
      toast.error(message)
      return { success: false, error: message }
    } finally {
    setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string): Promise<AuthResult> => {
    setLoading(true)
    try {
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
      if (err) throw err

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    verificationCodeRef.current = code
      toast.success('Verification code sent!')
    return { success: true, verificationCode: code }
    } catch (err: any) {
      const message = err.message || 'Failed to sign up'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (_email: string, code: string): Promise<AuthResult> => {
    if (code === verificationCodeRef.current) {
      toast.success('Email verified successfully!')
      return { success: true }
    }
    toast.error('Invalid verification code')
    return { success: false, error: "Invalid verification code" }
  }

  const signOut = async (): Promise<AuthResult> => {
    try {
    const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      toast.success('Signed out successfully!')
    return { success: true }
    } catch (err: any) {
      const message = err.message || 'Failed to sign out'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  /* ---------- public contract ---------- */
  return {
    user,
    loading,
    isLoading: loading,   // alias used by the pages
    error,

    signIn,
    signUp,
    verifyEmail,
    signOut,
  }
} 