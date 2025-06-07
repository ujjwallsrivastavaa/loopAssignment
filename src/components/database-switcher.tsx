import React from "react"

import { Database, ChevronDown } from "lucide-react"
import type { DatabaseType, DatabaseConfig } from "../types/dashboard"

// Props for the DatabaseSwitcher component
interface DatabaseSwitcherProps {
  currentDatabase: DatabaseType // Currently selected database type
  databaseConfigs: DatabaseConfig[] // List of available database configs
  onSwitch: (database: DatabaseType) => void // Callback when switching databases
  isLoading: boolean // Loading state for async operations
}

// DatabaseSwitcher component allows user to select a database from a dropdown
export const DatabaseSwitcher: React.FC<DatabaseSwitcherProps> = ({
  currentDatabase,
  databaseConfigs,
  onSwitch,
  isLoading,
}) => {
  // State to control dropdown open/close
  const [isOpen, setIsOpen] = React.useState(false)
  // Find the config for the currently selected database
  const currentConfig = databaseConfigs.find((db) => db.type === currentDatabase)

  return (
    <div className="relative">
      {/* Button to open/close the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Database icon */}
        <Database className="w-4 h-4 mr-2" />
        {/* Show loading or current database label */}
        {isLoading ? "Loading..." : currentConfig?.label || "Select Database"}
        {/* Chevron icon, rotates when open */}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown menu, shown when open and not loading */}
      {isOpen && !isLoading && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50" data-testid="dropdown">
          <div className="py-1">
            {/* List all database configs as options */}
            {databaseConfigs.map((config) => (
              <button
                key={config.type}
                onClick={() => {
                  onSwitch(config.type) // Switch database on click
                  setIsOpen(false) // Close dropdown
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                  currentDatabase === config.type ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                {/* Database icon */}
                <Database className="w-4 h-4 mr-2" />
                {/* Database label */}
                {config.label}
                {/* Checkmark for selected database */}
                {currentDatabase === config.type && <span className="ml-auto text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-40" data-testid="overlay" onClick={() => setIsOpen(false)} />}
    </div>
  )
}