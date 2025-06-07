import { render, screen, fireEvent } from "@testing-library/react"
import { MultiSelectFilter } from "../../components/multi-select-filter"
import type { FilterOption } from "../../types/dashboard"
import { vi } from "vitest"

// Test suite for the MultiSelectFilter component
describe("MultiSelectFilter Component", () => {
  // Sample options to use in tests
  const options: FilterOption[] = [
    { value: "alice", label: "Alice" },
    { value: "bob", label: "Bob" },
    { value: "charlie", label: "Charlie" },
  ]

  // Default props for the component
  const defaultProps = {
    label: "Test Filter",
    options,
    selectedValues: [],
    onChange: vi.fn(),
    placeholder: "Select options...",
  }

  // Test: Renders the label and placeholder text
  it("renders label and placeholder", () => {
    render(<MultiSelectFilter {...defaultProps} />)
    expect(screen.getByText("Test Filter")).toBeInTheDocument()
    expect(screen.getByText("Select options...")).toBeInTheDocument()
  })

  // Test: Displays selected values as chips
  it("shows selected values as chips", () => {
    render(
      <MultiSelectFilter
        {...defaultProps}
        selectedValues={["alice", "bob"]}
        options={options}
      />
    )
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  // Test: Opens dropdown and displays all options on click
  it("opens dropdown and shows options on click", () => {
    render(<MultiSelectFilter {...defaultProps} />)
    fireEvent.click(screen.getByText("Select options..."))
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Charlie")).toBeInTheDocument()
  })

  // Test: Filters options based on search input
  it("filters options based on search term", () => {
    render(<MultiSelectFilter {...defaultProps} />)
    fireEvent.click(screen.getByText("Select options..."))
    const searchInput = screen.getByPlaceholderText("Search...")
    fireEvent.change(searchInput, { target: { value: "bob" } })
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument()
  })

  // Test: Calls onChange callback when an option is selected
  it("calls onChange when option is selected", () => {
    const onChange = vi.fn()
    render(<MultiSelectFilter {...defaultProps} onChange={onChange} />)
    fireEvent.click(screen.getByText("Select options..."))
    fireEvent.click(screen.getByText("Alice"))
    expect(onChange).toHaveBeenCalledWith(["alice"])
  })

  // Test: Calls onChange callback when a chip's remove button is clicked
  it("calls onChange when chip remove button is clicked", () => {
    const onChange = vi.fn()
    render(
      <MultiSelectFilter
        {...defaultProps}
        selectedValues={["alice"]}
        onChange={onChange}
      />
    )
    // Open dropdown to render chips
    fireEvent.click(screen.getByText("Alice"))
    // Find the remove button (X icon) for Alice
    const removeBtn = screen.getByRole("button")
    fireEvent.click(removeBtn)
    expect(onChange).toHaveBeenCalledWith([])
  })

  // Test: Shows 'No options found' when search yields no results
  it("shows 'No options found' when search yields no results", () => {
    render(<MultiSelectFilter {...defaultProps} />)
    fireEvent.click(screen.getByText("Select options..."))
    const searchInput = screen.getByPlaceholderText("Search...")
    fireEvent.change(searchInput, { target: { value: "zzz" } })
    expect(screen.getByText("No options found")).toBeInTheDocument()
  })
})