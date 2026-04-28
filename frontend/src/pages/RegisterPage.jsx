import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Kanbi</h1>
          <p className="text-slate-400 mt-1">Crea tu cuenta gratis</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Nombre</label>
            <input name="name" className="input" placeholder="Tu nombre" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input name="email" type="email" className="input" placeholder="tu@email.com" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Contraseña</label>
            <input name="password" type="password" className="input" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>

        <p className="text-slate-500 text-sm text-center mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
