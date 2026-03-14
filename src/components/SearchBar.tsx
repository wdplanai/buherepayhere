"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { states } from "@/data/states";
import { cities } from "@/data/cities";

interface SearchResult {
  type: "state" | "city";
  label: string;
  href: string;
}

interface SearchBarProps {
  large?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  large = false,
  placeholder = "Search by city or state...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerValue = value.toLowerCase();
    const matches: SearchResult[] = [];

    // Search states
    states.forEach((state) => {
      if (
        state.name.toLowerCase().includes(lowerValue) ||
        state.abbreviation.toLowerCase() === lowerValue
      ) {
        matches.push({
          type: "state",
          label: state.name,
          href: `/dealers/${state.slug}/`,
        });
      }
    });

    // Search cities
    cities.forEach((city) => {
      if (city.name.toLowerCase().includes(lowerValue)) {
        matches.push({
          type: "city",
          label: `${city.name}, ${city.stateAbbreviation}`,
          href: `/dealers/${city.stateSlug}/${city.slug}/`,
        });
      }
    });

    setResults(matches.slice(0, 8));
    setIsOpen(matches.length > 0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(results[selectedIndex].href);
        setIsOpen(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleSelect(result: SearchResult) {
    router.push(result.href);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={`relative ${large ? "max-w-2xl mx-auto" : ""}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`${large ? "w-5 h-5" : "w-4 h-4"} text-gray-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full ${
            large
              ? "pl-12 pr-4 py-4 text-lg rounded-xl"
              : "pl-10 pr-4 py-2.5 text-sm rounded-lg"
          } border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm`}
          aria-label="Search for a city or state"
          autoComplete="off"
        />
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className={`absolute z-50 w-full ${large ? "max-w-2xl left-1/2 -translate-x-1/2" : ""} mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden`}>
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.href}`}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex-shrink-0">
                {result.type === "state" ? (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">{result.label}</span>
              <span className="text-xs text-gray-400 ml-auto capitalize">{result.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
