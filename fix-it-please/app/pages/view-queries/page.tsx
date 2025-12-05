"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';

interface Query {
    _id: string;
    title: string;
    type: string[];
    solution: string;
    createdAt: string;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

interface Suggestion {
    id: string;
    title: string;
}

export default function ViewQueriesPage() {
    const router = useRouter();
    const [queries, setQueries] = useState<Query[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] =useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                setSuggestions(data.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Autocomplete failed", error);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if(query.trim()) {
            router.push(`/pages/view-queries?q=${encodeURIComponent(query)}`);
        }
    }

    const handleSuggestionClick = (id: string) => {
        router.push(`/pages/view-queries/${id}`);
    }

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
        router.push(`/pages/view-queries/${id}`);
    }

    return (
        <div className="min-h-screen bg-[#1e2729] p-8 text-white">
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-700 pb-6">
                <button 
                        onClick={() => router.push('/pages/landing')}
                        className="p-2 rounded-full bg-[#000000] border border-gray-700 text-[#F7BD03] hover:bg-[#F7BD03] hover:text-black transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold font-serif text-[#F7BD03]">
                        Problem Database
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        View and manage all documented solutions.
                    </p>
                </div>
                
                <div className="w-full max-w-3xl relative group z-20" ref={wrapperRef}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#F7BD03] to-[#b38802] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <form onSubmit={handleSearch}>
                            <input 
                                type='text' 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true) }}
                                placeholder='Search for entries...'
                                autoComplete='off'
                                spellCheck="false" 
                                className="relative w-full p-2 pl-8 rounded-xl bg-[#000000] border-2 border-[#333] text-white text-xl placeholder-gray-500
                                        focus:outline-none focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]
                                        transition-all duration-300 shadow-2xl"
                            />
                        </form>

                        <svg 
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500 cursor-pointer hover:text-[#F7BD03]" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            onClick={() => handleSearch()}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>

                        {/* AUTOCOMPLETE DROPDOWN */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1112] border border-gray-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                {suggestions.map((suggestion) => (
                                    <div 
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionClick(suggestion.id)}
                                        className="p-4 border-b border-gray-800 hover:bg-[#1e2729] cursor-pointer flex items-center justify-between group/item"
                                    >
                                        <span className="text-gray-200 font-medium group-hover/item:text-[#F7BD03] transition-colors">
                                            {/* Highlight matching part logic could go here */}
                                            {suggestion.title}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-600 group-hover/item:text-[#F7BD03]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                ))}
                                <div 
                                    onClick={() => handleSearch()}
                                    className="p-3 bg-[#1e2729] text-center text-sm text-[#F7BD03] cursor-pointer hover:underline font-bold"
                                >
                                    View all results for &quot;{query}&quot;
                                </div>
                            </div>
                        )}
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