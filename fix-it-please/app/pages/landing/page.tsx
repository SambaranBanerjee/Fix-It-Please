import Link from 'next/link';
import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1e2729] flex flex-col text-white vertical-scroll">
      {/* Header Section */}
      <header className="w-full p-6 flex justify-end items-center border-b border-gray-800 bg-[#000000]/30 backdrop-blur-sm sticky top-0 z-50">
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
      </header>

      {/* Main Content Section */}
      <main 
      className="flex-grow flex flex-col items-center justify-center px-4 gap-10 -mt-20"
      style={{backgroundImage: "url('/opoy7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}
      >
        <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-[#F7BD03] drop-shadow-lg tracking-tight">
                Welcome to Fix It Please
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
                Search for existing solutions or add a new repair entry below.
            </p>
        </div>

        <div className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F7BD03] to-[#b38802] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <input 
                type='text' 
                placeholder='Enter your query here...'
                autoComplete='off'
                spellCheck="false" 
                className="relative w-full p-5 pl-8 rounded-xl bg-[#000000] border-2 border-[#333] text-white text-xl placeholder-gray-500
                         focus:outline-none focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]
                         transition-all duration-300 shadow-2xl"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
      </main>

      {/*<footer className="w-full p-6 text-center border-gray-800 bg-[#000000]/30 backdrop-blur-sm text-sm border-t">
        &copy; {new Date().getFullYear()} Fix It Please. All systems operational.
      </footer>*/}
    </div>
  )
}