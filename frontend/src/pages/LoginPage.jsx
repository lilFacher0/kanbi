import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Kanbi</h1>
          <p className="text-slate-400 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Contraseña</label>
            <input
              name="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>

        <p className="text-slate-500 text-sm text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
