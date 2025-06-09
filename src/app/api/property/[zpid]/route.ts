import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ zpid: string }> }
) {
  try {
    const { zpid } = await params
    
    if (!zpid) {
      return NextResponse.json(
        { error: 'ZPID is required' },
        { status: 400 }
      )
    }

    // Fetch multiple property details in parallel
    const [propertyRes, zestimateRes, rentEstimateRes, walkScoreRes, priceHistoryRes, compsRes] = await Promise.allSettled([
      // Main property details
      fetch(`https://zillow-com1.p.rapidapi.com/property?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }),
      // Zestimate
      fetch(`https://zillow-com1.p.rapidapi.com/zestimate?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }),
      // Rent estimate
      fetch(`https://zillow-com1.p.rapidapi.com/rentEstimate?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }),
      // Walk and transit scores
      fetch(`https://zillow-com1.p.rapidapi.com/walkAndTransitScore?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }),
      // Price and tax history
      fetch(`https://zillow-com1.p.rapidapi.com/priceAndTaxHistory?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      }),
      // Property comparables
      fetch(`https://zillow-com1.p.rapidapi.com/propertyComps?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      })
    ])

    // Process results
    const results: any = {}

    if (propertyRes.status === 'fulfilled' && propertyRes.value.ok) {
      results.property = await propertyRes.value.json()
    }

    if (zestimateRes.status === 'fulfilled' && zestimateRes.value.ok) {
      results.zestimate = await zestimateRes.value.json()
    }

    if (rentEstimateRes.status === 'fulfilled' && rentEstimateRes.value.ok) {
      results.rentEstimate = await rentEstimateRes.value.json()
    }

    if (walkScoreRes.status === 'fulfilled' && walkScoreRes.value.ok) {
      results.walkScore = await walkScoreRes.value.json()
    }

    if (priceHistoryRes.status === 'fulfilled' && priceHistoryRes.value.ok) {
      results.priceHistory = await priceHistoryRes.value.json()
    }

    if (compsRes.status === 'fulfilled' && compsRes.value.ok) {
      results.comps = await compsRes.value.json()
    }

    // Return combined results
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    })

  } catch (error) {
    console.error('Property details API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 