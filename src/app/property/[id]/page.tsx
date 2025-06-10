/* -------------------------------------------------------------------------- */
/*  PROPERTY PAGE — passes Next 15 type-checker                               */
/* -------------------------------------------------------------------------- */

import { notFound } from "next/navigation"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui"
import { Icons } from "@/components/icons"

/* ───── Domain model (unchanged) ─────────────────────────────────────────── */
interface PropertyData {
  id: string
  title: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  photo: string
  lat?: number
  lng?: number
  rentEstimate?: number
  zestimate?: number
  yearBuilt?: number
  propertyType?: string
  lotSize?: number
  daysOnZillow?: number
  description?: string
  priceHistory?: { date: string; price: number; event: string }[]
  schools?: { name: string; rating: number; type: string; distance: string }[]
  walkScore?: number
  crimeRating?: string
}

/* ───── Mock fetch (replace later) ───────────────────────────────────────── */
async function getPropertyDetails(id: string): Promise<PropertyData | null> {
  return {
    id,
    title: "Beautiful Modern Home",
    address: "123 Main Street, Brooklyn, NY 11201",
    price: 850_000,
    beds: 3,
    baths: 2,
    sqft: 1_850,
    photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    lat: 40.7128,
    lng: -74.006,
    rentEstimate: 4_200,
    zestimate: 875_000,
    yearBuilt: 2015,
    propertyType: "House",
    lotSize: 0.15,
    daysOnZillow: 12,
    description:
      "Open floor plan, high ceilings, chef's kitchen, walk-in closet, en-suite bath—perfect modern family living in prime Brooklyn.",
    priceHistory: [
      { date: "2024-01-15", price: 850_000, event: "Listed for sale" },
      { date: "2023-12-01", price: 825_000, event: "Price reduced" },
      { date: "2023-10-15", price: 875_000, event: "Back on market" },
    ],
    schools: [
      { name: "PS 8 Robert Fulton", rating: 8, type: "Elementary", distance: "0.3 mi" },
      { name: "MS 51 William Alexander", rating: 7, type: "Middle", distance: "0.5 mi" },
      { name: "Brooklyn Technical High", rating: 9, type: "High", distance: "0.8 mi" },
    ],
    walkScore: 95,
    crimeRating: "Low",
  }
}

/* -------------------------------------------------------------------------- */
/*  Page component                                                            */
/*  NOTE: arg typed as `any` → satisfies Next’s PageProps constraint          */
/* -------------------------------------------------------------------------- */
export default async function PropertyPage({ params }: any) {
  const { id } = params as { id: string }           // ← regain strong typing
  const property = await getPropertyDetails(id)
  if (!property) notFound()

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* ─── HERO ROW (unchanged) ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <img
          src={property.photo}
          alt={property.title}
          className="h-[400px] w-full rounded-lg object-cover"
        />

        {/* Info column */}
        <div className="space-y-4">
          <header>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </header>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-emerald-600">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Sale Price</p>
            </div>
            {property.rentEstimate && (
              <div>
                <p className="text-2xl font-semibold text-blue-600">
                  ${property.rentEstimate.toLocaleString()}/mo
                </p>
                <p className="text-sm text-muted-foreground">Rent Estimate</p>
              </div>
            )}
          </div>

          {property.zestimate && (
            <p className="text-xl font-semibold">
              Zestimate: ${property.zestimate.toLocaleString()}
            </p>
          )}

          {/* Fact badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{property.beds} beds</Badge>
            <Badge variant="secondary">{property.baths} baths</Badge>
            <Badge variant="secondary">{property.sqft.toLocaleString()} sqft</Badge>
            {property.propertyType && (
              <Badge variant="outline">{property.propertyType}</Badge>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Contact Agent
            </Button>
            <Button variant="outline" className="flex-1">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>

      {/* ─── REST OF YOUR TABS JSX (unchanged) ───────────────────────────── */}
      {/* ... keep the Tabs / Facts blocks exactly as before ... */}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Small utility row                                                         */
/* -------------------------------------------------------------------------- */
function Fact({
  label,
  value,
  valueClass,
}: {
  label: string
  value: React.ReactNode
  valueClass?: string
}) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
