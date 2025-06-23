// This is a simple test utility - you can call this from browser console
export async function testNationwideAPI() {
  console.log('🔍 Testing Nationwide Buildings API...')
  
  // Test NYC area
  const bbox = [-74.056, 40.6628, -73.956, 40.7628]
  const url = `/api/nationwide-buildings?bbox=${bbox.join(',')}&zoom=12`
  
  console.log('📡 Fetching:', url)
  
  try {
    const response = await fetch(url)
    console.log('📊 Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText)
      return
    }
    
    const reader = response.body?.getReader()
    if (!reader) {
      console.error('❌ No reader available')
      return
    }
    
    const decoder = new TextDecoder()
    let count = 0
    let sampleFeatures = []
    
    try {
      while (count < 10) { // Just read first 10 for testing
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            const feature = JSON.parse(line)
            sampleFeatures.push(feature)
            count++
            if (count >= 10) break
          } catch (e) {
            continue
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
    
    console.log('✅ Successfully loaded', count, 'features')
    console.log('📋 Sample features:', sampleFeatures)
    
    // Test coordinate conversion
    if (sampleFeatures.length > 0) {
      const sample = sampleFeatures[0]
      const [lon, lat] = sample.geometry.coordinates
      console.log('🗺️ Sample coordinates:', { lat, lon })
      console.log('💰 Sample price:', sample.properties.priceUsd)
    }
    
    return sampleFeatures
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Test ATTOM client directly
export async function testAttomClient() {
  console.log('🔍 Testing ATTOM Client...')
  
  try {
    const { createAttomClient } = await import('@/lib/clients/attom')
    const client = createAttomClient()
    console.log('✅ ATTOM Client created successfully')
    return client
  } catch (error) {
    console.error('❌ ATTOM Client creation failed:', error)
    return null
  }
} 