'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Star,
  Users,
  Shield,
  Zap,
  Building2,
  Heart
} from 'lucide-react'

const values = [
  {
    icon: Star,
    title: 'Innovation',
    description: 'Pushing the boundaries of real estate technology',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a network of realtors and buyers',
    color: 'text-blue-400'
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Providing reliable and accurate information',
    color: 'text-green-400'
  },
  {
    icon: Zap,
    title: 'Efficiency',
    description: 'Streamlining the property search process',
    color: 'text-purple-400'
  },
  {
    icon: Building2,
    title: 'Growth',
    description: 'Expanding our reach across NYC boroughs',
    color: 'text-red-400'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Dedicated to transforming real estate',
    color: 'text-pink-400'
  }
]

export function StorySection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Story</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Founded in California, HapSTR is revolutionizing how people experience and interact with real estate through cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card/5 border-border/10 h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${value.color} mb-4`}>
                    <value.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 