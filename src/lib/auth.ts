import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  email: string
  name: string
  isEmailVerified: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Mock user database (in real app, this would be a proper database)
const users = new Map<string, User>()
const pendingVerifications = new Map<string, { email: string; code: string; expiresAt: Date }>()
const sessions = new Map<string, string>() // sessionId -> userId

const AUTH_COOKIE_NAME = 'hapstr_session'
const COOKIE_EXPIRES_DAYS = 30

export class AuthService {
  // Sign up with email verification
  static async signUp(email: string, password: string, name: string): Promise<{ success: boolean; message: string; verificationCode?: string }> {
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email)
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' }
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store pending verification
    pendingVerifications.set(email, { email, code: verificationCode, expiresAt })

    // In a real app, you would send this code via email
    console.log(`Verification code for ${email}: ${verificationCode}`)

    return { 
      success: true, 
      message: 'Verification code sent to your email',
      verificationCode // Only for demo purposes
    }
  }

  // Verify email with code
  static async verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string; user?: User }> {
    const pending = pendingVerifications.get(email)
    
    if (!pending) {
      return { success: false, message: 'No pending verification found' }
    }

    if (pending.code !== code) {
      return { success: false, message: 'Invalid verification code' }
    }

    if (new Date() > pending.expiresAt) {
      pendingVerifications.delete(email)
      return { success: false, message: 'Verification code expired' }
    }

    // Create user
    const userId = uuidv4()
    const user: User = {
      id: userId,
      email,
      name: email.split('@')[0], // Simple name extraction
      isEmailVerified: true,
      createdAt: new Date()
    }

    users.set(userId, user)
    pendingVerifications.delete(email)

    // Create session
    const sessionId = uuidv4()
    sessions.set(sessionId, userId)
    
    // Set cookie
    Cookies.set(AUTH_COOKIE_NAME, sessionId, { expires: COOKIE_EXPIRES_DAYS })

    return { success: true, message: 'Email verified successfully', user }
  }

  // Sign in
  static async signIn(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email)
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' }
    }

    if (!user.isEmailVerified) {
      return { success: false, message: 'Please verify your email first' }
    }

    // In a real app, you would verify the password hash
    // For demo purposes, we'll accept any password

    // Create session
    const sessionId = uuidv4()
    sessions.set(sessionId, user.id)
    
    // Set cookie
    Cookies.set(AUTH_COOKIE_NAME, sessionId, { expires: COOKIE_EXPIRES_DAYS })

    return { success: true, message: 'Signed in successfully', user }
  }

  // Sign out
  static signOut(): void {
    const sessionId = Cookies.get(AUTH_COOKIE_NAME)
    if (sessionId) {
      sessions.delete(sessionId)
      Cookies.remove(AUTH_COOKIE_NAME)
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    const sessionId = Cookies.get(AUTH_COOKIE_NAME)
    if (!sessionId) return null

    const userId = sessions.get(sessionId)
    if (!userId) return null

    return users.get(userId) || null
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  // Refresh session (extend cookie)
  static refreshSession(): boolean {
    const sessionId = Cookies.get(AUTH_COOKIE_NAME)
    if (!sessionId) return false

    const userId = sessions.get(sessionId)
    if (!userId) return false

    // Extend cookie
    Cookies.set(AUTH_COOKIE_NAME, sessionId, { expires: COOKIE_EXPIRES_DAYS })
    return true
  }
} 