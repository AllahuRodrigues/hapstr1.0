import { NextRequest, NextResponse } from 'next/server'

// Rate limiting tracker
let lastAPICall = 0
const API_CALL_DELAY = 2000 // 2 seconds between calls

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)

    // Check rate limiting to avoid 429 errors
    const now = Date.now()
    if (now - lastAPICall < API_CALL_DELAY) {
      console.log('Rate limiting Zillow API call, returning demo data')
      return generateDemoResponse(latNum, lngNum)
    }

    lastAPICall = now

    try {
      // Create a small search polygon around the clicked point
      const radius = 0.001 // roughly 100m radius
      
      const polygon = [
        [lngNum - radius, latNum - radius],
        [lngNum + radius, latNum - radius], 
        [lngNum + radius, latNum + radius],
        [lngNum - radius, latNum + radius],
        [lngNum - radius, latNum - radius]
      ].map(coord => coord.join(',')).join(',')

      // Search for properties in the area using Zillow API
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
        
        // Find the closest property to the clicked point
        let closestProperty = null
        let minDistance = Infinity
        
        if (data.props && Array.isArray(data.props)) {
          for (const property of data.props) {
            if (property.latitude && property.longitude) {
              const distance = Math.sqrt(
                Math.pow(property.latitude - latNum, 2) + 
                Math.pow(property.longitude - lngNum, 2)
              )
              
              if (distance < minDistance) {
                minDistance = distance
                closestProperty = property
              }
            }
          }
        }
        
        if (closestProperty) {
          // Try to get rent estimate for the property
          let rentZestimate = null
          try {
            if (closestProperty.zpid) {
              const rentResponse = await fetch(
                `https://zillow-com1.p.rapidapi.com/rentEstimate?zpid=${closestProperty.zpid}`,
                {
                  method: 'GET',
                  headers: {
                    'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
                    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                  }
                }
              )
              if (rentResponse.ok) {
                const rentData = await rentResponse.json()
                rentZestimate = rentData.rentZestimate || rentData.rent
              }
            }
          } catch (rentError) {
            console.log('Rent estimate failed, using estimated value')
            // Generate realistic rent estimate based on price
            if (closestProperty.price) {
              rentZestimate = Math.round(closestProperty.price * 0.004) // ~0.4% of price per month
            }
          }

          // Format the response for the frontend
          return NextResponse.json({
            address: closestProperty.address || `${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`,
            buildingName: closestProperty.buildingName || "Property",
            price: closestProperty.price,
            beds: closestProperty.bedrooms,
            baths: closestProperty.bathrooms,
            description: closestProperty.description || `${closestProperty.homeType || 'Property'} in ${closestProperty.address || 'this location'}`,
            priceRange: closestProperty.priceLabel || (closestProperty.price ? `$${closestProperty.price.toLocaleString()}` : 'Price on request'),
            photos: closestProperty.imgSrc ? [{ url: closestProperty.imgSrc }] : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop' }],
            homeType: closestProperty.homeType,
            homeStatus: closestProperty.homeStatus,
            zpid: closestProperty.zpid,
            rentZestimate: rentZestimate,
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
    return generateDemoResponse(latNum, lngNum)

  } catch (error) {
    console.error('Zillow API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateDemoResponse(lat: number, lng: number) {
  // Generate realistic demo property based on location
  const properties = [
    {
      address: `${Math.floor(Math.random() * 9999) + 1000} California St, San Francisco, CA 94111`,
      buildingName: "Luxury Downtown Condo",
      price: 850000 + Math.floor(Math.random() * 500000),
      beds: 2,
      baths: 2,
      description: "Modern condo with stunning city views. Recently renovated with premium finishes and amenities.",
      priceRange: "$850K - $1.35M",
      photos: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop" }],
      homeType: "CONDO",
      homeStatus: "FOR_SALE",
      rentZestimate: 3500 + Math.floor(Math.random() * 1500)
    },
    {
      address: `${Math.floor(Math.random() * 9999) + 1000} Market St, San Francisco, CA 94105`,
      buildingName: "Historic Townhouse",
      price: 1200000 + Math.floor(Math.random() * 800000),
      beds: 3,
      baths: 2.5,
      description: "Beautiful Victorian townhouse with original details and modern updates. Perfect for families.",
      priceRange: "$1.2M - $2M",
      photos: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop" }],
      homeType: "TOWNHOUSE",
      homeStatus: "FOR_SALE",
      rentZestimate: 4500 + Math.floor(Math.random() * 2000)
    },
    {
      address: `${Math.floor(Math.random() * 9999) + 1000} Mission St, San Francisco, CA 94110`,
      buildingName: "Modern Studio",
      price: 650000 + Math.floor(Math.random() * 300000),
      beds: 1,
      baths: 1,
      description: "Stylish studio apartment in vibrant Mission District. Great for young professionals.",
      priceRange: "$650K - $950K",
      photos: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" }],
      homeType: "APARTMENT",
      homeStatus: "FOR_SALE",
      rentZestimate: 2800 + Math.floor(Math.random() * 1200)
    },
    {
      address: `${Math.floor(Math.random() * 9999) + 1000} Valencia St, San Francisco, CA 94110`,
      buildingName: "Family Home",
      price: 1800000 + Math.floor(Math.random() * 700000),
      beds: 4,
      baths: 3,
      description: "Spacious family home with backyard and modern kitchen. Perfect for growing families.",
      priceRange: "$1.8M - $2.5M",
      photos: [{ url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop" }],
      homeType: "SINGLE_FAMILY",
      homeStatus: "FOR_SALE",
      rentZestimate: 6500 + Math.floor(Math.random() * 3000)
    }
  ]

  // Select random property
  const property = properties[Math.floor(Math.random() * properties.length)]
  
  return NextResponse.json({
    ...property,
    isDemoData: true
  })
} 