"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain, Menu, X, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    // This would come from your auth context/state
    const isLoggedIn = false
    const user = null

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Mountain className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">TrekMate</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Destinations
                        </Link>
                        <Link href="/accommodations" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Accommodations
                        </Link>
                        {/* <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link> */}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>Account</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/bookings">My Bookings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/auth/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/destinations"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Destinations
                            </Link>
                            <Link
                                href="/accommodations"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Accommodations
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="pt-4 border-t">
                                {isLoggedIn ? (
                                    <div className="flex flex-col space-y-2">
                                        <Button asChild variant="ghost" className="justify-start">
                                            <Link href="/dashboard">Dashboard</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="justify-start">
                                            <Link href="/bookings">My Bookings</Link>
                                        </Button>
                                        <Button variant="ghost" className="justify-start">
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Button asChild variant="ghost" className="justify-start">
                                            <Link href="/auth/login">Login</Link>
                                        </Button>
                                        <Button asChild className="justify-start">
                                            <Link href="/auth/signup">Sign Up</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
