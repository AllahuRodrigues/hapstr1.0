import Cookies from 'js-cookie'

export interface User {
  id: string
  email: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Simple user storage (in production, use a real database)
const users = new Map<string, { email: string; password: string; id: string; createdAt: Date }>()
const sessions = new Map<string, string>() // sessionId -> userId

const AUTH_COOKIE_NAME = 'hapstr_session'
const COOKIE_EXPIRES_DAYS = 30

// Pre-populate with a demo user for testing
users.set('demo-user-id', {
  id: 'demo-user-id',
  email: 'demo@hapstr.com',
  password: 'password123',
  createdAt: new Date()
})

export class AuthService {
  // Simple sign up with email and password
  static async signUp(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email)
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' }
    }

    // Validate inputs
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' }
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' }
    }

    // Create user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const user = {
      id: userId,
      email,
      password, // In production, hash this!
      createdAt: new Date()
    }

    users.set(userId, user)

    // Create session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessions.set(sessionId, userId)
    
    // Set cookie
    Cookies.set(AUTH_COOKIE_NAME, sessionId, { expires: COOKIE_EXPIRES_DAYS })

    return { 
      success: true, 
      message: 'Account created successfully',
      user: { id: userId, email, createdAt: user.createdAt }
    }
  }

  // Simple sign in with email and password
  static async signIn(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email)
    
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid email or password' }
    }

    // Create session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessions.set(sessionId, user.id)
    
    // Set cookie
    Cookies.set(AUTH_COOKIE_NAME, sessionId, { expires: COOKIE_EXPIRES_DAYS })

    return { 
      success: true, 
      message: 'Signed in successfully', 
      user: { id: user.id, email: user.email, createdAt: user.createdAt }
    }
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

    const user = users.get(userId)
    if (!user) return null

    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
} 