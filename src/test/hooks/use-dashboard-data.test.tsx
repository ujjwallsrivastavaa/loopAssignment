import { renderHook, act, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { useDashboardData } from "../../hooks/use-dashboard-data"

// Mock CSV data to simulate API response
const mockCsv = `id,name,age
1,Alice,30
2,Bob,25
3,Charlie,35`

describe("useDashboardData hook", () => {
  // Reset mocks and mock global.fetch before each test
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockCsv),
    }) as any
  })

  // Test: fetches and parses CSV data on mount
  it("fetches and parses CSV data on mount", async () => {
    const { result } = renderHook(() => useDashboardData())

    // Wait until loading is finished
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check if data and columns are parsed correctly
    expect(result.current.data).toHaveLength(3)
    expect(result.current.columns).toEqual([
      { key: "id", label: "Id", type: "number" },
      { key: "name", label: "Name", type: "text" },
      { key: "age", label: "Age", type: "number" },
    ])
  })

  // Test: filters data based on filter state
  it("filters data based on filter state", async () => {
    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Apply filter for name "Alice"
    act(() => {
      result.current.updateFilter("name", ["Alice"])
    })

    // Only Alice should be in filteredData
    expect(result.current.filteredData).toEqual([
      { id: "1", name: "Alice", age: "30" },
    ])
  })

  // Test: clears all filters
  it("clears all filters", async () => {
    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Apply filter for name "Alice"
    act(() => {
      result.current.updateFilter("name", ["Alice"])
    })

    expect(result.current.filteredData).toHaveLength(1)

    // Clear all filters
    act(() => {
      result.current.clearAllFilters()
    })

    // All data should be visible again
    expect(result.current.filteredData).toHaveLength(3)
  })

  // Test: switches database and resets state
  it("switches database and resets state", async () => {
    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Apply filter for name "Alice"
    act(() => {
      result.current.updateFilter("name", ["Alice"])
    })

    // Switch database to "small"
    act(() => {
      result.current.switchDatabase("small")
    })

    // Wait for new data to load and state to reset
    await waitFor(() => {
      expect(result.current.currentDatabase).toBe("small")
      expect(result.current.isLoading).toBe(false)
    })

    // Data should be reset and filters cleared
    expect(result.current.data).toHaveLength(3)
    expect(result.current.filters).toEqual({
      name: [],
      age: [],
    })
  })

  // Test: computes availableOptions for filterable columns
  it("computes availableOptions for filterable columns", async () => {
    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check available filter options for name and age columns
    const options = result.current.availableOptions
    expect(options.name.map((o) => o.value)).toEqual(["Alice", "Bob", "Charlie"])
    expect(options.age.map((o) => o.value)).toEqual(["25", "30", "35"])
  })
})