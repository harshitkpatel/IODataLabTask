import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReportsData } from '../hooks/useReportsData'
import { reportsAPI } from '../services/reportsAPI'

// Mock the reports API
vi.mock('../services/reportsAPI', () => ({
  reportsAPI: {
    getReports: vi.fn()
  }
}))

describe('useReportsData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    reportsAPI.getReports.mockResolvedValue({
      data: {
        reports: [
          { id: 1, title: 'Test Report', status: 'draft' },
          { id: 2, title: 'Another Report', status: 'published' }
        ],
        pagination: {
          totalPages: 1,
          currentPage: 1,
          totalCount: 2
        }
      }
    })
  })

  it('should fetch reports on mount', async () => {
    const { result } = renderHook(() => useReportsData())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.error).toBe(null)
    expect(reportsAPI.getReports).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'API Error'
    reportsAPI.getReports.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useReportsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.data).toEqual([])
  })

  it('should update filters and refetch data', async () => {
    const { result } = renderHook(() => useReportsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Apply filters
    const newFilters = { search: 'test', status: 'draft' }
    result.current.applyFilters(newFilters)

    await waitFor(() => {
      expect(reportsAPI.getReports).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: newFilters
        })
      )
    })
  })

  it('should handle pagination changes', async () => {
    const { result } = renderHook(() => useReportsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change page
    const newPagination = { pageIndex: 1, pageSize: 10 }
    result.current.onPaginationChange(newPagination)

    await waitFor(() => {
      expect(reportsAPI.getReports).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2, // pageIndex + 1
          pageSize: 10
        })
      )
    })
  })

  it('should handle sorting changes', async () => {
    const { result } = renderHook(() => useReportsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change sorting
    const newSorting = [{ id: 'title', desc: false }]
    result.current.onSortingChange(newSorting)

    await waitFor(() => {
      expect(reportsAPI.getReports).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'title',
          sortOrder: 'asc'
        })
      )
    })
  })

  it('should provide refetch functionality', async () => {
    const { result } = renderHook(() => useReportsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear previous calls
    vi.clearAllMocks()

    // Call refetch
    result.current.refetch()

    await waitFor(() => {
      expect(reportsAPI.getReports).toHaveBeenCalledTimes(1)
    })
  })
})
