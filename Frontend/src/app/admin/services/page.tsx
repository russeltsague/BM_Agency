'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { servicesAPI } from '@/lib/api'

// Service form schema
const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.string().min(1, 'Features are required'),
  pricing: z.string().optional(),
  duration: z.string().optional(),
  caseStudy: z.string().optional(),
  icon: z.string().optional(),
})

type ServiceForm = z.infer<typeof serviceSchema>

interface Service {
  _id: string
  title: string
  description: string
  features: string[]
  pricing?: string
  duration?: string
  caseStudy?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  })

  // Check authentication on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('admin-token')
    const user = localStorage.getItem('admin-user')

    if (!token || !user) {
      toast.error('Authentication required', {
        description: 'Please log in to access the admin panel.',
        duration: 4000,
      })
      router.push('/admin/login')
      return
    }

    // Validate token format
    try {
      JSON.parse(user)
    } catch {
      toast.error('Invalid session', {
        description: 'Please log in again.',
        duration: 4000,
      })
      localStorage.removeItem('admin-token')
      localStorage.removeItem('admin-user')
      router.push('/admin/login')
      return
    }
  }, [router])

  // Fetch services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      try {
        const response = await servicesAPI.getAll()
        // Ensure we return an array
        return Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Failed to fetch services:', error)
        return []
      }
    },
  })

  // Ensure services is always an array
  const servicesArray = Array.isArray(services) ? services : []

  // Filter services based on search
  const filteredServices = servicesArray.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create service mutation
  const createMutation = useMutation({
    mutationFn: async (data: ServiceForm) => {
      const serviceData = {
        title: data.title,
        description: data.description,
        features: data.features.split(',').map(f => f.trim()),
        pricing: data.pricing,
        duration: data.duration,
        caseStudy: data.caseStudy,
        icon: data.icon,
      }
      const response = await servicesAPI.create(serviceData)
      return response.data.service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Service created successfully!')
    },
    onError: (error: unknown) => {
      console.error('Create service error:', error)
      if (error instanceof Error && (error.message?.includes('token') || error.message?.includes('session') || error.message?.includes('login'))) {
        toast.error('Authentication expired', {
          description: 'Please log in again to continue.',
          duration: 4000,
        })
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to create service')
      }
    },
  })

  // Update service mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceForm }) => {
      const serviceData = {
        title: data.title,
        description: data.description,
        features: data.features.split(',').map(f => f.trim()),
        pricing: data.pricing,
        duration: data.duration,
        caseStudy: data.caseStudy,
        icon: data.icon,
      }
      const response = await servicesAPI.update(id, serviceData)
      return response.data.service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsEditModalOpen(false)
      setSelectedService(null)
      reset()
      toast.success('Service updated successfully!')
    },
    onError: (error: unknown) => {
      console.error('Update service error:', error)
      if (error instanceof Error && (error.message?.includes('token') || error.message?.includes('session') || error.message?.includes('login'))) {
        toast.error('Authentication expired', {
          description: 'Please log in again to continue.',
          duration: 4000,
        })
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to update service')
      }
    },
  })

  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await servicesAPI.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsDeleteModalOpen(false)
      setSelectedService(null)
      toast.success('Service deleted successfully!')
    },
    onError: (error: unknown) => {
      console.error('Delete service error:', error)
      if (error instanceof Error && (error.message?.includes('token') || error.message?.includes('session') || error.message?.includes('login'))) {
        toast.error('Authentication expired', {
          description: 'Please log in again to continue.',
          duration: 4000,
        })
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to delete service')
      }
    },
  })

  const handleCreate = (data: ServiceForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setValue('title', service.title)
    setValue('description', service.description)
    setValue('features', service.features.join(', '))
    setValue('pricing', service.pricing)
    setValue('duration', service.duration)
    setValue('caseStudy', service.caseStudy)
    setValue('icon', service.icon)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: ServiceForm) => {
    if (selectedService) {
      updateMutation.mutate({ id: selectedService._id, data })
    }
  }

  const handleDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService._id)
    }
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Services Management</h1>
              <p className="text-slate-300 text-lg">Créez et gérez vos offres de services digitaux</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Settings className="h-5 w-5" />
                <span>{filteredServices.length} Services</span>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Rechercher des services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Services Table */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Services ({filteredServices.length})</CardTitle>
          <CardDescription className="text-slate-400">
            Gérez tous vos services digitaux et leurs détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 border-slate-700">
                    <TableHead className="text-slate-300 font-semibold">Service</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Tarification</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Durée</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Étude de Cas</TableHead>
                    <TableHead className="text-slate-300 font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredServices.map((service) => (
                      <motion.tr
                        key={service._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          <div>
                            <div className="font-semibold text-lg">{service.title}</div>
                            <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                              {service.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {service.features?.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                  {feature}
                                </Badge>
                              ))}
                              {service.features && service.features.length > 2 && (
                                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                  +{service.features.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="font-medium text-green-400">{service.pricing}</div>
                        </TableCell>
                        <TableCell className="text-slate-300">{service.duration}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {service.caseStudy}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-700">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem
                                onClick={() => handleEdit(service)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(service)}
                                className="text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Ajouter un Nouveau Service</DialogTitle>
            <DialogDescription className="text-slate-300">
              Créez une nouvelle offre de service digital.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-300">Titre du Service</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="ex: Communication Digitale"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.title && (
                <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Décrivez le service en détail..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="features" className="text-slate-300">Fonctionnalités (séparées par des virgules)</Label>
              <Input
                id="features"
                {...register('features')}
                placeholder="ex: Community Management, Publicité digitale, Relations presse"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.features && (
                <p className="text-sm text-red-400 mt-1">{errors.features.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricing" className="text-slate-300">Tarification</Label>
                <Input
                  id="pricing"
                  {...register('pricing')}
                  placeholder="ex: À partir de 250 000 FCFA/mois"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
                {errors.pricing && (
                  <p className="text-sm text-red-400 mt-1">{errors.pricing.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration" className="text-slate-300">Durée</Label>
                <Input
                  id="duration"
                  {...register('duration')}
                  placeholder="ex: 6-12 mois"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
                {errors.duration && (
                  <p className="text-sm text-red-400 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="caseStudy" className="text-slate-300">Étude de Cas</Label>
              <Input
                id="caseStudy"
                {...register('caseStudy')}
                placeholder="ex: E-commerce +300% trafic social"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.caseStudy && (
                <p className="text-sm text-red-400 mt-1">{errors.caseStudy.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {createMutation.isPending ? 'Création...' : 'Créer le Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le Service</DialogTitle>
            <DialogDescription className="text-slate-300">
              Mettez à jour les informations du service.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-slate-300">Titre du Service</Label>
              <Input
                id="edit-title"
                {...register('title')}
                placeholder="ex: Communication Digitale"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.title && (
                <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-slate-300">Description</Label>
              <Textarea
                id="edit-description"
                {...register('description')}
                placeholder="Décrivez le service en détail..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-features" className="text-slate-300">Fonctionnalités (séparées par des virgules)</Label>
              <Input
                id="edit-features"
                {...register('features')}
                placeholder="ex: Community Management, Publicité digitale, Relations presse"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.features && (
                <p className="text-sm text-red-400 mt-1">{errors.features.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pricing" className="text-slate-300">Tarification</Label>
                <Input
                  id="edit-pricing"
                  {...register('pricing')}
                  placeholder="ex: À partir de 250 000 FCFA/mois"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
                {errors.pricing && (
                  <p className="text-sm text-red-400 mt-1">{errors.pricing.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-duration" className="text-slate-300">Durée</Label>
                <Input
                  id="edit-duration"
                  {...register('duration')}
                  placeholder="ex: 6-12 mois"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
                {errors.duration && (
                  <p className="text-sm text-red-400 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-caseStudy" className="text-slate-300">Étude de Cas</Label>
              <Input
                id="edit-caseStudy"
                {...register('caseStudy')}
                placeholder="ex: E-commerce +300% trafic social"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              {errors.caseStudy && (
                <p className="text-sm text-red-400 mt-1">{errors.caseStudy.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {updateMutation.isPending ? 'Mise à jour...' : 'Mettre à Jour'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Supprimer le Service</DialogTitle>
            <DialogDescription className="text-slate-300">
              Êtes-vous sûr de vouloir supprimer &quot;{selectedService?.title}&quot; ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
