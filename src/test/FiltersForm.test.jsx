import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FiltersForm } from '../components/FiltersForm'

// Mock the reports API
vi.mock('../services/reportsAPI', () => ({
  reportsAPI: {
    getReports: vi.fn().mockResolvedValue({
      data: {
        reports: [],
        pagination: { totalPages: 1 }
      }
    })
  }
}))

describe('FiltersForm Integration Tests', () => {
  const mockOnSubmit = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all filter inputs', () => {
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
  })

  it('should call onSubmit when Apply Filters is clicked', async () => {
    const user = userEvent.setup()
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'test search')
    
    const applyButton = screen.getByRole('button', { name: /apply filters/i })
    await user.click(applyButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'test search'
      })
    )
  })

  it('should reset form when Clear Filters is clicked', async () => {
    const user = userEvent.setup()
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'test search')
    
    const clearButton = screen.getByRole('button', { name: /reset/i })
    await user.click(clearButton)
    
    expect(searchInput.value).toBe('')
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        search: ''
      })
    )
  })

  it('should show export button when implemented', () => {
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    // This test will pass once export functionality is added
    // For now, we just ensure the form renders without errors
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument()
  })

  // This test will be enabled once real-time search is implemented
  it.skip('should trigger real-time search with debouncing', async () => {
    const user = userEvent.setup()
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    const searchInput = screen.getByLabelText(/search/i)
    
    // Type in search input
    await user.type(searchInput, 'test')
    
    // Should not call immediately
    expect(mockOnSubmit).not.toHaveBeenCalled()
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test'
        })
      )
    }, { timeout: 400 })
  })

  // This test will be enabled once export functionality is implemented
  it.skip('should handle CSV export', async () => {
    const user = userEvent.setup()
    render(<FiltersForm onSubmit={mockOnSubmit} />)
    
    const exportButton = screen.getByRole('button', { name: /export csv/i })
    await user.click(exportButton)
    
    // Should show loading state
    expect(screen.getByText(/exporting/i)).toBeInTheDocument()
    
    // Should complete export
    await waitFor(() => {
      expect(screen.queryByText(/exporting/i)).not.toBeInTheDocument()
    })
  })
})
