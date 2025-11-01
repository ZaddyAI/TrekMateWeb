"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mountain, Search, Heart, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Accommodation {
  id: number
  name: string
  description: string
  destinationId: number
  price: number
  days: number
  urls: string[]
  rating?: number
}

export default function AccommodationsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null)
  const [bookingDate, setBookingDate] = useState("")

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accomodation/all`)
        if (response.ok) {
          const data = await response.json()
          setAccommodations(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.log("[v0] Error fetching accommodations:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAccommodations()
  }, [])

  const filteredAccommodations = accommodations.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleBooking = async (accommodation: Accommodation) => {
    if (!user || !token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a booking",
        variant: "destructive",
      })
      return
    }

    if (!bookingDate) {
      toast({
        title: "Select a date",
        description: "Please select a booking date",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/accomodation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId: accommodation.destinationId,
          date: bookingDate,
        }),
      })

      if (response.ok) {
        toast({
          title: "Booking successful",
          description: "Your accommodation has been booked successfully",
        })
        setSelectedAccommodation(null)
        setBookingDate("")
      } else {
        throw new Error("Booking failed")
      }
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      })
    }
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/destinations" className="text-gray-600 hover:text-gray-900">
              Destinations
            </Link>
            <Link href="/accommodations" className="text-blue-600 font-medium">
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl text-gray-600">Browse accommodations along the trekking routes</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search accommodations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">Found {filteredAccommodations.length} accommodations</p>
        </div>

        {/* Accommodations Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading accommodations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccommodations.map((accommodation) => (
              <Card key={accommodation.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 bg-gray-200">
                  {accommodation.urls && accommodation.urls.length > 0 ? (
                    <Image
                      src={accommodation.urls[0] || "/placeholder.svg"}
                      alt={accommodation.name}
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
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1">{accommodation.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{accommodation.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-semibold text-blue-600">${accommodation.price}/night</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-semibold">{accommodation.days} days</p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedAccommodation(accommodation)
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredAccommodations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mountain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No accommodations found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      {selectedAccommodation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Book {selectedAccommodation.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Date</label>
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price: ${selectedAccommodation.price}/night</p>
                  <p className="text-sm text-gray-600">Duration: {selectedAccommodation.days} days</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedAccommodation(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => handleBooking(selectedAccommodation)}>
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
