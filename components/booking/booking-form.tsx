"use client"

import { useEffect, useState } from "react"
import { Calendar, CreditCard, User } from "lucide-react"
import api from "@/lib/api"
import { toast } from "react-toastify"

interface BookingFormProps {
    accomodationId: number
    price: number
    name: string
}

export default function BookingForm({ accomodationId, price, name }: BookingFormProps) {
    const [startingDate, setStartingDate] = useState("")
    const [endingDate, setEndingDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const storedUserId = localStorage.getItem("id")
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
        }
    }, [])

    const calculateTotal = () => {
        if (!startingDate || !endingDate) return 0
        const start = new Date(startingDate)
        const end = new Date(endingDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        return days > 0 ? days * price : 0
    }

    const calculateNights = () => {
        if (!startingDate || !endingDate) return 0
        const start = new Date(startingDate)
        const end = new Date(endingDate)
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        // Validate dates
        if (new Date(endingDate) <= new Date(startingDate)) {
            setMessage("Ending date must be after starting date")
            setLoading(false)
            return
        }

        try {
            const response = await api.post('/user/accomodation/book', {
                accomodationId,
                startingDate,
                endingDate,
                // Remove totalPrice and userId as your backend doesn't expect them
                // totalPrice: calculateTotal(),
                // userId: userId,
            })

            toast.success("Booking created successfully!")
            setMessage("Booking created successfully!")
            setStartingDate("")
            setEndingDate("")
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to create booking'
            setMessage(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const total = calculateTotal()
    const nights = calculateNights()

    return (
        <div className="bg-card rounded-2xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Book Now
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <label className="block text-sm font-medium">
                        Accommodation
                    </label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{name}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            <label className="block text-sm font-medium">
                                Starting Date
                            </label>
                        </div>
                        <input
                            type="date"
                            value={startingDate}
                            onChange={(e) => setStartingDate(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-background"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            <label className="block text-sm font-medium">
                                Ending Date
                            </label>
                        </div>
                        <input
                            type="date"
                            value={endingDate}
                            onChange={(e) => setEndingDate(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-background"
                            required
                            min={startingDate || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                {total > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Price per night:</span>
                            <span>${price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Nights:</span>
                            <span>{nights}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total:</span>
                            <span>${total}</span>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !startingDate || !endingDate || nights <= 0}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>

                {message && (
                    <p className={`text-sm text-center ${message.includes('successfully')
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
