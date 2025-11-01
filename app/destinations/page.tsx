"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mountain, MapPin, Star, Search, Filter, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Destination {
  id: number
  name: string
  shortDescription: string
  region: string
  highestElivation: number
  urls: string[]
  rating?: number
  reviews?: number
}

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 20, sortBy: "name" }),
        })
        if (response.ok) {
          const data = await response.json()
          setDestinations(Array.isArray(data) ? data : data.destinations || [])
        }
      } catch (error) {
        console.log("[v0] Error fetching destinations:", error)
        setDestinations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "All Regions" || destination.region === selectedRegion

    return matchesSearch && matchesRegion
  })

  const regions = ["All Regions", ...new Set(destinations.map((d) => d.region))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TrekMate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/destinations" className="text-blue-600 font-medium">
              Destinations
            </Link>
            <Link href="/accommodations" className="text-gray-600 hover:text-gray-900">
              Stay
            </Link>
            <Link href="/transportation" className="text-gray-600 hover:text-gray-900">
              Transport
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Nepal's Trekking Destinations</h1>
          <p className="text-xl text-gray-600">
            Discover breathtaking trails and plan your perfect Himalayan adventure
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </p>
        </div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-64 bg-gray-200">
                  {destination.urls && destination.urls.length > 0 ? (
                    <Image
                      src={destination.urls[0] || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <Mountain className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{destination.name}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{destination.region}</span>
                      </div>
                    </div>
                    {destination.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.shortDescription}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Elevation:</span>
                      <p className="font-medium">{destination.highestElivation}m</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Region:</span>
                      <p className="font-medium">{destination.region}</p>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/destinations/${destination.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredDestinations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mountain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No destinations found. Try adjusting your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
