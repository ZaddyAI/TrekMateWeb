"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  MapPin,
  Building,
  Calendar,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Shield,
  Mountain,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const stats = {
    totalUsers: 1247,
    totalDestinations: 25,
    totalAccommodations: 156,
    totalBookings: 892,
    monthlyGrowth: 12.5,
  }

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2024-01-15", status: "Active" },
    { id: 2, name: "Sarah Wilson", email: "sarah@example.com", joinDate: "2024-01-14", status: "Active" },
    { id: 3, name: "Mike Chen", email: "mike@example.com", joinDate: "2024-01-13", status: "Pending" },
  ]

  const destinations = [
    { id: 1, name: "Everest Base Camp", district: "Solukhumbu", accommodations: 24, status: "Active" },
    { id: 2, name: "Annapurna Circuit", district: "Manang", accommodations: 18, status: "Active" },
    { id: 3, name: "Langtang Valley", district: "Rasuwa", accommodations: 12, status: "Active" },
  ]

  const accommodations = [
    { id: 1, name: "Everest View Hotel", type: "Hotel", location: "Namche Bazaar", status: "Active", rating: 4.5 },
    { id: 2, name: "Sherpa Lodge", type: "Tea House", location: "Tengboche", status: "Active", rating: 4.2 },
    { id: 3, name: "Mountain Paradise", type: "Tea House", location: "Dingboche", status: "Pending", rating: 4.3 },
  ]

  const recentBookings = [
    {
      id: 1,
      user: "John Doe",
      destination: "Everest Base Camp",
      accommodation: "Everest View Hotel",
      date: "2024-01-15",
      status: "Confirmed",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      destination: "Annapurna Circuit",
      accommodation: "Mountain Lodge",
      date: "2024-01-14",
      status: "Pending",
    },
    {
      id: 3,
      user: "Mike Chen",
      destination: "Langtang Valley",
      accommodation: "Sherpa Lodge",
      date: "2024-01-13",
      status: "Confirmed",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Mountain className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">TrekMate Admin</h1>
                <p className="text-sm text-slate-300">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5" />
              <span>Admin Panel</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAccommodations}</p>
                  <p className="text-sm text-gray-600">Accommodations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                        </div>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.user}</p>
                          <p className="text-sm text-gray-600">{booking.destination}</p>
                          <p className="text-xs text-gray-500">{booking.accommodation}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Join Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3 text-gray-600">{user.email}</td>
                          <td className="p-3 text-gray-600">{user.joinDate}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Destination Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">District</th>
                        <th className="text-left p-3">Accommodations</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((destination) => (
                        <tr key={destination.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{destination.name}</td>
                          <td className="p-3 text-gray-600">{destination.district}</td>
                          <td className="p-3 text-gray-600">{destination.accommodations}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(destination.status)}>{destination.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Accommodation Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Accommodation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Rating</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accommodations.map((accommodation) => (
                        <tr key={accommodation.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{accommodation.name}</td>
                          <td className="p-3 text-gray-600">{accommodation.type}</td>
                          <td className="p-3 text-gray-600">{accommodation.location}</td>
                          <td className="p-3 text-gray-600">{accommodation.rating}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(accommodation.status)}>{accommodation.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Destination</th>
                        <th className="text-left p-3">Accommodation</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{booking.user}</td>
                          <td className="p-3 text-gray-600">{booking.destination}</td>
                          <td className="p-3 text-gray-600">{booking.accommodation}</td>
                          <td className="p-3 text-gray-600">{booking.date}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
