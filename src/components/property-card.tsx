'use client'

import { Building, MapPin, DollarSign, Calendar, Users } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: {
    address: string
    buildingName?: string
    borough: string
    price?: number
    assessedValue?: number
    buildingArea?: number
    lotArea?: number
    yearBuilt?: number
    numFloors?: number
    residentialUnits?: number
    totalUnits?: number
    rentZestimate?: number
    hasListing?: boolean
  }
  onClick?: () => void
  className?: string
}

export function PropertyCard({ property, onClick, className }: PropertyCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        'bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden hover:bg-white/20 transition-colors cursor-pointer',
        className
      )}
    >
      <div className="h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
        <Building className="h-8 w-8 text-white/60" />
      </div>
      <div className="p-3 text-white">
        <h3 className="font-semibold text-sm truncate mb-1">
          {property.buildingName || 'NYC Property'}
        </h3>
        <p className="text-xs text-white/80 truncate flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {property.address}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {property.price && (
            <div className="bg-white/10 rounded p-2">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Value
              </p>
              <p className="text-sm font-bold text-emerald-300">
                ${(property.price / 1000000).toFixed(1)}M
              </p>
            </div>
          )}
          {property.yearBuilt && (
            <div className="bg-white/10 rounded p-2">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Built
              </p>
              <p className="text-sm font-bold text-purple-300">
                {property.yearBuilt}
              </p>
            </div>
          )}
          {property.residentialUnits && (
            <div className="bg-white/10 rounded p-2">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Units
              </p>
              <p className="text-sm font-bold text-blue-300">
                {property.residentialUnits}
              </p>
            </div>
          )}
          {property.buildingArea && (
            <div className="bg-white/10 rounded p-2">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Building className="h-3 w-3" />
                Area
              </p>
              <p className="text-sm font-bold text-orange-300">
                {property.buildingArea.toLocaleString()} sqft
              </p>
            </div>
          )}
        </div>
        {property.hasListing !== undefined && (
          <Badge 
            variant="outline" 
            className={cn(
              'mt-2',
              property.hasListing 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-red-500/20 text-red-300 border-red-400/30'
            )}
          >
            {property.hasListing ? 'Active Listing' : 'No Listing'}
          </Badge>
        )}
      </div>
    </div>
  )
} 