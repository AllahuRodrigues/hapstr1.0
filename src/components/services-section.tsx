'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ServiceCard = ({
  title,
  price,
  description,
  badge,
  href,
}: {
  title: string
  price: string
  description: string
  badge: string
  href: string
}) => (
  <Card className="bg-white/5 border-white/10 flex flex-col">
    <CardHeader>
      <CardTitle className="text-white text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 space-y-4">
      <p className="text-gray-400">{description}</p>
      <p className="text-3xl font-bold text-white">{price}</p>
      <Link href={href} target="_blank">
        <Button className="mt-6 w-full bg-white text-black hover:bg-white/90">
          Download Now
        </Button>
      </Link>
    </CardContent>
    <div className="px-4 pb-4">
      <span className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs">
        {badge}
      </span>
    </div>
  </Card>
)

export const ServicesSection = () => (
  <section className="bg-black px-4 py-24 text-white">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold">Services We Provide</h2>
        <p className="text-gray-400">
          Flexible solutions designed for <strong>realtors</strong> and <strong>buyers</strong>
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <ServiceCard
          title="Realtor Publish Subscription"
          price="$200 / month"
          description="Unlock our cutting-edge AR platform and publish interactive listings."
          badge="22 Active Brokers"
          href="https://apps.apple.com/us/app/hapstr-v2/id6461165079"
        />
        <ServiceCard
          title="Buyer Subscription"
          price="$4.99 / month"
          description="Deep insights and virtual tours at an affordable price."
          badge="Thousands of Buyers"
          href="https://apps.apple.com/us/app/hapstr-v2/id6461165079"
        />
      </motion.div>
    </div>
  </section>
) 