"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

interface Query {
    _id: string;
    title: string;
    type: string[];
    solution: string;
    createdAt: string;
}

export default function ViewQueriesPage() {
    const router = useRouter();
    const [queries, setQueries] = useState<Query[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getQueries = async () => {
            try {
                const response = await fetch('/api/entry',{
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch queries');
                }

                const data = await response.json();
                setQueries(data.entries); 
            } catch (error) {
                console.error("Error fetching queries:", error);
                setError("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getQueries();
    }, []);

    const handleQueryClick = (id: string) => {
        router.push(`/view-queries/${id}`);
    }

    return (
        <div className="min-h-screen bg-[#1e2729] p-8 text-white">
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-700 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold font-serif text-[#F7BD03]">
                        Problem Database
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        View and manage all documented solutions.
                    </p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="Search queries..." 
                        className="w-full p-3 pl-10 rounded-lg bg-[#000000] border border-gray-700 text-white focus:outline-none focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </header>

            <div className="bg-[#000000] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
                {isLoading ? (
                    <div className="p-8 text-center text-[#F7BD03]">Loading queries...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1e2729] text-[#F7BD03] text-sm uppercase tracking-wider border-b border-gray-700">
                                    <th className="p-4 font-bold">Query</th>
                                    <th className="p-4 font-bold">Tags</th>
                                    <th className="p-4 font-bold">Solution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {queries.length > 0 ? (
                                    queries.map((query) => (
                                        <tr 
                                            key={query._id}
                                            onClick={() => handleQueryClick(query._id)} 
                                            className="hover:bg-[#1e2729]/50 transition-colors">
                                            <td className="p-4 align-top font-medium text-white max-w-xs">
                                                {query.title}
                                            </td>

                                            <td className="p-4 align-top">
                                                <div className="flex flex-wrap gap-2">
                                                    {query.type.map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 rounded text-xs font-bold bg-[#F7BD03]/20 text-[#F7BD03] border border-[#F7BD03]/30">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-4 align-top text-gray-400 font-mono text-sm">
                                                <div className="truncate max-w-md">
                                                    {query.solution}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-500">
                                            No entries found. Go add some!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}