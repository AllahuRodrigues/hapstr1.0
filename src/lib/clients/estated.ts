import { z } from 'zod'

export const EstatedPropertySchema = z.object({
  address: z.string(),
  owner: z.string().nullable(),
  price: z.number().nullable(),
  yearBuilt: z.number().nullable(),
  floors: z.number().nullable(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export type EstatedProperty = z.infer<typeof EstatedPropertySchema>

export async function fetchEstatedByPoint(
  lat: number, 
  lon: number
): Promise<EstatedProperty | null> {
  const apiKey = process.env.ESTATED_API_KEY
  if (!apiKey) {
    return null // Skip Estated if no key
  }

  try {
    // Placeholder implementation - replace with actual Estated API
    const response = await fetch(
      `https://apis.estated.com/property/v4?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return EstatedPropertySchema.parse(data)
  } catch (error) {
    console.warn('Estated API error:', error)
    return null
  }
} 