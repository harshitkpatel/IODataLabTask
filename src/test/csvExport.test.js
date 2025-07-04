import { describe, it, expect, vi } from 'vitest'

describe('CSV Export Functionality', () => {
  const mockData = [
    {
      id: 1,
      title: 'Q1 Sales Report',
      status: 'published',
      department: 'Sales',
      priority: 'high',
      author: 'John Smith',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: 2,
      title: 'Marketing Campaign Analysis',
      status: 'draft',
      department: 'Marketing',
      priority: 'medium',
      author: 'Jane Doe',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T11:45:00Z'
    }
  ]

  it('should convert data to proper CSV format with headers', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const csv = csvExport.convertToCSV(mockData)
    const lines = csv.split('\n')
    
    // Should have proper CSV header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should have data rows with proper CSV formatting
    expect(lines[1]).toBe('1,Q1 Sales Report,published,Sales,high,John Smith,2024-01-15T10:30:00Z,2024-01-16T14:20:00Z')
    expect(lines[2]).toBe('2,Marketing Campaign Analysis,draft,Marketing,medium,Jane Doe,2024-01-14T09:15:00Z,2024-01-15T11:45:00Z')
  })

  it('should handle empty data by returning just headers', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const csv = csvExport.convertToCSV([], ['Title', 'Status', 'Department'])
    const lines = csv.split('\n')
    
    // Should have header row even with empty data
    expect(lines[0]).toBe('Title,Status,Department')
    expect(lines.length).toBe(1) // Only header row
  })

  it('should escape special characters in CSV data', async () => {
    const csvExport = await import('../lib/csvExport.js')

    const dataWithSpecialChars = [{
      id: 1,
      title: 'Report with "quotes" and, commas',
      status: 'draft',
      department: 'IT',
      priority: 'low',
      author: 'Test User',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    }]

    const csv = csvExport.convertToCSV(dataWithSpecialChars)
    
    // Should properly escape quotes and handle commas in CSV format
    expect(csv).toContain('"Report with ""quotes"" and, commas"')
  })

  it('should use custom headers when provided', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const customHeaders = ['ID', 'Title', 'Status']
    const csv = csvExport.convertToCSV(mockData, customHeaders)
    const lines = csv.split('\n')
    
    // Should use custom headers instead of object keys
    expect(lines[0]).toBe('ID,Title,Status')
  })

  it('should trigger file download in browser', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock DOM elements for file download
    const mockCreateElement = vi.spyOn(document, 'createElement')
    const mockClick = vi.fn()
    const mockElement = {
      href: '',
      download: '',
      click: mockClick,
      style: { display: '' }
    }
    
    mockCreateElement.mockReturnValue(mockElement)
    const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})
    
    // Mock URL.createObjectURL
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    const mockRevokeObjectURL = vi.fn()
    const originalURL = globalThis.URL
    globalThis.URL = {
      ...originalURL,
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL
    }

    // Test actual download functionality
    csvExport.downloadFile('test,content,csv', 'test.csv')
    
    // Verify download behavior
    expect(mockCreateElement).toHaveBeenCalledWith('a')
    expect(mockElement.download).toBe('test.csv')
    expect(mockElement.href).toBe('blob:mock-url')
    expect(mockClick).toHaveBeenCalled()
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob))

    // Cleanup
    mockCreateElement.mockRestore()
    mockAppendChild.mockRestore()
    mockRemoveChild.mockRestore()
    globalThis.URL = originalURL
  })

  it('should export complete CSV file with proper filename', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const today = new Date().toISOString().split('T')[0]
    const expectedFilename = `reports-${today}.csv`
    
    // Mock the downloadFile function to verify it gets called
    const mockDownloadFile = vi.spyOn(csvExport, 'downloadFile').mockImplementation(() => {})
    
    // Test that the export function generates proper filename and triggers download
    const result = csvExport.exportAsCSV(mockData, 'reports')
    
    expect(result.success).toBe(true)
    expect(result.filename).toBe(expectedFilename)
    expect(mockDownloadFile).toHaveBeenCalledWith(
      expect.stringContaining('id,title,status'), // Should contain CSV content
      expectedFilename
    )
    
    mockDownloadFile.mockRestore()
  })

  it('should format reports data with user-friendly column names', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const formatted = csvExport.formatReportsForCSV(mockData)
    
    // Should transform field names to user-friendly versions
    expect(formatted[0]).toHaveProperty('ID', 1)
    expect(formatted[0]).toHaveProperty('Title', 'Q1 Sales Report')
    expect(formatted[0]).toHaveProperty('Status', 'published')
    expect(formatted[0]).toHaveProperty('Department', 'Sales')
    expect(formatted[0]).toHaveProperty('Priority', 'high')
    expect(formatted[0]).toHaveProperty('Created Date')
    expect(formatted[0]).toHaveProperty('Updated Date')
    
    // Should not have original field names
    expect(formatted[0]).not.toHaveProperty('id')
    expect(formatted[0]).not.toHaveProperty('createdAt')
    expect(formatted[0]).not.toHaveProperty('updatedAt')
  })

  it('should format dates appropriately in CSV export', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    const formatted = csvExport.formatReportsForCSV(mockData)
    
    // Should format ISO dates to readable format
    expect(formatted[0]['Created Date']).toMatch(/\d{4}-\d{2}-\d{2}/)
    expect(formatted[0]['Updated Date']).toMatch(/\d{4}-\d{2}-\d{2}/)
    
    // Should not be the original ISO string
    expect(formatted[0]['Created Date']).not.toBe('2024-01-15T10:30:00Z')
  })

  it('should export only filtered data to CSV', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock filtered data (subset of original data)
    const filteredData = [
      {
        id: 1,
        title: 'Q1 Sales Report',
        status: 'published',
        department: 'Sales',
        priority: 'high',
        author: 'John Smith',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:20:00Z'
      }
      // Note: Only 1 record instead of 2, simulating filtered data
    ]
    
    const csv = csvExport.convertToCSV(filteredData)
    const lines = csv.split('\n')
    
    // Should have header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should only have 1 data row (filtered data)
    expect(lines.length).toBe(2) // header + 1 data row
    expect(lines[1]).toBe('1,Q1 Sales Report,published,Sales,high,John Smith,2024-01-15T10:30:00Z,2024-01-16T14:20:00Z')
    
    // Should NOT contain the second record that was filtered out
    expect(csv).not.toContain('Marketing Campaign Analysis')
  })

  it('should export filtered data with specific status', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock data filtered by status = 'published'
    const publishedReports = mockData.filter(report => report.status === 'published')
    
    const csv = csvExport.convertToCSV(publishedReports)
    const lines = csv.split('\n')
    
    // Should have header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should only have 1 data row (only published reports)
    expect(lines.length).toBe(2) // header + 1 data row
    expect(lines[1]).toContain('published')
    expect(lines[1]).toContain('Q1 Sales Report')
    
    // Should NOT contain draft reports
    expect(csv).not.toContain('draft')
    expect(csv).not.toContain('Marketing Campaign Analysis')
  })

  it('should export filtered data by department', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock data filtered by department = 'Sales'
    const salesReports = mockData.filter(report => report.department === 'Sales')
    
    const csv = csvExport.convertToCSV(salesReports)
    const lines = csv.split('\n')
    
    // Should have header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should only have 1 data row (only Sales department)
    expect(lines.length).toBe(2) // header + 1 data row
    expect(lines[1]).toContain('Sales')
    expect(lines[1]).toContain('Q1 Sales Report')
    
    // Should NOT contain Marketing department reports
    expect(csv).not.toContain('Marketing')
  })

  it('should export empty CSV when no data passes filter', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock data filtered to empty (no matches)
    const filteredData = mockData.filter(report => report.status === 'archived') // No archived reports
    
    const csv = csvExport.convertToCSV(filteredData)
    
    // Should return empty string for empty filtered data
    expect(csv).toBe('')
  })

  it('should export filtered data with custom date range', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock data filtered by date range (reports created on or after 2024-01-15)
    const dateFilteredReports = mockData.filter(report => 
      new Date(report.createdAt) >= new Date('2024-01-15')
    )
    
    const csv = csvExport.convertToCSV(dateFilteredReports)
    const lines = csv.split('\n')
    
    // Should have header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should only have 1 data row (only reports from 2024-01-15 onwards)
    expect(lines.length).toBe(2) // header + 1 data row
    expect(lines[1]).toContain('2024-01-15T10:30:00Z')
    expect(lines[1]).toContain('Q1 Sales Report')
    
    // Should NOT contain reports from earlier dates
    expect(csv).not.toContain('2024-01-14')
    expect(csv).not.toContain('Marketing Campaign Analysis')
  })

  it('should export filtered data respecting multiple filter criteria', async () => {
    const csvExport = await import('../lib/csvExport.js')
    
    // Mock data filtered by multiple criteria: status = 'published' AND department = 'Sales'
    const multiFilteredData = mockData.filter(report => 
      report.status === 'published' && report.department === 'Sales'
    )
    
    const csv = csvExport.convertToCSV(multiFilteredData)
    const lines = csv.split('\n')
    
    // Should have header row
    expect(lines[0]).toBe('id,title,status,department,priority,author,createdAt,updatedAt')
    
    // Should only have 1 data row (matching both criteria)
    expect(lines.length).toBe(2) // header + 1 data row
    expect(lines[1]).toContain('published')
    expect(lines[1]).toContain('Sales')
    expect(lines[1]).toContain('Q1 Sales Report')
    
    // Should NOT contain reports that don't match both criteria
    expect(csv).not.toContain('draft')
    expect(csv).not.toContain('Marketing')
  })
})
