'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, ExternalLink } from 'lucide-react'
import { WaitlistSection } from '@/components/waitlist-section'
import { Newsletter } from '@/components/newsletter'

type Building = {
  address: string
  borough: string
  yearBuilt: number
  buildingArea: number
  assessedValue: number
  zoning: string
  photo: string
}

export default function HomePage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nyc-buildings-sample')
      .then(res => res.json())
      .then(data => {
        setBuildings(data)
        setLoading(false)
      })
  }, [])

  // Calculate stats
  const stats = {
    count: buildings.length,
    avgArea: buildings.length ? Math.round(buildings.reduce((a, b) => a + b.buildingArea, 0) / buildings.length) : 0,
    avgValue: buildings.length ? Math.round(buildings.reduce((a, b) => a + b.assessedValue, 0) / buildings.length) : 0,
    avgYear: buildings.length ? Math.round(buildings.reduce((a, b) => a + b.yearBuilt, 0) / buildings.length) : 0,
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="HapSTR Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold tracking-tight">HapSTR Solutions</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Interior Transparency<br />
              <span className="text-blue-400 text-3xl">(Visualizing Your Future Home)</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              HapSTR makes it real. Our interior transparency lets you virtually tour a property's inside and floor plan from the outside, like test-driving your future home.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Card className="bg-white/5 border-white/10 text-center flex-1 min-w-[180px]">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-blue-400">{stats.count}</div>
                  <div className="text-gray-400 text-sm">Sample Buildings</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-center flex-1 min-w-[180px]">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-green-400">${stats.avgValue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Avg. Assessed Value</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-center flex-1 min-w-[180px]">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-purple-400">{stats.avgArea.toLocaleString()} sqft</div>
                  <div className="text-gray-400 text-sm">Avg. Building Area</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-center flex-1 min-w-[180px]">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-yellow-400">{stats.avgYear}</div>
                  <div className="text-gray-400 text-sm">Avg. Year Built</div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Explore Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#waitlist">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* Responsive YouTube Embed */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-lg aspect-video bg-black">
              <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/HsAY1SvmNpU?rel=0&autoplay=1&mute=1&loop=1&playlist=HsAY1SvmNpU"
                  title="HapSTR Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR SIGNAGE */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">AR Signage <span className="text-blue-400">(Spontaneous Insight)</span></h2>
            <p className="text-lg text-muted-foreground mb-6">
              HapSTR's AR signage offers this spontaneous insight, putting you in the driver's seat of your property search.
            </p>
            <ul className="space-y-4 text-lg">
              <li>
                <span className="font-bold text-blue-400">Technology & Innovation:</span> Our commitment to innovation sets us apart.
              </li>
              <li>
                <span className="font-bold text-blue-400">Real-time Information:</span> Stay informed with real-time data right on site.
              </li>
              <li>
                <span className="font-bold text-blue-400">Precise Allocation:</span> Our AR signage is incredibly precise, sticking exactly where you need it to be, providing unparalleled accuracy.
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <img src="/city-background.png" alt="AR Signage" className="rounded-2xl shadow-2xl w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Services We Provide</h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            We believe in offering flexible solutions that cater to everyone.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/10 flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Realtor Publish Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  For real estate professionals, we offer a subscription at just <span className="font-bold">$200 per month</span>, providing access to our cutting-edge platform.
                </p>
                <Link href="https://apps.apple.com/us/app/hapstr-v2/id6461165079" target="_blank" className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-white/90">
                    Download Now
                  </Button>
                </Link>
                <div className="mt-4 text-blue-400 font-bold text-lg">22 Active Brokers</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Buyer Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  For buyers seeking in-depth insights, we offer a monthly subscription at an affordable <span className="font-bold">$4.99</span>, unlocking a world of real estate information.
                </p>
                <Link href="https://apps.apple.com/us/app/hapstr-v2/id6461165079" target="_blank" className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-white/90">
                    Download Now
                  </Button>
                </Link>
                <div className="mt-4 text-green-400 font-bold text-lg">Thousands of Buyers</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">HapSTR Story</h2>
            <p className="text-lg text-muted-foreground mb-6">
              In a digital age where most marketplace platforms provide ample information for buyers, we recognized a significant gap, especially when it came to the intricate world of real estate.
              <br /><br />
              We understood that sitting in front of a computer screen might not be enough to truly grasp the essence of a potential home. That's where HapSTR comes into play.
            </p>
            <h3 className="text-2xl font-bold mb-2">HapSTR Vision</h3>
            <p className="text-lg text-muted-foreground">
              Explore a variety of services with AR Signage. Discover a tool that connects you with the right customers and brings your pre-agent journey to life.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img src="/androind-app-ios.png" alt="HapSTR App" className="rounded-2xl shadow-2xl w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* DYNAMIC PROPERTY LIST */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white">Sample NYC Buildings</h2>
          {loading ? (
            <div className="text-center text-white">Loading properties...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {buildings.map((b, i) => (
                <Card key={b.address + i} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <img src={b.photo} alt={b.address} className="rounded-lg mb-4 w-full h-40 object-cover" />
                    <div className="font-bold text-lg mb-2 text-white">{b.address}</div>
                    <div className="text-muted-foreground mb-2">{b.borough}</div>
                    <div className="mb-2">Year Built: <span className="font-bold">{b.yearBuilt}</span></div>
                    <div className="mb-2">Building Area: <span className="font-bold">{b.buildingArea.toLocaleString()} sqft</span></div>
                    <div className="mb-2">Assessed Value: <span className="font-bold text-green-400">${b.assessedValue.toLocaleString()}</span></div>
                    <div className="mb-2">Zoning: {b.zoning}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WAITLIST */}
      <div id="waitlist">
        <WaitlistSection />
      </div>

      {/* NEWSLETTER */}
      <Newsletter />

      {/* FOOTER */}
      <footer className="py-12 text-center text-muted-foreground text-sm bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-t border-border/10 pt-8">
            <p>© 2025 HapSTR. Happening on Streets. All Rights Reserved. Designed and Hosted by CIVI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}