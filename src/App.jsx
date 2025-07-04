import { useMemo } from 'react'
import { DataTable } from './components/DataTable'
import { FiltersForm } from './components/FiltersForm'
import { useReportsData } from './hooks/useReportsData'
import './App.css'

function App() {
  const {
    data,
    loading,
    error,
    pagination,
    sorting,
    filters,
    onPaginationChange,
    onSortingChange,
    applyFilters,
    refetch
  } = useReportsData()

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          published: 'bg-blue-100 text-blue-800',
          archived: 'bg-red-100 text-red-800',
        }
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('department')}</div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority')
        const priorityColors = {
          low: 'bg-blue-100 text-blue-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-red-100 text-red-800',
        }
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
            {priority}
          </span>
        )
      },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('author')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.getValue('updatedAt')).toLocaleDateString()}
        </div>
      ),
    },
  ], [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
          <p className="text-gray-600">Filter and manage your reports</p>
        </div>

        <div className="space-y-6">
          {/* Filters Form */}
          <FiltersForm onSubmit={applyFilters} initialFilters={filters} />

          {/* Data Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Reports</h2>
                {loading && (
                  <div className="text-sm text-gray-500">Loading...</div>
                )}
              </div>
              
              <DataTable
                data={data}
                columns={columns}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                sorting={sorting}
                onSortingChange={onSortingChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
