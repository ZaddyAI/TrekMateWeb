"use client"
import api from '@/lib/api'
import { AccomodationData, BookingData, TransportationData } from '@/types/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

interface AccommodationBooking {
    id: number;
    userId: number;
    accomodationId: number;
    startingDate: string;
    endingDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface TransportationBooking {
    id: number;
    userId: number;
    transportationId: number;
    dispatchDate: string;
    returnDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface CombinedBooking {
    id: number;
    type: 'accommodation' | 'transportation';
    status: string;
    createdAt: string;
    accommodationData?: {
        booking: AccommodationBooking;
        details?: AccomodationData;
    };
    transportationData?: {
        booking: TransportationBooking;
        details?: TransportationData;
    };
}

export default function BookingsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [bookings, setBookings] = useState<CombinedBooking[]>([])
    const [cancellingId, setCancellingId] = useState<number | null>(null)
    const [cancellingType, setCancellingType] = useState<'accommodation' | 'transportation' | null>(null)
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const storedUserId = localStorage.getItem("id")
        console.log("Stored User ID:", storedUserId);
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
        }
    }, [])

    useEffect(() => {
        if (userId) {
            fetchAllBookings()
        }
    }, [userId])

    const fetchAllBookings = async () => {
        setLoading(true)
        setError("")
        try {
            // Fetch both accommodation and transportation bookings in parallel
            const [accommodationResponse, transportationResponse] = await Promise.all([
                api.get(`/user/accomodation/booking/user/${userId}`),
                api.get(`/user/transportation/booking/user/${userId}`)
            ])

            const accommodationBookings: AccommodationBooking[] = accommodationResponse.data || []
            const transportationBookings: TransportationBooking[] = transportationResponse.data || []

            // Combine and format bookings
            const combinedBookings: CombinedBooking[] = []

            // Add accommodation bookings
            for (const booking of accommodationBookings) {
                combinedBookings.push({
                    id: booking.id,
                    type: 'accommodation',
                    status: booking.status,
                    createdAt: booking.createdAt,
                    accommodationData: {
                        booking: booking
                    }
                })
            }

            // Add transportation bookings
            for (const booking of transportationBookings) {
                combinedBookings.push({
                    id: booking.id,
                    type: 'transportation',
                    status: booking.status,
                    createdAt: booking.createdAt,
                    transportationData: {
                        booking: booking
                    }
                })
            }

            // Sort by creation date (newest first)
            combinedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            setBookings(combinedBookings)

            // Fetch details for all bookings
            if (combinedBookings.length > 0) {
                await fetchBookingDetails(combinedBookings)
            }

        } catch (error) {
            setError("Failed to load bookings. Please try again later.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchBookingDetails = async (bookings: CombinedBooking[]) => {
        try {
            const updatedBookings = [...bookings]

            // Fetch accommodation details
            const accommodationIds = bookings
                .filter(b => b.type === 'accommodation')
                .map(b => b.accommodationData!.booking.accomodationId)

            if (accommodationIds.length > 0) {
                const accommodationPromises = accommodationIds.map(id =>
                    api.get(`/accomodation/${id}`).then(res => res.data[0]) // Get first item from array
                )
                const accommodationsData = await Promise.all(accommodationPromises)

                // Update bookings with accommodation details
                accommodationsData.forEach((accData, index) => {
                    const bookingIndex = updatedBookings.findIndex(
                        b => b.type === 'accommodation' &&
                            b.accommodationData!.booking.accomodationId === accommodationIds[index]
                    )
                    if (bookingIndex !== -1) {
                        updatedBookings[bookingIndex].accommodationData!.details = accData
                    }
                })
            }

            // Fetch transportation details
            const transportationIds = bookings
                .filter(b => b.type === 'transportation')
                .map(b => b.transportationData!.booking.transportationId)

            if (transportationIds.length > 0) {
                const transportationPromises = transportationIds.map(id =>
                    api.get(`/transportation/${id}`).then(res => res.data[0]) // Get first item from array
                )
                const transportationsData = await Promise.all(transportationPromises)

                // Update bookings with transportation details
                transportationsData.forEach((transData, index) => {
                    const bookingIndex = updatedBookings.findIndex(
                        b => b.type === 'transportation' &&
                            b.transportationData!.booking.transportationId === transportationIds[index]
                    )
                    if (bookingIndex !== -1) {
                        updatedBookings[bookingIndex].transportationData!.details = transData
                    }
                })
            }

            setBookings(updatedBookings)

        } catch (error) {
            console.error("Failed to load booking details", error)
        }
    }

    const handleCancelBooking = async (bookingId: number, type: 'accommodation' | 'transportation') => {
        setCancellingId(bookingId)
        setCancellingType(type)
        try {
            if (type === 'accommodation') {
                await api.delete(`/user/accomodation/booking/${bookingId}`)
            } else {
                await api.delete(`/user/transportation/booking/${bookingId}`)
            }
            toast.success("Booking cancelled successfully!")
            // Remove the cancelled booking from state
            setBookings(prev => prev.filter(b => b.id !== bookingId))
        } catch (error) {
            toast.error("Failed to cancel booking. Please try again.")
        } finally {
            setCancellingId(null)
            setCancellingType(null)
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

    const getTypeColor = (type: 'accommodation' | 'transportation') => {
        return type === 'accommodation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
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
                        onClick={fetchAllBookings}
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-600 mt-2">Manage your accommodation and transportation reservations</p>
                    </div>
                    <Link
                        href="/user"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        ← Back to Main Page
                    </Link>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={`${booking.type}-${booking.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Service Image */}
                                        <div className="shrink-0">
                                            <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-200">
                                                {booking.type === 'accommodation' && booking.accommodationData?.details?.image?.url ? (
                                                    <img
                                                        src={booking.accommodationData.details.image.url}
                                                        alt={booking.accommodationData.details.accomodation?.name || 'Accommodation'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : booking.type === 'transportation' && booking.transportationData?.details?.image?.url ? (
                                                    <img
                                                        src={booking.transportationData.details.image.url}
                                                        alt="Transportation"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        {booking.type === 'accommodation' ? '🏨' : '🚗'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="grow">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(booking.type)}`}>
                                                            {booking.type === 'accommodation' ? 'Accommodation' : 'Transportation'}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {booking.type === 'accommodation'
                                                            ? booking.accommodationData?.details?.accomodation?.name || 'Unknown Accommodation'
                                                            : `Transportation - ${booking.transportationData?.details?.transportation?.grade || 'Unknown Grade'}`
                                                        }
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                        {booking.type === 'accommodation'
                                                            ? booking.accommodationData?.details?.accomodation?.description || 'No description available'
                                                            : `Transportation service`
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    Rs{booking.type === 'accommodation'
                                                        ? booking.accommodationData?.details?.accomodation?.price || 'N/A'
                                                        : booking.transportationData?.details?.transportation?.price || 'N/A'
                                                    }
                                                </div>
                                            </div>

                                            {/* Booking Dates */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.type === 'accommodation' ? 'Check-in' : 'Dispatch Date'}
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(
                                                            booking.type === 'accommodation'
                                                                ? booking.accommodationData!.booking.startingDate
                                                                : booking.transportationData!.booking.dispatchDate
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.type === 'accommodation' ? 'Check-out' : 'Return Date'}
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(
                                                            booking.type === 'accommodation'
                                                                ? booking.accommodationData!.booking.endingDate
                                                                : booking.transportationData!.booking.returnDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Booking Meta */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="text-sm text-gray-500">
                                                    Booking ID: #{booking.id} •
                                                    Created: {formatDate(booking.createdAt)}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-3">
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id, booking.type)}
                                                            disabled={cancellingId === booking.id && cancellingType === booking.type}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {cancellingId === booking.id && cancellingType === booking.type ? (
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
