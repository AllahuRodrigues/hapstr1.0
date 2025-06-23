'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  X, 
  Home, 
  Bed, 
  Bath, 
  Calendar, 
  TrendingUp, 
  MapPin,
  Info,
  Eye,
  Tag,
  Calculator,
  Users,
  Building,
  Ruler,
  Zap
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWxsYWh1cm9kcmlndWVzMSIsImEiOiJjbWJseGhvejQwdnI4MmtxdjFsNnNpcmJlIn0.BGZw6Nn0uBvZ3nopVD3I3A'

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN
}

interface BuildingListing {
  unit: number
  floor: number
  price: number
  size: number
  pricePerSqFt: number
  beds: number
  baths: number
  status?: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'off-market' | 'available'
  listingType?: 'sale' | 'rent' | 'both'
}

interface BuildingFeature {
  type: 'Feature'
  properties: {
    id: string
    address: string
    city: string
    state: string
    zipcode: string
    
    // Property details
    propertyType: string
    propertyClass: string
    yearBuilt: number
    
    // Physical characteristics
    floors: number
    buildingHeight: number
    units: number
    livingSize: number
    lotSize: number
    
    // Pricing information
    marketValue: number
    assessedValue: number
    taxAmount: number
    avmValue: number
    pricePerSqFt: number
    
    // Owner information
    owner: string
    
    // Multiple listings per building
    listings: BuildingListing[]
    
    // Building characteristics
    wallType: string
    roofType: string
    construction: string
    quality: string
    condition: string
    
    // Amenities
    pool: string
    heating: string
    cooling: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export default function MapAttomBuildings() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const popup = useRef<mapboxgl.Popup | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingFeature | null>(null)
  const [selectedListing, setSelectedListing] = useState<BuildingListing | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingFeature | null>(null)

  const validateBuildingData = useCallback((buildings: BuildingFeature[]) => {
    return buildings.map((building, index) => {
      const props = building.properties
      
      // Ensure all required numeric properties exist with valid values
      const validatedProps = {
        ...props,
        id: props.id || `building_${index}_${Date.now()}`,
        marketValue: (typeof props.marketValue === 'number' && props.marketValue > 0) ? props.marketValue : 500000,
        buildingHeight: (typeof props.buildingHeight === 'number' && props.buildingHeight > 0) ? props.buildingHeight : (props.floors || 5) * 12,
        floors: (typeof props.floors === 'number' && props.floors > 0) ? props.floors : 5,
        units: (typeof props.units === 'number' && props.units > 0) ? props.units : 10,
        yearBuilt: (typeof props.yearBuilt === 'number' && props.yearBuilt > 1800 && props.yearBuilt <= 2024) ? props.yearBuilt : 1990,
        taxAmount: (typeof props.taxAmount === 'number' && props.taxAmount > 0) ? props.taxAmount : (props.marketValue || 500000) * 0.015,
        assessedValue: (typeof props.assessedValue === 'number' && props.assessedValue > 0) ? props.assessedValue : (props.marketValue || 500000) * 0.8,
        avmValue: (typeof props.avmValue === 'number' && props.avmValue > 0) ? props.avmValue : (props.marketValue || 500000) * 1.1,
        livingSize: (typeof props.livingSize === 'number' && props.livingSize > 0) ? props.livingSize : 1000,
        lotSize: (typeof props.lotSize === 'number' && props.lotSize > 0) ? props.lotSize : 2000,
        // Calculate pricePerSqFt based on marketValue and livingSize
        pricePerSqFt: (typeof props.pricePerSqFt === 'number' && props.pricePerSqFt > 0) ? 
          props.pricePerSqFt : 
          Math.floor((props.marketValue || 500000) / (props.livingSize || 1000)),
        // Ensure string properties are not undefined
        address: props.address || `${index + 1} Unknown Street`,
        city: props.city || 'New York',
        state: props.state || 'NY',
        zipcode: props.zipcode || '10001',
        propertyType: props.propertyType || 'Residential',
        propertyClass: props.propertyClass || 'Standard',
        owner: props.owner || 'Private Owner',
        wallType: props.wallType || 'Brick',
        roofType: props.roofType || 'Asphalt',
        construction: props.construction || 'Frame',
        quality: props.quality || 'Average',
        condition: props.condition || 'Good',
        pool: props.pool || 'No',
        heating: props.heating || 'Central',
        cooling: props.cooling || 'Central',
        // Ensure listings array exists
        listings: Array.isArray(props.listings) ? props.listings : []
      }

      return {
        ...building,
        properties: validatedProps
      }
    })
  }, [])

  const loadBuildings = useCallback(async () => {
    if (!map.current || !map.current.isStyleLoaded()) return

    const bounds = map.current.getBounds()
    const zoom = Math.round(map.current.getZoom())
    
    if (zoom < 12) {
      console.log('🔍 Zoom level too low for building data:', zoom)
      return
    }

    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ]

    setIsLoading(true)
    setError(null)

    try {
      console.log(`🏗️ Loading buildings for bbox: ${bbox.join(',')}, zoom: ${zoom}`)
      
      const response = await fetch(`/api/nationwide-buildings?bbox=${bbox.join(',')}&zoom=${zoom}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const buildings: BuildingFeature[] = []
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const feature = JSON.parse(line) as BuildingFeature
            buildings.push(feature)
          } catch (e) {
            console.warn('Failed to parse feature:', e)
          }
        }
      }

      console.log(`✅ Loaded ${buildings.length} ATTOM buildings`)

      // Update map with buildings
      if (map.current && buildings.length > 0) {
        updateMapBuildings(buildings)
      } else if (buildings.length === 0) {
        console.log('⚠️ No buildings found for current view')
      }
    } catch (error) {
      console.error('Error loading ATTOM buildings:', error)
      setError(`Failed to load buildings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createHoverPopup = useCallback((building: BuildingFeature, coordinates: [number, number]) => {
    if (!map.current) return

    // Remove existing popup
    if (popup.current) {
      popup.current.remove()
    }

    const availableListings = building.properties.listings.filter(l => 
      l.status === 'for-sale' || l.status === 'for-rent' || l.status === 'available' || !l.status
    )

    const popupContent = `
      <div class="bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 min-w-[280px] text-white">
        <div class="space-y-3">
          <div>
            <h3 class="font-bold text-lg text-white truncate">${building.properties.address}</h3>
            <p class="text-gray-400 text-sm">${building.properties.city}, ${building.properties.state} ${building.properties.zipcode}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-white/10 rounded p-2">
              <div class="text-gray-400 text-xs">Market Value</div>
              <div class="font-bold text-green-400">${formatPrice(building.properties.marketValue)}</div>
            </div>
            <div class="bg-white/10 rounded p-2">
              <div class="text-gray-400 text-xs">Tax Amount</div>
              <div class="font-bold text-orange-400">${formatPrice(building.properties.taxAmount)}</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="text-gray-400">Floors</div>
              <div class="font-bold">${building.properties.floors}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-400">Units</div>
              <div class="font-bold">${building.properties.units}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-400">Built</div>
              <div class="font-bold">${building.properties.yearBuilt}</div>
            </div>
          </div>

          ${availableListings.length > 0 ? `
            <div class="border-t border-white/20 pt-2">
              <div class="text-gray-400 text-xs mb-2">${availableListings.length} Available Listings</div>
              <div class="space-y-1">
                ${availableListings.slice(0, 3).map(listing => `
                  <div class="bg-white/5 rounded p-2 text-xs">
                    <div class="flex justify-between items-center">
                      <span>Unit ${listing.unit} • Floor ${listing.floor}</span>
                      <span class="font-bold text-green-400">${formatPrice(listing.price)}</span>
                    </div>
                    <div class="text-gray-400">${listing.beds} bed • ${listing.baths} bath • ${listing.size.toLocaleString()} sqft</div>
                  </div>
                `).join('')}
                ${availableListings.length > 3 ? `
                  <div class="text-center text-gray-400 text-xs">+${availableListings.length - 3} more listings</div>
                ` : ''}
              </div>
            </div>
          ` : `
            <div class="border-t border-white/20 pt-2">
              <div class="text-gray-400 text-center text-sm">No active listings</div>
            </div>
          `}

          <div class="text-center">
            <div class="text-gray-400 text-xs">Click for detailed information</div>
          </div>
        </div>
      </div>
    `

    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup',
      maxWidth: 'none'
    })
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map.current)
  }, [])

  // Define event handlers outside of updateMapBuildings to maintain references
  const handleBuildingClick = useCallback((e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (e.features && e.features[0]) {
      const feature = e.features[0] as any
      setSelectedBuilding(feature)
      setSelectedListing(null)
      setIsSheetOpen(true)
    }
  }, [])

  const handleBuildingMouseEnter = useCallback((e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (map.current && e.features && e.features[0]) {
      const feature = e.features[0] as any
      
      // Update cursor
      map.current.getCanvas().style.cursor = 'pointer'
      
      // Show hover popup
      setHoveredBuilding(feature)
      createHoverPopup(feature, e.lngLat.toArray() as [number, number])
    }
  }, [createHoverPopup])

  const handleBuildingMouseLeave = useCallback(() => {
    if (map.current) {
      map.current.getCanvas().style.cursor = ''
      
      // Remove hover popup
      if (popup.current) {
        popup.current.remove()
      }
      setHoveredBuilding(null)
    }
  }, [])

  const updateMapBuildings = useCallback((buildings: BuildingFeature[]) => {
    if (!map.current || !map.current.isStyleLoaded()) {
      console.warn('⚠️ Map not ready for layer updates')
      return
    }

    console.log(`🏗️ Updating map with ${buildings.length} buildings`)

    try {
      // Validate and sanitize building data
      const validatedBuildings = validateBuildingData(buildings)

      // Remove existing layers and event listeners
      if (map.current.getLayer('attom-buildings')) {
        map.current.off('click', 'attom-buildings', handleBuildingClick)
        map.current.off('mouseenter', 'attom-buildings', handleBuildingMouseEnter)
        map.current.off('mouseleave', 'attom-buildings', handleBuildingMouseLeave)
        map.current.removeLayer('attom-buildings')
      }
      if (map.current.getSource('attom-buildings')) {
        map.current.removeSource('attom-buildings')
      }

      // Add buildings source with validated data
      map.current.addSource('attom-buildings', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: validatedBuildings
        }
      })

      // Add 3D buildings layer
      map.current.addLayer({
        id: 'attom-buildings',
        type: 'fill-extrusion',
        source: 'attom-buildings',
        paint: {
          'fill-extrusion-color': [
            'case',
            ['<', ['coalesce', ['get', 'marketValue'], 500000], 300000], '#3b82f6',
            ['<', ['coalesce', ['get', 'marketValue'], 500000], 500000], '#10b981',
            ['<', ['coalesce', ['get', 'marketValue'], 500000], 1000000], '#f59e0b',
            ['<', ['coalesce', ['get', 'marketValue'], 500000], 2000000], '#f97316',
            '#ef4444'
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 0,
            12.5, ['*', ['coalesce', ['get', 'buildingHeight'], 60], 1.2]
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8
        }
      })

      // Add event listeners
      map.current.on('click', 'attom-buildings', handleBuildingClick)
      map.current.on('mouseenter', 'attom-buildings', handleBuildingMouseEnter)
      map.current.on('mouseleave', 'attom-buildings', handleBuildingMouseLeave)

      console.log('✅ Map layers updated successfully')
    } catch (error) {
      console.error('❌ Error updating map layers:', error)
      setError(`Failed to update map: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [validateBuildingData, handleBuildingClick, handleBuildingMouseEnter, handleBuildingMouseLeave])

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-74.006, 40.7128], // NYC
        zoom: 13,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

      map.current.on('style.load', () => {
        console.log('✅ Map style loaded, initializing buildings...')
        loadBuildings()
      })

      map.current.on('moveend', loadBuildings)
      map.current.on('zoomend', loadBuildings)

      // FIX: Improved error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        // Only set error for critical issues, not minor warnings
        if (e.error && e.error.message && !e.error.message.includes('data expressions not supported')) {
          setError('Map rendering error')
        }
      })

    } catch (error) {
      console.error('Failed to initialize map:', error)
      setError('Failed to initialize map')
    }

    return () => {
      if (popup.current) {
        popup.current.remove()
      }
      if (map.current) {
        map.current.remove()
      }
    }
  }, [loadBuildings])

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
    return `$${price.toLocaleString()}`
  }

  const getListingStatusColor = (status?: string) => {
    switch (status) {
      case 'for-sale': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'for-rent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'sold': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'rented': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'available': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const getListingStatusText = (status?: string) => {
    switch (status) {
      case 'for-sale': return 'For Sale'
      case 'for-rent': return 'For Rent'
      case 'sold': return 'Sold'
      case 'rented': return 'Rented'
      case 'available': return 'Available'
      default: return 'Available'
    }
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <Card className="bg-red-900/20 border-red-500/30 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Mapbox Token Missing</h3>
            <p className="text-gray-300 text-sm">Please set NEXT_PUBLIC_MAPBOX_TOKEN</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <Card className="bg-red-900/20 border-red-500/30 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Map Error</h3>
            <p className="text-gray-300 text-sm">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => {
                setError(null)
                loadBuildings()
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-white text-sm">Loading ATTOM buildings...</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <h4 className="text-white font-bold text-sm mb-2">Price Range</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-300">&lt; $300K</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-300">$300K - $500K</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-300">$500K - $1M</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-300">$1M - $2M</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-300">&gt; $2M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-black/95 backdrop-blur border-white/10 text-white w-[500px] sm:w-[600px]">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-white text-lg">
                  {selectedBuilding?.properties?.address}
                </SheetTitle>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedBuilding?.properties?.city}, {selectedBuilding?.properties?.state} {selectedBuilding?.properties?.zipcode}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsSheetOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          {selectedBuilding && (
            <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
              <div className="space-y-6">
                {/* Property Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-sm">Market Value</span>
                      </div>
                      <p className="text-2xl font-bold text-green-400">
                        {formatPrice(selectedBuilding.properties.marketValue)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ${selectedBuilding.properties.pricePerSqFt}/sqft
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-400 text-sm">Annual Tax</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-400">
                        {formatPrice(selectedBuilding.properties.taxAmount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((selectedBuilding.properties.taxAmount / selectedBuilding.properties.marketValue) * 100).toFixed(2)}% rate
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Building Information */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      Building Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Floors</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.floors}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Units</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.units}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Height</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.buildingHeight}ft</p>
                      </div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Year Built</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.yearBuilt}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Property Type</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.propertyType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Living Size</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.livingSize.toLocaleString()} sqft</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Lot Size</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.lotSize.toLocaleString()} sqft</p>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Owner</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.owner}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Condition</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.condition}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Listings */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Home className="w-5 h-5 text-purple-400" />
                      Available Listings ({selectedBuilding.properties.listings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBuilding.properties.listings.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBuilding.properties.listings.map((listing, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedListing?.unit === listing.unit 
                                ? 'bg-white/10 border-white/30' 
                                : 'bg-white/5 border-white/10 hover:bg-white/8'
                            }`}
                            onClick={() => setSelectedListing(selectedListing?.unit === listing.unit ? null : listing)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-bold">Unit {listing.unit}</h4>
                                <p className="text-gray-400 text-sm">Floor {listing.floor}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-green-400 font-bold text-lg">
                                  {formatPrice(listing.price)}
                                </p>
                                <Badge className={getListingStatusColor(listing.status)}>
                                  {getListingStatusText(listing.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Bed className="w-3 h-3 text-gray-400" />
                                <span className="text-white">{listing.beds}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className="w-3 h-3 text-gray-400" />
                                <span className="text-white">{listing.baths}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Ruler className="w-3 h-3 text-gray-400" />
                                <span className="text-white">{listing.size.toLocaleString()} sqft</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-gray-400" />
                                <span className="text-white">${listing.pricePerSqFt}/sqft</span>
                              </div>
                            </div>

                            {selectedListing?.unit === listing.unit && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-400">Price per sqft</span>
                                    <p className="text-white font-bold">${listing.pricePerSqFt}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Floor</span>
                                    <p className="text-white font-bold">{listing.floor} of {selectedBuilding.properties.floors}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Schedule Tour
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No active listings available</p>
                        <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Financial Details */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-yellow-400" />
                      Financial Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Market Value</span>
                        <p className="text-white font-bold">{formatPrice(selectedBuilding.properties.marketValue)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Assessed Value</span>
                        <p className="text-white font-bold">{formatPrice(selectedBuilding.properties.assessedValue)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">AVM Value</span>
                        <p className="text-white font-bold">{formatPrice(selectedBuilding.properties.avmValue)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Annual Tax</span>
                        <p className="text-white font-bold">{formatPrice(selectedBuilding.properties.taxAmount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Building Features */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Building Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Wall Type</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.wallType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Roof Type</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.roofType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Heating</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.heating}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Cooling</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.cooling}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Pool</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.pool}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Construction</span>
                        <p className="text-white font-bold">{selectedBuilding.properties.construction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
} 