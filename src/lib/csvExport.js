/**
 * CSV Export Utility
 * 
 * This utility provides functions to convert data to CSV format and trigger
 * file downloads in the browser. It's designed to work with the reports data
 * structure and handle proper CSV formatting with headers.
 */

/**
 * Converts an array of objects to CSV format
 * 
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of column headers (optional)
 * @returns {string} - CSV formatted string
 */
// ✅ 1. Update the csvExport.js with real logic
export const convertToCSV = (data, headers = null) => {
  if (!data || data.length === 0) return '';

  const keys = headers || Object.keys(data[0]);
  const escapeCSV = (value) => {
    if (value == null) return '';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = keys.join(',');
  const dataRows = data.map(row => keys.map(key => escapeCSV(row[key])).join(','));

  return [headerRow, ...dataRows].join('\n');
};

export const downloadFile = (content, filename, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsCSV = (data, baseFilename = 'export', headers = null) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `${baseFilename}-${date}.csv`;
  const csvContent = convertToCSV(data, headers);
  if (!csvContent) throw new Error('No data to export');
  downloadFile(csvContent, filename);
};

export const formatReportsForCSV = (reports) => {
  return reports.map(report => ({
    ID: report.id,
    Title: report.title,
    Status: report.status,
    Department: report.department,
    Priority: report.priority,
    Author: report.author,
    "Created Date": new Date(report.createdAt).toLocaleDateString(),
    "Updated Date": new Date(report.updatedAt).toLocaleDateString(),
  }));
};

export const REPORTS_CSV_HEADERS = [
  'ID',
  'Title',
  'Status',
  'Department',
  'Priority',
  'Author',
  'Created Date',
  'Updated Date'
];

export default {
  convertToCSV,
  downloadFile,
  exportAsCSV,
  formatReportsForCSV,
  REPORTS_CSV_HEADERS
};
