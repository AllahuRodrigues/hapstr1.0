import { z } from 'zod'

// Enhanced ATTOM API schemas based on real API responses
export const AttomSnapshotSchema = z.object({
  status: z.object({
    version: z.string(),
    code: z.number(),
    msg: z.string(),
    total: z.number().optional(),
    page: z.number().optional(),
    pagesize: z.number().optional(),
  }),
  property: z.array(z.object({
    identifier: z.object({
      Id: z.union([z.string(), z.number()]).transform(val => val.toString()).optional(),
      fips: z.string().optional(),
      apn: z.string().optional(),
      attomId: z.union([z.string(), z.number()]).transform(val => val.toString()).optional(),
    }).optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipcode: z.string().optional(),
      latitude: z.union([z.string(), z.number()]).transform(val => 
        typeof val === 'string' ? parseFloat(val) : val
      ).optional(),
      longitude: z.union([z.string(), z.number()]).transform(val => 
        typeof val === 'string' ? parseFloat(val) : val
      ).optional(),
    }).optional(),
    summary: z.object({
      propclass: z.string().optional(),
      propsubtype: z.string().optional(),
      proptype: z.string().optional(),
      yearbuilt: z.number().optional(),
      lotsize: z.number().optional(),
      units: z.number().optional(),
      stories: z.number().optional(),
      rooms: z.number().optional(),
      beds: z.number().optional(),
      baths: z.number().optional(),
      // Additional common summary fields
      livingsize: z.number().optional(),
      walltype: z.string().optional(),
      rooftype: z.string().optional(),
      construction: z.string().optional(),
      quality: z.string().optional(),
      condition: z.string().optional(),
      pool: z.string().optional(),
      heating: z.string().optional(),
      cooling: z.string().optional(),
    }).optional(),
    building: z.object({
      size: z.object({
        bldgsize: z.number().optional(),
        grosssize: z.number().optional(),
        livingsize: z.number().optional(),
      }).optional(),
      construction: z.object({
        condition: z.string().optional(),
        constructiontype: z.string().optional(),
        walltype: z.string().optional(),
        rooftype: z.string().optional(),
        heating: z.string().optional(),
        cooling: z.string().optional(),
      }).optional(),
      exterior: z.object({
        pool: z.string().optional(),
      }).optional(),
      parking: z.object({
        prkgType: z.string().optional(),
        prkgSize: z.number().optional(),
      }).optional(),
    }).optional(),
    assessment: z.object({
      assessed: z.object({
        assdttlvalue: z.number().optional(),
        assdlandvalue: z.number().optional(),
        assdimprvalue: z.number().optional(),
      }).optional(),
      appraised: z.object({
        apprttlvalue: z.number().optional(),
        apprlandvalue: z.number().optional(),
        apprimprvalue: z.number().optional(),
      }).optional(),
      market: z.object({
        mktttlvalue: z.number().optional(),
        mktlandvalue: z.number().optional(),
        mktimprvalue: z.number().optional(),
      }).optional(),
      tax: z.object({
        taxamt: z.number().optional(),
        taxtot: z.number().optional(), // Alternative field name
        taxyear: z.number().optional(),
      }).optional(),
    }).optional(),
    avm: z.object({
      amount: z.object({
        value: z.number().optional(),
      }).optional(),
      eventDate: z.string().optional(),
    }).optional(),
    owner: z.object({
      owner1: z.object({
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        fullname: z.string().optional(),
        name: z.string().optional(), // Alternative field name
      }).optional(),
      owner2: z.object({
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        fullname: z.string().optional(),
        name: z.string().optional(),
      }).optional(),
      mailingaddress: z.object({
        oneLine: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipcode: z.string().optional(),
      }).optional(),
    }).optional(),
    sale: z.object({
      amount: z.object({
        saleamt: z.number().optional(),
        salerecdate: z.string().optional(),
      }).optional(),
      calculation: z.object({
        priceperbed: z.number().optional(),
        priceperbath: z.number().optional(),
        pricepersize: z.number().optional(),
      }).optional(),
    }).optional(),
  })).optional(),
})

export type AttomSnapshotResponse = z.infer<typeof AttomSnapshotSchema>

export interface AttomClientConfig {
  apiKey: string
  baseUrl?: string
  maxRetries?: number
  baseDelayMs?: number
}

export class AttomClient {
  private apiKey: string
  private baseUrl: string
  private maxRetries: number
  private baseDelayMs: number

  constructor(config: AttomClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.gateway.attomdata.com/propertyapi/v1.0.0'
    this.maxRetries = config.maxRetries || 2
    this.baseDelayMs = config.baseDelayMs || 500
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private sanitizeAttomData(rawData: any): any {
    // Deep clone to avoid mutating original data
    const sanitized = JSON.parse(JSON.stringify(rawData))
    
    // Sanitize property array
    if (sanitized.property && Array.isArray(sanitized.property)) {
      sanitized.property = sanitized.property.map((prop: any) => {
        // Fix identifier.Id - convert number to string if needed
        if (prop.identifier?.Id && typeof prop.identifier.Id === 'number') {
          prop.identifier.Id = prop.identifier.Id.toString()
        }
        
        // Fix location coordinates - convert strings to numbers if needed
        if (prop.location) {
          if (prop.location.latitude && typeof prop.location.latitude === 'string') {
            prop.location.latitude = parseFloat(prop.location.latitude)
          }
          if (prop.location.longitude && typeof prop.location.longitude === 'string') {
            prop.location.longitude = parseFloat(prop.location.longitude)
          }
        }
        
        // Ensure all required fields exist with proper types
        return {
          ...prop,
          identifier: {
            Id: prop.identifier?.Id?.toString() || '',
            ...prop.identifier
          },
          location: {
            latitude: typeof prop.location?.latitude === 'string' 
              ? parseFloat(prop.location.latitude) 
              : (prop.location?.latitude || 0),
            longitude: typeof prop.location?.longitude === 'string' 
              ? parseFloat(prop.location.longitude) 
              : (prop.location?.longitude || 0),
            ...prop.location
          }
        }
      })
    }
    
    return sanitized
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    attempt = 1
  ): Promise<T> {
    try {
      console.log(`🔍 ATTOM API Request (attempt ${attempt}): ${url}`)
      
      const response = await fetch(url, options)

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ ATTOM API Error ${response.status}: ${errorText}`)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const rawData = await response.json()
      
      // Sanitize the data before Zod parsing
      const sanitizedData = this.sanitizeAttomData(rawData)
      
      // Parse with Zod schema
      const validatedData = AttomSnapshotSchema.parse(sanitizedData)
      
      return validatedData as T
    } catch (error) {
      console.log(`⚠️ ATTOM API Error (attempt ${attempt}): ${error}`)
      
      if (attempt < this.maxRetries) {
        const delayMs = this.baseDelayMs * Math.pow(2, attempt - 1)
        await this.delay(delayMs)
        return this.fetchWithRetry(url, options, attempt + 1)
      }
      
      throw error
    }
  }

  async fetchSnapshot(bbox: [number, number, number, number], page = 1, pagesize = 50): Promise<AttomSnapshotResponse> {
    try {
      // Calculate center point and radius from bbox
      const [west, south, east, north] = bbox
      const centerLat = (south + north) / 2
      const centerLon = (west + east) / 2
      
      // Calculate radius in miles (approximate)
      const latDiff = north - south
      const lonDiff = east - west
      const radiusMiles = Math.max(latDiff, lonDiff) * 69 / 2 // Convert degrees to miles, then get radius
      const radius = Math.min(Math.max(radiusMiles, 0.5), 50) // Clamp between 0.5 and 50 miles

      const params = new URLSearchParams({
        latitude: centerLat.toString(),
        longitude: centerLon.toString(),
        radius: radius.toString(),
        page: page.toString(),
        pagesize: pagesize.toString(),
      })

      const url = `${this.baseUrl}/property/snapshot?${params}`
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': this.apiKey,
        },
      }

      return await this.fetchWithRetry<AttomSnapshotResponse>(url, options)
    } catch (error) {
      console.error('ATTOM fetchSnapshot error:', error)
      throw error
    }
  }

  async fetchPropertyDetail(attomId: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        id: attomId,
      })

      const url = `${this.baseUrl}/property/detailowner?${params}`
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': this.apiKey,
        },
      }

      return await this.fetchWithRetry(url, options)
    } catch (error) {
      console.error('ATTOM fetchPropertyDetail error:', error)
      throw error
    }
  }
}

export function createAttomClient(): AttomClient {
  const apiKey = process.env.ATTOM_API_KEY
  
  if (!apiKey) {
    throw new Error('ATTOM_API_KEY environment variable is required')
  }

  return new AttomClient({
    apiKey,
    maxRetries: 3,
    baseDelayMs: 1000,
  })
} 