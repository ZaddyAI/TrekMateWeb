"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader, ArrowLeft, MapPin, Mountain, Calendar } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { DestinationData } from "@/types/types"
import BookingForm from "@/components/booking/booking-form"

export default function DestinationDetailsPage() {
    const { id } = useParams()
    const [destination, setDestination] = useState<DestinationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
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
                    <Link
                        href="/user"
                        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Destinations
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {dest.destination.name}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        {dest.destination.shortDescription}
                    </p>
                </div>

                {/* Image Grid */}
                {dest.image?.url && (
                    <div className="mb-8">
                        <img
                            src={dest.image.url}
                            alt={dest.destination.name}
                            className="w-full h-96 object-cover rounded-2xl shadow-lg"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <section className="bg-card rounded-2xl border shadow-sm p-6">
                            <h2 className="text-2xl font-semibold mb-4">About this Destination</h2>
                            <p className="text-foreground leading-relaxed">
                                {dest.destination.description}
                            </p>
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

                        {/* Accommodation Information */}
                        {dest.destination && (
                            <section className="bg-card rounded-2xl border shadow-sm p-6">
                                <h2 className="text-2xl font-semibold mb-4">Accommodation</h2>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-medium">{dest.destination.name}</h3>
                                    <p className="text-muted-foreground">{dest.accomodation.description}</p>
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price per night</p>
                                            <p className="font-medium text-lg">${dest.accomodation.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        {dest.accomodation ? (
                            <BookingForm
                                accomodationId={dest.accomodation.id}
                                price={dest.accomodation.price}
                                name={dest.accomodation.name}
                            />
                        ) : (
                            <div className="bg-card rounded-2xl border shadow-sm p-6 text-center">
                                <p className="text-muted-foreground">No accommodation available for booking</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
