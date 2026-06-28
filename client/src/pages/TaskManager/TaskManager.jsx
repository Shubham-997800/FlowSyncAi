import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

function TaskManager() {
  const [tasks] = useState([])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          <Plus size={20} /> Add Task
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>
              <button className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskManager
