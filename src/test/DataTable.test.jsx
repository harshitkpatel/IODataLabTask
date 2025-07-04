import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataTable } from '../components/DataTable'

describe('DataTable', () => {
  const mockData = [
    {
      id: 1,
      title: 'Test Report',
      status: 'draft',
      department: 'IT',
      priority: 'high',
      author: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    }
  ]

  const mockColumns = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    }
  ]

  const mockPagination = {
    pageIndex: 0,
    pageSize: 10,
    pageCount: 1
  }

  const mockProps = {
    data: mockData,
    columns: mockColumns,
    pagination: mockPagination,
    onPaginationChange: () => {},
    sorting: [],
    onSortingChange: () => {}
  }

  it('should render table with data', () => {
    render(<DataTable {...mockProps} />)
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Test Report')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<DataTable {...mockProps} data={[]} />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should render pagination controls', () => {
    render(<DataTable {...mockProps} />)
    
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
  })

  it('should render column headers as buttons for sorting', () => {
    render(<DataTable {...mockProps} />)
    
    const titleHeader = screen.getByRole('button', { name: /title/i })
    const statusHeader = screen.getByRole('button', { name: /status/i })
    
    expect(titleHeader).toBeInTheDocument()
    expect(statusHeader).toBeInTheDocument()
  })
})
