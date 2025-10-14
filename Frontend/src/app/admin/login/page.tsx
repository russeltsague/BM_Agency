'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { MotionDiv, MotionCard } from '@/components/MotionComponents'

const loginSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError('')

    const result = await login(data.email, data.password)

    if (result.success) {
      setIsSuccess(true)
      toast.success('Connexion réussie !', {
        description: 'Redirection vers le tableau de bord...',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        duration: 2000,
      })

      // Add a small delay for better UX
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    } else {
      setError(result.error || 'Échec de la connexion')
      toast.error('Échec de la connexion', {
        description: result.error || 'Vérifiez vos identifiants',
        icon: <XCircle className="w-5 h-5 text-red-600" />,
        duration: 4000,
      })
    }
  }

  // Reset success state when component mounts
  useEffect(() => {
    setIsSuccess(false)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-slate-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <MotionCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-white/20 shadow-2xl"
        >
          <CardHeader className="text-center pb-8">
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Image
                src="/images/lightlogo2.png"
                alt="BM Agency Logo"
                width={200}
                height={67}
                className="h-12 w-auto object-contain"
                priority
              />
            </MotionDiv>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Administration
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400">
              Connectez-vous à votre tableau de bord
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Alert with Animation */}
              {error && (
                <MotionDiv
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="transition-all duration-300"
                >
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                </MotionDiv>
              )}

              {/* Email Field */}
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Adresse Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-11 pr-4 py-3 border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                    placeholder="admin@bm-agency.net"
                    {...register('email')}
                  />
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                {errors.email && (
                  <MotionDiv
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.email.message}
                  </MotionDiv>
                )}
              </MotionDiv>

              {/* Password Field */}
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Mot de Passe
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="pl-11 pr-12 py-3 border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <MotionDiv
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.password.message}
                  </MotionDiv>
                )}
              </MotionDiv>

              {/* Submit Button */}
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se Connecter
                    </>
                  )}
                </Button>
              </MotionDiv>
            </form>

            {/* Success Animation */}
            {isSuccess && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-green-500/10 backdrop-blur-sm rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
                  <p className="text-green-700 dark:text-green-400 font-medium">Connexion réussie !</p>
                </div>
              </MotionDiv>
            )}
          </CardContent>
        </MotionCard>
      </MotionDiv>
    </div>
  )
}
