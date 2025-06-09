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
  priceHistory?: Array<{
    date: string
    price: number
    event: string
  }>
  schools?: Array<{
    name: string
    rating: number
    type: string
    distance: string
  }>
  walkScore?: number
  crimeRating?: string
}

async function getPropertyDetails(id: string): Promise<PropertyData | null> {
  // TODO: replace with real API call
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
      "This stunning modern home features an open floor plan with high ceilings, hardwood floors throughout, and a chef's kitchen with stainless-steel appliances. The master suite includes a walk-in closet and en-suite bathroom. Perfect for families looking for comfort and style in a prime location.",
    priceHistory: [
      { date: "2024-01-15", price: 850_000, event: "Listed for sale" },
      { date: "2023-12-01", price: 825_000, event: "Price reduced" },
      { date: "2023-10-15", price: 875_000, event: "Back on market" },
    ],
    schools: [
      {
        name: "PS 8 Robert Fulton",
        rating: 8,
        type: "Elementary",
        distance: "0.3 mi",
      },
      {
        name: "MS 51 William Alexander",
        rating: 7,
        type: "Middle",
        distance: "0.5 mi",
      },
      {
        name: "Brooklyn Technical High School",
        rating: 9,
        type: "High",
        distance: "0.8 mi",
      },
    ],
    walkScore: 95,
    crimeRating: "Low",
  }
}

export default async function PropertyPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await getPropertyDetails(params.id)

  if (!property) notFound()

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <img
          src={property.photo}
          alt={property.title}
          className="h-[400px] w-full rounded-lg object-cover"
        />
        <div className="space-y-4">
          <header>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </header>
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
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{property.beds} beds</Badge>
            <Badge variant="secondary">{property.baths} baths</Badge>
            <Badge variant="secondary">
              {property.sqft.toLocaleString()} sqft
            </Badge>
            {property.propertyType && (
              <Badge variant="outline">{property.propertyType}</Badge>
            )}
          </div>
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
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
          <TabsTrigger value="history">Price History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.description}</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Fact label="Year Built" value={property.yearBuilt ?? "—"} />
                <Fact
                  label="Lot Size"
                  value={
                    property.lotSize ? `${property.lotSize} acres` : "—"
                  }
                />
                <Fact
                  label="Days on Zillow"
                  value={
                    property.daysOnZillow
                      ? `${property.daysOnZillow} days`
                      : "—"
                  }
                />
                <Fact
                  label="Property Type"
                  value={property.propertyType ?? "—"}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.rentEstimate && (
                  <Fact
                    label="Monthly Yield"
                    value={`${(
                      ((property.rentEstimate * 12) / property.price) *
                      100
                    ).toFixed(2)}%`}
                  />
                )}
                {property.zestimate && (
                  <Fact
                    label="Zestimate vs List"
                    value={
                      (property.zestimate - property.price > 0 ? "+" : "") +
                      `$${(
                        property.zestimate - property.price
                      ).toLocaleString()}`
                    }
                    valueClass={
                      property.zestimate > property.price
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  />
                )}
                <Fact
                  label="Price per sqft"
                  value={`$${Math.round(property.price / property.sqft)}`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold">Interior Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Hardwood floors throughout</li>
                    <li>• Open floor plan</li>
                    <li>• High ceilings</li>
                    <li>• Modern kitchen with island</li>
                    <li>• Stainless-steel appliances</li>
                    <li>• Central air conditioning</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Exterior Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Private backyard</li>
                    <li>• Two-car garage</li>
                    <li>• Front porch</li>
                    <li>• Landscaped garden</li>
                    <li>• Security system</li>
                    <li>• Energy-efficient windows</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="neighborhood" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Walkability &amp; Transit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Fact label="Walk Score" value={`${property.walkScore}/100`} />
                  <Fact
                    label="Crime Rating"
                    value={property.crimeRating ?? "—"}
                    valueClass={
                      property.crimeRating === "Low"
                        ? "text-emerald-600"
                        : "text-destructive"
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {property.schools?.map((school, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{school.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {school.type} • {school.distance}
                        </p>
                      </div>
                      <Badge variant="outline">{school.rating}/10</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.priceHistory?.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{entry.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${entry.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

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