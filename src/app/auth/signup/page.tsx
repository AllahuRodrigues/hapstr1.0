"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Mail, 
  Lock,
  ArrowRight,
  User,
  Loader2,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const [step, setStep] = useState<'signup' | 'verify'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; name?: string; code?: string }>({})
  const [demoCode, setDemoCode] = useState('')
  
  const router = useRouter()
  const { signUp, verifyEmail, isLoading, error } = useAuth()

  const validateSignUpForm = () => {
    const errors: { email?: string; password?: string; name?: string } = {}
    
    if (!name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateVerificationForm = () => {
    const errors: { code?: string } = {}
    
    if (!verificationCode.trim()) {
      errors.code = 'Verification code is required'
    } else if (verificationCode.length !== 6) {
      errors.code = 'Code must be 6 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateSignUpForm()) return
    
    const result = await signUp(email, password, name)
    
    if (result.success) {
      setDemoCode(result.verificationCode || '')
      setStep('verify')
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateVerificationForm()) return
    
    const result = await verifyEmail(email, verificationCode)
    
    if (result.success) {
      // Small delay for the success animation
    setTimeout(() => {
      router.push('/dashboard')
      }, 1500)
  }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold">HapSTR</span>
            </Link>
            
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-400">
              We sent a verification code to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <form onSubmit={handleVerifyEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-white">Verification Code</Label>
                    <div className="relative">
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                        className={`bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 text-center text-xl tracking-widest ${
                          formErrors.code ? 'border-red-500' : ''
                        }`}
                        maxLength={6}
                        disabled={isLoading}
                      />
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    </div>
                    {formErrors.code && (
                      <p className="text-red-400 text-sm">{formErrors.code}</p>
                    )}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep('signup')}
                      className="text-white/70 hover:text-white text-sm underline"
                      disabled={isLoading}
                    >
                      ← Back to sign up
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo hint */}
          {demoCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
            >
              <p className="text-green-300 text-sm text-center">
                💡 Demo Code: <span className="font-mono font-bold">{demoCode}</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold">HapSTR</span>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join HapSTR and revolutionize real estate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 ${
                        formErrors.name ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      </div>
                  {formErrors.name && (
                    <p className="text-red-400 text-sm">{formErrors.name}</p>
                  )}
                    </div>

                <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 ${
                        formErrors.email ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      </div>
                  {formErrors.email && (
                    <p className="text-red-400 text-sm">{formErrors.email}</p>
                  )}
                    </div>

                <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                      type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 pr-10 ${
                        formErrors.password ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                        />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-400 text-sm">{formErrors.password}</p>
                  )}
                  </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-black text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" disabled>
                      Google
                    </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" disabled>
                      Apple
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-white hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
        >
          <p className="text-blue-300 text-sm text-center">
            💡 Demo: Use any email to create an account and get a verification code
          </p>
        </motion.div>
      </div>
    </div>
  )
} 