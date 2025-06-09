import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { notFound } from 'next/navigation'

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
  try {
    // In a real app, this would fetch from your API
    // For demo, we'll return mock data
    return {
      id,
      title: "Beautiful Modern Home",
      address: "123 Main Street, Brooklyn, NY 11201",
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1850,
      photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      lat: 40.7128,
      lng: -74.0060,
      rentEstimate: 4200,
      zestimate: 875000,
      yearBuilt: 2015,
      propertyType: "House",
      lotSize: 0.15,
      daysOnZillow: 12,
      description: "This stunning modern home features an open floor plan with high ceilings, hardwood floors throughout, and a chef's kitchen with stainless steel appliances. The master suite includes a walk-in closet and en-suite bathroom. Perfect for families looking for comfort and style in a prime location.",
      priceHistory: [
        { date: "2024-01-15", price: 850000, event: "Listed for sale" },
        { date: "2023-12-01", price: 825000, event: "Price reduced" },
        { date: "2023-10-15", price: 875000, event: "Back on market" },
      ],
      schools: [
        { name: "PS 8 Robert Fulton", rating: 8, type: "Elementary", distance: "0.3 mi" },
        { name: "MS 51 William Alexander", rating: 7, type: "Middle", distance: "0.5 mi" },
        { name: "Brooklyn Technical High School", rating: 9, type: "High", distance: "0.8 mi" },
      ],
      walkScore: 95,
      crimeRating: "Low"
    }
  } catch {
    return null
  }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyDetails(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <img 
            src={property.photo} 
            alt={property.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </div>

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
            <div>
              <p className="text-xl font-semibold">
                Zestimate: ${property.zestimate.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{property.beds} beds</Badge>
            <Badge variant="secondary">{property.baths} baths</Badge>
            <Badge variant="secondary">{property.sqft.toLocaleString()} sqft</Badge>
            {property.propertyType && (
              <Badge variant="outline">{property.propertyType}</Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Icons.spinner className="mr-2 h-4 w-4" />
              Contact Agent
            </Button>
            <Button variant="outline" className="flex-1">
              <Icons.spinner className="mr-2 h-4 w-4" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Year Built:</span>
                  <span>{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lot Size:</span>
                  <span>{property.lotSize} acres</span>
                </div>
                <div className="flex justify-between">
                  <span>Days on Zillow:</span>
                  <span>{property.daysOnZillow} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Type:</span>
                  <span>{property.propertyType}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.rentEstimate && property.price && (
                  <div className="flex justify-between">
                    <span>Monthly Yield:</span>
                    <span>{((property.rentEstimate * 12 / property.price) * 100).toFixed(2)}%</span>
                  </div>
                )}
                {property.zestimate && property.price && (
                  <div className="flex justify-between">
                    <span>Zestimate vs List:</span>
                    <span className={property.zestimate > property.price ? "text-emerald-600" : "text-red-600"}>
                      {property.zestimate > property.price ? "+" : ""}
                      ${(property.zestimate - property.price).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Price per sqft:</span>
                  <span>${Math.round(property.price / property.sqft)}</span>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold">Interior Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Hardwood floors throughout</li>
                    <li>• Open floor plan</li>
                    <li>• High ceilings</li>
                    <li>• Modern kitchen with island</li>
                    <li>• Stainless steel appliances</li>
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
                    <li>• Energy efficient windows</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neighborhood" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Walkability & Transit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Walk Score:</span>
                    <Badge variant={property.walkScore! > 80 ? "default" : "secondary"}>
                      {property.walkScore}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Crime Rating:</span>
                    <Badge variant={property.crimeRating === "Low" ? "default" : "destructive"}>
                      {property.crimeRating}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {property.schools?.map((school, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.type} • {school.distance}</p>
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
                {property.priceHistory?.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{entry.event}</p>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <p className="font-semibold">${entry.price.toLocaleString()}</p>
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