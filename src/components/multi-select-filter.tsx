import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, X, Search } from "lucide-react"
import type { FilterOption } from "../types/dashboard"

// Props for the MultiSelectFilter component
interface MultiSelectFilterProps {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

// MultiSelectFilter: A dropdown with multi-select, search, and infinite scroll
export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
}) => {
  // Dropdown open/close state
  const [isOpen, setIsOpen] = useState(false)
  // Search input value
  const [searchTerm, setSearchTerm] = useState("")
  // Number of visible options (for infinite scroll)
  const [visibleCount, setVisibleCount] = useState(100) // Start with 100 items

  // Refs for dropdown, search input, and scroll container
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const ITEMS_PER_LOAD = 100 // Number of items to load per scroll

  // Effect: Close dropdown when clicking outside, reset search and visible count
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchTerm("")
        setIsOpen(false)
        // Reset visible count when closing
        setVisibleCount(100)
      }
    }

    // Auto-focus search input when dropdown opens
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Effect: Reset visible count when search term changes
  useEffect(() => {
    setVisibleCount(100)
  }, [searchTerm])

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get the visible options based on current visible count
  const visibleOptions = filteredOptions.slice(0, visibleCount)
  const hasMoreOptions = visibleCount < filteredOptions.length

  // Handle infinite scroll: load more items when near bottom
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

      // Check if user has scrolled to near the bottom (within 50px)
      if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreOptions) {
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, filteredOptions.length))
      }
    },
    [hasMoreOptions, filteredOptions.length],
  )

  // Toggle selection of an option
  const handleToggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onChange(newValues)

    // Clear search term after selection to show all other values
    setSearchTerm("")
  }

  // Remove a selected value (from the tag)
  const handleRemoveValue = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value))
  }

  // Get the selected option objects for display
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {/* Dropdown trigger */}
      <div
        className="min-h-[40px] w-full border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Selected tags or placeholder */}
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {option.label}
                {/* Remove button for each tag */}
                <button
                  type="button"
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveValue(option.value)
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        {/* Dropdown arrow */}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()

                    // If search matches an option, select it
                    const match = filteredOptions.find(
                      (option) => option.label.toLowerCase() === searchTerm.toLowerCase(),
                    )

                    if (match && !selectedValues.includes(match.value)) {
                      onChange([...selectedValues, match.value])
                      setSearchTerm("") // Clear search after selection
                    }
                  }
                }}
              />
            </div>
          </div>
          {/* Options list with infinite scroll */}
          <div ref={scrollContainerRef} className="max-h-48 overflow-y-auto" onScroll={handleScroll}>
            {visibleOptions.length > 0 ? (
              <>
                {visibleOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleToggleOption(option.value)}
                  >
                    {/* Checkbox for selection */}
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
                {/* Infinite scroll info */}
                {hasMoreOptions && (
                  <div className="px-3 py-2 text-center text-xs text-gray-500 border-t">
                    Showing {visibleOptions.length} of {filteredOptions.length} options
                    <br />
                    <span className="text-gray-400">Scroll down to load more...</span>
                  </div>
                )}
              </>
            ) : (
              // No options found message
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}