import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * 
 * This hook delays the update of a value until after a specified delay period
 * has passed since the last change. This is useful for preventing excessive
 * API calls during user input, such as real-time search functionality.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 300ms)
 * @returns {any} - The debounced value
 * 
 * Example usage:
 * ```javascript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search API call
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export const useDebounce = (value, delay = 300) => {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Clear previous timer if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
