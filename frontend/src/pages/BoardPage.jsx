import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PRIORITIES = { baja: '🟢', media: '🟡', alta: '🔴' };

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(null); // nombre de columna activa
  const [form, setForm] = useState({ title: '', description: '', priority: 'media', dueDate: '' });
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    Promise.all([api.get(`/boards/${id}`), api.get(`/tasks?board=${id}`)]).then(
      ([boardRes, tasksRes]) => {
        setBoard(boardRes.data);
        setTasks(tasksRes.data);
      }
    );
  }, [id]);

  const tasksByColumn = (col) => tasks.filter((t) => t.status === col);

  const handleAddTask = async (column) => {
    if (!form.title.trim()) return;
    const { data } = await api.post('/tasks', {
      ...form,
      status: column,
      board: id,
    });
    setTasks([...tasks, data]);
    setForm({ title: '', description: '', priority: 'media', dueDate: '' });
    setShowForm(null);
  };

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e, column) => {
    e.preventDefault();
    if (!dragging || dragging.status === column) return;
    const updated = { ...dragging, status: column };
    setTasks(tasks.map((t) => (t._id === dragging._id ? updated : t)));
    await api.put(`/tasks/${dragging._id}`, { status: column });
    setDragging(null);
  };

  if (!board) return <div className="flex items-center justify-center h-screen text-slate-400">Cargando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">
          ← Volver
        </button>
        <div className="w-5 h-5 rounded" style={{ backgroundColor: board.color }} />
        <h1 className="text-lg font-bold text-white">{board.title}</h1>
      </header>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {board.columns.map((col) => (
            <div
              key={col}
              className="w-72 flex-shrink-0"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{col}</span>
                  <span className="text-xs bg-slate-800 text-slate-400 rounded-full px-2 py-0.5">
                    {tasksByColumn(col).length}
                  </span>
                </div>
                <button
                  onClick={() => setShowForm(showForm === col ? null : col)}
                  className="text-slate-500 hover:text-indigo-400 text-lg leading-none"
                >
                  +
                </button>
              </div>

              {/* Add task form */}
              {showForm === col && (
                <div className="card mb-3">
                  <input
                    className="input mb-2 text-sm"
                    placeholder="Título de la tarea"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    autoFocus
                  />
                  <textarea
                    className="input mb-2 text-sm resize-none"
                    placeholder="Descripción (opcional)"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <select
                    className="input mb-2 text-sm"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🟡 Media</option>
                    <option value="alta">🔴 Alta</option>
                  </select>
                  <input
                    type="date"
                    className="input mb-3 text-sm"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleAddTask(col)} className="btn-primary text-sm py-1">
                      Agregar
                    </button>
                    <button onClick={() => setShowForm(null)} className="btn-ghost text-sm py-1">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks */}
              <div className="space-y-2 min-h-[100px]">
                {tasksByColumn(col).map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="card cursor-grab active:cursor-grabbing group hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-slate-100 leading-snug">{task.title}</span>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xs mt-0.5"
                      >
                        ✕
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">{PRIORITIES[task.priority]} {task.priority}</span>
                      {task.dueDate && (
                        <span className="text-xs text-slate-500">
                          {new Date(task.dueDate).toLocaleDateString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
