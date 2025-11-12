"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader, ArrowLeft, MapPin, Mountain, Calendar, Car, Hotel } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { DestinationData } from "@/types/types"
import { toast } from "react-toastify"
import { PublicDestinationCard } from "@/components/destinations/public-destination-card"

interface BookingFormData {
    startDate: string
    endDate: string
    bookingType: 'accommodation' | 'transportation' | null
}

export default function DestinationDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [destination, setDestination] = useState<DestinationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingForm, setBookingForm] = useState<BookingFormData>({
        startDate: '',
        endDate: '',
        bookingType: null
    })
    const [userId, setUserId] = useState<number | null>(null)
    const [recommendedDestinations, setRecommendedDestinations] = useState<DestinationData[]>([])

    // Fetch current destination
    useEffect(() => {
        const storedUserId = localStorage.getItem("id")
        if (storedUserId) setUserId(parseInt(storedUserId))
        fetchDestination()
    }, [id])

    const fetchDestination = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get(`/destination/${id}`)
            setDestination(response.data)
        } catch (error) {
            setError("Failed to load destination details.")
        } finally {
            setLoading(false)
        }
    }

    // Fetch recommendations after current destination is loaded
    useEffect(() => {
        if (destination.length > 0) {
            const currentDest = destination[0]
            fetchRecommendedDestinations(currentDest.destination.id, currentDest.destination.region)
        }
    }, [destination])

    // Recommendation Algorithm: content-based + popularity-based
    const fetchRecommendedDestinations = async (currentDestinationId: number, currentRegion: string) => {
        try {
            const response = await api.get('/destinations')
            const allDestinations: DestinationData[] = response.data

            // Exclude current destination
            const filtered = allDestinations.filter(dest => dest.destination.id !== currentDestinationId)

            // Content-based filtering: same region
            const regionMatches = filtered.filter(dest => dest.destination.region === currentRegion)



            setRecommendedDestinations(regionMatches.slice(0, 3)) // top 3
        } catch (err) {
            console.error('Failed to fetch recommended destinations', err)
        }
    }

    const handleBookAccommodation = async () => {
        if (!bookingForm.startDate || !bookingForm.endDate) {
            toast.error("Please select check-in and check-out dates")
            return
        }
        setBookingLoading(true)
        try {
            await api.post('/user/accomodation/book', {
                userId: userId,
                accomodationId: destination[0]?.accomodation?.id,
                startingDate: bookingForm.startDate,
                endingDate: bookingForm.endDate
            })
            toast.success("Accommodation booked successfully!")
            setBookingForm({ startDate: '', endDate: '', bookingType: null })
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to book accommodation")
        } finally {
            setBookingLoading(false)
        }
    }

    const handleBookTransportation = async () => {
        if (!bookingForm.startDate || !bookingForm.endDate) {
            toast.error("Please select dispatch and return dates")
            return
        }
        setBookingLoading(true)
        try {
            await api.post('/user/transportation/book', {
                transportationId: destination[0]?.transportation?.id,
                dispatchDate: bookingForm.startDate,
                returnDate: bookingForm.endDate
            })
            toast.success("Transportation booked successfully!")
            setBookingForm({ startDate: '', endDate: '', bookingType: null })
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to book transportation")
        } finally {
            setBookingLoading(false)
        }
    }

    const handleBooking = () => {
        if (bookingForm.bookingType === 'accommodation') handleBookAccommodation()
        else if (bookingForm.bookingType === 'transportation') handleBookTransportation()
    }

    const selectBookingType = (type: 'accommodation' | 'transportation') => {
        setBookingForm(prev => ({ ...prev, bookingType: type, startDate: '', endDate: '' }))
    }

    const cancelBooking = () => {
        setBookingForm({ startDate: '', endDate: '', bookingType: null })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
        )
    }

    if (error || !destination.length) {
        return (
            <div className="text-center py-20">
                <p className="text-destructive text-lg">{error || "Destination not found."}</p>
                <Link href="/user" className="inline-flex items-center mt-4 text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
                </Link>
            </div>
        )
    }

    const dest = destination[0]

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/user" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{dest.destination.name}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">{dest.destination.shortDescription}</p>
                </div>

                {/* Image Grid */}
                {dest.image?.url && (
                    <div className="mb-8">
                        <img src={dest.image.url} alt={dest.destination.name} className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <section className="bg-card rounded-2xl border shadow-sm p-6">
                            <h2 className="text-2xl font-semibold mb-4">About this Destination</h2>
                            <p className="text-foreground leading-relaxed">{dest.destination.description}</p>
                        </section>

                        {/* Destination Details */}
                        <section className="bg-card rounded-2xl border shadow-sm p-6">
                            <h2 className="text-2xl font-semibold mb-4">Destination Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Region</p>
                                        <p className="font-medium">{dest.destination.region}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mountain className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Highest Elevation</p>
                                        <p className="font-medium">{dest.destination.highestElivation}m</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Available Services */}
                        <section className="bg-card rounded-2xl border shadow-sm p-6">
                            <h2 className="text-2xl font-semibold mb-6">Available Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dest.accomodation && (
                                    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Hotel className="h-6 w-6 text-blue-600" />
                                            <h3 className="text-lg font-semibold">Accommodation</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium">{dest.accomodation.name}</h4>
                                            <p className="text-sm text-muted-foreground">{dest.accomodation.description}</p>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-2xl font-bold text-green-600">Rs{dest.accomodation.price}</span>
                                                <span className="text-sm text-muted-foreground">per night</span>
                                            </div>
                                        </div>
                                        <button onClick={() => selectBookingType('accommodation')} className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            Book Accommodation
                                        </button>
                                    </div>
                                )}

                                {dest.transportation && (
                                    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Car className="h-6 w-6 text-green-600" />
                                            <h3 className="text-lg font-semibold">Transportation</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Grade:</span>
                                                <span className="text-muted-foreground">{dest.transportation.grade}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-2xl font-bold text-green-600">Rs{dest.transportation.price}</span>
                                                <span className="text-sm text-muted-foreground">per trip</span>
                                            </div>
                                        </div>
                                        <button onClick={() => selectBookingType('transportation')} className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                            Book Transportation
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!dest.accomodation && !dest.transportation && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No services available for this destination</p>
                                </div>
                            )}
                        </section>

                        {/* Recommended Destinations */}
                        {recommendedDestinations.length > 0 && (
                            <section className="mt-12">
                                <h2 className="text-2xl font-semibold mb-6">Recommended Destinations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {recommendedDestinations.map((rec) => (
                                        <div
                                            key={rec.destination.id}
                                            onClick={() => router.push(`/user/destinations/${rec.destination.id}`)}
                                            className="cursor-pointer hover:scale-[1.02] transition"
                                        >
                                            <PublicDestinationCard
                                                id={rec.destination.id}
                                                name={rec.destination.name}
                                                description={rec.destination.description}
                                                location={rec.destination.region}
                                                images={rec.image?.url ? [rec.image.url] : []}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        {bookingForm.bookingType ? (
                            <div className="bg-card rounded-2xl border shadow-sm p-6 sticky top-8">
                                <h3 className="text-xl font-semibold mb-4">
                                    Book {bookingForm.bookingType === 'accommodation' ? 'Accommodation' : 'Transportation'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {bookingForm.bookingType === 'accommodation' ? 'Check-in Date' : 'Dispatch Date'} *
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingForm.startDate}
                                            onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {bookingForm.bookingType === 'accommodation' ? 'Check-out Date' : 'Return Date'} *
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingForm.endDate}
                                            onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Service:</span>
                                            <span className="font-medium capitalize">{bookingForm.bookingType}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Price:</span>
                                            <span className="text-lg font-bold text-green-600">
                                                Rs{bookingForm.bookingType === 'accommodation' ? dest.accomodation?.price : dest.transportation?.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button onClick={cancelBooking} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingLoading || !bookingForm.startDate || !bookingForm.endDate}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card rounded-2xl border shadow-sm p-6 text-center sticky top-8">
                                <div className="text-muted-foreground mb-4">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Select a service to book</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Choose either accommodation or transportation from the available services to start booking.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
