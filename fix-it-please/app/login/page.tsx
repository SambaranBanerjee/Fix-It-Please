"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success', text: string} | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const LoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatusMessage(null);
        setIsLoading(true);

        try {
            // Assuming your backend route is /api/login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login Successful", data);
                setStatusMessage({ type: 'success', text: 'Login successful! Redirecting...' });
                
                // Optional: Store the token if your backend sends one
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                setFormData({
                    email: '',
                    password: ''
                });

                setTimeout(() => {
                    // Navigate to your landing page or dashboard
                    router.push('/landing'); 
                }, 1000);

            } else {
                console.error("Login failed:", data.message);
                setStatusMessage({ type: 'error', text: data.message || "Invalid credentials" });
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setStatusMessage({ type: 'error', text: "An unexpected error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#1e2729] p-4">
            <form 
                onSubmit={LoginUser} 
                className="w-full max-w-md bg-[#000000] rounded-xl shadow-2xl overflow-hidden p-8 space-y-6"
            >
                <header className="text-center">
                    <h1 className="text-3xl font-extrabold font-serif text-[#F7BD03]">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-2">Please enter your details to sign in</p>
                </header>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor='email' className="block text-sm font-medium text-[#F7BD03] mb-1">
                            Email Address
                        </label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type='email'
                            id='email'
                            placeholder='name@example.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='password' className="block text-sm font-medium text-[#F7BD03] mb-1">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type='password'
                            id="password"
                            placeholder='••••••••'
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                {statusMessage && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${
                        statusMessage.type === 'error' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                        {statusMessage.text}
                    </div>
                )}

                <button 
                    type='submit' 
                    disabled={isLoading}
                    className="w-full bg-[#1e2729] hover:bg-yellow-700 text-[#F7BD03] hover:text-[#ffffff] font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <span 
                        onClick={() => router.push('/register')} 
                        className="text-[#F7BD03] hover:text-blue-500 font-semibold cursor-pointer hover:underline"
                    >
                        Sign Up
                    </span>
                </div>
            </form>
        </div>
    )
}