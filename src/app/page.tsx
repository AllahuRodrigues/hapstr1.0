'use client'

import { Hero } from '@/components/hero'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Building2, 
  MapPin, 
  DollarSign,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero 
        title="NYC Real Estate Intelligence"
        description="Complete NYC building intelligence with real PLUTO data, live availability status, and comprehensive property information across all five boroughs."
        badge="🏙️ NYC Real Estate Intelligence"
        stats={[
          { label: 'NYC Properties', value: '1.8M+' },
          { label: 'PLUTO Data', value: 'Live', color: 'text-green-400' },
          { label: 'Satellite Maps', value: '3D', color: 'text-blue-400' }
        ]}
      />

      {/* Features Overview */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/5 border-white/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Live NYC PLUTO Data
                </h3>
                <p className="text-gray-400">
                  Direct integration with NYC's official property database containing 
                  comprehensive building records, assessments, and zoning information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  3D Interactive Maps
                </h3>
                <p className="text-gray-400">
                  Satellite view with 3D buildings and seamless navigation 
                  across all five NYC boroughs using Mapbox technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Property Analysis
                </h3>
                <p className="text-gray-400">
                  Detailed property information including zoning, assessed values, 
                  building characteristics, and comprehensive market data.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Explore NYC Properties
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 text-sm">
        Data © NYC Open Data • Map © Mapbox • Built with ❤️ by HapSTR
      </footer>
    </div>
  )
} 