import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RotateCcw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/common/Input'
import { Select, type SelectOption } from '../../components/common/Select'
import { Spinner } from '../../components/common/Spinner'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { RegisterPayload } from '../../api/authApi'

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'CUSTOMER', label: 'Cliente' },
  { value: 'WAREHOUSE_STAFF', label: 'Personal de almacén' },
]

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterPayload>({
    defaultValues: { role: 'CUSTOMER' },
  })

  const onSubmit = async (data: RegisterPayload) => {
    setError('')
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err, 'Error al registrar la cuenta'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <RotateCcw size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-500">Completa tus datos para comenzar</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                placeholder="Juan"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Requerido' })}
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Requerido' })}
              />
            </div>

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

            <Input
              label="Teléfono"
              placeholder="+54 11 1234-5678"
              error={errors.phone?.message}
              {...register('phone', { required: 'El teléfono es requerido' })}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
            />

            <Select
              label="Tipo de cuenta"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              {...register('role', { required: 'Selecciona un tipo' })}
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? <Spinner size="sm" /> : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
