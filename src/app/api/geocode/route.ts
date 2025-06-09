import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    // Try Mapbox Geocoding first
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=place,neighborhood,address&limit=5`
      
      const mapboxRes = await fetch(mapboxUrl)
      
      if (mapboxRes.ok) {
        const mapboxData = await mapboxRes.json()
        
        if (mapboxData.features && mapboxData.features.length > 0) {
          const results = mapboxData.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            place_name: feature.place_name,
            center: feature.center,
            bbox: feature.bbox
          }))
          
          return NextResponse.json({ results, provider: 'mapbox' })
        }
      }
    }

    // Fallback to Google Geocoding
    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      
      const googleRes = await fetch(googleUrl)
      
      if (googleRes.ok) {
        const googleData = await googleRes.json()
        
        if (googleData.results && googleData.results.length > 0) {
          const results = googleData.results.map((result: any) => ({
            id: result.place_id,
            name: result.address_components[0]?.long_name || result.formatted_address,
            place_name: result.formatted_address,
            center: [result.geometry.location.lng, result.geometry.location.lat],
            bbox: result.geometry.viewport ? [
              result.geometry.viewport.southwest.lng,
              result.geometry.viewport.southwest.lat,
              result.geometry.viewport.northeast.lng,
              result.geometry.viewport.northeast.lat
            ] : null
          }))
          
          return NextResponse.json({ results, provider: 'google' })
        }
      }
    }

    return NextResponse.json({ results: [], message: 'No results found' })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
} 