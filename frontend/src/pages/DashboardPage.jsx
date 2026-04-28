import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', color: COLORS[0] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/boards').then(({ data }) => setBoards(data)).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    const { data } = await api.post('/boards', form);
    setBoards([data, ...boards]);
    setForm({ title: '', description: '', color: COLORS[0] });
    setShowForm(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este tablero?')) return;
    await api.delete(`/boards/${id}`);
    setBoards(boards.filter((b) => b._id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Kanbi</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hola, {user?.name}</span>
          <button onClick={logout} className="btn-ghost text-sm">Cerrar sesión</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Mis tableros</h2>
            <p className="text-slate-400 mt-1">Organiza tus proyectos con tableros Kanban</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            + Nuevo tablero
          </button>
        </div>

        {/* Formulario nuevo tablero */}
        {showForm && (
          <div className="card mb-6">
            <h3 className="font-semibold text-white mb-4">Crear nuevo tablero</h3>
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Nombre del tablero"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className="input"
                placeholder="Descripción (opcional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Color:</span>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent' }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreate} className="btn-primary">Crear</button>
                <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de tableros */}
        {loading ? (
          <p className="text-slate-400">Cargando tableros...</p>
        ) : boards.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No tienes tableros aún</p>
            <p className="text-sm mt-1">Crea uno para empezar a organizar tus tareas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className="card cursor-pointer hover:border-slate-600 transition-all hover:-translate-y-1 group relative"
              >
                <div className="w-10 h-10 rounded-lg mb-3" style={{ backgroundColor: board.color }} />
                <h3 className="font-semibold text-white">{board.title}</h3>
                {board.description && (
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{board.description}</p>
                )}
                <button
                  onClick={(e) => handleDelete(board._id, e)}
                  className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
