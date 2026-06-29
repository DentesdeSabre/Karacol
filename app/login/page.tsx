"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormValues = { email: string; password: string }

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormValues>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Falha no login')
        setLoading(false)
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h2 className="text-xl font-semibold mb-4" style={{color:'#945846'}}>Entrar — Admin</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input className="w-full p-2 border rounded" {...register('email')} />
        </div>

        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input type="password" className="w-full p-2 border rounded" {...register('password')} />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button type="submit" className="px-4 py-2 bg-karacol-brown text-white rounded" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
