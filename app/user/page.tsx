"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader, LogOut, Calendar, DollarSign, MapPin } from "lucide-react"
import Link from "next/link"
import { Booking } from "@/types/types"
import api from "@/lib/api"

export default function DashboardPage() {
    const router = useRouter()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState("Guest")

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        setUser(storedUser || "Guest")
        fetchBookings()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/auth/login")
    }

    const fetchBookings = async () => {
        setLoading(true)
        setError("")
        try {
            const localStorageId = localStorage.getItem("id")
            const response = await api.get(`/user/booking/acc/user/${localStorageId}`)
            if (Array.isArray(response.data)) {
                setBookings(response.data)
            } else {
                setBookings([])
            }
        } catch (error) {
            setError("Failed to load bookings. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {user}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Your Bookings</h2>
                        <Link href="/user/destinations">
                            <Button>Book Another Destination</Button>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center py-12">
                            <Loader className="animate-spin h-8 w-8" />
                        </div>
                    )}

                    {/* Data Display */}
                    {!loading && !error && bookings.length > 0 && (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <Card key={booking.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Booking #{booking.id}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === "confirmed"
                                                ? "bg-green-100 text-green-800"
                                                : booking.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Check-in</p>
                                                <p className="font-semibold">
                                                    {new Date(booking.checkInDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Check-out</p>
                                                <p className="font-semibold">
                                                    {new Date(booking.checkOutDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Price</p>
                                                <p className="font-semibold">${booking.totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Empty Data State */}
                    {!loading && !error && bookings.length === 0 && (
                        <Card className="p-12 text-center">
                            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                You haven’t made any bookings yet.
                            </p>
                            <Link href="/user/destinations">
                                <Button>Browse Destinations</Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    )
}
