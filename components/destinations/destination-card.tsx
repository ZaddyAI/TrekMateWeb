"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DestinationsData } from "@/types/types"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DestinationCardProps {
    destination: DestinationsData
}

export function DestinationCard({ destination }: DestinationCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-gray-200">
                <Image
                    src={destination.image[0] || "/placeholder.svg?height=300&width=400&query=mountain"}
                    alt={destination.destination.name}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{destination.destination.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                        {destination.destination.region}
                    </span>
                </div>

                {/* {destination.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{destination.rating}</span>
            </div>
            <span className="text-sm text-gray-600">({destination.reviews} reviews)</span>
          </div>
        )} */}

                {destination.destination.description && <p className="text-sm text-gray-600 line-clamp-2">{destination.destination.description}</p>}

                <Link
                    href={`/destinations/${destination.destination.id}`}
                    className="inline-block text-blue-600 hover:underline text-sm font-medium"
                >
                    View Details →
                </Link>
            </CardContent>
        </Card>
    )
}
