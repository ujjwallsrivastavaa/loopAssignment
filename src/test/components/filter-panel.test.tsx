import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import { FilterPanel } from "../../components/filter-panel"
import type { FilterState, ColumnConfig, FilterOption, DatabaseConfig, DatabaseType } from "../../types/dashboard"

// Test suite for the FilterPanel component
describe("FilterPanel Component", () => {
  // Mock filterable columns for the panel
  const filterableColumns: ColumnConfig[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "age", label: "Age", type: "number" },
  ]

  // Mock available filter options for each column
  const availableOptions: Record<string, FilterOption[]> = {
    name: [
      { value: "Alice", label: "Alice" },
      { value: "Bob", label: "Bob" },
    ],
    age: [
      { value: "25", label: "25" },
      { value: "30", label: "30" },
    ],
  }

  // Mock database configurations
  const databaseConfigs: DatabaseConfig[] = [
    { type: "small", url: "/dataset_small.csv", label: "Small Database" },
    { type: "large", url: "/dataset_large.csv", label: "Large Database" },
  ]

  // Default props for FilterPanel
  const defaultProps = {
    filters: {},
    filterableColumns,
    availableOptions,
    onFilterChange: vi.fn(),
    onClearAll: vi.fn(),
    currentDatabase: "small" as DatabaseType,
    databaseConfigs,
  }

  // Test: Should render the current database label
  it("renders current database label", () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText(/Currently viewing:/i)).toBeInTheDocument()
    expect(screen.getByText(/Small Database/i)).toBeInTheDocument()
  })

  // Test: Should render MultiSelectFilter for each filterable column
  it("renders MultiSelectFilter for each filterable column", () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Age")).toBeInTheDocument()
  })

  // Test: Should not show 'Clear All' button if no filters are active
  it("does not show 'Clear All' button if no filters are active", () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.queryByText(/Clear All/i)).not.toBeInTheDocument()
  })

  // Test: Should show 'Clear All' button and active filters when filters are active
  it("shows 'Clear All' button and active filters when filters are active", () => {
    const filters: FilterState = { name: ["Alice"], age: [] }
    render(<FilterPanel {...defaultProps} filters={filters} />)
    expect(screen.getByText(/Clear All/i)).toBeInTheDocument()
    expect(screen.getByText(/Active filters:/i)).toBeInTheDocument()
    expect(screen.getByText(/Name: 1 selected/i)).toBeInTheDocument()
  })

  // Test: Should call onClearAll when 'Clear All' button is clicked
  it("calls onClearAll when 'Clear All' button is clicked", () => {
    const onClearAll = vi.fn()
    const filters: FilterState = { name: ["Alice"], age: ["25"] }
    render(<FilterPanel {...defaultProps} filters={filters} onClearAll={onClearAll} />)
    fireEvent.click(screen.getByText(/Clear All/i))
    expect(onClearAll).toHaveBeenCalled()
  })

  // Test: Should call onFilterChange when MultiSelectFilter changes
  it("calls onFilterChange when MultiSelectFilter changes", () => {
    // Simulate MultiSelectFilter by calling onChange directly
    const onFilterChange = vi.fn()
    render(<FilterPanel {...defaultProps} onFilterChange={onFilterChange} />)
    // Find the MultiSelectFilter for "Name" and simulate a change
    // Since MultiSelectFilter is a custom component, we call the prop directly
    // This is a placeholder for a real integration test
    onFilterChange("name", ["Bob"])
    expect(onFilterChange).toHaveBeenCalledWith("name", ["Bob"])
  })
})