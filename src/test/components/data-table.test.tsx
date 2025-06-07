import { render, screen, fireEvent } from "@testing-library/react"
import { DataTable } from "../../components/data-table"
import type { DataRow, ColumnConfig } from "../../types/dashboard"

// Test suite for the DataTable component
describe("DataTable Component", () => {
  // Define columns configuration for the table
  const columns: ColumnConfig[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "age", label: "Age", type: "number" },
  ]

  // Sample data for testing
  const data: DataRow[] = [
    { name: "Alice", age: "30" },
    { name: "Bob", age: "25" },
    { name: "Charlie", age: "40" },
  ]

  // Test: Should render loading state when isLoading is true
  it("renders loading state", () => {
    render(<DataTable data={[]} columns={columns} isLoading={true} />)
    expect(screen.getByText("Loading data...")).toBeInTheDocument()
  })

  // Test: Should render "no data" state when data is empty and not loading
  it("renders no data state", () => {
    render(<DataTable data={[]} columns={columns} isLoading={false} />)
    expect(screen.getByText("No data available")).toBeInTheDocument()
  })

  // Test: Should render table headers and all rows
  it("renders table headers and rows", () => {
    render(<DataTable data={data} columns={columns} isLoading={false} />)
    expect(screen.getByText("Data Table (3 records)")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Age")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("25")).toBeInTheDocument()
  })

  // Test: Should show correct pagination info for small data set
  it("shows correct pagination info", () => {
    render(<DataTable data={data} columns={columns} isLoading={false} />)
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(screen.getByText("1 / 1")).toBeInTheDocument()
    expect(screen.getByText("Showing 1 to 3 of 3 results")).toBeInTheDocument()
  })

  // Test: Pagination buttons should be disabled when only one page exists
  it("disables pagination buttons when only one page", () => {
    render(<DataTable data={data} columns={columns} isLoading={false} />);

    expect(screen.getByTestId("first-page-button")).toBeDisabled();
    expect(screen.getByTestId("previous-page-button")).toBeDisabled();
    expect(screen.getByTestId("next-page-button")).toBeDisabled();
    expect(screen.getByTestId("last-page-button")).toBeDisabled();
  });

  // Test: Should handle pagination correctly for more than 100 rows
  it("handles pagination for more than 100 rows", () => {
    // Generate 150 rows of test data
    const bigData = Array.from({ length: 150 }, (_, i) => ({
      name: `User${i + 1}`,
      age: `${20 + (i % 50)}`,
    }))
    render(<DataTable data={bigData} columns={columns} isLoading={false} />)
    expect(screen.getByText("Data Table (150 records)")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
    expect(screen.getByText("Showing 1 to 100 of 150 results")).toBeInTheDocument()

    // Simulate clicking the "next page" button
    const nextBtn = screen.getAllByRole("button")[3]
    fireEvent.click(nextBtn)
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument()
    expect(screen.getByText("Showing 101 to 150 of 150 results")).toBeInTheDocument()
  })
})