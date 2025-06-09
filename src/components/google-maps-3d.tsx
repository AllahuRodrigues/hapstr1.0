'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

// Declare global google object
declare global {
  interface Window {
    google: any
  }
}

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
  hasListing?: boolean
  listingType?: string
  availabilityStatus?: string
}

const NYC_CENTER = { lat: 40.7128, lng: -74.006 } // NYC Center
const NYC_BOUNDS = {
  north: 40.9176,
  south: 40.4774,
  west: -74.2591,
  east: -73.7004
}

export default function GoogleMaps3D() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [property, setProperty] = useState<NYCProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError('Google Maps API key not found. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Starting Google Maps initialization...')
        console.log('API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
        
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry', 'marker']
        })

        console.log('Loading Google Maps API...')
        const google = await loader.load()
        console.log('Google Maps API loaded successfully')
        
        // Wait for DOM to be ready
        await new Promise(resolve => {
          if (mapRef.current) {
            resolve(true)
          } else {
            setTimeout(resolve, 100)
          }
        })

        if (!mapRef.current) {
          console.error('Map container ref is null')
          setError('Map container not available')
          setLoading(false)
          return
        }

        console.log('Creating map instance...')
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: NYC_CENTER,
          zoom: 13,
          mapTypeId: 'satellite',
          tilt: 60, // 3D eagle-eye perspective
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
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          // Enable 3D buildings
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined
        })

        console.log('Map instance created successfully')
        
        // Wait for map to be fully loaded
        await new Promise(resolve => {
          const listener = google.maps.event.addListenerOnce(mapInstance, 'tilesloaded', () => {
            console.log('Map tiles loaded')
            resolve(true)
          })
          // Fallback timeout
          setTimeout(resolve, 3000)
        })

        setMap(mapInstance)

        // Add click listener for comprehensive NYC property search
        mapInstance.addListener('click', async (e: any) => {
          if (!e.latLng) return
          
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          
          console.log(`Clicked at: ${lat}, ${lng}`)
          
          // Check if click is within NYC bounds
          if (lat >= NYC_BOUNDS.south && lat <= NYC_BOUNDS.north && 
              lng >= NYC_BOUNDS.west && lng <= NYC_BOUNDS.east) {
            await fetchProperty(lat, lng, mapInstance)
          } else {
            console.log('Click outside NYC bounds')
          }
        })

        setLoading(false)
        console.log('Google Maps setup complete')
        
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError(`Failed to load Google Maps: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your API key and internet connection.`)
        setLoading(false)
      }
    }

    // Initialize with proper timing
    if (typeof window !== 'undefined') {
      const timer = setTimeout(initMap, 200)
      return () => clearTimeout(timer)
    }
  }, [])

  const fetchProperty = async (lat: number, lng: number, mapInstance?: any) => {
    try {
      const response = await fetch(`/api/nyc-property?lat=${lat}&lng=${lng}`)
      const data = await response.json()
      
      setProperty({
        address: data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
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
        description: data.description,
        photos: data.photos,
        rentZestimate: data.rentZestimate,
        boro: data.boro,
        block: data.block,
        lot: data.lot,
        zipcode: data.zipcode,
        councilDistrict: data.councilDistrict,
        communityDistrict: data.communityDistrict,
        hasListing: data.hasListing,
        listingType: data.listingType,
        availabilityStatus: data.availabilityStatus
      })

      // Add or update marker
      if (window.google) {
        if (markerRef.current) {
          markerRef.current.setMap(null)
        }

        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance || map,
          title: data.address,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: data.hasListing ? '#007bff' : '#dc3545',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        })

        // Pan to the selected location with 3D view
        if (mapInstance || map) {
          (mapInstance || map).panTo({ lat, lng })
          ;(mapInstance || map).setZoom(18)
          ;(mapInstance || map).setTilt(60)
        }
      }
    } catch (err) {
      console.error('NYC Property fetch failed:', err)
    }
  }

  const PropertyCard = useCallback(() => {
    if (!property) return null

    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 md:w-[480px] bg-black/20 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden z-10 border border-white/30">
        {property.photos?.[0]?.url && (
          <img 
            src={property.photos[0].url} 
            alt={property.buildingName || 'NYC Property'} 
            className="w-full h-40 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
            }}
          />
        )}
        
        {/* Header with Close Button */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">
                {property.buildingName || 'NYC Property'}
              </h3>
              {property.hasListing && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-400/30">
                  {property.listingType === 'FOR_RENT' ? 'FOR RENT' : 
                   property.listingType === 'FOR_SALE' ? 'FOR SALE' : 
                   property.listingType === 'RECENTLY_SOLD' ? 'RECENTLY SOLD' : 'AVAILABLE'}
                </span>
              )}
              {!property.hasListing && (
                <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-400/30">
                  NOT LISTED
                </span>
              )}
            </div>
            <p className="text-sm text-white/90">{property.address}</p>
            <p className="text-xs text-white/70">{property.borough}</p>
          </div>
          <button 
            onClick={() => setProperty(null)}
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
            {property.price && (
              <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30">
                <p className="text-xs text-emerald-200 font-medium">ESTIMATED VALUE</p>
                <p className="text-lg font-bold text-emerald-100">
                  ${(property.price / 1000000).toFixed(2)}M
                </p>
                {property.assessedValue && (
                  <p className="text-xs text-emerald-300">
                    Assessed: ${(property.assessedValue / 1000).toFixed(0)}K
                  </p>
                )}
              </div>
            )}
            
            {property.rentZestimate && (
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
                <p className="text-xs text-blue-200 font-medium">MONTHLY RENT EST.</p>
                <p className="text-lg font-bold text-blue-100">
                  ${(property.rentZestimate / 1000).toFixed(1)}K/mo
                </p>
                <p className="text-xs text-blue-300">
                  ${property.rentZestimate.toLocaleString()}/month
                </p>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2">
            {property.yearBuilt && (
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-xs text-white/70">Built</p>
                <p className="text-sm font-bold text-yellow-300">{property.yearBuilt}</p>
              </div>
            )}
            {property.numFloors && (
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-xs text-white/70">Floors</p>
                <p className="text-sm font-bold text-purple-300">{property.numFloors}</p>
              </div>
            )}
            {property.residentialUnits && property.residentialUnits > 0 && (
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-xs text-white/70">Units</p>
                <p className="text-sm font-bold text-orange-300">{property.residentialUnits}</p>
              </div>
            )}
          </div>

          {/* Property Intelligence */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {property.zoning && (
              <div className="bg-white/5 rounded p-2">
                <span className="text-white/70">Zoning:</span>
                <span className="ml-1 text-white font-medium">{property.zoning}</span>
              </div>
            )}
            {property.buildingClass && (
              <div className="bg-white/5 rounded p-2">
                <span className="text-white/70">Building Class:</span>
                <span className="ml-1 text-white font-medium">{property.buildingClass}</span>
              </div>
            )}
            {property.buildingArea && (
              <div className="bg-white/5 rounded p-2">
                <span className="text-white/70">Building Area:</span>
                <span className="ml-1 text-white font-medium">{property.buildingArea.toLocaleString()} sqft</span>
              </div>
            )}
            {property.lotArea && (
              <div className="bg-white/5 rounded p-2">
                <span className="text-white/70">Lot Size:</span>
                <span className="ml-1 text-white font-medium">{property.lotArea.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
          
          {property.landUse && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/70 mb-1 font-medium">LAND USE CLASSIFICATION</p>
              <p className="text-sm text-white/90">{property.landUse}</p>
            </div>
          )}
          
          {property.description && (
            <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => setProperty(null)}
              className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              Close Details
            </button>
            {property.boro && property.block && property.lot && (
              <button 
                onClick={() => window.open(`https://data.cityofnewyork.us/resource/64uk-42ks.json?boro=${property.boro}&block=${property.block}&lot=${property.lot}`, '_blank')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-blue-400/30"
              >
                NYC Data
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }, [property])

  const BoroughSelector = useCallback(() => (
    <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
      <div className="flex flex-wrap gap-2">
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
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white font-medium transition-colors"
          >
            {borough.name}
          </button>
        ))}
      </div>
    </div>
  ), [map])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading NYC Google Maps 3D...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-600 text-lg font-semibold">Google Maps Not Configured</div>
          <div className="text-gray-600">
            <p className="mb-2">{error}</p>
            <div className="bg-gray-200 p-3 rounded text-sm text-left">
              <div className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key</div>
            </div>
            <p className="mt-2 text-xs">
              Get API keys at <a href="https://console.cloud.google.com" className="text-blue-600 underline">Google Cloud Console</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-full" />
      <PropertyCard />
      <BoroughSelector />
      
      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md rounded-lg p-3 shadow-lg max-w-xs z-10 border border-white/30">
        <h4 className="font-semibold text-sm mb-1 text-white">NYC Google Maps 3D</h4>
        <p className="text-xs text-white/80">
          Click anywhere on NYC buildings to explore PLUTO property data with real-time details
        </p>
      </div>
    </div>
  )
} 