"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [user, setUser] = useState<{ email: string } | null>(null)

    useEffect(() => {
        const role = localStorage.getItem("role")
        const email = localStorage.getItem("user")
        if (role === "admin") {
            setIsAdmin(true)
            setUser({ email: email || "Admin" })
        } else {
            setIsAdmin(false)
        }
        setLoading(false)
    }, [])

    const router = useRouter()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You don't have admin access</p>
                <Link href="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold">TrekMate Admin</h1>
                        <div className="flex gap-4">
                            <Link href="/admin">
                                <Button variant="ghost">Home</Button>
                            </Link>
                            <Link href="/admin/accomodations">
                                <Button variant="ghost">Accomodations</Button>
                            </Link>
                            <Link href="/admin/transportation">
                                <Button variant="ghost">Transportation</Button>
                            </Link>
                            <Link href="/admin/bookings">
                                <Button variant="ghost">Bookings</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user?.email}</span>
                        <Button
                            variant="outline"
                            onClick={() => {
                                localStorage.removeItem("token")
                                router.push("/")
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
