"use client"
import React, { useState, useRef, useEffect } from 'react'

export default function AddEntryPage() {
  const [options, setOptions] = useState([
    'TypeScript', 
    'JavaScript', 
    'Python', 
    'React', 
    'Next.js', 
    'Syntax Error', 
    'Runtime Error', 
    'API Error',
    'Styling Issue'
  ]);

  const [formData, setFormData] = useState({
    title: '',
    type: [] as string[], 
    solution: ''
  })

  // Dropdown specific state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsAddingCustom(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const toggleSelection = (value: string) => {
    setFormData(prev => {
        if (prev.type.includes(value)) {
            return { ...prev, type: prev.type.filter(t => t !== value) };
        } else {
            return { ...prev, type: [...prev.type, value] };
        }
    });
  }

  // Handle adding a custom "Other" value
  const handleAddCustom = () => {
    if (customValue.trim() !== "") {
        const newValue = customValue.trim();
        setOptions(prev => [...prev, newValue]);
        toggleSelection(newValue);
        setCustomValue("");
        setIsAddingCustom(false);
        setSearchTerm(""); 
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Entry:", formData);
    try {
        const response = await fetch('/api/addEntry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Entry submitted successfully", data);

            setFormData({
                title: '',
                type: [],
                solution: ''
            })
        }
    }
    catch (error) {
        console.error("Error submitting entry:", error);
    }
  }

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
    className="min-h-screen w-full flex items-center justify-center bg-[#1e2729] p-4"
    style={{backgroundImage: "url('/opoy7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
        <form 
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[#000000] rounded-xl shadow-2xl border border-gray-800 p-8 md:p-10 space-y-8"
        >
            <header className="border-b border-gray-800 pb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#F7BD03] tracking-wide">
                    New Problem Found?
                </h1>
                <p className="text-gray-400 mt-2 text-sm font-light">
                    Document the issue and the fix for future reference.
                </p>
            </header>

            <div className="space-y-6">
                
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-[#F7BD03] uppercase tracking-wider">
                        Problem Title
                    </label>
                    <input 
                        type="text" 
                        id="title" 
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., TypeError in API Response" 
                        className="w-full p-4 rounded-lg bg-[#1e2729] border border-gray-700 text-white placeholder-gray-500
                                 focus:outline-none focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]
                                 transition-all duration-200"
                    />
                </div>

                {/* --- CUSTOM DROPDOWN SECTION --- */}
                <div className="space-y-3 relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-[#F7BD03] uppercase tracking-wider">
                        Language / Type (Select all that apply)
                    </label>
                    
                    {/* Trigger Box (Displays selected items) */}
                    <div 
                        onClick={() => !isAddingCustom && setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full p-4 rounded-lg bg-[#1e2729] border border-gray-700 min-h-[60px] cursor-pointer flex flex-wrap gap-2 items-center
                                   ${isDropdownOpen ? 'ring-1 ring-[#F7BD03] border-[#F7BD03]' : ''}`}
                    >
                        {formData.type.length === 0 ? (
                            <span className="text-gray-500">Select languages or bug types...</span>
                        ) : (
                            formData.type.map(item => (
                                <span key={item} className="bg-[#F7BD03] text-[#1e2729] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    {item}
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); toggleSelection(item); }}
                                        className="hover:text-white"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))
                        )}
                        {/* Chevron Icon */}
                        <div className="ml-auto text-[#F7BD03]">
                            <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-[#0d1112] border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            
                            {!isAddingCustom ? (
                                <>
                                    {/* Search Box */}
                                    <div className="p-3 border-b border-gray-800 sticky top-0 bg-[#0d1112]">
                                        <input 
                                            type="text"
                                            placeholder="Search types..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full p-2 bg-[#1e2729] rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#F7BD03] text-sm"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Options List */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredOptions.length > 0 ? (
                                            filteredOptions.map(opt => (
                                                <div 
                                                    key={opt} 
                                                    onClick={() => toggleSelection(opt)}
                                                    className="flex items-center gap-3 p-3 hover:bg-[#1e2729] cursor-pointer transition-colors"
                                                >
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                                        ${formData.type.includes(opt) ? 'bg-[#F7BD03] border-[#F7BD03]' : 'border-gray-500'}`}
                                                    >
                                                        {formData.type.includes(opt) && (
                                                            <svg className="w-3 h-3 text-[#1e2729]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-200">{opt}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">No matches found</div>
                                        )}
                                    </div>

                                    {/* 'Other' Option */}
                                    <div 
                                        onClick={() => setIsAddingCustom(true)}
                                        className="p-3 border-t border-gray-800 text-[#F7BD03] hover:bg-[#1e2729] cursor-pointer flex items-center gap-2 font-medium"
                                    >
                                        <span>+ Other (Add New)</span>
                                    </div>
                                </>
                            ) : (
                                /* Custom Input Mode */
                                <div className="p-4 space-y-4 bg-[#0d1112]">
                                    <label className="block text-sm font-medium text-gray-300">Enter new bug type:</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={customValue}
                                            onChange={(e) => setCustomValue(e.target.value)}
                                            placeholder="e.g. Memory Leak"
                                            className="flex-1 p-2 bg-[#1e2729] rounded border border-gray-700 text-white focus:outline-none focus:border-[#F7BD03]"
                                            autoFocus
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleAddCustom}
                                            className="bg-[#F7BD03] text-[#1e2729] px-4 py-2 rounded font-bold hover:bg-white transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddingCustom(false)}
                                        className="text-xs text-gray-500 hover:text-gray-300 underline"
                                    >
                                        &larr; Back to list
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="solution" className="block text-sm font-medium text-[#F7BD03] uppercase tracking-wider">
                        Solution
                    </label>
                    <textarea 
                        id="solution" 
                        value={formData.solution}
                        onChange={handleChange}
                        placeholder="Paste your code snippet or explanation here..." 
                        rows={6}
                        className="w-full p-4 rounded-lg bg-[#1e2729] border border-gray-700 text-white placeholder-gray-500
                                 focus:outline-none focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]
                                 transition-all duration-200 resize-y font-mono text-sm"
                    ></textarea>
                </div>

            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
                <button 
                    type="button"
                    className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type='submit' 
                    className="bg-[#F7BD03] text-[#1e2729] font-bold py-3 px-8 rounded-lg shadow-lg
                             hover:bg-[#ffffff] hover:text-[#1e2729] 
                             hover:shadow-[0_0_15px_rgba(247,189,3,0.3)] transition-all duration-300 ease-in-out transform 
                             hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-900"
                >
                    Save Entry
                </button>
            </div>

        </form>
    </div>
  )
}