'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  DollarSign,
  Home,
  Calendar,
  Info,
  ExternalLink
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import Mapbox3D from '@/components/mapbox-3d'

interface NYCProperty {
  address: string
  buildingName?: string
  borough: string
  latitude?: number
  longitude?: number
  photos?: { url: string }[]
  description?: string
  price?: number
  assessedValue?: number
  buildingArea?: number
  lotArea?: number
  yearBuilt?: number
  numFloors?: number
  zoning?: string
  landUse?: string
  buildingClass?: string
  residentialUnits?: number
  totalUnits?: number
  rentZestimate?: number
  boro?: string
  block?: string
  lot?: string
  zipcode?: string
  councilDistrict?: string
  communityDistrict?: string
}

export default function DemoPage() {
  const [selectedProperty, setSelectedProperty] = useState<NYCProperty | null>(null)
  const [buildingStats, setBuildingStats] = useState({
    total: 0,
    loaded: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading NYC building data
    const interval = setInterval(() => {
      setBuildingStats(prev => ({
        total: 1800000,
        loaded: Math.min(prev.loaded + 50000, 1800000)
      }))
    }, 100)

    // Simulate initial data loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    setTimeout(() => clearInterval(interval), 3000)
    return () => {
      clearInterval(interval)
      clearTimeout(loadingTimeout)
    }
  }, [])

  const boroughStats = [
    { name: 'Manhattan', count: 400000, color: 'bg-red-500' },
    { name: 'Brooklyn', count: 650000, color: 'bg-blue-500' },
    { name: 'Queens', count: 550000, color: 'bg-green-500' },
    { name: 'Bronx', count: 350000, color: 'bg-yellow-500' },
    { name: 'Staten Island', count: 180000, color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
        <motion.section 
          className="px-4 py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            🏙️ NYC Real Estate Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore NYC Buildings
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Complete NYC building intelligence with real PLUTO data, live availability status, 
            and comprehensive property information across all five boroughs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {buildingStats.loaded.toLocaleString()}+
              </div>
              <div className="text-gray-400">NYC Properties</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">Live</div>
              <div className="text-gray-400">PLUTO Data</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">3D</div>
              <div className="text-gray-400">Satellite Maps</div>
            </div>
          </div>
        </motion.section>

        {/* Features Overview */}
        <motion.section 
          className="px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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

            {/* Borough Statistics */}
            <div className="grid md:grid-cols-5 gap-4 mb-16">
              {boroughStats.map((borough) => (
                <Card key={borough.name} className="bg-white/5 border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-8 h-8 ${borough.color} rounded-lg mx-auto mb-3`} />
                    <h4 className="text-lg font-bold text-white mb-1">
                      {borough.name}
                    </h4>
                    <p className="text-2xl font-bold text-white mb-1">
                      {(borough.count / 1000).toFixed(0)}K+
                    </p>
                    <p className="text-gray-400 text-sm">Properties Available</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Interactive Map Section */}
        <motion.section 
          className="px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Interactive 3D NYC Property Map
              </h2>
              <p className="text-gray-400 text-lg">
                Explore NYC properties with live data from the city's PLUTO database. 
                Click anywhere on the map to view property details.
              </p>
            </div>

            {/* Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              {isLoading ? (
                <div className="h-[600px] w-full flex items-center justify-center bg-black/50">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                    <p className="text-white/80">Loading NYC property data...</p>
                  </div>
                </div>
              ) : (
                <Mapbox3D 
                  onPropertySelect={setSelectedProperty}
                  className="h-[600px] w-full"
                />
              )}
              
              {/* Data Source Badge */}
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-green-500 text-white">
                  ✅ Live NYC PLUTO Data
                </Badge>
              </div>
            </div>

            {/* Property Details Panel */}
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {selectedProperty.address}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Borough:</span>
                            <span className="text-white font-medium">{selectedProperty.borough}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Assessed Value:</span>
                            <span className="text-white font-medium">
                              ${selectedProperty.assessedValue?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Building Area:</span>
                            <span className="text-white font-medium">
                              {selectedProperty.buildingArea?.toLocaleString() || 'N/A'} sq ft
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Year Built:</span>
                            <span className="text-white font-medium">{selectedProperty.yearBuilt || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Property Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Zoning:</span>
                            <span className="text-white font-medium">{selectedProperty.zoning || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Floors:</span>
                            <span className="text-white font-medium">{selectedProperty.numFloors || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Residential Units:</span>
                            <span className="text-white font-medium">{selectedProperty.residentialUnits || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Building Class:</span>
                            <span className="text-white font-medium">{selectedProperty.buildingClass || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* close panel */}
                    <div className="mt-8 text-right">
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => setSelectedProperty(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* simple footer */}
        <footer className="py-12 text-center text-gray-500 text-sm">
          Data © NYC Open Data • Map © Mapbox • Built with ❤️ by HapSTR
        </footer>
      </div>
    </div>
  )
} 