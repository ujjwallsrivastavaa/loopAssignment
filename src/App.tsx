// Import the Dashboard component
import { Dashboard } from "./components/dashboard"
// Import the DashboardProvider context for state management
import { DashboardProvider } from "./context/dashboard-context"

function App() {
  // Wrap the Dashboard component with DashboardProvider to provide context
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}

// Export the App component as the default export
export default App