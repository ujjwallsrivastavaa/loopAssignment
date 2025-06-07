import type React from "react"
import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { DataRow, ColumnConfig } from "../types/dashboard"

interface DataTableProps {
  data: DataRow[]
  columns: ColumnConfig[]
  isLoading: boolean
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 100
  const visibleRows = 21 // Always show exactly 20 rows
  const rowHeight = 48 // Fixed row height in pixels

  const totalPages = Math.ceil(data.length / rowsPerPage)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return data.slice(startIndex, startIndex + rowsPerPage)
  }, [data, currentPage, rowsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const formatCellValue = (value: string, columnType: "number" | "text") => {
    if (columnType === "number" && !isNaN(Number(value))) {
      return Number(value).toLocaleString()
    }
    return value
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      </div>
    )
  }
  if (!isLoading && data.length === 0) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-center h-48">
        <span className="text-gray-500 text-lg">No data available</span>
      </div>
    </div>
  )
}

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Data Table ({data.length.toLocaleString()} records)</h3>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto border-t border-gray-200" style={{ height: `${visibleRows > paginatedData.length ? (paginatedData.length +1) * rowHeight : visibleRows * rowHeight}px` }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b border-gray-200"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((row, index) => (
                  <tr key={`row-${index}`} className="hover:bg-gray-50" style={{ height: "48px" }}>
                    {columns.map((column) => (
                      <td
                        key={`${column.key}-${index}`}
                        className={`px-6 py-3 whitespace-nowrap text-sm ${
                          column.key === columns[0]?.key ? "font-medium text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {formatCellValue(row[column.key] || "", column.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, data.length)} of{" "}
            {data.length.toLocaleString()} results
          </div>

          {/* Pagination controls: first, previous, page indicator, next, last */}
          <div className="flex items-center space-x-2">
            {/* Go to first page */}
            <button
              onClick={() => handlePageChange(1)}
              data-testid="first-page-button"
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Go to previous page */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              data-testid="previous-page-button"
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Current page indicator */}
            <span className="px-3 py-2 text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>

            {/* Go to next page */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              data-testid="next-page-button"
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Go to last page */}
            <button
              onClick={() => handlePageChange(totalPages)}
              data-testid="last-page-button"
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
