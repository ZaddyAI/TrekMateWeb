"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mountain, MapPin, Star, Heart, Share2, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Destination {
  id: number
  name: string
  description: string
  shortDescription: string
  region: string
  highestElivation: number
  urls: string[]
  rating?: number
  reviews?: number
}

interface Accommodation {
  id: number
  name: string
  description: string
  price: number
  days: number
  urls: string[]
  rating?: number
}

interface Transportation {
  id: number
  vehiclesType: string
  price: number
  time: number
  grade: string
  distance: number
  urls: string[]
}

export default function DestinationDetailPage() {
  const params = useParams()
  const destinationId = params.id
  const { toast } = useToast()
  const [isSaved, setIsSaved] = useState(false)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [transportation, setTransportation] = useState<Transportation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/${destinationId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 10 }),
        })
        if (destResponse.ok) {
          const destData = await destResponse.json()
          setDestination(destData)
        }

        const accomResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accomodation/all`)
        if (accomResponse.ok) {
          const accomData = await accomResponse.json()
          setAccommodations(Array.isArray(accomData) ? accomData.slice(0, 3) : [])
        }

        const transResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transportation/all`)
        if (transResponse.ok) {
          const transData = await transResponse.json()
          setTransportation(Array.isArray(transData) ? transData.slice(0, 2) : [])
        }
      } catch (error) {
        console.log("[v0] Error fetching destination details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (destinationId) {
      fetchData()
    }
  }, [destinationId])

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved" : "Saved to favorites",
      description: isSaved ? "Destination removed from your saved list" : "You can find this in your dashboard",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Destination link copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <Mountain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Destination not found</p>
          <Button asChild>
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Destinations
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TrekMate</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{destination.region}</span>
                </div>
                {destination.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={isSaved ? "bg-red-50 text-red-600 border-red-200" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-600" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-4 gap-2 h-96 mb-6">
            {destination.urls && destination.urls.length > 0 ? (
              <>
                <div className="col-span-2 row-span-2">
                  <Image
                    src={destination.urls[0] || "/placeholder.svg"}
                    alt={destination.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {destination.urls.slice(1, 4).map((url, idx) => (
                  <div key={idx} className="col-span-1">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`${destination.name} ${idx}`}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-4 flex items-center justify-center bg-gray-300 rounded-lg">
                <Mountain className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Mountain className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Elevation</p>
                <p className="font-semibold">{destination.highestElivation}m</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Region</p>
                <p className="font-semibold">{destination.region}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Best Season</p>
                <p className="font-semibold text-sm">Sep-Nov</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accommodations">Stay</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Trek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{destination.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accommodations" className="space-y-6">
                {accommodations.length > 0 ? (
                  <div className="grid gap-6">
                    {accommodations.map((accommodation) => (
                      <Card key={accommodation.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {accommodation.urls && accommodation.urls.length > 0 && (
                              <Image
                                src={accommodation.urls[0] || "/placeholder.svg"}
                                alt={accommodation.name}
                                width={200}
                                height={150}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{accommodation.name}</h3>
                              <p className="text-sm text-gray-600 mb-4">{accommodation.description}</p>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-lg font-semibold text-blue-600">${accommodation.price}/night</p>
                                </div>
                                <Button>Book Now</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-600">No accommodations available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="transport" className="space-y-6">
                {transportation.length > 0 ? (
                  <div className="grid gap-6">
                    {transportation.map((transport) => (
                      <Card key={transport.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {transport.urls && transport.urls.length > 0 && (
                              <Image
                                src={transport.urls[0] || "/placeholder.svg"}
                                alt={transport.vehiclesType}
                                width={200}
                                height={150}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{transport.vehiclesType}</h3>
                              <p className="text-sm text-gray-600 mb-4">Grade: {transport.grade}</p>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-600">Distance: {transport.distance}km</p>
                                  <p className="text-lg font-semibold text-blue-600">${transport.price}</p>
                                </div>
                                <Button>Book Transport</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-600">No transportation available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Plan Your Trek</CardTitle>
                <CardDescription>Book your adventure today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Check Availability
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
