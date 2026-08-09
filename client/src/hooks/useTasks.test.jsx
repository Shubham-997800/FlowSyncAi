import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './useTasks'
import * as taskService from '../services/taskService'

vi.mock('../services/taskService', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

const makeWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    queryClient,
    wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useTasks', () => {
  it('fetches via getTasks and passes filters through', async () => {
    taskService.getTasks.mockResolvedValue([{ _id: '1', title: 'A' }])
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useTasks({ status: 'todo' }), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual([{ _id: '1', title: 'A' }]))
    expect(taskService.getTasks).toHaveBeenCalledWith({ status: 'todo' })
  })

  it('normalizes non-array responses to an empty array', async () => {
    taskService.getTasks.mockResolvedValue(null)
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual([]))
  })
})

describe('task mutation hooks', () => {
  it('useCreateTask calls createTask with the payload', async () => {
    taskService.createTask.mockResolvedValue({ _id: 'x', title: 'New' })
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useCreateTask(), { wrapper })
    await result.current.mutateAsync({ title: 'New task' })
    expect(taskService.createTask).toHaveBeenCalledWith({ title: 'New task' })
  })

  it('useUpdateTask calls updateTask with id + data', async () => {
    taskService.updateTask.mockResolvedValue({ _id: 'x', status: 'done' })
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useUpdateTask(), { wrapper })
    await result.current.mutateAsync({ id: 'x', data: { status: 'done' } })
    expect(taskService.updateTask).toHaveBeenCalledWith('x', { status: 'done' })
  })

  it('useDeleteTask calls deleteTask with the id', async () => {
    taskService.deleteTask.mockResolvedValue({ message: 'ok' })
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useDeleteTask(), { wrapper })
    await result.current.mutateAsync('abc123')
    expect(taskService.deleteTask).toHaveBeenCalledWith('abc123')
  })

  it('mutations invalidate the tasks list so caches stay fresh', async () => {
    taskService.createTask.mockResolvedValue({ _id: 'y', title: 'B' })
    const { wrapper, queryClient } = makeWrapper()
    const invalidationSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateTask(), { wrapper })
    await result.current.mutateAsync({ title: 'B' })
    expect(invalidationSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] })
  })
})
