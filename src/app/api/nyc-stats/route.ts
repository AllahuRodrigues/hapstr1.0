import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch sample data from NYC PLUTO API to get real stats
    const response = await fetch('https://data.cityofnewyork.us/resource/64uk-42ks.json?$limit=100')
    
    if (!response.ok) {
      throw new Error('Failed to fetch NYC data')
    }
    
    const data = await response.json()
    
    // Calculate real statistics from the sample
    const totalBuildings = 1200000 // Estimated total buildings in NYC
    const averageAssessedValue = data.reduce((sum: number, property: any) => {
      const value = parseFloat(property.assesstot) || 0
      return sum + value
    }, 0) / data.length
    
    const avgPrice = Math.round(averageAssessedValue / 0.42) // Convert assessed to market value
    
    return NextResponse.json({
      totalBuildings,
      avgPrice: avgPrice || 850000, // Fallback average
      totalArea: 302.6, // NYC total area in square miles
      boroughs: 5,
      lastUpdated: new Date().toISOString(),
      sampleSize: data.length
    })
    
  } catch (error) {
    console.error('NYC Stats API error:', error)
    
    // Return fallback stats
    return NextResponse.json({
      totalBuildings: 1200000,
      avgPrice: 850000,
      totalArea: 302.6,
      boroughs: 5,
      lastUpdated: new Date().toISOString(),
      sampleSize: 0
    })
  }
} 