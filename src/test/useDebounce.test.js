import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from '../hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300))
    expect(result.current).toBe('test')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'updated', delay: 300 })
    expect(result.current).toBe('initial') // Should still be initial

    // Fast forward time by 250ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial') // Should still be initial

    // Fast forward time by remaining 50ms (total 300ms)
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('updated') // Should now be updated
  })

  it('should cancel previous timeout when value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    // First change
    rerender({ value: 'first', delay: 300 })
    
    // Second change before first timeout completes
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'second', delay: 300 })

    // Should still be initial after first timeout would have completed
    act(() => {
      vi.advanceTimersByTime(150) // Total 350ms from first change
    })
    expect(result.current).toBe('initial')

    // Complete second timeout
    act(() => {
      vi.advanceTimersByTime(150) // Additional 150ms for second change
    })
    expect(result.current).toBe('second')
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    )

    rerender({ value: 'updated', delay: 100 })

    // Should update after 100ms
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('updated')
  })
})
