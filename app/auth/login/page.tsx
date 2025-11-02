import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">TrekMate</h1>
                    <p className="text-gray-600 mt-2">Your trusted trekking companion</p>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}
