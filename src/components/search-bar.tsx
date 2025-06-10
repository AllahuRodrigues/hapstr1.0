'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  place_name: string
  center: [number, number]
  bbox?: [number, number, number, number]
}

interface SearchBarProps {
  onLocationSelect: (result: SearchResult) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onLocationSelect, placeholder = 'Search...', className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,neighborhood,locality,place&country=us&bbox=-74.2591,40.4774,-73.7004,40.9176`
      )
      const data = await response.json()
      setResults(
        data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          place_name: feature.place_name,
          center: feature.center,
          bbox: feature.bbox
        }))
      )
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setShowResults(true)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-black/20 backdrop-blur-md text-white placeholder:text-white/70 border-white/30',
          className
        )}
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/20 overflow-hidden z-50">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onLocationSelect(result)
                setShowResults(false)
                setQuery(result.place_name)
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            >
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-white/70">{result.place_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 