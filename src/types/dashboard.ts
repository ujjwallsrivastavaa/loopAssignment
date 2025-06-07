// Represents a single row of data, where each key is a column name and value is a string.
export interface DataRow {
  [key: string]: string
}

// Represents an option for filtering, with a value and a display label.
export interface FilterOption {
  value: string
  label: string
}

// Represents the current state of filters, mapping each filter key to an array of selected values.
export interface FilterState {
  [key: string]: string[]
}

// Configuration for a single column in the dashboard.
export interface ColumnConfig {
  key: string         // Unique identifier for the column (e.g., column name)
  label: string       // Display label for the column
  type: "number" | "text" // Data type of the column
}

// Enum for the type of database being used.
export type DatabaseType = "large" | "small"

// Configuration for a database, including its type, URL, and display label.
export interface DatabaseConfig {
  type: DatabaseType
  url: string
  label: string
}

// The shape of the dashboard context, used for state management in the dashboard.
export interface DashboardContextType {
  data: DataRow[]                                   // All data rows loaded from the database
  filteredData: DataRow[]                           // Data rows after applying filters
  filters: FilterState                              // Current filter selections
  columns: ColumnConfig[]                           // All columns in the dashboard
  filterableColumns: ColumnConfig[]                 // Columns that can be filtered
  availableOptions: Record<string, FilterOption[]>  // Available filter options for each column
  updateFilter: (filterKey: string, values: string[]) => void // Function to update a filter
  clearAllFilters: () => void                       // Function to clear all filters
  isLoading: boolean                                // Indicates if data is currently loading
  currentDatabase: DatabaseType                     // Currently selected database type
  switchDatabase: (database: DatabaseType) => void  // Function to switch databases
  databaseConfigs: DatabaseConfig[]                 // List of available database configurations
}