"use client"
import React, {useState} from 'react'
import { useRouter } from 'next/navigation';

export default function RegistrationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success', text: string} | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const RegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
        //Registration logic
        e.preventDefault();
        setStatusMessage(null);

        try {
            const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(formData)
        });
            const data = await response.json();
            if (response.ok) {
                console.log("User Registered", data);
                setStatusMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
                
                // This Clears the form entries
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                setTimeout(() => {
                    router.push('/login');
                }, 1500);

            }  else if (response.status === 409) {
                console.warn("User conflict:", data.message);
            
                setStatusMessage({ type: 'error', text: 'User already exists! Redirecting to login...' });
                
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
             } else {
                console.error("Registration failed:", data.message);
                setStatusMessage({ type: 'error', text: data.message || "Registration failed" });
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setStatusMessage({ type: 'error', text: "An unexpected error occurred." });
        }
    }

    return (
        <form onSubmit={RegisterUser} className="p-4 max-w-md mx-auto border rounded shadow-md mt-10">
            <header className="mb-4">
                <h1 className="text-2xl font-bold">Register</h1>
            </header>
            
            <div className="mb-4">
                <label htmlFor='email' className="block mb-1 font-medium">Email: </label>
                <input
                    className="w-full p-2 border rounded"
                    type='email'
                    id='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor='password' className="block mb-1 font-medium">Password: </label>
                <input
                    className="w-full p-2 border rounded"
                    type='password'
                    id="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required />
            </div>
            <div className="mb-4">
                <label htmlFor='confirmPassword' className="block mb-1 font-medium">Confirm Password: </label>
                <input
                    className="w-full p-2 border rounded"
                    type='password'
                    id="confirmPassword"
                    placeholder='Confirm Password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required />
            </div>

            {statusMessage && (
                <div className={`p-3 mb-4 rounded ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {statusMessage.text}
                </div>
            )}

            <button 
                type='submit' 
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            >
                Submit
            </button>
        </form>
  )
}
