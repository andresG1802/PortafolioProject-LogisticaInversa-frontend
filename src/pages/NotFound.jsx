import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <p className="text-lg font-medium text-gray-600">Página no encontrada</p>
      <button onClick={() => navigate('/')} className="btn-primary">
        <Home size={16} /> Volver al inicio
      </button>
    </div>
  )
}
