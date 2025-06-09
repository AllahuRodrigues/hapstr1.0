'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function VideoSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background YouTube Video */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <iframe
          className="absolute inset-0 w-full h-full object-cover"
          src="https://www.youtube.com/embed/HsAY1SvmNpU?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&playlist=HsAY1SvmNpU"
          title="Background video"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience Real Estate in a New Way
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover properties through immersive AR technology and real-time data visualization.
            Transform how you explore and understand real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/waitlist">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join Waitlist
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
