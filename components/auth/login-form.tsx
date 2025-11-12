"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { toast } from "react-toast"
import { useRouter } from "next/navigation";


export function LoginForm() {
    const navigate = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState<string | null>(null)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post("/login", { email, password });
            const token = response.data.token;
            const name = response.data.name;
            const id = response.data.id;
            const role = response.data.role;
            localStorage.setItem("token", token);
            localStorage.setItem("user", name);
            localStorage.setItem("id", id);
            localStorage.setItem("role", role);
            toast.success("Logged in successfully!");
            if (role === "admin") {
                navigate.push("/admin/");

            } else {
                navigate.push("/user/");
            }
            // navigate.push("/admin");

        } catch (error) {
            console.error(error);
            setError("Invalid email or password.");
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access TrekMate</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
