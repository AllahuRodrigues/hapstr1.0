// NYC Property Types (PLUTO API)
export interface NYCProperty {
  // Basic property information
  address: string
  buildingName?: string
  borough: string
  
  // Assessment and financial data
  price?: number
  assessedValue?: number
  assessedLand?: number
  
  // Building characteristics
  buildingArea?: number
  lotArea?: number
  yearBuilt?: number
  numFloors?: number
  
  // Zoning and planning
  zoning?: string
  landUse?: string
  buildingClass?: string
  
  // Unit information
  residentialUnits?: number
  totalUnits?: number
  
  // Location data
  latitude?: number
  longitude?: number
  boro?: string
  block?: string
  lot?: string
  zipcode?: string
  councilDistrict?: string
  communityDistrict?: string
  
  // Additional information
  rentZestimate?: number
  hasListing?: boolean
  listingType?: string
  availabilityStatus?: string
  
  // Media and description
  photos?: PropertyPhoto[]
  description?: string
  
  // Data source tracking
  isDemoData?: boolean
  dataSource?: 'NYC' | 'DEMO'
}

export interface PropertyPhoto {
  url: string
  width?: number
  height?: number
  caption?: string
}

// Search and results
export interface PropertySearchResult {
  results: NYCProperty[]
  totalResultCount: number
  searchBounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  isDemoData?: boolean
}

// NYC-specific enums and constants
export interface NYCBorough {
  id: string
  name: string
  center: {
    lat: number
    lng: number
  }
}

export interface NYCZoning {
  district: string
  description: string
  category: 'Residential' | 'Commercial' | 'Manufacturing' | 'Mixed'
}

export interface NYCBuildingClass {
  code: string
  category: string
  description: string
}

// Map-related types
export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface SearchResult {
  id: string
  name: string
  place_name: string
  center: [number, number]
  bbox?: [number, number, number, number]
}

// Component props
export interface PropertyCardProps {
  property: NYCProperty
  onClick?: (property: NYCProperty) => void
  className?: string
}

export interface MapComponentProps {
  onPropertySelect?: (property: NYCProperty) => void
  initialBounds?: MapBounds
  className?: string
}

// API Response types
export interface PlutoApiResponse {
  borough: string
  block: string
  lot: string
  address: string
  ownername: string
  bldgarea: string
  lotarea: string
  yearbuilt: string
  numfloors: string
  zonedist1: string
  landuse: string
  assessland: string
  assesstot: string
  latitude: string
  longitude: string
  unitsres: string
  unitstotal: string
  cd: string
  council: string
  zipcode: string
  bldgclass: string
  residfar: string
  commfar: string
  facilfar: string
}

// Error handling
export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface PropertyApiResponse {
  data?: NYCProperty | NYCProperty[]
  error?: ApiError
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// NYC Constants
export const NYC_BOROUGHS: NYCBorough[] = [
  { id: '1', name: 'Manhattan', center: { lat: 40.7831, lng: -73.9712 } },
  { id: '2', name: 'Bronx', center: { lat: 40.8448, lng: -73.8648 } },
  { id: '3', name: 'Brooklyn', center: { lat: 40.6782, lng: -73.9442 } },
  { id: '4', name: 'Queens', center: { lat: 40.7282, lng: -73.7949 } },
  { id: '5', name: 'Staten Island', center: { lat: 40.5795, lng: -74.1502 } }
]

export const NYC_BOUNDS: MapBounds = {
  north: 40.9176,
  south: 40.4774,
  west: -74.2591,
  east: -73.7004
}

export const NYC_CENTER = { lat: 40.7128, lng: -74.006 } 