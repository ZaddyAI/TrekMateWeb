"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export function BookingForm() {
    const searchParams = useSearchParams()
    const accommodationId = searchParams.get("accommodation")
    const router = useRouter()
    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)







    const calculateDays = () => {
        if (!checkInDate || !checkOutDate) return 0
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    }

    const totalPrice = calculateDays() * (4)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)


        if (calculateDays() === 0) {
            setError("Please select valid check-in and check-out dates")
            return
        }

        setIsSubmitting(true)
        try {
            //   await BookingsService.createBooking({
            //     user_id: user.id,
            //     accommodation_id: accommodationId,
            //     check_in_date: checkInDate,
            //     check_out_date: checkOutDate,
            //     total_price: totalPrice,
            //     status: "pending",
            //   })
            setSuccess(true)
            setTimeout(() => router.push("/dashboard"), 2000)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Booking failed"
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accommodation Info */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{accommodationId}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-gray-600 text-sm">Location</Label>
                                <p className="font-medium">{accommodationId}</p>
                            </div>
                            <div>
                                <Label className="text-gray-600 text-sm">Price per Night</Label>
                                <p className="text-2xl font-bold">Rs {accommodationId}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Complete Your Booking</CardTitle>
                            <CardDescription>Select your dates and review the total</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded">
                                        <CheckCircle className="w-4 h-4" />
                                        Booking created successfully! Redirecting...
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="check-in">Check-in Date</Label>
                                    <Input
                                        id="check-in"
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="check-out">Check-out Date</Label>
                                    <Input
                                        id="check-out"
                                        type="date"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {calculateDays() > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Number of Nights:</span>
                                            <span className="font-semibold">{calculateDays()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price per Night:</span>
                                            <span className="font-semibold">Rs {accommodationId?.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between text-lg">
                                            <span className="font-semibold">Total:</span>
                                            <span className="font-bold text-blue-600">Rs {totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isSubmitting || calculateDays() === 0}>
                                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
