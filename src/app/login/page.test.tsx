import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithOtp: jest.fn(),
    },
  })),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ error: null })
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOtp: mockSignIn,
      },
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.any(String),
        },
      })
    })
  })

  it('displays error message on failed submission', async () => {
    const mockError = new Error('Invalid email')
    const mockSignIn = jest.fn().mockRejectedValue(mockError)
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOtp: mockSignIn,
      },
    })

    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })
}) 