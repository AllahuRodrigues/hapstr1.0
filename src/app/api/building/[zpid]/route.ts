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

    const url = `https://zillow-com1.p.rapidapi.com/building?zpid=${zpid}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '0fd50ff40fmshf5c3ce46017f1d7p1ee5efjsnb91a7145da45',
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Zillow API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch building data from Zillow' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Building API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 