import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RotateCcw, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/common/Input'
import { Spinner } from '../../components/common/Spinner'
import { getErrorMessage } from '../../utils/getErrorMessage'

interface LoginFormValues {
  email: string
  password: string
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>()

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setError('')
    try {
      const user = await login(email, password)
      if (user.role === 'WAREHOUSE_STAFF') navigate('/warehouse')
      else if (user.role === 'ADMIN') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err, 'Credenciales inválidas'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <RotateCcw size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Logística Inversa</h1>
          <p className="text-sm text-gray-500">Ingresá a tu cuenta</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'El email es requerido',
                pattern: { value: /^\S+@\S+$/, message: 'Email inválido' },
              })}
            />

            <div>
              <label className="form-label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`form-input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', { required: 'La contraseña es requerida' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? <Spinner size="sm" /> : 'Ingresar'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
