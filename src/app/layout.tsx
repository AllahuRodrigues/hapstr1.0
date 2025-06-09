import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HapSTR - NYC Real Estate Intelligence',
  description: 'Complete NYC building intelligence with real PLUTO data, live availability status, and comprehensive property information across all five boroughs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}