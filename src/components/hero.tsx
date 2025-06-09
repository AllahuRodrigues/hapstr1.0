import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface HeroProps {
  title: string
  description: string
  badge?: string
  stats?: {
    label: string
    value: string | number
    color?: string
  }[]
}

export function Hero({ title, description, badge, stats }: HeroProps) {
  return (
    <motion.section 
      className="px-4 py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {badge && (
        <Badge className="bg-white/10 text-white border-white/20 mb-4">
          {badge}
        </Badge>
      )}
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        {title}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        {description}
      </p>
      
      {stats && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {stats.map((stat, index) => (
            <>
              {index > 0 && <div className="hidden sm:block w-px h-12 bg-white/20" />}
              <div className="text-center">
                <div className={`text-3xl font-bold ${stat.color || 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            </>
          ))}
        </div>
      )}
    </motion.section>
  )
} 