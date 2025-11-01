"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
    id: number
    name: string
    role: "user" | "partner" | "admin"
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // ✅ Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(storedUser)
        }
        setLoading(false)
    }, [])

    // ✅ Redirect user based on their role after login
    useEffect(() => {
        if (!loading && user) {
            if (pathname.startsWith("/auth")) {
                if (user.role === "admin") {
                    router.push("/admin")
                } else {
                    router.push("/dashboard")
                }
            }
        }
    }, [user, loading, pathname, router])

    // ✅ Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok && data.token) {
                // Build user object from backend response
                const userData: User = {
                    id: data.userId,
                    name: data.name,
                    role: data.role,
                }

                // Store data in localStorage
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(userData))

                // Update state
                setToken(data.token)
                setUser(userData)
            } else {
                throw new Error(data.message || "Login failed")
            }
        } catch (error: any) {
            console.error("Login error:", error.message)
            throw error
        }
    }

    // ✅ Logout function
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
