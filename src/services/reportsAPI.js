// Mock Reports API service for development
// In a real application, these would be actual HTTP requests to a reporting backend

const API_BASE_URL = '/api'
const MOCK_DELAY = 1200 // Simulate realistic network delay for data operations

// Simulate network delay for realistic experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock report data
const generateMockReports = (count = 100) => {
  const departments = ['Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'IT']
  const statuses = ['draft', 'pending', 'approved', 'published', 'archived']
  const priorities = ['low', 'medium', 'high']
  const reportTypes = ['Monthly Summary', 'Weekly Analytics', 'User Activity', 'Performance Report', 'Budget Analysis']
  const authors = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown', 'Chris Wilson', 'Lisa Anderson']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${reportTypes[i % reportTypes.length]} ${Math.floor(i / reportTypes.length) + 1}`,
    department: departments[i % departments.length],
    type: reportTypes[i % reportTypes.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    author: authors[i % authors.length],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    recordCount: Math.floor(Math.random() * 50000) + 1000,
    fileSize: `${(Math.random() * 50 + 5).toFixed(1)} MB`,
    executionTime: `${(Math.random() * 180 + 10).toFixed(1)}s`
  }))
}

// Mock database
let mockReports = generateMockReports(250)

export const reportsAPI = {
  // GET /api/reports with pagination, sorting, filtering
  async getReports({
    page = 1,
    pageSize = 25,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filters = {},
    search = ''
  } = {}) {
    await delay(MOCK_DELAY)
    
    // Simulate potential network error (3% chance)
    if (Math.random() < 0.03) {
      throw new Error('Network error: Failed to fetch reports')
    }
    
    let filteredReports = [...mockReports]
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      filteredReports = filteredReports.filter(report =>
        report.title.toLowerCase().includes(searchLower) ||
        report.department.toLowerCase().includes(searchLower) ||
        report.author.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply filters
    if (filters.department) {
      filteredReports = filteredReports.filter(report => report.department === filters.department)
    }
    if (filters.status) {
      filteredReports = filteredReports.filter(report => report.status === filters.status)
    }
    if (filters.priority) {
      filteredReports = filteredReports.filter(report => report.priority === filters.priority)
    }
    if (filters.dateFrom) {
      filteredReports = filteredReports.filter(report => 
        new Date(report.createdAt) >= new Date(filters.dateFrom)
      )
    }
    if (filters.dateTo) {
      filteredReports = filteredReports.filter(report => 
        new Date(report.createdAt) <= new Date(filters.dateTo)
      )
    }
    
    // Apply sorting
    filteredReports.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }
    })
    
    const totalCount = filteredReports.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize)
    
    return {
      success: true,
      data: {
        reports: paginatedReports,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      },
      message: 'Reports retrieved successfully'
    }
  },

  // POST /api/reports
  async createReport(reportData) {
    await delay(MOCK_DELAY)
    
    // Simulate validation error
    if (!reportData.name || reportData.name.trim().length === 0) {
      throw new Error('Validation error: Report name is required')
    }
    
    const newReport = {
      id: Math.max(...mockReports.map(r => r.id)) + 1,
      name: reportData.name.trim(),
      department: reportData.department || 'Engineering',
      type: reportData.type || 'Custom Report',
      status: 'pending',
      createdBy: 'current.user@company.com',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      recordCount: 0,
      fileSize: '0 MB',
      executionTime: '0s',
      priority: reportData.priority || 'medium'
    }
    
    mockReports.unshift(newReport)
    
    return {
      success: true,
      data: newReport,
      message: 'Report created successfully'
    }
  },

  // PUT /api/reports/:id
  async updateReport(id, updates) {
    await delay(MOCK_DELAY)
    
    const reportIndex = mockReports.findIndex(report => report.id === id)
    
    if (reportIndex === -1) {
      throw new Error('Report not found')
    }
    
    if (updates.name && updates.name.trim().length === 0) {
      throw new Error('Validation error: Report name cannot be empty')
    }
    
    const updatedReport = {
      ...mockReports[reportIndex],
      ...updates,
      lastModified: new Date().toISOString()
    }
    
    mockReports[reportIndex] = updatedReport
    
    return {
      success: true,
      data: updatedReport,
      message: 'Report updated successfully'
    }
  },

  // DELETE /api/reports/:id
  async deleteReport(id) {
    await delay(MOCK_DELAY)
    
    const reportIndex = mockReports.findIndex(report => report.id === id)
    
    if (reportIndex === -1) {
      throw new Error('Report not found')
    }
    
    const deletedReport = mockReports[reportIndex]
    mockReports.splice(reportIndex, 1)
    
    return {
      success: true,
      data: deletedReport,
      message: 'Report deleted successfully'
    }
  },

  // POST /api/reports/:id/execute
  async executeReport(id) {
    await delay(MOCK_DELAY * 2) // Longer delay for report execution
    
    const report = mockReports.find(report => report.id === id)
    
    if (!report) {
      throw new Error('Report not found')
    }
    
    // Simulate execution
    report.status = 'active'
    report.lastModified = new Date().toISOString()
    
    // Simulate completion after delay
    setTimeout(() => {
      report.status = Math.random() > 0.1 ? 'completed' : 'failed'
      report.recordCount = Math.floor(Math.random() * 50000) + 1000
      report.fileSize = `${(Math.random() * 50 + 5).toFixed(1)} MB`
      report.executionTime = `${(Math.random() * 180 + 10).toFixed(1)}s`
    }, 3000)
    
    return {
      success: true,
      data: report,
      message: 'Report execution started'
    }
  },

  // GET /api/reports/summary
  async getReportsSummary() {
    await delay(500) // Faster for dashboard
    
    const summary = mockReports.reduce((acc, report) => {
      acc.total++
      acc.byStatus[report.status] = (acc.byStatus[report.status] || 0) + 1
      acc.byDepartment[report.department] = (acc.byDepartment[report.department] || 0) + 1
      return acc
    }, {
      total: 0,
      byStatus: {},
      byDepartment: {}
    })
    
    return {
      success: true,
      data: summary,
      message: 'Summary retrieved successfully'
    }
  }
}

// Export individual functions for easier testing
export const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  executeReport,
  getReportsSummary
} = reportsAPI
