"use client"

import { useEffect, useState } from "react"
import { PublicDestinationCard } from "@/components/destinations/public-destination-card"
import { Loader, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { DestinationsData } from "@/types/types"

export default function DestinationsPage() {
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
            const response = await api.get("/user/destination/get")



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

    return (
        <main className="min-h-screen bg-background">
            <nav className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <h1 className="text-2xl font-bold">TrekMate</h1>
                    </Link>
                    <Link href="/user">
                        <Button variant="ghost">Back to Home</Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Explore Destinations</h1>
                    <p className="text-muted-foreground">
                        Browse and book your next trekking adventure
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="animate-spin h-8 w-8" />
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex items-center gap-3 bg-destructive/10 border border-destructive p-4 rounded-lg text-destructive mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Data Available */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                        <PublicDestinationCard
                            key={destination.destination.id}
                            id={destination.destination.id}
                            name={destination.destination.name}
                            description={destination.destination.description}
                            location={destination.destination.region}
                            price={destination.destination.id}
                            images={destination.image}
                        />
                    ))}
                </div>


                {/* Empty Data State */}
                {!loading && !error && destinations.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">
                            No destinations available yet.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
