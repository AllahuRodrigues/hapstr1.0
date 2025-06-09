'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Building2, 
  MapPin, 
  DollarSign,
  Users,
  Shield,
  Zap
} from 'lucide-react'

const solutions = [
  {
    icon: Building2,
    title: 'Property Intelligence',
    description: 'Comprehensive building data and analytics powered by NYC PLUTO database.',
    color: 'text-blue-400'
  },
  {
    icon: MapPin,
    title: '3D Visualization',
    description: 'Interactive 3D maps and property tours with real-time data overlay.',
    color: 'text-green-400'
  },
  {
    icon: DollarSign,
    title: 'Market Analysis',
    description: 'Real-time market trends, property values, and investment opportunities.',
    color: 'text-purple-400'
  },
  {
    icon: Users,
    title: 'Community Insights',
    description: 'Neighborhood data, demographics, and community resources.',
    color: 'text-yellow-400'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security and data protection for all users.',
    color: 'text-red-400'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant notifications and live property status updates.',
    color: 'text-orange-400'
  }
]

export function SolutionsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to transform how you interact with real estate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card/5 border-border/10 h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${solution.color} mb-4`}>
                    <solution.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground">{solution.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 