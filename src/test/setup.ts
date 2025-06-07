// Import custom Jest matchers for DOM nodes from @testing-library/jest-dom
import "@testing-library/jest-dom"
// Import Vitest's mocking utilities
import { vi } from "vitest"

// Mock the global fetch API to prevent real network requests during tests
global.fetch = vi.fn()

// Mock the global IntersectionObserver API
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(), // Mock disconnect method
  observe: vi.fn(),    // Mock observe method
  unobserve: vi.fn(),  // Mock unobserve method
}))

// Mock the global ResizeObserver API
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(), // Mock disconnect method
  observe: vi.fn(),    // Mock observe method
  unobserve: vi.fn(),  // Mock unobserve method
}))

// Mock the window.matchMedia API to control media query matching in tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,                // Always return false for matches
    media: query,                  // Return the query string
    onchange: null,                // No change handler
    addListener: vi.fn(),          // Mock deprecated addListener method
    removeListener: vi.fn(),       // Mock deprecated removeListener method
    addEventListener: vi.fn(),     // Mock addEventListener method
    removeEventListener: vi.fn(),  // Mock removeEventListener method
    dispatchEvent: vi.fn(),        // Mock dispatchEvent method
  })),
})