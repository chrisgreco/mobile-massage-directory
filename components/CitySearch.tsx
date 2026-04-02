"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { cities } from "@/data/cities";

export default function CitySearch({ size = "lg" }: { size?: "lg" | "sm" }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.length >= 2
    ? cities
        .filter(
          (c) =>
            c.city.toLowerCase().includes(query.toLowerCase()) ||
            c.state.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isLarge = size === "lg";

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-cream/40 ${
            isLarge ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your city or zip code..."
          className={`w-full rounded-xl border border-cream/20 bg-spa-800 shadow-sm transition-all placeholder:text-cream/40 text-cream focus:border-sage focus:shadow-md focus:outline-none focus:ring-2 focus:ring-sage/20 ${
            isLarge
              ? "py-4 pl-12 pr-4 text-base"
              : "py-3 pl-10 pr-4 text-sm"
          }`}
          aria-label="Search for your city"
          aria-expanded={isOpen && filtered.length > 0}
          role="combobox"
          aria-autocomplete="list"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-cream/10 bg-spa-800 shadow-lg"
          role="listbox"
        >
          {filtered.map((city, i) => (
            <li
              key={city.slug}
              role="option"
              aria-selected={i === selectedIndex}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors ${
                i === selectedIndex
                  ? "bg-sage/10 text-sage"
                  : "text-cream/70 hover:bg-cream/5"
              }`}
              onMouseDown={() => handleSelect(city.slug)}
            >
              <MapPin className="h-4 w-4 shrink-0 text-cream/40" />
              <span>
                <span className="font-medium">{city.city}</span>,{" "}
                {city.state}
              </span>
              <span className="ml-auto text-xs text-cream/30 capitalize">
                {city.tier}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
