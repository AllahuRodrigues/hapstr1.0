'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Layers, 
  Navigation, 
  ZoomIn, 
  ZoomOut,
  Compass,
  Home,
  Search,
  Filter
} from 'lucide-react'

// Set Mapbox token
if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
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
}

interface Mapbox3DProps {
  onPropertySelect?: (property: any) => void
  className?: string
}

export default function Mapbox3D({ onPropertySelect, className }: Mapbox3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selected, setSelected] = useState<NYCProperty | null>(null)
  const [isMapboxReady, setIsMapboxReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [show3DBuildings, setShow3DBuildings] = useState(true)
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark')

  // Check if Mapbox is available
  useEffect(() => {
    const checkMapbox = () => {
      if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        setIsMapboxReady(true)
        setError(null)
      } else {
        const errorMsg = 'Mapbox token not found. Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file'
        console.warn(errorMsg)
        setError(errorMsg)
      }
    }
    
    checkMapbox()
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.006, 40.7128], // NYC coordinates
      zoom: 12,
      pitch: 60, // Tilt the map for 3D effect
      bearing: -17.6,
      antialias: true,
      maxBounds: [
        [-74.2591, 40.4774], // Southwest
        [-73.7004, 40.9176]  // Northeast
      ]
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
    
    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-left'
    )

    map.current.on('load', () => {
      if (!map.current) return

      // Add 3D building layer
      map.current.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 12,
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['>', ['get', 'height'], 300], '#e55e5e', // Red for very tall buildings
            ['>', ['get', 'height'], 150], '#3887be', // Blue for tall buildings  
            ['>', ['get', 'height'], 50], '#5d9cec',  // Light blue for medium buildings
            '#74b9ff' // Light blue for short buildings
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            0,
            12.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            0,
            12.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.8
        }
      })

      // Add building outlines for better visibility
      map.current.addLayer({
        'id': 'building-outlines',
        'source': 'composite',
        'source-layer': 'building',
        'type': 'line',
        'minzoom': 15,
        'paint': {
          'line-color': '#ffffff',
          'line-width': 0.5,
          'line-opacity': 0.6
        }
      })

      setMapLoaded(true)
    })

    // Add click handler for property selection
    map.current.on('click', (e) => {
      if (!map.current) return

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['3d-buildings', 'building-outlines']
      })

      if (features.length > 0) {
        const feature = features[0]
        onPropertySelect?.({
          address: feature.properties?.address || 'Unknown Address',
          borough: feature.properties?.borough || 'Unknown Borough',
          buildingClass: feature.properties?.building_class || 'Unknown',
          height: feature.properties?.height || 0,
          minHeight: feature.properties?.min_height || 0
        })
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [onPropertySelect, mapStyle])

  const BoroughSelector = () => (
    <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
      <div className="flex flex-wrap gap-2">
        {[
          { name: 'Manhattan', center: [-73.9712, 40.7831], color: 'bg-red-500' },
          { name: 'Brooklyn', center: [-73.9442, 40.6782], color: 'bg-blue-500' },
          { name: 'Queens', center: [-73.7949, 40.7282], color: 'bg-green-500' },
          { name: 'Bronx', center: [-73.8648, 40.8448], color: 'bg-yellow-500' },
          { name: 'Staten Island', center: [-74.1502, 40.5795], color: 'bg-purple-500' }
        ].map((borough) => (
          <button
            key={borough.name}
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: borough.center as [number, number],
                  zoom: 13,
                  pitch: 60,
                  speed: 1.2
                })
              }
            }}
            className={`px-3 py-1 ${borough.color} hover:opacity-80 rounded text-xs text-white font-medium transition-colors`}
          >
            {borough.name}
          </button>
        ))}
      </div>
    </div>
  )

  const MapControls = () => (
    <div className="absolute bottom-4 left-4 space-y-2">
      <Button
        size="sm"
        variant="outline"
        className="bg-black/80 hover:bg-black/90 text-white border-white/20"
        onClick={() => setShow3DBuildings(!show3DBuildings)}
      >
        <Layers className="w-4 h-4 mr-2" />
        {show3DBuildings ? 'Hide 3D' : 'Show 3D'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-black/80 hover:bg-black/90 text-white border-white/20"
        onClick={() => setMapStyle(mapStyle === 'dark' ? 'satellite' : 'dark')}
      >
        <Navigation className="w-4 h-4 mr-2" />
        {mapStyle === 'dark' ? 'Satellite' : 'Dark'}
      </Button>
    </div>
  )

  if (!isMapboxReady) {
    return (
      <div className={`h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 ${className || ''}`}>
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Mapbox Configuration Required</h3>
            <p className="text-slate-600 mb-4">
              {error || 'To view the interactive 3D map, please add your Mapbox token to your environment configuration.'}
            </p>
            <div className="bg-white p-4 rounded-lg border text-left">
              <p className="text-sm font-medium text-slate-700 mb-2">Add to .env.local:</p>
              <code className="text-xs bg-slate-100 p-2 rounded block">
                NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
              </code>
              <p className="text-xs text-slate-500 mt-2">
                Get a free token at{' '}
                <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">
                  mapbox.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapContainer} 
      className={cn('w-full h-full relative', className)}
    >
      <BoroughSelector />
      <MapControls />
      
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30 max-w-md mx-auto">
          <div className="flex items-start justify-between p-4 pb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {selected.buildingName || 'NYC Property'}
              </h3>
              <p className="text-sm text-white/90">{selected.address}</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selected.borough} • {selected.zipcode}
              </p>
            </div>
            <button 
              onClick={() => setSelected(null)}
              className="ml-3 p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 pb-4 space-y-3">
            {/* Property Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {selected.assessedValue && (
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    ${(selected.assessedValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-white/70">Assessed Value</p>
                </div>
              )}
              {selected.buildingArea && (
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {selected.buildingArea.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/70">Sq Ft</p>
                </div>
              )}
              {selected.yearBuilt && (
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{selected.yearBuilt}</p>
                  <p className="text-xs text-white/70">Year Built</p>
                </div>
              )}
              {selected.numFloors && (
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{selected.numFloors}</p>
                  <p className="text-xs text-white/70">Floors</p>
                </div>
              )}
            </div>

            {/* Additional Property Details */}
            <div className="grid grid-cols-1 gap-2 text-xs">
              {selected.zoning && (
                <div className="flex justify-between">
                  <span className="text-white/70">Zoning:</span>
                  <span className="text-white">{selected.zoning}</span>
                </div>
              )}
              {selected.landUse && (
                <div className="flex justify-between">
                  <span className="text-white/70">Land Use:</span>
                  <span className="text-white">{selected.landUse}</span>
                </div>
              )}
              {selected.buildingClass && (
                <div className="flex justify-between">
                  <span className="text-white/70">Building Class:</span>
                  <span className="text-white">{selected.buildingClass}</span>
                </div>
              )}
              {selected.residentialUnits && (
                <div className="flex justify-between">
                  <span className="text-white/70">Residential Units:</span>
                  <span className="text-white">{selected.residentialUnits}</span>
                </div>
              )}
            </div>

            {/* NYC Data Link */}
            {selected.boro && selected.block && selected.lot && (
              <div className="pt-2 border-t border-white/20">
                <a
                  href={`https://data.cityofnewyork.us/resource/64uk-42ks.json?boro=${selected.boro}&block=${selected.block}&lot=${selected.lot}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm border border-blue-400/30 text-white"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View NYC Data
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 