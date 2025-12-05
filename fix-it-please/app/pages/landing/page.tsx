"use client"
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Custom Hook for Debouncing (System Design Best Practice)
// Prevents API flooding while the user types
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

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Effect: Triggers API call only when debouncedQuery changes
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
  }, [debouncedQuery]);

  // Handle clicking outside to close dropdown
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

  return (
    <div className="min-h-screen bg-[#1e2729] flex flex-col text-white vertical-scroll">
      
      {/* Header Section */}
      <header className="w-full p-6 flex justify-end items-center gap-5 border-b border-gray-800 bg-[#000000]/30 backdrop-blur-sm sticky top-0 z-50">
        <div>
            <Link href='/pages/add-entry' className="bg-[#F7BD03] text-[#1e2729] font-bold py-2 px-6 rounded-lg shadow-md
                        hover:bg-[#ffffff] hover:text-[#1e2729] 
                        hover:shadow-[0_0_15px_rgba(247,189,3,0.4)] transition-all duration-300 ease-in-out transform 
                        hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-200
                        text-lg font-medium"      
            >
                Add new entry
            </Link>
        </div>
        <div>
            <Link href='/pages/view-queries' className="bg-[#F7BD03] text-[#1e2729] font-bold py-2 px-6 rounded-lg shadow-md
                        hover:bg-[#ffffff] hover:text-[#1e2729] 
                        hover:shadow-[0_0_15px_rgba(247,189,3,0.4)] transition-all duration-300 ease-in-out transform 
                        hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-200
                        text-lg font-medium"      
            >
                View All Entries
            </Link>
        </div>
      </header>

      {/* Main Content Section */}
      <main 
      className="flex-grow flex flex-col items-center justify-center px-4 gap-10 -mt-20 relative"
      >
        
        <div 
            className="absolute inset-0 z-0 opacity-40"
            style={{backgroundImage: "url('/opoy7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}
        />
        
        <div className="text-center space-y-4 z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-[#F7BD03] drop-shadow-lg tracking-tight">
                Welcome to Fix It Please
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
                Search for existing solutions or add a new repair entry below.
            </p>
        </div>

        {/* Search Container with Dropdown */}
        <div className="w-full max-w-3xl relative group z-20" ref={wrapperRef}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F7BD03] to-[#b38802] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <form onSubmit={handleSearch}>
                  <input 
                      type='text' 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true) }}
                      placeholder='Enter your query here...'
                      autoComplete='off'
                      spellCheck="false" 
                      className="relative w-full p-5 pl-8 rounded-xl bg-[#000000] border-2 border-[#333] text-white text-xl placeholder-gray-500
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
      </main>
    </div>
  )
}