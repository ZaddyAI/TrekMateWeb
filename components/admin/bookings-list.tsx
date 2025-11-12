"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { BookingData } from "@/types/types"
import api from "@/lib/api"

export function BookingsList() {
    const [bookings, setBookings] = useState<BookingData[]>([])
    const [userNames, setUserNames] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await api.get("/admin/booking/bookings")
            const bookingsData: BookingData[] = response.data
            setBookings(bookingsData)
            await fetchUserNames(bookingsData)
        } catch (err: any) {
            console.error("Error fetching bookings:", err)
            setError(err.response?.data?.message || "Failed to fetch bookings")
        } finally {
            setLoading(false)
        }
    }

    const fetchUserNames = async (bookingsData: BookingData[]) => {
        try {
            const names: Record<number, string> = {}
            // avoid duplicate requests for same userId
            const uniqueUserIds = [...new Set(bookingsData.map((b) => b.userId))]

            await Promise.all(
                uniqueUserIds.map(async (id) => {
                    try {
                        const res = await api.get(`/user/${id}`)
                        // adjust based on your API response
                        names[id] = res.data?.name || res.data?.user?.name || "Unknown User"
                    } catch {
                        names[id] = "Unknown User"
                    }
                })
            )

            setUserNames(names)
        } catch (error) {
            console.error("Error fetching user names:", error)
        }
    }

    const handleStatusUpdate = (bookingId: number, newStatus: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b))
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin" />
            </div>
        )
    }

    if (error) {
        return <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">User Bookings ({bookings.length})</h2>

            {bookings.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">No bookings yet.</Card>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">User</th>
                                <th className="text-left py-3 px-4">Destination</th>
                                <th className="text-left py-3 px-4">Check-in</th>
                                <th className="text-left py-3 px-4">Check-out</th>
                                <th className="text-left py-3 px-4">Price</th>
                                <th className="text-left py-3 px-4">Status</th>
                                <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b hover:bg-muted/50">
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium">
                                                {userNames[booking.userId] || "Loading..."}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                User ID: {booking.userId}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">{booking.accomodationId || "N/A"}</td>
                                    <td className="py-3 px-4">
                                        {new Date(booking.startingDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(booking.endingDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 font-bold">${booking.id || 0}</td>
                                    <td className="py-3 px-4">
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
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {booking.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusUpdate(booking.id, "confirmed")
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            )}
                                            {booking.status !== "cancelled" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleStatusUpdate(booking.id, "cancelled")
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
