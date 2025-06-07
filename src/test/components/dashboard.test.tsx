import { render, screen } from "@testing-library/react"
import { vi, type MockedFunction } from "vitest"
import { Dashboard } from "../../components/dashboard"
import { useDashboardContext } from "../../context/dashboard-context"
import type { DashboardContextType } from "../../types/dashboard"

// Mock the context hook to control Dashboard's context in tests
vi.mock("../../context/dashboard-context", () => ({
  useDashboardContext: vi.fn(),
}))

describe("Dashboard Component", () => {
  // Create a mock context object to simulate DashboardContextType
  const mockContext: DashboardContextType = {
    data: [],
    filteredData: [],
    filters: {},
    columns: [{ key: "name", label: "Name", type: "text" }],
    filterableColumns: [],
    availableOptions: {},
    updateFilter: vi.fn(),
    clearAllFilters: vi.fn(),
    isLoading: false,
    currentDatabase: "small",
    switchDatabase: vi.fn(),
    databaseConfigs: [{ type: "small", url: "/dataset_small.csv", label: "Small Database" }],
  }

  // Reset mocks and set the mock context before each test
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDashboardContext as MockedFunction<typeof useDashboardContext>).mockReturnValue(mockContext)
  })

  // Test: Dashboard header renders correctly
  it("renders the dashboard header", () => {
    render(<Dashboard />)
    expect(screen.getByText("Business Intelligence Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Dynamic filtering system with real-time data analysis")).toBeInTheDocument()
  })

  // Test: Displays the number of columns detected
  it("displays the number of columns detected", () => {
    render(<Dashboard />)
    expect(screen.getByText("1 columns detected")).toBeInTheDocument()
  })

  // Test: Renders the DatabaseSwitcher component
  it("renders the DatabaseSwitcher component", () => {
    render(<Dashboard />)
    expect(screen.getByRole("button", { name: /Small Database/i })).toBeInTheDocument()
  })

  // Test: Renders the FilterPanel component
  it("renders the FilterPanel component", () => {
    render(<Dashboard />)
    expect(screen.getByText(/Currently viewing:/i)).toBeInTheDocument()
  })

  // Test: Renders the DataTable component with no data
  it("renders the DataTable component", () => {
    render(<Dashboard />)
    expect(screen.getByText("No data available")).toBeInTheDocument()
  })
})