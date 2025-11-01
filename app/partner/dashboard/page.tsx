"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mountain,
  Calendar,
  Star,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  DollarSign,
  Users,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function PartnerDashboard() {
  const { toast } = useToast()

  const stats = {
    totalListings: 8,
    activeBookings: 12,
    monthlyRevenue: 3450,
    averageRating: 4.6,
    totalReviews: 89,
  }

  const listings = [
    {
      id: 1,
      name: "Namche Bazaar Lodge",
      type: "Accommodation",
      location: "Namche Bazaar",
      status: "active",
      bookings: 15,
      rating: 4.5,
      revenue: 1250,
      image: "/placeholder.svg?height=100&width=150&text=Lodge",
    },
    {
      id: 2,
      name: "Mountain View Tea House",
      type: "Accommodation",
      location: "Tengboche",
      status: "active",
      bookings: 8,
      rating: 4.7,
      revenue: 890,
      image: "/placeholder.svg?height=100&width=150&text=Tea+House",
    },
    {
      id: 3,
      name: "Sherpa Transport Service",
      type: "Transportation",
      location: "Lukla",
      status: "pending",
      bookings: 0,
      rating: 0,
      revenue: 0,
      image: "/placeholder.svg?height=100&width=150&text=Transport",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      guest: "Sarah Johnson",
      service: "Namche Bazaar Lodge",
      checkIn: "2024-03-15",
      checkOut: "2024-03-17",
      amount: 90,
      status: "confirmed",
    },
    {
      id: 2,
      guest: "Mike Chen",
      service: "Mountain View Tea House",
      checkIn: "2024-03-20",
      checkOut: "2024-03-22",
      amount: 80,
      status: "pending",
    },
    {
      id: 3,
      guest: "Emma Wilson",
      service: "Namche Bazaar Lodge",
      checkIn: "2024-03-25",
      checkOut: "2024-03-27",
      amount: 90,
      status: "confirmed",
    },
  ]

  const handleBookingAction = (bookingId: number, action: "accept" | "reject") => {
    toast({
      title: action === "accept" ? "Booking Accepted" : "Booking Rejected",
      description: `The booking has been ${action}ed successfully.`,
      variant: action === "accept" ? "default" : "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TrekMate Partner</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>RB</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Ram!</h1>
          <p className="text-gray-600">Manage your listings and bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold">{stats.totalListings}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold">{stats.activeBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">${stats.monthlyRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Listings</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>

            <div className="grid gap-6">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{listing.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="outline">{listing.type}</Badge>
                              <span>•</span>
                              <span>{listing.location}</span>
                            </div>
                          </div>
                          <Badge
                            variant={listing.status === "active" ? "default" : "secondary"}
                            className={listing.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {listing.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Bookings</p>
                            <p className="font-semibold">{listing.bookings}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{listing.rating || "N/A"}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="font-semibold">${listing.revenue}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Bookings</h2>
              <Button variant="outline">View All</Button>
            </div>

            <div className="grid gap-6">
              {recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{booking.guest}</h3>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{booking.service}</p>
                        <p className="text-sm text-gray-600">
                          {booking.checkIn} to {booking.checkOut}
                        </p>
                        <p className="text-lg font-semibold text-green-600 mt-2">${booking.amount}</p>
                      </div>
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleBookingAction(booking.id, "accept")}>
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what your guests are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reviews interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track your business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
