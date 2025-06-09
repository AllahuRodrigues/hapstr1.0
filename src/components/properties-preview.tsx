'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Parcel = {
  address?: string
  borough?: string
  lotarea?: string
  yearbuilt?: string
}

export const PropertiesPreview = () => {
  const [items, setItems] = useState<Parcel[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          'https://data.cityofnewyork.us/resource/64uk-42ks.json?$limit=9'
        )
        const data: Parcel[] = await res.json()
        setItems(data)
      } catch {
        /* silent network failure for demo */
      }
    }
    load()
  }, [])

  if (!items.length) return null

  return (
    <section className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-bold">Live NYC Data Snapshot</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <Card key={i} className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {p.address || '—'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-400">
                <p>Borough: {p.borough || '—'}</p>
                <p>Lot Area: {p.lotarea || '—'}</p>
                <p>Year Built: {p.yearbuilt || '—'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 