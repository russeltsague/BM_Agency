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
  Users,
  Star,
  Quote
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

// Testimonial form schema
const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  rating: z.number().min(1).max(5),
  featured: z.boolean(),
  published: z.boolean(),
}).transform((data) => ({
  ...data,
  featured: data.featured ?? false,
  published: data.published ?? false,
}))

type TestimonialForm = z.infer<typeof testimonialSchema>

interface Testimonial {
  id: string
  name: string
  company: string
  position: string
  message: string
  rating: number
  featured: boolean
  published: boolean
  photo?: string
  createdAt: string
  updatedAt: string
}

// Mock data - replace with real API
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jean-Pierre Ndiaye',
    company: 'Société Générale Cameroun',
    position: 'Directeur Marketing',
    message: 'BM Agency nous a accompagnés dans notre transformation digitale avec un professionnalisme exemplaire. Leur expertise et leur réactivité ont dépassé nos attentes.',
    rating: 5,
    featured: true,
    published: true,
    photo: '/images/testimonial-1.jpg',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Fatou Sow',
    company: 'MTN Cameroon',
    position: 'Chef de Projet Digital',
    message: 'Excellente collaboration ! L\'équipe de BM Agency comprend parfaitement les enjeux du marché camerounais et propose des solutions adaptées.',
    rating: 5,
    featured: true,
    published: true,
    photo: '/images/testimonial-2.jpg',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '3',
    name: 'Paul Mbarga',
    company: 'Orange Cameroun',
    position: 'Responsable Communication',
    message: 'Un partenaire de confiance pour notre stratégie digitale. Excellent travail sur notre plateforme e-commerce !',
    rating: 5,
    featured: false,
    published: true,
    photo: '/images/testimonial-3.jpg',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
]

export default function AdminTestimonials() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
  })

  // Fetch testimonials
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockTestimonials
    },
  })

  // Ensure testimonials is always an array
  const testimonialsArray = Array.isArray(testimonials) ? testimonials : []

  // Filter testimonials based on search
  const filteredTestimonials = testimonialsArray.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: async (data: TestimonialForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        ...data,
        photo: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newTestimonial
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Testimonial created successfully!')
    },
    onError: () => {
      toast.error('Failed to create testimonial')
    },
  })

  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialForm }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      setIsEditModalOpen(false)
      setSelectedTestimonial(null)
      reset()
      toast.success('Testimonial updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update testimonial')
    },
  })

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      setIsDeleteModalOpen(false)
      setSelectedTestimonial(null)
      toast.success('Testimonial deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete testimonial')
    },
  })

  const handleCreate = (data: TestimonialForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setValue('name', testimonial.name)
    setValue('company', testimonial.company)
    setValue('position', testimonial.position)
    setValue('message', testimonial.message)
    setValue('rating', testimonial.rating)
    setValue('featured', testimonial.featured)
    setValue('published', testimonial.published)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: TestimonialForm) => {
    if (selectedTestimonial) {
      updateMutation.mutate({ id: selectedTestimonial.id, data })
    }
  }

  const handleDelete = () => {
    if (selectedTestimonial) {
      deleteMutation.mutate(selectedTestimonial.id)
    }
  }

  const openDeleteModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsDeleteModalOpen(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-900 via-slate-800 to-red-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Témoignages Management</h1>
              <p className="text-slate-300 text-lg">Gérez les témoignages et avis clients</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Users className="h-5 w-5" />
                <span>{filteredTestimonials.length} Témoignages</span>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter
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
              placeholder="Rechercher des témoignages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Testimonials Table */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Témoignages ({filteredTestimonials.length})</CardTitle>
          <CardDescription className="text-slate-400">
            Gérez tous vos témoignages clients et leurs détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            </div>
          ) : (
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 border-slate-700">
                    <TableHead className="text-slate-300 font-semibold">Client</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Entreprise</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Évaluation</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Statut</TableHead>
                    <TableHead className="text-slate-300 font-semibold">En vedette</TableHead>
                    <TableHead className="text-slate-300 font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTestimonials.map((testimonial) => (
                      <motion.tr
                        key={testimonial.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          <div>
                            <div className="font-semibold text-lg">{testimonial.name}</div>
                            <div className="text-sm text-slate-400">
                              {testimonial.position}
                            </div>
                            <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                              <Quote className="inline h-3 w-3 mr-1" />
                              "{testimonial.message.substring(0, 60)}..."
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{testimonial.company}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {renderStars(testimonial.rating)}
                            <span className="ml-2 text-sm text-slate-400">({testimonial.rating}/5)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              testimonial.published ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <span className="text-sm text-slate-300">
                              {testimonial.published ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {testimonial.featured ? (
                            <Badge className="bg-orange-100 text-orange-800">En vedette</Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-600 text-slate-300">Standard</Badge>
                          )}
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
                                onClick={() => handleEdit(testimonial)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(testimonial)}
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
            <DialogTitle className="text-white">Ajouter un Nouveau Témoignage</DialogTitle>
            <DialogDescription className="text-slate-300">
              Ajoutez un nouveau témoignage client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Nom Complet</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="ex: Jean-Pierre Ndiaye"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-slate-300">Entreprise</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="ex: Société Générale Cameroun"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.company && (
                  <p className="text-sm text-red-400 mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position" className="text-slate-300">Poste</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="ex: Directeur Marketing"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.position && (
                  <p className="text-sm text-red-400 mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rating" className="text-slate-300">Évaluation</Label>
                <select
                  id="rating"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="">Sélectionner une note</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 étoiles)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 étoiles)</option>
                  <option value={3}>⭐⭐⭐ (3 étoiles)</option>
                  <option value={2}>⭐⭐ (2 étoiles)</option>
                  <option value={1}>⭐ (1 étoile)</option>
                </select>
                {errors.rating && (
                  <p className="text-sm text-red-400 mt-1">{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-slate-300">Message du Témoignage</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Partagez le message du témoignage client..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
              />
              {errors.message && (
                <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-6 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="featured" className="text-slate-300">Marquer comme témoignage en vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="published" className="text-slate-300">Publier immédiatement</Label>
              </div>
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
              <Button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-700">
                {createMutation.isPending ? 'Création...' : 'Créer le Témoignage'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le Témoignage</DialogTitle>
            <DialogDescription className="text-slate-300">
              Mettez à jour les informations du témoignage.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-slate-300">Nom Complet</Label>
                <Input
                  id="edit-name"
                  {...register('name')}
                  placeholder="ex: Jean-Pierre Ndiaye"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-company" className="text-slate-300">Entreprise</Label>
                <Input
                  id="edit-company"
                  {...register('company')}
                  placeholder="ex: Société Générale Cameroun"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.company && (
                  <p className="text-sm text-red-400 mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-position" className="text-slate-300">Poste</Label>
                <Input
                  id="edit-position"
                  {...register('position')}
                  placeholder="ex: Directeur Marketing"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
                />
                {errors.position && (
                  <p className="text-sm text-red-400 mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-rating" className="text-slate-300">Évaluation</Label>
                <select
                  id="edit-rating"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="">Sélectionner une note</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 étoiles)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 étoiles)</option>
                  <option value={3}>⭐⭐⭐ (3 étoiles)</option>
                  <option value={2}>⭐⭐ (2 étoiles)</option>
                  <option value={1}>⭐ (1 étoile)</option>
                </select>
                {errors.rating && (
                  <p className="text-sm text-red-400 mt-1">{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-message" className="text-slate-300">Message du Témoignage</Label>
              <Textarea
                id="edit-message"
                {...register('message')}
                placeholder="Partagez le message du témoignage client..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-400"
              />
              {errors.message && (
                <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-6 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  {...register('featured')}
                  className="rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="edit-featured" className="text-slate-300">Marquer comme témoignage en vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  {...register('published')}
                  className="rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="edit-published" className="text-slate-300">Publier immédiatement</Label>
              </div>
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
              <Button type="submit" disabled={updateMutation.isPending} className="bg-orange-600 hover:bg-orange-700">
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
            <DialogTitle className="text-white">Supprimer le Témoignage</DialogTitle>
            <DialogDescription className="text-slate-300">
              Êtes-vous sûr de vouloir supprimer le témoignage de "{selectedTestimonial?.name}" ? Cette action ne peut pas être annulée.
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
