"use client"
import api from '@/lib/api'
import { AccomodationData, BookingData } from '@/types/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function BookingsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [booking, setBooking] = useState<BookingData[]>([])
    const [accomodations, setAccomodations] = useState<AccomodationData[]>([])
    const [cancellingId, setCancellingId] = useState<number | null>(null)
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const navigate = useRouter();



    useEffect(() => {
        const storedUserId = localStorage.getItem("id")
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
        }
        fetchBookingByID()
    }, [])

    const fetchBookingByID = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get(`/user/accomodation/booking/user/${userId}`)
            if (Array.isArray(response.data) && response.data.length > 0) {
                setBooking(response.data)
                // Fetch accommodations for all bookings
                const accommodationIds = response.data.map(booking => booking.accomodationId)
                fetchAccomodationsByIds(accommodationIds)
            } else {
                setBooking([])
                setAccomodations([])
            }
        } catch (error) {
            setError("Failed to load bookings. Please try again later.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAccomodationsByIds = async (ids: number[]) => {
        try {
            const accommodationPromises = ids.map(id =>
                api.get(`/accomodation/${id}`).then(res => res.data)
            )
            const accommodationsData = await Promise.all(accommodationPromises)
            setAccomodations(accommodationsData.flat())
        } catch (error) {
            console.error("Failed to load accommodations", error)
        }
    }

    const getAccommodationForBooking = (accommodationId: number) => {
        return accomodations.find(acc =>
            acc.accomodation?.id === accommodationId ||
            acc.accomodation.id === accommodationId
        )
    }

    const handleCancelBooking = async (bookingId: number) => {
        try {
            await api.delete(`/user/accomodation/booking/${bookingId}`)
            toast.success("Booking cancelled successfully!")
            navigate.push('/user/booking');
        } catch (error) {
            toast.error("Failed to cancel booking. Please try again.")
        } finally {
            setCancellingId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchBookingByID}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-600 mt-2">Manage your accommodation reservations</p>
                    </div>
                    <Link
                        href="/user"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-black transition-colors flex items-center gap-2"
                    >
                        ← Back to Main Page
                    </Link>
                </div>

                {/* Bookings List */}
                {booking.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🏨</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                        {/* <Link
                            href="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                            Explore Accommodations
                        </Link> */}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {booking.map((bookingItem) => {
                            const accommodation = getAccommodationForBooking(bookingItem.accomodationId)
                            const imageUrl = accommodation?.image?.url

                            return (
                                <div key={bookingItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Accommodation Image */}
                                            <div className="shrink-0">
                                                <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-200">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={accommodation?.accomodation?.name || 'Accommodation'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            🏨
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="grow">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                            {accommodation?.accomodation?.name || 'Unknown Accommodation'}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                            {accommodation?.accomodation?.description || 'No description available'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingItem.status)}`}>
                                                            {bookingItem.status.charAt(0).toUpperCase() + bookingItem.status.slice(1)}
                                                        </span>
                                                        <div className="text-lg font-bold text-blue-600">
                                                            ${accommodation?.accomodation?.price || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Booking Dates */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Check-in</p>
                                                        <p className="font-medium text-gray-900">
                                                            {formatDate(bookingItem.startingDate.toString())}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Check-out</p>
                                                        <p className="font-medium text-gray-900">
                                                            {formatDate(bookingItem.endingDate.toString())}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Booking Meta */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="text-sm text-gray-500">
                                                        Booking ID: #{bookingItem.id} •
                                                        Created: {formatDate(bookingItem.createdAt.toString())}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-3">
                                                        {/* <button
                                                            onClick={() => router.push(`/accommodations/${bookingItem.accomodationId}`)}
                                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            View Details
                                                        </button> */}
                                                        {bookingItem.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleCancelBooking(bookingItem.id)}
                                                                disabled={cancellingId === bookingItem.id}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                            >
                                                                {cancellingId === bookingItem.id ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                        Cancelling...
                                                                    </>
                                                                ) : (
                                                                    'Cancel Booking'
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
