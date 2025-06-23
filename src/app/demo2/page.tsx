'use client'

import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, DollarSign, Eye, Home, Calculator, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'

// Only import the essential ATTOM buildings map
const MapAttomBuildings = dynamic(() => import('@/components/map-attom-buildings'), { ssr: false })

export default function Demo2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative px-4 py-20 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge variant="outline" className="border-blue-400/30 text-blue-400 bg-blue-400/10 px-4 py-2">
                <Building2 className="w-5 h-5 mr-2" />
                3D Buildings
              </Badge>
              <Badge variant="outline" className="border-green-400/30 text-green-400 bg-green-400/10 px-4 py-2">
                <DollarSign className="w-5 h-5 mr-2" />
                Real-Time Data
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-400 bg-purple-400/10 px-4 py-2">
                <Zap className="w-5 h-5 mr-2" />
                Interactive
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight">
              3D Property Map
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                ATTOM API Integration
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto mb-12 leading-relaxed">
              Explore properties with comprehensive real-time data, hover effects, detailed listings, 
              and interactive building information powered by ATTOM Data API.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Eye className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Hover Effects</h3>
                  <p className="text-gray-400 text-sm">Interactive building previews with detailed information</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Home className="w-10 h-10 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Multiple Listings</h3>
                  <p className="text-gray-400 text-sm">Multiple units per building with individual pricing</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Live Pricing</h3>
                  <p className="text-gray-400 text-sm">Real-time market values, assessments, and tax data</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Calculator className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Financial Analysis</h3>
                  <p className="text-gray-400 text-sm">Comprehensive financial data and market analysis</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-400 text-lg mb-4">
                🏢 Hover over buildings to see preview • 🖱️ Click buildings for detailed information • 🗺️ Navigate freely across the US
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>✨ Interactive Hover Effects</span>
                <span>🏗️ Real Building Heights</span>
                <span>💰 Live Market Data</span>
                <span>🏠 Multiple Listings per Building</span>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/50 rounded-2xl border border-white/10 overflow-hidden">
              <div className="h-[80vh] relative">
                <Suspense fallback={
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                      <p className="text-white text-lg">Loading 3D Property Map...</p>
                      <p className="text-gray-400 text-sm">Initializing ATTOM API integration</p>
                    </div>
                  </div>
                }>
                  <MapAttomBuildings />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 