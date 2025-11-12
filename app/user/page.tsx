"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader, LogOut, AlertCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { DestinationData } from "@/types/types"
import { PublicDestinationCard } from "@/components/destinations/public-destination-card"
import page from "./booking/page"

export default function DashboardPage() {
    const router = useRouter()
    const [destinations, setDestinations] = useState<DestinationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState("Guest")

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        setUser(storedUser || "Guest")
        fetchDestinations()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        router.push("/auth/login")
    }

    const fetchDestinations = async () => {
        setLoading(true)
        setError("")
        try {

            const response = await api.get("/destinations");
            if (Array.isArray(response.data)) {
                setDestinations(response.data)
            } else {
                setDestinations([])
            }
        } catch (error) {
            setError("Failed to load destinations. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const handleDestinationClick = (id: number) => {
        router.push(`/user/destinations/${id}`)
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="text">
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Welcome back, {user}</p>
                        </div>

                        <div className="menus">
                            <Link href="/user/booking" className="mr-4 text-sm font-medium hover:underline">
                                My Bookings
                            </Link>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Explore Destinations</h2>
                    <p className="text-muted-foreground">
                        Discover and book your next trekking adventure
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="flex items-center gap-3 bg-destructive/10 border border-destructive p-4 rounded-lg text-destructive mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin h-8 w-8" />
                    </div>
                )}

                {/* Destinations Grid */}
                {!loading && !error && destinations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map((destination) => (
                            <div
                                key={destination.destination.id}
                                onClick={() => handleDestinationClick(destination.destination.id)}
                                className="cursor-pointer transition hover:scale-[1.02]"
                            >
                                <PublicDestinationCard
                                    id={destination.destination.id}
                                    name={destination.destination.name}
                                    description={destination.destination.description}
                                    location={destination.destination.region}
                                    price={destination.destination.id || 0}
                                    images={destination.image?.url ? [destination.image.url] : []}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
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
