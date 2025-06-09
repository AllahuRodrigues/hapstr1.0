import { render, screen } from '@testing-library/react'
import DashboardPage from './page'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
    },
  })),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard with user metrics', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/properties viewed/i)).toBeInTheDocument()
    expect(screen.getByText(/ar tours completed/i)).toBeInTheDocument()
    expect(screen.getByText(/saved properties/i)).toBeInTheDocument()
  })

  it('handles sign out', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
        signOut: mockSignOut,
      },
    })

    render(<DashboardPage />)
    
    const signOutButton = screen.getByRole('button', { name: /sign out/i })
    expect(signOutButton).toBeInTheDocument()
  })

  it('displays loading state', () => {
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
}) 