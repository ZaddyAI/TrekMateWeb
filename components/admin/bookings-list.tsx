"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { Booking } from "@/types/types"

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
    //   const data = await adminService.getAllBookings()
    //   setBookings(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
    //   await adminService.updateBookingStatus(bookingId, newStatus)
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b)))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update booking")
    }
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
                      {/* <p className="font-medium">{booking.?.fullName || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{booking.user?.email}</p> */}
                    </div>
                  </td>
                  {/* <td className="py-3 px-4">{booking.destination?.name || "N/A"}</td> */}
                  <td className="py-3 px-4">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-bold">${booking.totalPrice}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "confirmed"
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
                        <Button size="sm" onClick={() => handleStatusUpdate(booking.id, "confirmed")}>
                          Confirm
                        </Button>
                      )}
                      {booking.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(booking.id, "cancelled")}
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
