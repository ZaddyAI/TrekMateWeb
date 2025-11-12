"use client"
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { Loader, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const fullParam = params.token as string;

                if (!fullParam) {
                    setError('Invalid verification link');
                    setLoading(false);
                    return;
                }

                // Extract the actual JWT token
                let token = fullParam;
                console.log('Full token param:', fullParam);

                // Decode URL encoding
                token = decodeURIComponent(token);
                if (token.startsWith("token=")) {
                    token = token.slice(6);
                }

                console.log('Token to send in header:', token);

                // Send request with Bearer token
                const response = await api.post('/verifyEmail', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.message) {
                    setSuccess(true);
                    setTimeout(() => router.push('/auth/login'), 3000);
                } else {
                    setError(response.data.message || 'Email verification failed');
                }
            } catch (error: any) {
                console.error('Verification error:', error);
                setError(error.response?.data?.error || 'Email verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [params.token, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
                    <p className="text-gray-600">Please wait while we verify your email address.</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your email has been verified successfully. Redirecting you to login page...
                    </p>
                    <div className="animate-pulse text-blue-600">
                        Redirecting in 3 seconds...
                    </div>
                </div>
            </div>
        )
    }

    return null
}
