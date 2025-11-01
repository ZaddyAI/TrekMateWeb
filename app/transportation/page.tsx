"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mountain, Search, Calendar, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Transportation {
  id: number
  vehiclesType: string
  destinationId: number
  price: number
  time: number
  grade: string
  distance: number
  urls: string[]
}

export default function TransportationPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [transportation, setTransportation] = useState<Transportation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransport, setSelectedTransport] = useState<Transportation | null>(null)
  const [bookingDate, setBookingDate] = useState("")

  useEffect(() => {
    const fetchTransportation = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transportation/all`)
        if (response.ok) {
          const data = await response.json()
          setTransportation(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.log("[v0] Error fetching transportation:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransportation()
  }, [])

  const filteredTransportation = transportation.filter(
    (trans) =>
      trans.vehiclesType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.grade.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleBooking = async (transport: Transportation) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/transportation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transportationId: transport.id,
          date: bookingDate,
        }),
      })

      if (response.ok) {
        toast({
          title: "Booking successful",
          description: "Your transportation has been booked successfully",
        })
        setSelectedTransport(null)
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
            <Link href="/accommodations" className="text-gray-600 hover:text-gray-900">
              Stay
            </Link>
            <Link href="/transportation" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book Transportation</h1>
          <p className="text-xl text-gray-600">Choose from jeeps, helicopters, flights, and more</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by vehicle type or grade..."
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
          <p className="text-gray-600">Found {filteredTransportation.length} options</p>
        </div>

        {/* Transportation Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading transportation options...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransportation.map((transport) => (
              <Card key={transport.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 bg-gray-200">
                  {transport.urls && transport.urls.length > 0 ? (
                    <Image
                      src={transport.urls[0] || "/placeholder.svg"}
                      alt={transport.vehiclesType}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <Zap className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-blue-600">{transport.vehiclesType}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1">{transport.grade}</h3>
                    <p className="text-sm text-gray-600">
                      {transport.distance}km • {transport.time}hrs
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-semibold text-blue-600">${transport.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-semibold">{transport.vehiclesType}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTransport(transport)
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

        {!isLoading && filteredTransportation.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transportation options found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      {selectedTransport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Book {selectedTransport.vehiclesType}</h3>
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
                  <p className="text-sm text-gray-600">Price: ${selectedTransport.price}</p>
                  <p className="text-sm text-gray-600">Duration: {selectedTransport.time} hours</p>
                  <p className="text-sm text-gray-600">Distance: {selectedTransport.distance}km</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedTransport(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => handleBooking(selectedTransport)}>
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
