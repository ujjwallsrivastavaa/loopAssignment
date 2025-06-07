import type React from "react"
import { RotateCcw } from "lucide-react"
import { MultiSelectFilter } from "./multi-select-filter"
import type { FilterState, FilterOption, ColumnConfig, DatabaseType, DatabaseConfig } from "../types/dashboard"

// Props for the FilterPanel component
interface FilterPanelProps {
  filters: FilterState // Current filter state (selected values for each filter)
  filterableColumns: ColumnConfig[] // Columns that can be filtered
  availableOptions: Record<string, FilterOption[]> // Available options for each filter
  onFilterChange: (filterKey: string, values: string[]) => void // Handler for filter changes
  onClearAll: () => void // Handler to clear all filters
  currentDatabase: DatabaseType // Currently selected database type
  databaseConfigs: DatabaseConfig[] // List of all database configs (for label lookup)
}

// FilterPanel component displays filter controls and active filters
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  filterableColumns,
  availableOptions,
  onFilterChange,
  onClearAll,
  currentDatabase,
  databaseConfigs,
}) => {
  // Check if any filters are currently active
  const hasActiveFilters = Object.values(filters).some((filter) => filter.length > 0)

  // Helper to determine grid columns based on number of filters
  const getGridCols = (count: number) => {
    if (count <= 2) return "grid-cols-1 md:grid-cols-2"
    if (count <= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    if (count <= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header: shows current database and clear all button if filters are active */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg text-gray-500 mt-1">
            <strong>Currently viewing: </strong>
            {/* Show label for current database */}
            {databaseConfigs.find((db) => db.type === currentDatabase)?.label}
          </p>
        </div>
        {/* Show "Clear All" button if any filters are active */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Render a grid of MultiSelectFilter components for each filterable column */}
      <div className={`grid ${getGridCols(filterableColumns.length)} gap-4`}>
        {filterableColumns.map((column) => (
          <MultiSelectFilter
            key={column.key}
            label={column.label}
            options={availableOptions[column.key] || []}
            selectedValues={filters[column.key] || []}
            onChange={(values) => onFilterChange(column.key, values)}
            placeholder={`Select ${column.label.toLowerCase()} values...`}
          />
        ))}
      </div>

      {/* If filters are active, show a summary of active filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {Object.entries(filters)
              .filter(([_, values]) => values.length > 0)
              .map(([key, values]) => {
                const column = filterableColumns.find((col) => col.key === key)
                return (
                  <span key={key} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800">
                    {column?.label}: {values.length} selected
                  </span>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}