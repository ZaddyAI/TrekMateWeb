"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProtectedBookingForm } from "@/components/booking/protected-booking-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, AlertCircle, MapPin } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { DestinationsData } from "@/types/types"



export default function DestinationDetailPage() {
    const { id } = useParams() as { id: string }
    const [destinations, setDestinations] = useState<DestinationsData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchDestinations()
    }, [])

    const fetchDestinations = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get(`/user/destination/get/${id}`)



            if (Array.isArray(response.data) && response.data.length > 0) {
                setDestinations(response.data)
            } else {
                setDestinations([])
            }

            setLoading(false)
        } catch (error) {
            setError("Failed to load destinations. Please try again later.")
            setLoading(false)
        }
    }
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin" />
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 bg-destructive/10 border border-destructive p-4 rounded-lg text-destructive">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        )
    }

    if (!destinations) return null

    return (
        <main className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/user/destinations">
                        <Button variant="ghost">Back to Destinations</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            {destinations.map((destination) => (
                <div>

                    <div className="relative h-96 w-full bg-muted">
                        <img
                            src={"/placeholder.svg?height=400&width=800&query=mountain%20destination"}
                            alt={destination.destination.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Details */}
                            <div className="lg:col-span-2">
                                <h1 className="text-4xl font-bold mb-4">{destination.destination.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                    <MapPin className="w-5 h-5" />
                                    <span>{destination.destination.region}</span>
                                </div>

                                {destination.destination.description && (
                                    <Card className="p-6 mb-8">
                                        <h2 className="text-xl font-bold mb-4">About this destination</h2>
                                        <p className="text-muted-foreground leading-relaxed">{destination.destination.description}</p>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Right Column - Booking */}
                    <div>
                        <div className="sticky top-4">
                            <Card className="p-6">
                                <div className="mb-6">
                                    <div className="text-3xl font-bold">${destination.destination.id}</div>
                                    <p className="text-sm text-muted-foreground">per night</p>
                                </div>
                                <ProtectedBookingForm
                                    destinationId={destination.destination.id.toString()}
                                    destinationName={destination.destination.name}
                                    price={destination.destination.id}
                                />
                            </Card>
                        </div>
                    </div>

                </div>
            ))}
        </main >
    )
}
