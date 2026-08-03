import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Timer from './Timer'

describe('Timer', () => {
  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('renders the default 25:00 focus timer', () => {
    render(<Timer />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Focus Session')).toBeInTheDocument()
  })

  it('starts countdown when Start is pressed', () => {
    vi.useFakeTimers()
    render(<Timer />)
    fireEvent.click(screen.getByText('Start'))
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('24:58')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('pauses the countdown when Pause is pressed', () => {
    vi.useFakeTimers()
    render(<Timer />)
    fireEvent.click(screen.getByText('Start'))
    act(() => vi.advanceTimersByTime(3000))
    fireEvent.click(screen.getByText('Pause'))
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('24:57')).toBeInTheDocument()
  })

  it('resets to full duration when Reset is pressed', () => {
    vi.useFakeTimers()
    render(<Timer />)
    fireEvent.click(screen.getByText('Start'))
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('switches to break mode with 05:00 duration', () => {
    render(<Timer />)
    fireEvent.click(screen.getByText('Break'))
    expect(screen.getByText('05:00')).toBeInTheDocument()
    expect(screen.getByText('Break Time')).toBeInTheDocument()
  })

  it('persists custom focus/break settings to localStorage', () => {
    render(<Timer />)
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.change(screen.getByLabelText('Focus (min)'), { target: { value: '50' } })
    fireEvent.change(screen.getByLabelText('Break (min)'), { target: { value: '10' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(JSON.parse(localStorage.getItem('flowsync_timer_settings'))).toEqual({ focus: 50, break: 10 })
  })

  it('clamps custom settings to the allowed ranges', () => {
    render(<Timer />)
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    fireEvent.change(screen.getByLabelText('Focus (min)'), { target: { value: '999' } })
    fireEvent.change(screen.getByLabelText('Break (min)'), { target: { value: '999' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(JSON.parse(localStorage.getItem('flowsync_timer_settings'))).toEqual({ focus: 180, break: 60 })
  })

  it('loads saved settings on mount', () => {
    localStorage.setItem('flowsync_timer_settings', JSON.stringify({ focus: 45, break: 15 }))
    render(<Timer />)
    expect(screen.getByText('45:00')).toBeInTheDocument()
  })

  it('calls onComplete when the timer runs out', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<Timer onComplete={onComplete} />)
    fireEvent.click(screen.getByText('Start'))
    act(() => vi.advanceTimersByTime(25 * 60 * 1000))
    act(() => vi.runOnlyPendingTimers())
    expect(onComplete).toHaveBeenCalled()
  })
})
