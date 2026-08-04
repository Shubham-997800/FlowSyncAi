import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReportExportMenu from './ReportExportMenu'

describe('ReportExportMenu', () => {
  it('renders an Export button', () => {
    render(<ReportExportMenu onExport={vi.fn()} disabled={false} />)
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<ReportExportMenu onExport={vi.fn()} disabled />)
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled()
  })

  it('opens the menu with all six formats', async () => {
    const user = userEvent.setup()
    render(<ReportExportMenu onExport={vi.fn()} disabled={false} />)
    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    for (const label of ['PDF', 'DOCX', 'Text', 'JSON', 'XML', 'CSV']) {
      expect(screen.getByRole('menuitem', { name: label })).toBeInTheDocument()
    }
  })

  it('calls onExport with the chosen format', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn().mockResolvedValue(true)
    render(<ReportExportMenu onExport={onExport} disabled={false} />)
    await user.click(screen.getByRole('button', { name: /export/i }))
    await user.click(screen.getByRole('menuitem', { name: 'CSV' }))
    expect(onExport).toHaveBeenCalledWith('csv')
  })

  it('closes the menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(<ReportExportMenu onExport={vi.fn()} disabled={false} />)
    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
