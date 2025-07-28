"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Mountain, Wifi, Coffee, Bed, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  const [selectedAccommodation, setSelectedAccommodation] = useState<number | null>(null)

  // Mock data - in real app, fetch based on params.id
  const destination = {
    id: 1,
    name: "Everest Base Camp",
    district: "Solukhumbu",
    province: "Province 1",
    image: "/placeholder.svg?height=400&width=800",
    rating: 4.8,
    difficulty: "Hard",
    duration: "12-14 days",
    elevation: "5,364m",
    description:
      "The Everest Base Camp trek is one of the most popular and iconic treks in the world. This incredible journey takes you through the heart of the Khumbu region, offering breathtaking views of the world's highest peaks including Mount Everest, Lhotse, and Ama Dablam.",
    highlights: [
      "Stunning views of Mount Everest and surrounding peaks",
      "Experience Sherpa culture and hospitality",
      "Visit ancient monasteries and Buddhist sites",
      "Cross suspension bridges over deep gorges",
      "Reach Everest Base Camp at 5,364m",
    ],
    bestTime: "March-May, September-November",
    permits: "Sagarmatha National Park Permit, TIMS Card",
  }

  const subLocations = [
    {
      id: 1,
      name: "Namche Bazaar",
      district: "Solukhumbu",
      elevation: "3,440m",
      description: "The gateway to Everest and main trading center of the Khumbu region",
    },
    {
      id: 2,
      name: "Tengboche",
      district: "Solukhumbu",
      elevation: "3,867m",
      description: "Famous for its monastery with spectacular mountain views",
    },
    {
      id: 3,
      name: "Dingboche",
      district: "Solukhumbu",
      elevation: "4,410m",
      description: "Important acclimatization stop with stunning valley views",
    },
    {
      id: 4,
      name: "Lobuche",
      district: "Solukhumbu",
      elevation: "4,940m",
      description: "Last major stop before Everest Base Camp",
    },
  ]

  const accommodations = [
    {
      id: 1,
      name: "Everest View Hotel",
      type: "Hotel",
      location: "Namche Bazaar",
      sublocation_id: 1,
      price: 80,
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Hot Shower", "Restaurant", "Mountain View"],
      description: "Luxury hotel with panoramic mountain views",
    },
    {
      id: 2,
      name: "Sherpa Lodge",
      type: "Tea House",
      location: "Tengboche",
      sublocation_id: 2,
      price: 25,
      rating: 4.2,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Basic Wifi", "Shared Bathroom", "Local Food"],
      description: "Traditional Sherpa hospitality in a cozy setting",
    },
    {
      id: 3,
      name: "Mountain Paradise Lodge",
      type: "Tea House",
      location: "Dingboche",
      sublocation_id: 3,
      price: 35,
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Hot Shower", "Dining Hall", "Yak Blankets"],
      description: "Comfortable lodge with excellent mountain views",
    },
    {
      id: 4,
      name: "Base Camp Lodge",
      type: "Tea House",
      location: "Lobuche",
      sublocation_id: 4,
      price: 40,
      rating: 4.0,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Basic Wifi", "Heated Rooms", "Restaurant"],
      description: "Your final stop before reaching Everest Base Camp",
    },
  ]

  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Absolutely incredible experience! The views were breathtaking and the accommodations exceeded expectations.",
      accommodation: "Everest View Hotel",
    },
    {
      id: 2,
      user: "Mike Chen",
      rating: 4,
      date: "2024-01-10",
      comment: "Great trek with amazing hospitality. The tea houses were cozy and the food was surprisingly good.",
      accommodation: "Sherpa Lodge",
    },
    {
      id: 3,
      user: "Emma Wilson",
      rating: 5,
      date: "2024-01-05",
      comment: "Life-changing experience! The journey to EBC was challenging but so rewarding. Highly recommend!",
      accommodation: "Mountain Paradise Lodge",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Hotel":
        return "bg-purple-100 text-purple-800"
      case "Tea House":
        return "bg-green-100 text-green-800"
      case "Cafeteria":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
      case "basic wifi":
        return <Wifi className="h-4 w-4" />
      case "restaurant":
      case "dining hall":
      case "local food":
        return <Coffee className="h-4 w-4" />
      case "hot shower":
      case "shared bathroom":
      case "heated rooms":
        return <Bed className="h-4 w-4" />
      default:
        return <Mountain className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/destinations" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Destinations
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-96">
            <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>
                    {destination.district}, {destination.province}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 fill-current" />
                  <span>{destination.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="locations">Sub-Locations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">About This Trek</h2>
                    <p className="text-gray-600 mb-6">{destination.description}</p>

                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {destination.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Mountain className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Trek Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <Badge className="bg-red-100 text-red-800">{destination.difficulty}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{destination.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Elevation:</span>
                        <span className="font-medium">{destination.elevation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best Time:</span>
                        <span className="font-medium">{destination.bestTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Required Permits</h3>
                    <p className="text-gray-600 text-sm">{destination.permits}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((accommodation) => (
                <Card key={accommodation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={accommodation.image || "/placeholder.svg"}
                      alt={accommodation.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className={`absolute top-4 left-4 ${getTypeColor(accommodation.type)}`}>
                      {accommodation.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{accommodation.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{accommodation.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{accommodation.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {accommodation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                          {getAmenityIcon(amenity)}
                          <span className="text-xs ml-1">{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{accommodation.rating}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${accommodation.price}</div>
                        <div className="text-xs text-gray-600">per night</div>
                      </div>
                    </div>

                    <Button className="w-full mt-4" asChild>
                      <Link href={`/booking?accommodation=${accommodation.id}`}>Book Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {subLocations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Mountain className="h-4 w-4 mr-1" />
                      <span className="text-sm">Elevation: {location.elevation}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{location.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/accommodations?location=${location.id}`}>View Accommodations</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{review.user}</h4>
                        <p className="text-sm text-gray-600">Stayed at {review.accommodation}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
