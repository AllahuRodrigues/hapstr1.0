"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building2,
  Eye,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  Camera,
  Navigation,
  Zap,
  Landmark,
  Building,
  Scale,
  FileText,
  Map
} from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Mapbox3D from '@/components/mapbox-3d'

interface Property {
  borough: string
  block: string
  lot: string
  cd?: string
  ct2010?: string
  cb2010?: string
  schooldist?: string
  council?: string
  zipcode?: string
  firecomp?: string
  policeprct?: string
  healtharea?: string
  sanitboro?: string
  sanitsub?: string
  address: string
  zonedist1?: string
  spdist1?: string
  splitzone: boolean
  bldgclass?: string
  landuse?: string
  easements: string
  ownertype?: string
  ownername?: string
  lotarea: string
  bldgarea: string
  comarea?: string
  resarea?: string
  officearea?: string
  retailarea?: string
  garagearea?: string
  strgearea?: string
  factryarea?: string
  otherarea?: string
  areasource?: string
  numbldgs?: string
  numfloors?: string
  unitsres?: string
  unitstotal?: string
  lotfront?: string
  lotdepth?: string
  bldgfront?: string
  bldgdepth?: string
  ext?: string
  proxcode?: string
  irrlotcode: boolean
  lottype?: string
  bsmtcode?: string
  assessland?: string
  assesstot?: string
  exempttot?: string
  yearbuilt?: string
  yearalter1?: string
  yearalter2?: string
  builtfar?: string
  residfar?: string
  commfar?: string
  facilfar?: string
  borocode?: string
  bbl: string
  tract2010?: string
  xcoord?: string
  ycoord?: string
  latitude?: string
  longitude?: string
  zonemap?: string
  sanborn?: string
  taxmap?: string
  plutomapid?: string
  version?: string
}

interface BoroughStats {
  name: string
  totalProperties: number
  totalArea: number
  avgAssessedValue: number
  residentialProperties: number
  commercialProperties: number
  industrialProperties: number
  color: string
}

interface PropertyAnalytics {
  totalProperties: number
  totalAssessedValue: number
  totalExemptValue: number
  avgPropertyAge: number
  totalResidentialUnits: number
  totalCommercialArea: number
  totalResidentialArea: number
  totalIndustrialArea: number
}

// Initialize Mapbox with your token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBorough, setSelectedBorough] = useState("all")
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [analytics, setAnalytics] = useState<PropertyAnalytics>({
    totalProperties: 0,
    totalAssessedValue: 0,
    totalExemptValue: 0,
    avgPropertyAge: 0,
    totalResidentialUnits: 0,
    totalCommercialArea: 0,
    totalResidentialArea: 0,
    totalIndustrialArea: 0
  })

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  /* -------- auth-gate -------- */
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/signin?redirect=/dashboard")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    // Fetch NYC properties data
    fetch('https://data.cityofnewyork.us/resource/64uk-42ks.json')
      .then(response => response.json())
      .then(data => {
        setProperties(data)
        calculateAnalytics(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching property data:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.006, 40.7128], // NYC coordinates
      zoom: 11
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !map.current || !properties.length) return

    // Add property markers to the map
    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const marker = new mapboxgl.Marker({
          color: getBoroughColor(property.borough)
        })
          .setLngLat([parseFloat(property.longitude), parseFloat(property.latitude)])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${property.address}</h3>
              <p>Borough: ${property.borough}</p>
              <p>Building Class: ${property.bldgclass || 'N/A'}</p>
              <p>Assessed Value: $${property.assesstot ? (parseFloat(property.assesstot) / 1000).toFixed(1) + 'k' : 'N/A'}</p>
            </div>
          `))
          .addTo(map.current!)
      }
    })
  }, [mapLoaded, properties])

  const calculateAnalytics = (properties: Property[]) => {
    const currentYear = new Date().getFullYear()
    let totalAssessedValue = 0
    let totalExemptValue = 0
    let totalAge = 0
    let propertiesWithAge = 0
    let totalResidentialUnits = 0
    let totalCommercialArea = 0
    let totalResidentialArea = 0
    let totalIndustrialArea = 0

    properties.forEach(property => {
      if (property.assesstot) {
        totalAssessedValue += parseFloat(property.assesstot)
      }
      if (property.exempttot) {
        totalExemptValue += parseFloat(property.exempttot)
      }
      if (property.yearbuilt) {
        totalAge += (currentYear - parseInt(property.yearbuilt))
        propertiesWithAge++
      }
      if (property.unitsres) {
        totalResidentialUnits += parseInt(property.unitsres)
      }
      if (property.comarea) {
        totalCommercialArea += parseFloat(property.comarea)
      }
      if (property.resarea) {
        totalResidentialArea += parseFloat(property.resarea)
      }
      if (property.factryarea) {
        totalIndustrialArea += parseFloat(property.factryarea)
      }
    })

    setAnalytics({
      totalProperties: properties.length,
      totalAssessedValue,
      totalExemptValue,
      avgPropertyAge: propertiesWithAge > 0 ? totalAge / propertiesWithAge : 0,
      totalResidentialUnits,
      totalCommercialArea,
      totalResidentialArea,
      totalIndustrialArea
    })
  }

  const getBoroughColor = (borough: string) => {
    switch (borough) {
      case 'MN': return '#ef4444' // red
      case 'BK': return '#3b82f6' // blue
      case 'QN': return '#22c55e' // green
      case 'BX': return '#eab308' // yellow
      case 'SI': return '#a855f7' // purple
      default: return '#ffffff'
    }
  }

  const boroughStats: BoroughStats[] = [
    { 
      name: 'Manhattan', 
      totalProperties: properties.filter(p => p.borough === 'MN').length,
      totalArea: properties.filter(p => p.borough === 'MN').reduce((sum, p) => sum + parseFloat(p.lotarea), 0),
      avgAssessedValue: properties.filter(p => p.borough === 'MN').reduce((sum, p) => sum + (p.assesstot ? parseFloat(p.assesstot) : 0), 0) / properties.filter(p => p.borough === 'MN').length,
      residentialProperties: properties.filter(p => p.borough === 'MN' && p.landuse === '1').length,
      commercialProperties: properties.filter(p => p.borough === 'MN' && p.landuse === '2').length,
      industrialProperties: properties.filter(p => p.borough === 'MN' && p.landuse === '3').length,
      color: 'bg-red-500'
    },
    { 
      name: 'Brooklyn', 
      totalProperties: properties.filter(p => p.borough === 'BK').length,
      totalArea: properties.filter(p => p.borough === 'BK').reduce((sum, p) => sum + parseFloat(p.lotarea), 0),
      avgAssessedValue: properties.filter(p => p.borough === 'BK').reduce((sum, p) => sum + (p.assesstot ? parseFloat(p.assesstot) : 0), 0) / properties.filter(p => p.borough === 'BK').length,
      residentialProperties: properties.filter(p => p.borough === 'BK' && p.landuse === '1').length,
      commercialProperties: properties.filter(p => p.borough === 'BK' && p.landuse === '2').length,
      industrialProperties: properties.filter(p => p.borough === 'BK' && p.landuse === '3').length,
      color: 'bg-blue-500'
    },
    { 
      name: 'Queens', 
      totalProperties: properties.filter(p => p.borough === 'QN').length,
      totalArea: properties.filter(p => p.borough === 'QN').reduce((sum, p) => sum + parseFloat(p.lotarea), 0),
      avgAssessedValue: properties.filter(p => p.borough === 'QN').reduce((sum, p) => sum + (p.assesstot ? parseFloat(p.assesstot) : 0), 0) / properties.filter(p => p.borough === 'QN').length,
      residentialProperties: properties.filter(p => p.borough === 'QN' && p.landuse === '1').length,
      commercialProperties: properties.filter(p => p.borough === 'QN' && p.landuse === '2').length,
      industrialProperties: properties.filter(p => p.borough === 'QN' && p.landuse === '3').length,
      color: 'bg-green-500'
    },
    { 
      name: 'Bronx', 
      totalProperties: properties.filter(p => p.borough === 'BX').length,
      totalArea: properties.filter(p => p.borough === 'BX').reduce((sum, p) => sum + parseFloat(p.lotarea), 0),
      avgAssessedValue: properties.filter(p => p.borough === 'BX').reduce((sum, p) => sum + (p.assesstot ? parseFloat(p.assesstot) : 0), 0) / properties.filter(p => p.borough === 'BX').length,
      residentialProperties: properties.filter(p => p.borough === 'BX' && p.landuse === '1').length,
      commercialProperties: properties.filter(p => p.borough === 'BX' && p.landuse === '2').length,
      industrialProperties: properties.filter(p => p.borough === 'BX' && p.landuse === '3').length,
      color: 'bg-yellow-500'
    },
    { 
      name: 'Staten Island', 
      totalProperties: properties.filter(p => p.borough === 'SI').length,
      totalArea: properties.filter(p => p.borough === 'SI').reduce((sum, p) => sum + parseFloat(p.lotarea), 0),
      avgAssessedValue: properties.filter(p => p.borough === 'SI').reduce((sum, p) => sum + (p.assesstot ? parseFloat(p.assesstot) : 0), 0) / properties.filter(p => p.borough === 'SI').length,
      residentialProperties: properties.filter(p => p.borough === 'SI' && p.landuse === '1').length,
      commercialProperties: properties.filter(p => p.borough === 'SI' && p.landuse === '2').length,
      industrialProperties: properties.filter(p => p.borough === 'SI' && p.landuse === '3').length,
      color: 'bg-purple-500'
    }
  ]

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading…
      </div>
    )
  }

  const stats = [
    {
      title: "Total Properties",
      value: analytics.totalProperties.toLocaleString(),
      change: "+12.5%",
      icon: Building2,
      color: "text-blue-400"
    },
    {
      title: "Total Assessed Value",
      value: `$${(analytics.totalAssessedValue / 1000000).toFixed(1)}M`,
      change: "+18.2%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Total Exempt Value",
      value: `$${(analytics.totalExemptValue / 1000000).toFixed(1)}M`,
      change: "+5.8%",
      icon: Scale,
      color: "text-yellow-400"
    },
    {
      title: "Avg Property Age",
      value: `${Math.round(analytics.avgPropertyAge)} years`,
      change: "+9.1%",
      icon: Calendar,
      color: "text-purple-400"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  NYC Property Analytics Dashboard
                </h1>
                <p className="text-gray-400">
                  Comprehensive property intelligence across all five boroughs
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-white/10 hover:bg-white/20 border border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Search className="w-4 h-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-400 mt-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Map and Borough Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/5 border-white/10 h-[600px]">
              <CardHeader>
                <CardTitle>Property Map</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <Mapbox3D 
                  onPropertySelect={setSelectedProperty}
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Borough Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boroughStats.map((borough) => (
                    <div key={borough.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${borough.color}`} />
                        <span>{borough.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{borough.totalProperties.toLocaleString()} properties</div>
                        <div className="text-sm text-gray-400">
                          ${(borough.avgAssessedValue / 1000).toFixed(1)}k avg value
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Details Panel */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
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
                            ${selectedProperty.assesstot ? (parseFloat(selectedProperty.assesstot) / 1000).toFixed(1) + 'k' : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Building Area:</span>
                          <span className="text-white font-medium">
                            {selectedProperty.bldgarea ? parseFloat(selectedProperty.bldgarea).toLocaleString() : 'N/A'} sq ft
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year Built:</span>
                          <span className="text-white font-medium">{selectedProperty.yearbuilt || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Property Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Zoning:</span>
                          <span className="text-white font-medium">{selectedProperty.zonedist1 || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Building Class:</span>
                          <span className="text-white font-medium">{selectedProperty.bldgclass || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Land Use:</span>
                          <span className="text-white font-medium">{selectedProperty.landuse || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lot Area:</span>
                          <span className="text-white font-medium">
                            {selectedProperty.lotarea ? parseFloat(selectedProperty.lotarea).toLocaleString() : 'N/A'} sq ft
                          </span>
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

          {/* Property List */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.bbl} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium">{property.address}</div>
                      <div className="text-sm text-gray-400">
                        {property.borough} • {property.bldgclass} • {property.zonedist1}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${property.assesstot ? (parseFloat(property.assesstot) / 1000).toFixed(1) + 'k' : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {property.yearbuilt || 'Unknown'} • {property.lotarea} sqft
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download App Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Download HapSTR Mobile App</h2>
            <p className="text-gray-400 mb-6">
              Get the full NYC property experience on your mobile device
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://apps.apple.com/us/app/hapstr-v2/id6461165079"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on App Store
              </a>
              <a
                href="https://github.com/AllahuRodrigues/hapstr-web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}