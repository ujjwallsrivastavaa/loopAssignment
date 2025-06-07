import type React from "react"
import { FilterPanel } from "./filter-panel"
import { DataTable } from "./data-table"
import { useDashboardContext } from "../context/dashboard-context"
import { DatabaseSwitcher } from "./database-switcher"

// Main Dashboard component
export const Dashboard: React.FC = () => {
  // Extracting state and actions from custom dashboard context
  const {
    filteredData,         // Data after applying filters
    filters,              // Current filter values
    columns,              // Table columns
    filterableColumns,    // Columns that can be filtered
    availableOptions,     // Options for each filterable column
    updateFilter,         // Function to update a filter
    clearAllFilters,      // Function to clear all filters
    isLoading,            // Loading state for async operations
    currentDatabase,      // Currently selected database
    switchDatabase,       // Function to switch databases
    databaseConfigs,      // List of available database configs
  } = useDashboardContext()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section with title and database switcher */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Dynamic filtering system with real-time data analysis
                {/* Show number of columns if available */}
                {columns.length > 0 && (
                  <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">{columns.length} columns detected</span>
                )}
              </p>
            </div>
            {/* Database switcher dropdown */}
            <DatabaseSwitcher
              currentDatabase={currentDatabase}
              databaseConfigs={databaseConfigs}
              onSwitch={switchDatabase}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Filter panel for dynamic filtering */}
        <FilterPanel
          filters={filters}
          filterableColumns={filterableColumns}
          availableOptions={availableOptions}
          onFilterChange={updateFilter}
          onClearAll={clearAllFilters}
          currentDatabase={currentDatabase}
          databaseConfigs={databaseConfigs}
        />

        {/* Data table displaying filtered data */}
        <DataTable data={filteredData} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
