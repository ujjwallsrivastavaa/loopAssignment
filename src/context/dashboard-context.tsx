import type React from "react"
import { createContext, useContext } from "react"
import type { DashboardContextType } from "../types/dashboard"
import { useDashboardData } from "../hooks/use-dashboard-data"

// Create a context for the dashboard, initially undefined
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Provider component to wrap parts of the app that need dashboard data
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Custom hook to fetch or manage dashboard data
  const dashboardData = useDashboardData()

  // Provide the dashboard data to all children components
  return <DashboardContext.Provider value={dashboardData}>{children}</DashboardContext.Provider>
}

// Custom hook to consume the dashboard context
export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  // Ensure the hook is used within a DashboardProvider
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider")
  }
  return context
}