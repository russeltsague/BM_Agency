'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { toast } from 'react-hot-toast'

// Service form schema
const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.string().min(1, 'Features are required'),
  pricing: z.string().min(1, 'Pricing is required'),
  duration: z.string().min(1, 'Duration is required'),
  caseStudy: z.string().min(1, 'Case study is required'),
})

type ServiceForm = z.infer<typeof serviceSchema>

interface Service {
  id: string
  title: string
  description: string
  features: string[]
  pricing: string
  duration: string
  caseStudy: string
  createdAt: string
  updatedAt: string
}

// Mock data - replace with real API
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Communication Digitale',
    description: 'Stratégies de communication globale et digitale pour développer votre présence en ligne et engager votre audience camerounaise.',
    features: ['Community Management', 'Publicité digitale', 'Relations presse digitales'],
    pricing: 'À partir de 250 000 FCFA/mois',
    duration: '6-12 mois',
    caseStudy: 'E-commerce +300% trafic social',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Marketing Digital',
    description: 'Optimisation de votre visibilité et acquisition de nouveaux clients sur le web avec des stratégies data-driven adaptées au marché camerounais.',
    features: ['SEO/SEA avancé', 'Marketing automation', 'Analytics'],
    pricing: 'À partir de 300 000 FCFA/mois',
    duration: '3-6 mois',
    caseStudy: 'E-commerce +400% conversions',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
]

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  })

  // Fetch services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockServices
    },
  })

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create service mutation
  const createMutation = useMutation({
    mutationFn: async (data: ServiceForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newService: Service = {
        id: Date.now().toString(),
        ...data,
        features: data.features.split(',').map(f => f.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newService
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Service created successfully!')
    },
    onError: () => {
      toast.error('Failed to create service')
    },
  })

  // Update service mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceForm }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data, features: data.features.split(',').map(f => f.trim()) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsEditModalOpen(false)
      setSelectedService(null)
      reset()
      toast.success('Service updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update service')
    },
  })

  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setIsDeleteModalOpen(false)
      setSelectedService(null)
      toast.success('Service deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete service')
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
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: ServiceForm) => {
    if (selectedService) {
      updateMutation.mutate({ id: selectedService.id, data })
    }
  }

  const handleDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id)
    }
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600">Manage your digital services and offerings.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
          <CardDescription>
            Manage all your digital services and their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Case Study</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredServices.map((service) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{service.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {service.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{service.pricing}</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.caseStudy}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(service)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(service)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new digital service offering.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Communication Digitale"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the service in detail..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                {...register('features')}
                placeholder="e.g., Community Management, Publicité digitale, Relations presse"
              />
              {errors.features && (
                <p className="text-sm text-red-600 mt-1">{errors.features.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricing">Pricing</Label>
                <Input
                  id="pricing"
                  {...register('pricing')}
                  placeholder="e.g., À partir de 250 000 FCFA/mois"
                />
                {errors.pricing && (
                  <p className="text-sm text-red-600 mt-1">{errors.pricing.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...register('duration')}
                  placeholder="e.g., 6-12 mois"
                />
                {errors.duration && (
                  <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="caseStudy">Case Study</Label>
              <Input
                id="caseStudy"
                {...register('caseStudy')}
                placeholder="e.g., E-commerce +300% trafic social"
              />
              {errors.caseStudy && (
                <p className="text-sm text-red-600 mt-1">{errors.caseStudy.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Service Title</Label>
              <Input
                id="edit-title"
                {...register('title')}
                placeholder="e.g., Communication Digitale"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...register('description')}
                placeholder="Describe the service in detail..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-features">Features (comma-separated)</Label>
              <Input
                id="edit-features"
                {...register('features')}
                placeholder="e.g., Community Management, Publicité digitale, Relations presse"
              />
              {errors.features && (
                <p className="text-sm text-red-600 mt-1">{errors.features.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pricing">Pricing</Label>
                <Input
                  id="edit-pricing"
                  {...register('pricing')}
                  placeholder="e.g., À partir de 250 000 FCFA/mois"
                />
                {errors.pricing && (
                  <p className="text-sm text-red-600 mt-1">{errors.pricing.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  {...register('duration')}
                  placeholder="e.g., 6-12 mois"
                />
                {errors.duration && (
                  <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-caseStudy">Case Study</Label>
              <Input
                id="edit-caseStudy"
                {...register('caseStudy')}
                placeholder="e.g., E-commerce +300% trafic social"
              />
              {errors.caseStudy && (
                <p className="text-sm text-red-600 mt-1">{errors.caseStudy.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedService?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
