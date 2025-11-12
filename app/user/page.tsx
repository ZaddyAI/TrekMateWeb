"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader, LogOut, AlertCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { DestinationData } from "@/types/types"
import { PublicDestinationCard } from "@/components/destinations/public-destination-card"

export default function DashboardPage() {
    const router = useRouter()
    const [destinations, setDestinations] = useState<DestinationData[]>([])
    const [filteredDestinations, setFilteredDestinations] = useState<DestinationData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState("Guest")
    const [searchQuery, setSearchQuery] = useState("")

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
                // Sort destinations by name for binary search
                const sortedData = response.data.sort((a, b) => a.destination.name.localeCompare(b.destination.name))
                setDestinations(sortedData)
                setFilteredDestinations(sortedData)
            } else {
                setDestinations([])
                setFilteredDestinations([])
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

    // Binary search function
    const binarySearchByName = (arr: DestinationData[], target: string) => {
        let left = 0
        let right = arr.length - 1
        target = target.toLowerCase()

        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            const midName = arr[mid].destination.name.toLowerCase()

            if (midName === target) {
                return [arr[mid]] // Return the matched destination
            } else if (midName < target) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return [] // Return empty if not found
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        if (!value) {
            setFilteredDestinations(destinations)
            return
        }

        const results = binarySearchByName(destinations, value)
        setFilteredDestinations(results)
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
                    <p className="text-muted-foreground">Discover and book your next trekking adventure</p>

                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search destination by name..."
                        className="mt-4 p-2 border rounded w-full max-w-md"
                    />
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
                {!loading && !error && filteredDestinations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDestinations.map((destination) => (
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
                                    images={destination.image?.url ? [destination.image.url] : []}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredDestinations.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No destinations found.</p>
                    </div>
                )}
            </div>
        </main>
    )
}
