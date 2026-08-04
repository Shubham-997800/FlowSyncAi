import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useKeyboardNavigation, useSwipeNavigation, isTypingTarget, NAV_ORDER } from './useNavigation'

function KeyboardHarness({ onOpenHelp }) {
  useKeyboardNavigation(onOpenHelp)
  const location = useLocation()
  return <div data-testid="path">{location.pathname}</div>
}

function SwipeHarness({ onEdgeOpen }) {
  const swipe = useSwipeNavigation(onEdgeOpen)
  const location = useLocation()
  return <div data-testid="swipe" {...swipe}>{location.pathname}</div>
}

function key(target, key) {
  fireEvent.keyDown(target, { key })
}

beforeEach(() => {
  window.history.pushState({}, '', '/')
})

describe('isTypingTarget', () => {
  it('true for inputs, textareas, selects, contentEditable', () => {
    const input = document.createElement('input')
    const textarea = document.createElement('textarea')
    const select = document.createElement('select')
    const div = document.createElement('div')
    div.setAttribute('contenteditable', 'true')
    expect(isTypingTarget(input)).toBe(true)
    expect(isTypingTarget(textarea)).toBe(true)
    expect(isTypingTarget(select)).toBe(true)
    expect(isTypingTarget(div)).toBe(true)
  })

  it('false for ordinary elements and null', () => {
    expect(isTypingTarget(document.createElement('button'))).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
    expect(isTypingTarget(undefined)).toBe(false)
  })
})

describe('useKeyboardNavigation', () => {
  it('navigates to a page when a number key is pressed', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <KeyboardHarness onOpenHelp={vi.fn()} />
      </MemoryRouter>,
    )
    key(window, '2')
    expect(screen.getByTestId('path')).toHaveTextContent('/tasks')
  })

  it('navigates to the previous page with ArrowLeft', () => {
    render(
      <MemoryRouter initialEntries={['/calendar']}>
        <KeyboardHarness onOpenHelp={vi.fn()} />
      </MemoryRouter>,
    )
    key(window, 'ArrowLeft')
    expect(screen.getByTestId('path')).toHaveTextContent('/ai-planner')
  })

  it('navigates to the next page with ArrowRight', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <KeyboardHarness onOpenHelp={vi.fn()} />
      </MemoryRouter>,
    )
    key(window, 'ArrowRight')
    expect(screen.getByTestId('path')).toHaveTextContent('/ai-planner')
  })

  it('does not navigate past the first or last page', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <KeyboardHarness onOpenHelp={vi.fn()} />
      </MemoryRouter>,
    )
    key(window, 'ArrowLeft')
    expect(screen.getByTestId('path')).toHaveTextContent('/dashboard')
  })

  it('opens help when ? is pressed', () => {
    const onOpenHelp = vi.fn()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <KeyboardHarness onOpenHelp={onOpenHelp} />
      </MemoryRouter>,
    )
    key(window, '?')
    expect(onOpenHelp).toHaveBeenCalled()
  })

  it('ignores keys when typing in an input', () => {
    const onOpenHelp = vi.fn()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <KeyboardHarness onOpenHelp={onOpenHelp} />
      </MemoryRouter>,
    )
    const input = document.createElement('input')
    key(input, '2')
    expect(screen.getByTestId('path')).toHaveTextContent('/dashboard')
    expect(onOpenHelp).not.toHaveBeenCalled()
  })
})

describe('useSwipeNavigation', () => {
  it('navigates forward on a left swipe', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <SwipeHarness onEdgeOpen={vi.fn()} />
      </MemoryRouter>,
    )
    const el = screen.getByTestId('swipe')
    fireEvent.touchStart(el, { touches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(el, { changedTouches: [{ clientX: 80, clientY: 105 }] })
    expect(screen.getByTestId('swipe')).toHaveTextContent('/ai-planner')
  })

  it('opens the sidebar from a right swipe starting at the left edge', () => {
    const onEdgeOpen = vi.fn()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SwipeHarness onEdgeOpen={onEdgeOpen} />
      </MemoryRouter>,
    )
    const el = screen.getByTestId('swipe')
    fireEvent.touchStart(el, { touches: [{ clientX: 10, clientY: 100 }] })
    fireEvent.touchEnd(el, { changedTouches: [{ clientX: 120, clientY: 105 }] })
    expect(onEdgeOpen).toHaveBeenCalled()
  })

  it('ignores tiny swipes', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <SwipeHarness onEdgeOpen={vi.fn()} />
      </MemoryRouter>,
    )
    const el = screen.getByTestId('swipe')
    fireEvent.touchStart(el, { touches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(el, { changedTouches: [{ clientX: 190, clientY: 100 }] })
    expect(screen.getByTestId('swipe')).toHaveTextContent('/tasks')
  })

  it('exposes NAV_ORDER with keys 1-9 and 0', () => {
    expect(NAV_ORDER).toHaveLength(10)
    expect(NAV_ORDER.map(n => n.key)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
  })
})
