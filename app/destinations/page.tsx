"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Search, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("all")

  const destinations = [
    {
      id: 1,
      name: "Everest Base Camp",
      district: "Solukhumbu",
      province: "Province 1",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 24,
      rating: 4.8,
      difficulty: "Hard",
      duration: "12-14 days",
      elevation: "5,364m",
    },
    {
      id: 2,
      name: "Annapurna Circuit",
      district: "Manang",
      province: "Gandaki",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 18,
      rating: 4.7,
      difficulty: "Moderate",
      duration: "15-20 days",
      elevation: "5,416m",
    },
    {
      id: 3,
      name: "Langtang Valley",
      district: "Rasuwa",
      province: "Bagmati",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 12,
      rating: 4.6,
      difficulty: "Moderate",
      duration: "7-10 days",
      elevation: "4,984m",
    },
    {
      id: 4,
      name: "Manaslu Circuit",
      district: "Gorkha",
      province: "Gandaki",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 15,
      rating: 4.5,
      difficulty: "Hard",
      duration: "14-18 days",
      elevation: "5,106m",
    },
    {
      id: 5,
      name: "Gokyo Lakes",
      district: "Solukhumbu",
      province: "Province 1",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 10,
      rating: 4.7,
      difficulty: "Moderate",
      duration: "12-15 days",
      elevation: "5,357m",
    },
    {
      id: 6,
      name: "Upper Mustang",
      district: "Mustang",
      province: "Gandaki",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 8,
      rating: 4.4,
      difficulty: "Moderate",
      duration: "10-12 days",
      elevation: "3,840m",
    },
  ]

  const provinces = [
    { value: "all", label: "All Provinces" },
    { value: "Province 1", label: "Province 1" },
    { value: "Gandaki", label: "Gandaki" },
    { value: "Bagmati", label: "Bagmati" },
  ]

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.district.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvince = selectedProvince === "all" || destination.province === selectedProvince
    return matchesSearch && matchesProvince
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Destinations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover Nepal's most spectacular trekking destinations and find the perfect accommodation for your
            adventure.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search destinations or districts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600">{destination.accommodations} Stays</Badge>
                <Badge className={`absolute top-4 right-4 ${getDifficultyColor(destination.difficulty)}`}>
                  {destination.difficulty}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {destination.district}, {destination.province}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{destination.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Elevation:</span>
                    <span className="font-medium">{destination.elevation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{destination.rating}</span>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/destinations/${destination.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setSelectedProvince("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
