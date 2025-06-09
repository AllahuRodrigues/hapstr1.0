'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { SearchBar } from './search-bar'
import { PropertyCard } from './property-card'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { RefreshCw, MapPin, Building, Database } from 'lucide-react'
import type { ZillowProperty, PropertySearchResult, HomeCard } from '@/lib/types'

// Declare global google object
declare global {
  interface Window {
    google: any
  }
}

const NYC_CENTER = { lat: 40.7128, lng: -74.006 } // NYC Center
const NYC_BOUNDS = {
  north: 40.9176,
  south: 40.4774,
  west: -74.2591,
  east: -73.7004
}

interface SearchResult {
  id: string
  name: string
  place_name: string
  center: [number, number]
  bbox?: [number, number, number, number]
}

interface NYCProperty {
  address: string
  buildingName?: string
  borough: string
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
  latitude?: number
  longitude?: number
  hasListing?: boolean
}

export function EagleMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<NYCProperty[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [resultCount, setResultCount] = useState(0)
  const [isDemoData, setIsDemoData] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<NYCProperty | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError('Google Maps API key not found. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file')
        setLoading(false)
        return
      }

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        const google = await loader.load()
        
        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: NYC_CENTER,
          zoom: 13,
          mapTypeId: 'satellite',
          tilt: 60, // Eagle-eye 3D perspective
          heading: 0,
          restriction: {
            latLngBounds: NYC_BOUNDS,
            strictBounds: false
          },
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'simplified' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        })

        setMap(mapInstance)

        // Load initial demo properties for NYC
        loadNYCDemoProperties()

        // Add bounds change listener for dynamic loading
        const boundsChangedListener = google.maps.event.addListener(
          mapInstance,
          'bounds_changed',
          debounce(() => {
            const bounds = mapInstance.getBounds()
            if (bounds) {
              searchPropertiesInBounds(bounds)
            }
          }, 1000)
        )

        // Add click listener for property details
        mapInstance.addListener('click', async (e: any) => {
          if (!e.latLng) return
          
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          
          await fetchPropertyDetails(lat, lng)
        })

        return () => {
          google.maps.event.removeListener(boundsChangedListener)
        }
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError('Failed to load map. Please check your internet connection and API key.')
      } finally {
        setLoading(false)
      }
    }

    initMap()
  }, [])

  // Fetch detailed property information
  const fetchPropertyDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/nyc-property?lat=${lat}&lng=${lng}`)
      const data = await response.json()
      
      setSelectedProperty({
        address: data.address || 'Address not available',
        buildingName: data.buildingName,
        borough: data.borough,
        price: data.price,
        assessedValue: data.assessedValue,
        buildingArea: data.buildingArea,
        lotArea: data.lotArea,
        yearBuilt: data.yearBuilt,
        numFloors: data.numFloors,
        zoning: data.zoning,
        landUse: data.landUse,
        buildingClass: data.buildingClass,
        residentialUnits: data.residentialUnits,
        totalUnits: data.totalUnits,
        rentZestimate: data.rentZestimate,
        boro: data.boro,
        block: data.block,
        lot: data.lot,
        zipcode: data.zipcode,
        councilDistrict: data.councilDistrict,
        communityDistrict: data.communityDistrict,
        latitude: data.latitude,
        longitude: data.longitude,
        hasListing: data.hasListing
      })

      // Center map on selected property
      if (map) {
        map.panTo({ lat, lng })
        map.setZoom(Math.max(map.getZoom()!, 17))
      }
    } catch (err) {
      console.error('Property fetch failed:', err)
    }
  }

  // Debounce function for API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  // Search properties within map bounds using NYC coordinates
  const searchPropertiesInBounds = async (bounds: any) => {
    if (!bounds) return

    setSearchLoading(true)
    
    try {
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      
      // Generate multiple NYC properties based on the bounds
      const centerLat = (ne.lat() + sw.lat()) / 2
      const centerLng = (ne.lng() + sw.lng()) / 2
      
      // Fetch real NYC properties within the bounds
      const nycProperties: NYCProperty[] = []
      
      // Generate several coordinate points within the bounds and fetch real data
      for (let i = 0; i < 6; i++) {
        const lat = sw.lat() + Math.random() * (ne.lat() - sw.lat())
        const lng = sw.lng() + Math.random() * (ne.lng() - sw.lng())
        
        try {
          const response = await fetch(`/api/nyc-property?lat=${lat}&lng=${lng}`)
          const data = await response.json()
          
          if (data && !data.error) {
            nycProperties.push({
              address: data.address,
              buildingName: data.buildingName,
              borough: data.borough,
              price: data.price,
              assessedValue: data.assessedValue,
              buildingArea: data.buildingArea,
              lotArea: data.lotArea,
              yearBuilt: data.yearBuilt,
              numFloors: data.numFloors,
              zoning: data.zoning,
              landUse: data.landUse,
              buildingClass: data.buildingClass,
              residentialUnits: data.residentialUnits,
              totalUnits: data.totalUnits,
              rentZestimate: data.rentZestimate,
              boro: data.boro,
              block: data.block,
              lot: data.lot,
              zipcode: data.zipcode,
              councilDistrict: data.councilDistrict,
              communityDistrict: data.communityDistrict,
              latitude: data.latitude,
              longitude: data.longitude,
              hasListing: data.hasListing
            })
          }
        } catch (err) {
          console.error('Failed to fetch NYC property:', err)
        }
      }
      
      // If we got real NYC properties, use them, otherwise generate demo NYC data
      if (nycProperties.length > 0) {
        setProperties(nycProperties)
        setResultCount(nycProperties.length)
        setIsDemoData(false)
        updateMapMarkers(nycProperties)
      } else {
        // Generate NYC demo properties as fallback
        const demoProperties = generateBoundsProperties(centerLat, centerLng, 8)
        setProperties(demoProperties)
        setResultCount(demoProperties.length)
        setIsDemoData(true)
        updateMapMarkers(demoProperties)
      }
      
    } catch (err) {
      console.error('Property search error:', err)
      setError('Failed to load NYC properties. Showing demo data.')
      
      // Load demo properties
      loadNYCDemoProperties()
    } finally {
      setSearchLoading(false)
    }
  }

  // Generate properties within specific bounds
  const generateBoundsProperties = (centerLat: number, centerLng: number, count: number): NYCProperty[] => {
    const boroughNames = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
    const landUseTypes = [
      'One Family Dwellings',
      'Multi-Family Walkup', 
      'Multi-Family Elevator',
      'Mixed Residential & Commercial',
      'Commercial'
    ]
    
    return Array.from({ length: count }, (_, i) => ({
      address: `${Math.floor(Math.random() * 999) + 100} ${['Broadway', 'Atlantic Ave', 'Queens Blvd', 'Grand Concourse', 'Victory Blvd'][i % 5]}, ${boroughNames[i % 5]}, NY`,
      buildingName: `NYC Property ${i + 1}`,
      borough: boroughNames[i % 5],
      price: 800000 + Math.floor(Math.random() * 3000000),
      assessedValue: 400000 + Math.floor(Math.random() * 1500000),
      buildingArea: 1200 + Math.floor(Math.random() * 4000),
      lotArea: 800 + Math.floor(Math.random() * 2000),
      yearBuilt: 1920 + Math.floor(Math.random() * 100),
      numFloors: 2 + Math.floor(Math.random() * 20),
      zoning: ['R6', 'R7A', 'C4-4', 'M1-1', 'R8'][i % 5],
      landUse: landUseTypes[i % 5],
      buildingClass: ['A5', 'C2', 'D4', 'O4', 'S1'][i % 5],
      residentialUnits: 1 + Math.floor(Math.random() * 20),
      totalUnits: 1 + Math.floor(Math.random() * 25),
      rentZestimate: 2500 + Math.floor(Math.random() * 6000),
      boro: String((i % 5) + 1),
      block: String(Math.floor(Math.random() * 9999) + 1000),
      lot: String(Math.floor(Math.random() * 999) + 1),
      zipcode: `1${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
      councilDistrict: String(Math.floor(Math.random() * 51) + 1),
      communityDistrict: String(Math.floor(Math.random() * 59) + 101),
      latitude: undefined,
      longitude: undefined,
      hasListing: false
    }))
  }

  // Load demo properties for NYC
  const loadNYCDemoProperties = () => {
    const demoProperties = generateBoundsProperties(40.7128, -74.006, 12)
    setProperties(demoProperties)
    setResultCount(demoProperties.length)
    setIsDemoData(true)
    updateMapMarkers(demoProperties)
  }

  // Update map markers
  const updateMapMarkers = (properties: NYCProperty[]) => {
    if (!mapRef.current || !window.google) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    markers.length = 0

    // Add new markers with color coding based on availability
    properties.forEach((property, index) => {
      if (property.latitude && property.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map: mapRef.current,
          title: property.address,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: property.hasListing ? '#007bff' : '#dc3545', // Blue for listings, Red for no listings
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        marker.addListener('click', () => {
          setSelectedProperty(property)
        })

        markers.push(marker)
      }
    })
  }

  // Handle NYC location search
  const handleLocationSelect = async (result: SearchResult) => {
    if (!map) return

    const [lng, lat] = result.center
    setSearchQuery(result.place_name)
    
    console.log(`Searching for: ${result.place_name} at ${lat}, ${lng}`)
    
    // Check if the result is in NYC area
    const isNYC = (lat >= 40.4774 && lat <= 40.9176 && lng >= -74.2591 && lng <= -73.7004)
    
    if (!isNYC && !result.place_name.toLowerCase().includes('new york')) {
      // If not NYC, default to NYC center
      console.log('Location not in NYC, defaulting to NYC center')
      map.panTo(NYC_CENTER)
      map.setZoom(12)
    } else {
      // Animate to location with eagle-eye view
      map.panTo({ lat, lng })
      map.setZoom(15)
    }
    
    map.setTilt(60)
    
    // Search for properties in the new area
    setTimeout(async () => {
      const bounds = map.getBounds()
      if (bounds) {
        await searchPropertiesInBounds(bounds)
      }
    }, 1000) // Wait for map animation to complete
  }

  // Refresh properties
  const refreshProperties = () => {
    if (map) {
      const bounds = map.getBounds()
      searchPropertiesInBounds(bounds)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading NYC Eagle-Eye Map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Search Header */}
      <div className="absolute top-4 left-4 right-4 z-10 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <SearchBar 
              onLocationSelect={handleLocationSelect}
              placeholder="Search NYC neighborhoods, addresses, or landmarks..."
              className="bg-black/20 backdrop-blur-md text-white placeholder:text-white/70 border-white/30"
            />
          </div>
          
          <Button
            onClick={refreshProperties}
            disabled={searchLoading}
            variant="outline"
            size="icon"
            className="bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-black/30"
          >
            <RefreshCw className={`h-4 w-4 ${searchLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Results summary */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-black/20 backdrop-blur-md text-white border-white/30">
            <Building className="h-3 w-3 mr-1" />
            {resultCount} NYC properties found
          </Badge>
          
          {isDemoData && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
              Demo Data
            </Badge>
          )}
          
          {searchLoading && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              Loading...
            </Badge>
          )}
        </div>

        {/* Borough quick navigation */}
        <div className="flex gap-2 flex-wrap">
          {[
            { name: 'Manhattan', center: { lat: 40.7831, lng: -73.9712 } },
            { name: 'Brooklyn', center: { lat: 40.6782, lng: -73.9442 } },
            { name: 'Queens', center: { lat: 40.7282, lng: -73.7949 } },
            { name: 'Bronx', center: { lat: 40.8448, lng: -73.8648 } },
            { name: 'Staten Island', center: { lat: 40.5795, lng: -74.1502 } }
          ].map((borough) => (
            <button
              key={borough.name}
              onClick={() => {
                if (map) {
                  map.panTo(borough.center)
                  map.setZoom(13)
                  map.setTilt(60)
                }
              }}
              className="px-3 py-1 bg-black/20 backdrop-blur-md hover:bg-black/30 rounded text-xs text-white font-medium transition-colors border border-white/20"
            >
              {borough.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Selected Property Detail Card */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 md:w-[480px] bg-black/20 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden z-20 border border-white/30">
            {/* Header with Close Button */}
            <div className="flex items-start justify-between p-4 pb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {selectedProperty.buildingName || 'NYC Property'}
                </h3>
                <p className="text-sm text-white/90">{selectedProperty.address}</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedProperty.borough} • {selectedProperty.zipcode}
                </p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="ml-3 p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="Close property details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-4 space-y-4">
              {/* Key Financial Information */}
              <div className="grid grid-cols-2 gap-3">
                {selectedProperty.price && (
                  <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30">
                    <p className="text-xs text-emerald-200 font-medium">ESTIMATED VALUE</p>
                    <p className="text-lg font-bold text-emerald-100">
                      ${(selectedProperty.price / 1000000).toFixed(2)}M
                    </p>
                    {selectedProperty.assessedValue && (
                      <p className="text-xs text-emerald-300">
                        Assessed: ${(selectedProperty.assessedValue / 1000).toFixed(0)}K
                      </p>
                    )}
                  </div>
                )}
                
                {selectedProperty.rentZestimate && (
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
                    <p className="text-xs text-blue-200 font-medium">MONTHLY RENT EST.</p>
                    <p className="text-lg font-bold text-blue-100">
                      ${(selectedProperty.rentZestimate / 1000).toFixed(1)}K/mo
                    </p>
                    <p className="text-xs text-blue-300">
                      ${selectedProperty.rentZestimate.toLocaleString()}/month
                    </p>
                  </div>
                )}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-3 gap-2">
                {selectedProperty.yearBuilt && (
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/70">Built</p>
                    <p className="text-sm font-bold text-yellow-300">{selectedProperty.yearBuilt}</p>
                  </div>
                )}
                {selectedProperty.numFloors && (
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/70">Floors</p>
                    <p className="text-sm font-bold text-purple-300">{selectedProperty.numFloors}</p>
                  </div>
                )}
                {selectedProperty.residentialUnits && selectedProperty.residentialUnits > 0 && (
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/70">Units</p>
                    <p className="text-sm font-bold text-orange-300">{selectedProperty.residentialUnits}</p>
                  </div>
                )}
              </div>

              {/* Investment & Business Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white/90 flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  Property Intelligence
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedProperty.zoning && (
                    <div className="bg-white/5 rounded p-2">
                      <span className="text-white/70">Zoning:</span>
                      <span className="ml-1 text-white font-medium">{selectedProperty.zoning}</span>
                    </div>
                  )}
                  {selectedProperty.buildingClass && (
                    <div className="bg-white/5 rounded p-2">
                      <span className="text-white/70">Building Class:</span>
                      <span className="ml-1 text-white font-medium">{selectedProperty.buildingClass}</span>
                    </div>
                  )}
                  {selectedProperty.buildingArea && (
                    <div className="bg-white/5 rounded p-2">
                      <span className="text-white/70">Building Area:</span>
                      <span className="ml-1 text-white font-medium">{selectedProperty.buildingArea.toLocaleString()} sqft</span>
                    </div>
                  )}
                  {selectedProperty.lotArea && (
                    <div className="bg-white/5 rounded p-2">
                      <span className="text-white/70">Lot Size:</span>
                      <span className="ml-1 text-white font-medium">{selectedProperty.lotArea.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Land Use Information */}
              {selectedProperty.landUse && (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-1 font-medium">LAND USE CLASSIFICATION</p>
                  <p className="text-sm text-white/90">{selectedProperty.landUse}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                >
                  Close Details
                </button>
                {selectedProperty.boro && selectedProperty.block && selectedProperty.lot && (
                  <button 
                    onClick={() => window.open(`https://data.cityofnewyork.us/resource/64uk-42ks.json?boro=${selectedProperty.boro}&block=${selectedProperty.block}&lot=${selectedProperty.lot}`, '_blank')}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-blue-400/30"
                  >
                    <Database className="h-3 w-3 inline mr-1" />
                    NYC Data
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Property List Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 max-h-48 overflow-y-auto border border-white/30">
            {searchLoading ? (
              <div className="flex gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="min-w-48">
                    <Skeleton className="h-32 w-full mb-2 bg-white/20" />
                    <Skeleton className="h-4 w-3/4 mb-1 bg-white/20" />
                    <Skeleton className="h-4 w-1/2 bg-white/20" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {properties.slice(0, 10).map((property, index) => (
                  <div 
                    key={index} 
                    className="min-w-48 cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden hover:bg-white/20 transition-colors">
                      <div className="h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Building className="h-8 w-8 text-white/60" />
                      </div>
                      <div className="p-3 text-white">
                        <h3 className="font-semibold text-sm truncate mb-1">{property.buildingName}</h3>
                        <p className="text-xs text-white/80 truncate">{property.borough}</p>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <div className="bg-white/10 rounded p-1 text-center">
                            <p className="text-xs text-white/70">Value</p>
                            <p className="text-xs font-bold text-emerald-300">
                              ${property.price ? (property.price / 1000000).toFixed(1) : '0'}M
                            </p>
                          </div>
                          <div className="bg-white/10 rounded p-1 text-center">
                            <p className="text-xs text-white/70">Floors</p>
                            <p className="text-xs font-bold text-purple-300">
                              {property.numFloors || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {properties.length > 10 && (
                  <div className="min-w-48 flex items-center justify-center bg-white/5 rounded-lg border border-white/20">
                    <p className="text-white/80 text-center">
                      +{properties.length - 10} more
                      <br />
                      <span className="text-xs">Zoom to see details</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-white/80">
                <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No properties found in this area</p>
                <p className="text-xs">Try searching a different NYC location</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 