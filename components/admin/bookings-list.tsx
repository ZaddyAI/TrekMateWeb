"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, Building, Car, MapPin, Calendar, User, DollarSign, ArrowUpDown } from "lucide-react"
import {
    CombinedBooking,
    Accomodation,
    Transportation,
    AccomodationBookingData,
    TransportationBookingData,
    UserData
} from "@/types/types"
import api from "@/lib/api"

// Merge Sort Implementation
const mergeSort = <T,>(array: T[], compareFn: (a: T, b: T) => number): T[] => {
    if (array.length <= 1) {
        return array
    }

    const middle = Math.floor(array.length / 2)
    const left = array.slice(0, middle)
    const right = array.slice(middle)

    return merge(
        mergeSort(left, compareFn),
        mergeSort(right, compareFn),
        compareFn
    )
}

const merge = <T,>(left: T[], right: T[], compareFn: (a: T, b: T) => number): T[] => {
    const result: T[] = []
    let leftIndex = 0
    let rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
        if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
            result.push(left[leftIndex])
            leftIndex++
        } else {
            result.push(right[rightIndex])
            rightIndex++
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

// Sorting options
type SortField = 'date' | 'customer' | 'service' | 'status' | 'type'
type SortOrder = 'asc' | 'desc'

export function BookingsList() {
    const [bookings, setBookings] = useState<CombinedBooking[]>([])
    const [accommodations, setAccommodations] = useState<{ [key: number]: Accomodation }>({})
    const [transportations, setTransportations] = useState<{ [key: number]: Transportation }>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updatingBooking, setUpdatingBooking] = useState<number | null>(null)
    const [sortField, setSortField] = useState<SortField>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            setLoading(true)
            const [accommodationBookingsRes, transportationBookingsRes, accommodationsRes, transportationsRes] = await Promise.all([
                api.get("/user/accomodation/bookings"),
                api.get("/user/transportation/bookings"),
                api.get("/accomodations"),
                api.get("/transportations")
            ])

            // Process accommodation bookings
            const accommodationBookings: CombinedBooking[] = accommodationBookingsRes.data.map((item: AccomodationBookingData) => ({
                id: item.accomodation_booking.id,
                type: "accommodation" as const,
                user: item.user,
                status: item.accomodation_booking.status as "pending" | "confirmed" | "cancelled",
                createdAt: item.accomodation_booking.createdAt,
                accomodationId: item.accomodation_booking.accomodationId,
                startingDate: item.accomodation_booking.startingDate,
                endingDate: item.accomodation_booking.endingDate
            }))

            // Process transportation bookings
            const transportationBookings: CombinedBooking[] = transportationBookingsRes.data.map((item: TransportationBookingData) => ({
                id: item.transportation_booking.id,
                type: "transportation" as const,
                user: item.user,
                status: item.transportation_booking.status as "pending" | "confirmed" | "cancelled",
                createdAt: item.transportation_booking.createdAt,
                transportationId: item.transportation_booking.transportationId,
                dispatchDate: item.transportation_booking.dispatchDate,
                returnDate: item.transportation_booking.returnDate
            }))

            setBookings([...accommodationBookings, ...transportationBookings])

            // Process accommodations
            const accommodationsMap: { [key: number]: Accomodation } = {}
            accommodationsRes.data.forEach((acc: Accomodation) => {
                accommodationsMap[acc.id] = acc
            })
            setAccommodations(accommodationsMap)

            // Process transportations
            const transportationsMap: { [key: number]: Transportation } = {}
            transportationsRes.data.forEach((trans: Transportation) => {
                transportationsMap[trans.id] = trans
            })
            setTransportations(transportationsMap)

        } catch (err) {
            console.error("Error fetching data:", err)
            setError("Failed to fetch bookings data")
        } finally {
            setLoading(false)
        }
    }

    // Comparison functions for different sort fields
    const getComparisonFunction = (field: SortField, order: SortOrder) => {
        const direction = order === 'asc' ? 1 : -1

        return (a: CombinedBooking, b: CombinedBooking): number => {
            switch (field) {
                case 'date':
                    const dateA = new Date(a.createdAt).getTime()
                    const dateB = new Date(b.createdAt).getTime()
                    return (dateA - dateB) * direction

                case 'customer':
                    const nameA = a.user.name.toLowerCase()
                    const nameB = b.user.name.toLowerCase()
                    return nameA.localeCompare(nameB) * direction

                case 'service':
                    const serviceA = getServiceName(a).toLowerCase()
                    const serviceB = getServiceName(b).toLowerCase()
                    return serviceA.localeCompare(serviceB) * direction

                case 'status':
                    const statusOrder = { 'pending': 0, 'conformed': 1, 'cancelled': 2 }
                    const statusA = statusOrder[a.status]
                    const statusB = statusOrder[b.status]
                    return (statusA - statusB) * direction

                case 'type':
                    const typeA = a.type === 'accommodation' ? 0 : 1
                    const typeB = b.type === 'accommodation' ? 0 : 1
                    return (typeA - typeB) * direction

                default:
                    return 0
            }
        }
    }

    // Apply merge sort to bookings
    const getSortedBookings = () => {
        const compareFn = getComparisonFunction(sortField, sortOrder)
        return mergeSort([...bookings], compareFn)
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle order if same field
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            // New field, default to descending
            setSortField(field)
            setSortOrder('desc')
        }
    }

    const handleStatusUpdate = async (bookingId: number, newStatus: "conformed" | "cancelled" | "pending", type: "accommodation" | "transportation", userId: number) => {
        try {
            setUpdatingBooking(bookingId)

            let endpoint = ""
            let payload = {
                userId,
                bookingId: bookingId,
                status: newStatus
            }

            if (type === "accommodation") {
                endpoint = "/user/accomodation/conformation"
            } else {
                endpoint = "/user/transportation/conformation"
            }

            await api.put(endpoint, payload)

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId && booking.type === type
                        ? { ...booking, status: newStatus }
                        : booking
                )
            )
        } catch (err: any) {
            console.error("Error updating booking status:", err)
            setError(err.response?.data?.message || "Failed to update booking status")
        } finally {
            setUpdatingBooking(null)
        }
    }

    const getServiceName = (booking: CombinedBooking) => {
        if (booking.type === "accommodation" && booking.accomodationId) {
            return accommodations[booking.accomodationId]?.name || `Accommodation #${booking.accomodationId}`
        } else if (booking.type === "transportation" && booking.transportationId) {
            return `Transportation - ${transportations[booking.transportationId]?.grade || "Standard"}`
        }
        return "N/A"
    }

    const getServiceDescription = (booking: CombinedBooking) => {
        if (booking.type === "accommodation" && booking.accomodationId) {
            return accommodations[booking.accomodationId]?.description || "No description available"
        } else if (booking.type === "transportation" && booking.transportationId) {
            const trans = transportations[booking.transportationId]
            return trans ? `${trans.grade} grade vehicle` : "Transportation service"
        }
        return "No description available"
    }

    const getDateInfo = (booking: CombinedBooking) => {
        if (booking.type === "accommodation") {
            return {
                start: booking.startingDate,
                end: booking.endingDate,
                startLabel: "Check-in",
                endLabel: "Check-out"
            }
        } else {
            return {
                start: booking.dispatchDate,
                end: booking.returnDate,
                startLabel: "Dispatch",
                endLabel: "Return"
            }
        }
    }

    const formatDate = (date: Date | undefined) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const sortedBookings = getSortedBookings()

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin h-8 w-8" />
                <span className="ml-2">Loading bookings...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                {error}
                <Button onClick={fetchAllData} className="ml-4" size="sm">
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">All Bookings ({sortedBookings.length})</h2>
                    <p className="text-muted-foreground">
                        Manage accommodation and transportation bookings
                    </p>
                </div>
                <Button onClick={fetchAllData} variant="outline">
                    Refresh
                </Button>
            </div>

            {/* Sorting Controls */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium">Sort by:</span>
                    {(['date', 'customer', 'service', 'status', 'type'] as SortField[]).map((field) => (
                        <Button
                            key={field}
                            variant={sortField === field ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSort(field)}
                            className="capitalize"
                        >
                            {field}
                            <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === field ? 'opacity-100' : 'opacity-50'
                                } ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        </Button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                        {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                    </span>
                </div>
            </Card>

            {sortedBookings.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p>There are no accommodation or transportation bookings at the moment.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sortedBookings.map((booking) => {
                        const dateInfo = getDateInfo(booking)
                        const serviceName = getServiceName(booking)
                        const serviceDescription = getServiceDescription(booking)
                        const isUpdating = updatingBooking === booking.id

                        return (
                            <Card key={`${booking.type}-${booking.id}`} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`p-3 rounded-lg ${booking.type === "accommodation"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-green-100 text-green-600"
                                            }`}>
                                            {booking.type === "accommodation" ? (
                                                <Building className="h-6 w-6" />
                                            ) : (
                                                <Car className="h-6 w-6" />
                                            )}
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.type === "accommodation"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-green-100 text-green-800"
                                                    }`}>
                                                    {booking.type.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === "conformed"
                                                    ? "bg-green-100 text-green-800"
                                                    : booking.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                {isUpdating && (
                                                    <Loader className="h-4 w-4 animate-spin" />
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-lg">{serviceName}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {serviceDescription}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-muted-foreground">Customer</p>
                                                        <p className="font-medium">{booking.user.name}</p>
                                                        <p className="text-muted-foreground text-xs">{booking.user.email}</p>
                                                        <p className="text-muted-foreground text-xs">{booking.user.phone}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-muted-foreground">{dateInfo.startLabel}</p>
                                                        <p className="font-medium">
                                                            {formatDate(dateInfo.start)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-muted-foreground">{dateInfo.endLabel}</p>
                                                        <p className="font-medium">
                                                            {formatDate(dateInfo.end)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-muted-foreground">Booking ID</p>
                                                        <p className="font-medium text-lg">#{booking.id}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                <span>
                                                    Booked on {formatDate(booking.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-4">
                                        {booking.status === "pending" && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleStatusUpdate(booking.id, "conformed", booking.type, booking.user.id)
                                                }
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? <Loader className="h-4 w-4 animate-spin" /> : "Confirm"}
                                            </Button>
                                        )}
                                        {booking.status !== "cancelled" && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleStatusUpdate(booking.id, "cancelled", booking.type, booking.user.id)
                                                }
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? <Loader className="h-4 w-4 animate-spin" /> : "Cancel"}
                                            </Button>
                                        )}
                                        {booking.status === "cancelled" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleStatusUpdate(booking.id, "pending", booking.type, booking.user.id)
                                                }
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? <Loader className="h-4 w-4 animate-spin" /> : "Reactivate"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
