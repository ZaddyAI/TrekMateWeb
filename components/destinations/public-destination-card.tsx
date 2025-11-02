"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign } from "lucide-react"

interface DestinationCardProps {
    id: number
    name: string
    description: string
    location: string
    price: number
    images?: string[]
}

export function PublicDestinationCard({ id, name, description, location, price, images }: DestinationCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={images?.[0] || "/placeholder.svg?height=250&width=400&query=travel%20destination"}
                    alt={name}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{price}</span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {location}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

                <Link href={`/user/destinations/${id}`}>
                    <Button className="w-full">View Details</Button>
                </Link>
            </div>
        </Card>
    )
}
