import { useState, useEffect, useMemo } from "react"
import type { DataRow, FilterState, ColumnConfig, DatabaseType, DatabaseConfig } from "../types/dashboard"

// Custom hook to manage dashboard data, columns, filters, and database switching
export const useDashboardData = () => {
  // State for raw data rows
  const [data, setData] = useState<DataRow[]>([])
  // State for column configurations (key, label, type)
  const [columns, setColumns] = useState<ColumnConfig[]>([])
  // Loading state for async data fetching
  const [isLoading, setIsLoading] = useState(true)
  // State for current filter selections per column
  const [filters, setFilters] = useState<FilterState>({})
  // State for currently selected database
  const [currentDatabase, setCurrentDatabase] = useState<DatabaseType>("large")

  // Available database configurations (type, url, label)
  const databaseConfigs: DatabaseConfig[] = [
    {
      type: "large",
      url: "/dataset_large.csv",
      label: "Large Dataset",
    },
    {
      type: "small",
      url: "/dataset_small.csv",
      label: "Small Dataset",
    },
  ]

  // Detect if a column contains mostly numeric data
  const detectColumnType = (values: string[]): "number" | "text" => {
    const sampleSize = Math.min(100, values.length)
    const numericCount = values
      .slice(0, sampleSize)
      .filter((value) => !isNaN(Number(value)) && value.trim() !== "").length

    return numericCount / sampleSize > 0.8 ? "number" : "text"
  }

  // Convert column key to a more readable label
  const formatColumnLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .replace(/\b\w/g, (str) => str.toUpperCase()) // Capitalize each word
      .trim()
  }

  // Fetch and parse CSV data for the selected database
  const fetchData = async (databaseType: DatabaseType = currentDatabase) => {
    try {
      setIsLoading(true)
      const config = databaseConfigs.find((db) => db.type === databaseType)
      if (!config) {
        throw new Error(`Database configuration not found for type: ${databaseType}`)
      }

      const response = await fetch(config.url)
      const csvText = await response.text()

      // Split CSV into lines and extract headers
      const lines = csvText.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      // Parse each row into a DataRow object
      const parsedData: DataRow[] = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const row: DataRow = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        return row
      })

      // Detect column types and create column configs
      const columnConfigs: ColumnConfig[] = headers.map((header) => {
        const columnValues = parsedData.map((row) => row[header]).filter(Boolean)
        return {
          key: header,
          label: formatColumnLabel(header),
          type: detectColumnType(columnValues),
        }
      })

      setData(parsedData)
      setColumns(columnConfigs)

      // Initialize filters for all columns except the first one (assumed ID)
      const initialFilters: FilterState = {}
      columnConfigs.slice(1).forEach((col) => {
        initialFilters[col.key] = []
      })
      setFilters(initialFilters)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when the current database changes
  useEffect(() => {
    fetchData(currentDatabase)
  }, [currentDatabase])

  // Memoized list of filterable columns (excluding the first column)
  const filterableColumns = useMemo(() => {
    return columns.slice(1)
  }, [columns])

  // Memoized filtered data based on current filter selections
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([columnKey, selectedValues]) => {
        return selectedValues.length === 0 || selectedValues.includes(row[columnKey])
      })
    })
  }, [data, filters])

  // Memoized available filter options for each column, based on current selections
  const availableOptions = useMemo(() => {
    const options: Record<string, { value: string; label: string }[]> = {}

    filterableColumns.forEach((column) => {
      // Create temporary filters excluding the current column
      const tempFilters = { ...filters }
      tempFilters[column.key] = []

      // Filter data based on all other filters
      const tempFilteredData = data.filter((row) => {
        return Object.entries(tempFilters).every(([columnKey, selectedValues]) => {
          return selectedValues.length === 0 || selectedValues.includes(row[columnKey])
        })
      })

      // Get unique values for this column, sorted appropriately
      const uniqueValues = Array.from(new Set(tempFilteredData.map((row) => row[column.key])))
        .filter((value) => value !== undefined && value !== "")
        .sort((a, b) => {
          if (column.type === "number") {
            return Number(a) - Number(b)
          }
          return a.localeCompare(b)
        })

      options[column.key] = uniqueValues.map((value) => ({ value, label: value }))
    })

    return options
  }, [data, filters, filterableColumns])

  // Update filter values for a specific column
  const updateFilter = (filterKey: string, values: string[]) => {
  setFilters((prev) => {
    // Step 1: Apply the new filter selection
    const updatedFilters = { ...prev, [filterKey]: values }

    // Step 2: Build new filters by validating all selected values
    const validatedFilters: FilterState = {}

    filterableColumns.forEach((column) => {
      const columnKey = column.key

      if (columnKey === filterKey) {
        validatedFilters[columnKey] = values
        return
      }

      const tempFilters = { ...updatedFilters }
      tempFilters[columnKey] = []

      // Get filtered data excluding the current column
      const tempFilteredData = data.filter((row) => {
        return Object.entries(tempFilters).every(([key, selectedValues]) => {
          return selectedValues.length === 0 || selectedValues.includes(row[key])
        })
      })

      // Find valid options for this column based on current filtered data
      const validOptions = new Set(
        tempFilteredData.map((row) => row[columnKey])
      )

      // Retain only those already-selected values which are still valid
      validatedFilters[columnKey] = (updatedFilters[columnKey] || []).filter((val) =>
        validOptions.has(val)
      )
    })

    return validatedFilters
  })
}


  // Clear all filters (reset to empty arrays)
  const clearAllFilters = () => {
    const clearedFilters: FilterState = {}
    filterableColumns.forEach((col) => {
      clearedFilters[col.key] = []
    })
    setFilters(clearedFilters)
  }

  // Switch to a different database and reset state
  const switchDatabase = (database: DatabaseType) => {
    setCurrentDatabase(database)
    // Clear existing filters and data when switching databases
    setFilters({})
    setData([])
    setColumns([])
    // Fetch new data for the selected database
    fetchData(database)
  }

  // Expose state and actions for use in dashboard components
  return {
    data,
    filteredData,
    filters,
    columns,
    filterableColumns,
    availableOptions,
    updateFilter,
    clearAllFilters,
    isLoading,
    currentDatabase,
    switchDatabase,
    databaseConfigs,
  }
}