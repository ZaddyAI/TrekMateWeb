"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ProtectedBookingFormProps {
  destinationId: string
  destinationName: string
  price: number
}

export function ProtectedBookingForm({ destinationId, destinationName, price }: ProtectedBookingFormProps) {
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)

    try {
      const checkInDate = new Date(bookingData.checkIn)
      const checkOutDate = new Date(bookingData.checkOut)
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      const totalPrice = price * nights

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          destinationId,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          numberOfGuests: Number.parseInt(bookingData.guests),
          totalPrice,
        }),
      })

      if (!response.ok) {
        throw new Error("Booking failed")
      }

      alert("Booking created successfully!")
      setBookingData({ checkIn: "", checkOut: "", guests: "1" })
    } catch (error) {
      alert("Failed to create booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">Book {destinationName}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Check-in Date</label>
          <input
            type="date"
            required
            value={bookingData.checkIn}
            onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Check-out Date</label>
          <input
            type="date"
            required
            value={bookingData.checkOut}
            onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Guests</label>
          <input
            type="number"
            min="1"
            max="10"
            required
            value={bookingData.guests}
            onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span>Price per night:</span>
            <span className="font-bold">${price}</span>
          </div>
          {bookingData.checkIn && bookingData.checkOut && (
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-lg">
                $
                {price *
                  Math.ceil(
                    (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
              </span>
            </div>
          )}
        </div>

        <Button type="submit" disabled={bookingLoading} className="w-full">
          {bookingLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </form>
    </Card>
  )
}
