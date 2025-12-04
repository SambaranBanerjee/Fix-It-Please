"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';

interface Query {
    _id: string;
    title: string;
    type: string[];
    solution: string;
    createdAt: string;
}

export default function ViewAQuery() {
    const router = useRouter();
    //We will not be using an array Query[] because we are fetching a single query 
    //while in /view-query out of queries we were mapping through query 
    //and then using the title, solution etc.
    //Here if we try to do query.title with Query[] it will throw an error
    const [query, setQuery] = useState<Query | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const id = params?.id as string;

    useEffect(() => {
        const getQuery = async () => {
            if(!id) {
                setIsLoading(false);
                return;
            }
            console.log("Fetching query with ID:", id);
            try {
                const response = await fetch(`/api/entry/${id}`  , {
                    method: 'GET'
                });

                if(!response.ok) {
                    throw new Error('Failed to fetch query');
                }

                const data = await response.json();
                setQuery(data.entry);
            } catch (error) {
                console.error("Error fetching query:", error);
                setError("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        getQuery();
    }, [id]);

    if (isLoading) return <div className="min-h-screen bg-[#1e2729] flex items-center justify-center text-[#F7BD03]">Loading details...</div>;
    
    if (error) return (
        <div className="min-h-screen bg-[#1e2729] flex flex-col items-center justify-center text-white gap-4">
            <p className="text-red-400">{error}</p>
            <button onClick={() => router.push('/pages/view-queries')} className="text-[#F7BD03] underline">Go Back</button>
        </div>
    );

    if (!query) return null;

    return (
        <div className="min-h-screen w-full bg-[#1e2729] p-4 md:p-10 flex justify-center">
            
            <div className="w-full max-w-4xl space-y-6">
                
                {/* Header / Back Button */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/pages/view-queries')}
                        className="p-2 rounded-full bg-[#000000] border border-gray-700 text-[#F7BD03] hover:bg-[#F7BD03] hover:text-black transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h2 className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
                        Query Details
                    </h2>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#000000] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                    
                    {/* Title Section */}
                    <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-[#000000] to-[#0a0a0a]">
                        <div className="flex flex-wrap gap-3 mb-4">
                            {query.type.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7BD03] text-[#1e2729] shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#F7BD03] leading-tight">
                            {query.title}
                        </h1>
                        <p className="text-gray-500 text-sm mt-4">
                            Logged on {new Date(query.createdAt).toLocaleDateString()} at {new Date(query.createdAt).toLocaleTimeString()}
                        </p>
                    </div>

                    {/* Solution Section */}
                    <div className="p-8 space-y-4">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider border-l-4 border-[#F7BD03] pl-3">
                            Solution / Implementation
                        </h3>
                        
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F7BD03] to-[#1e2729] rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-200"></div>
                            <div className="relative bg-[#1e2729] rounded-lg border border-gray-700 p-6 overflow-x-auto">
                                <pre className="font-mono text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                                    {query.solution}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-[#0a0a0a] p-6 border-t border-gray-800 flex justify-end">
                        <button 
                            className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(query.solution);
                                alert("Solution copied to clipboard!");
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            Copy Solution
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}