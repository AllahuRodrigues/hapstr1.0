"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  User,
  LogOut,
  Building2,
  Users,
  Briefcase,
  Info,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion"

/* -------------------------------------------------------------------------- */
/*                                NAVIGATION                                  */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  /* Supabase session ------------------------------------------------------- */
  const supabase = createClientComponentClient()

  useEffect(() => {
    const sync = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsSignedIn(!!session)
    }
    sync()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_evt, session) => {
        setIsSignedIn(!!session)
      })

    return () => subscription.unsubscribe()
  }, [supabase])

  /* Scroll visual ---------------------------------------------------------- */
  const { scrollY } = useScroll()
  const bgOpacity   = useTransform(scrollY, [0, 100], [0, 0.9])
  const border      = useTransform(scrollY, [0, 100], [0, 0.2])

  // Compose CSS strings with motion values (replaces `.to`)
  const navBg     = useMotionTemplate`rgba(0,0,0,${bgOpacity})`
  const navBorder = useMotionTemplate`1px solid rgba(255,255,255,${border})`

  /* Sign-out --------------------------------------------------------------- */
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  /* Routes ----------------------------------------------------------------- */
  const navItems = [
    { name: "Demo",      href: "/demo",      icon: Building2 },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requireAuth: true },
    { name: "About",     href: "/about",     icon: Info },
    { name: "Teams",     href: "/teams",     icon: Users },
    { name: "Careers",   href: "/careers",   icon: Briefcase },
    { name: "Contact",   href: "/contact",   icon: MessageSquare },
  ].filter((n) => !n.requireAuth || isSignedIn)

  /* ----------------------------------------------------------------------- */

  return (
    <motion.nav
      style={{ backgroundColor: navBg, borderBottom: navBorder }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo ------------------------------------------------------------- */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Building2 className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">HapSTR</span>
        </Link>

        {/* Desktop Nav ------------------------------------------------------ */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons ------------------------------------------- */}
        <div className="hidden items-center gap-4 md:flex">
          {isSignedIn ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth/signin")}
                className="text-white hover:bg-white/10"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Burger ---------------------------------------------------- */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden text-white hover:bg-white/10"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu ------------------------------------------------------- */}
      {isOpen && (
        <div className="md:hidden bg-black/90 px-3 pb-3 pt-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-colors ${
                pathname === href
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}

          <div className="mt-3 border-t border-white/10 pt-3">
            {isSignedIn ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => {
                    router.push("/auth/signin")
                    setIsOpen(false)
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Link href="/auth/signup">
                  <Button
                    className="mt-2 w-full bg-white text-black hover:bg-white/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  )
} 