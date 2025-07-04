# Test Suite for Assessment Tasks

This project includes a comprehensive test suite to help validate your implementation of the assessment tasks.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (interactive)
npm run test:ui

# Run tests once
npm run test:run
```

## Test Files

### Current Tests (will help guide your implementation):

1. **`src/test/useDebounce.test.js`** - Tests for the debounce hook you need to create
2. **`src/test/csvExport.test.js`** - Tests for CSV export functionality
3. **`src/test/FiltersForm.test.jsx`** - Integration tests for the filters form
4. **`src/test/DataTable.test.jsx`** - Tests for the data table component
5. **`src/test/useReportsData.test.js`** - Tests for the reports data hook

### Test Status

✅ **Passing Tests**: These validate existing functionality  
❌ **Failing Tests**: These will pass once you implement the required features  
⏭️ **Skipped Tests**: These are ready to enable once features are implemented

## What the Tests Expect

### Task 1: Real-time Search with Debouncing
- `useDebounce` hook in `src/hooks/useDebounce.js`
- Debounce delay of 300ms
- Proper cleanup of timeouts

### Task 2: CSV Export
- CSV export utility in `src/utils/csvExport.js`
- Export button in FiltersForm
- Proper CSV formatting with headers

## Tips

- Tests failing is normal - they're designed to guide your implementation
- Read the test descriptions to understand expected behavior
- Run tests frequently to validate your progress
- Tests include proper mocking for external dependencies
