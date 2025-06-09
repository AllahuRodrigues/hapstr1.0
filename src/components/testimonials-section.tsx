'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const testimonials = [
  {
    quote:
      'HapSTR has transformed the way I connect with my clients. Virtual tours feel almost in-person.',
    name: 'Sarah Anderson',
    role: 'Real Estate Agent',
  },
  {
    quote:
      'As a first-time homebuyer HapSTR saved me countless hours. This is the future of home buying!',
    name: 'James Kim',
    role: 'Home Buyer',
  },
  {
    quote:
      'Instant AR signage data helps me make fast investment decisions. Indispensable tool.',
    name: 'Lisa Martinez',
    role: 'Investor',
  },
]

export const TestimonialsSection = () => (
  <section className="bg-black px-4 py-24 text-white">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold">Testimonials</h2>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-3 gap-8"
      >
        {testimonials.map((t, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">{t.name}</CardTitle>
              <p className="text-sm text-gray-400">{t.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 italic">“{t.quote}”</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  </section>
) 