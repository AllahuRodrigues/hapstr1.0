"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu, X, User, LogOut, Building2, Users, Briefcase, Info, MessageSquare, LayoutDashboard } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Demo",
    href: "/demo",
  },
  {
    title: "Pricing",
    href: "/#pricing",
  },
  {
    title: "About",
    href: "/#about",
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { scrollY } = useScroll()
  
  // Scroll-based blur and background effects
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95])
  const backdropBlur = useTransform(scrollY, [0, 100], [8, 20])
  const borderOpacity = useTransform(scrollY, [0, 100], [0.2, 0.4])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsSignedIn(!!session)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = () => {
    localStorage.removeItem('hapstr_user')
    setIsSignedIn(false)
    router.push('/')
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  const navItems = [
    { name: 'Demo', href: '/demo', icon: Building2 },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requireAuth: true },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Career', href: '/career', icon: Briefcase },
    { name: 'Contact', href: '/contact', icon: MessageSquare },
  ]

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isSignedIn)
  )

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-bold text-xl">HapSTR</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`transition-colors duration-200 text-sm font-medium flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg ${
                    pathname === item.href 
                      ? 'text-white bg-white/10' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={handleSignIn}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            height: isOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 rounded-lg mt-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium hover:bg-white/10 rounded-lg flex items-center gap-2 ${
                  pathname === item.href 
                    ? 'text-white bg-white/10' 
                    : 'text-white/80 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3">
              {isSignedIn ? (
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10 justify-start"
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10 justify-start"
                    onClick={() => {
                      handleSignIn()
                      setIsOpen(false)
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Link href="/auth/signup">
                    <Button
                      className="w-full bg-white text-black hover:bg-white/90"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
} 