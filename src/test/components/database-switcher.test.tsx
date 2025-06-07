import { render, screen, fireEvent, within } from "@testing-library/react"
import { vi } from "vitest"
import { DatabaseSwitcher } from "../../components/database-switcher"
import type { DatabaseConfig } from "../../types/dashboard"

// Test suite for the DatabaseSwitcher component
describe("DatabaseSwitcher Component", () => {
  // Mock database configurations
  const databaseConfigs: DatabaseConfig[] = [
    { type: "small", url: "/dataset_small.csv", label: "Small Database" },
    { type: "large", label: "Large Database", url: "/dataset_large.csv" },
  ]

  // Helper function to render the component with optional props
  const setup = (props?: Partial<React.ComponentProps<typeof DatabaseSwitcher>>) => {
    const onSwitch = vi.fn() // Mock callback for database switch
    render(
      <DatabaseSwitcher
        currentDatabase="small"
        databaseConfigs={databaseConfigs}
        onSwitch={onSwitch}
        isLoading={false}
        {...props}
      />
    )
    return { onSwitch }
  }

  // Test: Should render the current database label on the button
  it("renders current database label", () => {
    setup()
    expect(screen.getByRole("button", { name: /Small Database/i })).toBeInTheDocument()
  })

  // Test: Should show loading state and disable button when isLoading is true
  it("displays 'Loading...' when isLoading is true", () => {
    setup({ isLoading: true })
    expect(screen.getByRole("button", { name: /Loading/i })).toBeDisabled()
  })

  // Test: Should display dropdown with all database options when button is clicked
  it("shows dropdown with options when clicked", () => {
    setup()
    fireEvent.click(screen.getByRole("button"))
    const dropdown = screen.getByTestId("dropdown")
    expect(within(dropdown).getByText("Small Database")).toBeInTheDocument()
    expect(within(dropdown).getByText("Large Database")).toBeInTheDocument()
  })

  // Test: Should call onSwitch and close dropdown when an option is selected
  it("calls onSwitch and closes dropdown when an option is selected", () => {
    const { onSwitch } = setup()
    fireEvent.click(screen.getByRole("button"))
    fireEvent.click(screen.getByText("Large Database"))
    expect(onSwitch).toHaveBeenCalledWith("large")
    // Dropdown should close after selection
    expect(screen.queryByText("Large Database")).not.toBeInTheDocument()
  })

  // Test: Should close dropdown when overlay is clicked
  it("closes dropdown when overlay is clicked", () => {
    setup()
    fireEvent.click(screen.getByRole("button"))
    const overlay = screen.getByTestId("overlay")
    fireEvent.click(overlay)
    // Dropdown should close after overlay click
    expect(screen.queryByText("Large Database")).not.toBeInTheDocument()
  })
})