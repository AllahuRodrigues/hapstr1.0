import { NextRequest, NextResponse } from 'next/server'

interface ZillowProperty {
  zpid: string
  address: {
    streetAddress: string
    city: string
    state: string
    zipcode: string
  }
  price: number
  bedrooms: number
  bathrooms: number
  livingArea: number
  imgSrc: string
  latitude?: number
  longitude?: number
  rentZestimate?: number
  zestimate?: number
  yearBuilt?: number
  propertyType?: string
  lotSize?: number
  daysOnZillow?: number
}

interface ZillowRes { 
  props: ZillowProperty[]
  totalResultCount?: number
  totalPages?: number
}

interface WalkScoreData {
  walk?: number
  bike?: number
  transit?: number
}

interface PropertyComps {
  comps?: Array<{
    zpid: string
    price: number
    bedrooms: number
    bathrooms: number
    livingArea: number
    soldDate?: string
  }>
}

interface PriceHistory {
  priceHistory?: Array<{
    date: string
    price: number
    event: string
    source?: string
  }>
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sw = searchParams.get('sw')! // "-74.02,40.70"
  const ne = searchParams.get('ne')! // "-73.93,40.79"
  
  // Create a proper polygon for the search area
  const swLng = parseFloat(sw.split(',')[0])
  const swLat = parseFloat(sw.split(',')[1])
  const neLng = parseFloat(ne.split(',')[0])
  const neLat = parseFloat(ne.split(',')[1])
  
  const polygon = `${swLng} ${swLat}, ${neLng} ${swLat}, ${neLng} ${neLat}, ${swLng} ${neLat}, ${swLng} ${swLat}`

  const url = new URL('https://' + process.env.RAPIDAPI_ZILLOW_HOST + '/propertyByPolygon')
  url.searchParams.set('polygon', polygon)
  url.searchParams.set('status_type', 'ForSale')
  url.searchParams.set('home_type', 'Houses')
  url.searchParams.set('page', '0')

  const headers = {
    'x-rapidapi-host': process.env.RAPIDAPI_ZILLOW_HOST!,
    'x-rapidapi-key': process.env.RAPIDAPI_ZILLOW_KEY!
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      console.error('Zillow API error:', res.status, res.statusText)
      return NextResponse.json({ error: 'Zillow API error', status: res.status }, { status: 500 })
    }

    const data = (await res.json()) as ZillowRes

    if (!data.props || data.props.length === 0) {
      return NextResponse.json([])
    }

    // Process properties and get additional details
    const properties = await Promise.all(
      data.props.slice(0, 8).map(async (p) => {
        let rentEstimate = null
        let zestimate = null
        let walkScore = null
        let bikeScore = null
        let transitScore = null
        let priceHistory = null
        let comps = null

        // Get comprehensive property data
        try {
          if (p.zpid) {
            // Get multiple data points in parallel for better performance
            const [rentRes, zestRes, walkRes, priceRes, compsRes] = await Promise.allSettled([
              // Rent estimate
              fetch(`https://${process.env.RAPIDAPI_ZILLOW_HOST}/rentEstimate?zpid=${p.zpid}`, { headers }),
              
              // Zestimate
              fetch(`https://${process.env.RAPIDAPI_ZILLOW_HOST}/zestimate?zpid=${p.zpid}`, { headers }),
              
              // Walk/Transit scores
              fetch(`https://${process.env.RAPIDAPI_ZILLOW_HOST}/walkAndTransitScore?zpid=${p.zpid}`, { headers }),
              
              // Price history
              fetch(`https://${process.env.RAPIDAPI_ZILLOW_HOST}/priceAndTaxHistory?zpid=${p.zpid}`, { headers }),
              
              // Property comps
              fetch(`https://${process.env.RAPIDAPI_ZILLOW_HOST}/propertyComps?zpid=${p.zpid}`, { headers })
            ])

            // Process rent estimate
            if (rentRes.status === 'fulfilled' && rentRes.value.ok) {
              const rentData = await rentRes.value.json()
              rentEstimate = rentData.rentZestimate || rentData.rent || rentData.estimate
            }

            // Process zestimate
            if (zestRes.status === 'fulfilled' && zestRes.value.ok) {
              const zestData = await zestRes.value.json()
              zestimate = zestData.zestimate || zestData.estimate
            }

            // Process walk/transit scores
            if (walkRes.status === 'fulfilled' && walkRes.value.ok) {
              const walkData: WalkScoreData = await walkRes.value.json()
              walkScore = walkData.walk
              bikeScore = walkData.bike
              transitScore = walkData.transit
            }

            // Process price history
            if (priceRes.status === 'fulfilled' && priceRes.value.ok) {
              const priceData: PriceHistory = await priceRes.value.json()
              priceHistory = priceData.priceHistory?.slice(0, 5) // Last 5 entries
            }

            // Process comps
            if (compsRes.status === 'fulfilled' && compsRes.value.ok) {
              const compsData: PropertyComps = await compsRes.value.json()
              comps = compsData.comps?.slice(0, 3) // Top 3 comps
            }
          }
        } catch (error) {
          console.error('Error fetching additional property details:', error)
        }

        return {
          id: p.zpid,
          title: p.address?.streetAddress || 'Property',
          address: `${p.address?.streetAddress || ''}, ${p.address?.city || ''}, ${p.address?.state || ''} ${p.address?.zipcode || ''}`.trim(),
          price: p.price || 0,
          beds: p.bedrooms || 0,
          baths: p.bathrooms || 0,
          sqft: p.livingArea || 0,
          photo: p.imgSrc || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
          lat: p.latitude,
          lng: p.longitude,
          rentEstimate: rentEstimate,
          zestimate: zestimate,
          yearBuilt: p.yearBuilt,
          propertyType: p.propertyType || 'House',
          lotSize: p.lotSize,
          daysOnZillow: p.daysOnZillow,
          // Enhanced data
          walkScore: walkScore,
          bikeScore: bikeScore,
          transitScore: transitScore,
          priceHistory: priceHistory,
          comps: comps
        }
      })
    )

    return NextResponse.json(properties)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
} 