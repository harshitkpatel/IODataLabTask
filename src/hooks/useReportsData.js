import { useState, useEffect, useCallback } from 'react'
import { reportsAPI } from '../services/reportsAPI'

export const useReportsData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
  })
  const [sorting, setSorting] = useState([])
  const [filters, setFilters] = useState({})

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const sortBy = sorting.length > 0 ? sorting[0].id : 'createdAt'
      const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'desc'
      
      const response = await reportsAPI.getReports({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy,
        sortOrder,
        filters,
        search: filters.search || ''
      })
      
      // Safely extract data from response
      if (response && response.data) {
        setData(response.data.reports || [])
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            pageCount: response.data.pagination.totalPages || 0
          }))
        }
      } else {
        setData([])
        console.warn('Unexpected API response structure:', response)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reports')
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, filters])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const onPaginationChange = useCallback((updater) => {
    setPagination(prev => {
      const newPagination = typeof updater === 'function' ? updater(prev) : updater
      return newPagination
    })
  }, [])

  const onSortingChange = useCallback((updater) => {
    setSorting(prev => {
      const newSorting = typeof updater === 'function' ? updater(prev) : updater
      return newSorting
    })
  }, [])

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page
  }, [])

  return {
    data,
    loading,
    error,
    pagination,
    sorting,
    filters,
    onPaginationChange,
    onSortingChange,
    applyFilters,
    refetch: fetchReports
  }
}
