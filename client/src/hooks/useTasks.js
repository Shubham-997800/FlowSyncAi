import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService'

export const taskKeys = {
  all: ['tasks'],
  list: (filters = {}) => ['tasks', 'list', filters],
}

// Query hook for the tasks list. Accepts server-side filters and any extra
// React Query options (refetchInterval, staleTime, enabled, ...).
export const useTasks = (filters = {}, options = {}) =>
  useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
    select: (data) => (Array.isArray(data) ? data : []),
    ...options,
  })

// Mutation hooks keep every cached tasks query in sync after writes.
const useInvalidateTasks = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: taskKeys.all })
}

export const useCreateTask = () => {
  const invalidate = useInvalidateTasks()
  return useMutation({
    mutationFn: (taskData) => createTask(taskData),
    onSuccess: invalidate,
  })
}

export const useUpdateTask = () => {
  const invalidate = useInvalidateTasks()
  return useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: invalidate,
  })
}

export const useDeleteTask = () => {
  const invalidate = useInvalidateTasks()
  return useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: invalidate,
  })
}
