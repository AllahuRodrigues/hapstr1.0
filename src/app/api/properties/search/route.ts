import { NextRequest, NextResponse } from 'next/server'

interface ZillowProperty {
  zpid: string
  address: string
  bedrooms?: number
  bathrooms?: number
  price?: number
  homeType?: string
  homeStatus?: string
  imgSrc?: string
  longitude?: number
  latitude?: number
  livingArea?: number
  zestimate?: number
  rentZestimate?: number
}

interface PropertySearchResult {
  results: ZillowProperty[]
  totalResultCount: number
  isDemoData: boolean
}

// Rate limiting tracker
let lastAPICall = 0
const API_CALL_DELAY = 2000 // 2 seconds between calls

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const polygon = searchParams.get('polygon')
    
    if (!polygon) {
      return NextResponse.json(
        { error: 'Polygon parameter is required' },
        { status: 400 }
      )
    }

    // Check rate limiting
    const now = Date.now()
    if (now - lastAPICall < API_CALL_DELAY) {
      console.log('Rate limiting API call, returning demo data')
      return NextResponse.json(generateDemoData(polygon))
    }

    lastAPICall = now

    try {
      // Try Zillow API first
      const response = await fetch(
        `https://zillow-com1.p.rapidapi.com/propertyByPolygon?polygon=${encodeURIComponent(polygon)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.props && Array.isArray(data.props) && data.props.length > 0) {
          const results: ZillowProperty[] = data.props.map((prop: any) => ({
            zpid: prop.zpid || `prop_${Math.random().toString(36).substr(2, 9)}`,
            address: prop.address || 'Address not available',
            bedrooms: prop.bedrooms || prop.beds,
            bathrooms: prop.bathrooms || prop.baths,
            price: prop.price,
            homeType: prop.homeType,
            homeStatus: prop.homeStatus,
            imgSrc: prop.imgSrc,
            longitude: prop.longitude,
            latitude: prop.latitude,
            livingArea: prop.livingArea,
            zestimate: prop.zestimate,
            rentZestimate: prop.rentZestimate
          }))

          return NextResponse.json({
            results,
            totalResultCount: data.totalResultCount || results.length,
            isDemoData: false
          })
        }
      } else {
        console.error('Zillow API error:', response.status, response.statusText)
      }
    } catch (apiError) {
      console.error('Zillow API fetch error:', apiError)
    }

    // Fallback to demo data
    return NextResponse.json(generateDemoData(polygon))

  } catch (error) {
    console.error('Property search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateDemoData(polygon: string): PropertySearchResult {
  // Extract approximate center from polygon for realistic demo data
  const coords = polygon.split(',').map(parseFloat)
  const centerLat = coords.reduce((sum, val, idx) => idx % 2 === 0 ? sum + val : sum, 0) / (coords.length / 2)
  const centerLng = coords.reduce((sum, val, idx) => idx % 2 === 1 ? sum + val : sum, 0) / (coords.length / 2)

  // Generate realistic California demo properties
  const demoProperties: ZillowProperty[] = [
    {
      zpid: 'demo_001',
      address: `${Math.floor(Math.random() * 9999) + 1000} California St, San Francisco, CA 94111`,
      bedrooms: 2,
      bathrooms: 2,
      price: 850000 + Math.floor(Math.random() * 500000),
      homeType: 'CONDO',
      homeStatus: 'FOR_SALE',
      imgSrc: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      longitude: centerLng + (Math.random() - 0.5) * 0.01,
      latitude: centerLat + (Math.random() - 0.5) * 0.01,
      livingArea: 1200 + Math.floor(Math.random() * 800),
      zestimate: 820000 + Math.floor(Math.random() * 400000),
      rentZestimate: 3500 + Math.floor(Math.random() * 1500)
    },
    {
      zpid: 'demo_002',
      address: `${Math.floor(Math.random() * 9999) + 1000} Market St, San Francisco, CA 94105`,
      bedrooms: 3,
      bathrooms: 2.5,
      price: 1200000 + Math.floor(Math.random() * 800000),
      homeType: 'TOWNHOUSE',
      homeStatus: 'FOR_SALE',
      imgSrc: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      longitude: centerLng + (Math.random() - 0.5) * 0.01,
      latitude: centerLat + (Math.random() - 0.5) * 0.01,
      livingArea: 1800 + Math.floor(Math.random() * 1000),
      zestimate: 1150000 + Math.floor(Math.random() * 600000),
      rentZestimate: 4500 + Math.floor(Math.random() * 2000)
    },
    {
      zpid: 'demo_003',
      address: `${Math.floor(Math.random() * 9999) + 1000} Mission St, San Francisco, CA 94110`,
      bedrooms: 1,
      bathrooms: 1,
      price: 650000 + Math.floor(Math.random() * 300000),
      homeType: 'APARTMENT',
      homeStatus: 'FOR_SALE',
      imgSrc: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      longitude: centerLng + (Math.random() - 0.5) * 0.01,
      latitude: centerLat + (Math.random() - 0.5) * 0.01,
      livingArea: 800 + Math.floor(Math.random() * 400),
      zestimate: 625000 + Math.floor(Math.random() * 250000),
      rentZestimate: 2800 + Math.floor(Math.random() * 1200)
    },
    {
      zpid: 'demo_004',
      address: `${Math.floor(Math.random() * 9999) + 1000} Valencia St, San Francisco, CA 94110`,
      bedrooms: 4,
      bathrooms: 3,
      price: 1800000 + Math.floor(Math.random() * 1200000),
      homeType: 'SINGLE_FAMILY',
      homeStatus: 'FOR_SALE',
      imgSrc: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop',
      longitude: centerLng + (Math.random() - 0.5) * 0.01,
      latitude: centerLat + (Math.random() - 0.5) * 0.01,
      livingArea: 2400 + Math.floor(Math.random() * 1600),
      zestimate: 1750000 + Math.floor(Math.random() * 1000000),
      rentZestimate: 6500 + Math.floor(Math.random() * 3000)
    },
    {
      zpid: 'demo_005',
      address: `${Math.floor(Math.random() * 9999) + 1000} Lombard St, San Francisco, CA 94123`,
      bedrooms: 2,
      bathrooms: 1.5,
      price: 950000 + Math.floor(Math.random() * 400000),
      homeType: 'CONDO',
      homeStatus: 'FOR_SALE',
      imgSrc: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      longitude: centerLng + (Math.random() - 0.5) * 0.01,
      latitude: centerLat + (Math.random() - 0.5) * 0.01,
      livingArea: 1100 + Math.floor(Math.random() * 500),
      zestimate: 920000 + Math.floor(Math.random() * 300000),
      rentZestimate: 3800 + Math.floor(Math.random() * 1500)
    }
  ]

  return {
    results: demoProperties,
    totalResultCount: demoProperties.length,
    isDemoData: true
  }
} 