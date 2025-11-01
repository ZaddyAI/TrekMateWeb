"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mountain, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const { user, token, logout, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalAccommodations: 0,
    totalTransportation: 0,
    totalBookings: 0,
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TrekMate Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully",
                })
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage destinations, accommodations, and transportation services</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Destinations</p>
              <p className="text-3xl font-bold">{stats.totalDestinations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Accommodations</p>
              <p className="text-3xl font-bold">{stats.totalAccommodations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Transportation</p>
              <p className="text-3xl font-bold">{stats.totalTransportation}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Bookings</p>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Destinations</CardTitle>
                <Button asChild>
                  <Link href="/admin/destinations">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Add new trekking destinations to the platform</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accommodations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Accommodations</CardTitle>
                <Button asChild>
                  <Link href="/admin/accommodations">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Accommodation
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Add lodges, hotels, and guest houses</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transportation">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Transportation</CardTitle>
                <Button asChild>
                  <Link href="/admin/transportation">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transportation
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Add jeeps, helicopters, and buses</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and manage all user bookings</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
