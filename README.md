# TaskFlow 🗂️

Aplicación de gestión de tareas estilo Kanban con autenticación JWT y tableros personalizables.

## ✨ Características

- **Autenticación completa** — Registro, login y logout con JWT
- **Tableros Kanban** — Crea múltiples tableros con colores personalizados
- **Drag & Drop** — Arrastra tareas entre columnas
- **Prioridades** — Marca tareas como baja, media o alta prioridad
- **Fechas límite** — Asigna fechas de vencimiento a cada tarea
- **Rutas protegidas** — Solo usuarios autenticados acceden al contenido

## 🛠️ Stack tecnológico

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## 🚀 Instalación local

### Prerrequisitos
- Node.js 18+
- MongoDB corriendo localmente (o MongoDB Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu MONGODB_URI y JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La app estará en `http://localhost:5173`

## 📁 Estructura del proyecto

```
taskflow/
├── backend/
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Auth JWT
│   ├── models/          # Schemas de Mongoose
│   ├── routes/          # Endpoints API
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── context/     # AuthContext (estado global)
        ├── pages/       # Vistas principales
        ├── services/    # Configuración Axios
        └── App.jsx      # Rutas
```

## 📡 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Usuario actual |
| GET | `/api/boards` | Listar tableros |
| POST | `/api/boards` | Crear tablero |
| PUT | `/api/boards/:id` | Actualizar tablero |
| DELETE | `/api/boards/:id` | Eliminar tablero |
| GET | `/api/tasks?board=id` | Tareas de un tablero |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar/mover tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

## 🌐 Deploy

- **Frontend**: Vercel — conecta el repo y apunta a la carpeta `/frontend`
- **Backend**: Railway o Render — apunta a `/backend`
- **Base de datos**: MongoDB Atlas (gratuito)

## 📄 Licencia

MIT
