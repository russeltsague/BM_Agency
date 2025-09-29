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
    message: 'Camer Digital Agency nous a accompagnés dans notre transformation digitale avec un professionnalisme exemplaire. Leur expertise et leur réactivité ont dépassé nos attentes.',
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
    message: 'Excellente collaboration ! L\'équipe de Camer Digital Agency comprend parfaitement les enjeux du marché camerounais et propose des solutions adaptées.',
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

  // Filter testimonials based on search
  const filteredTestimonials = testimonials.filter(testimonial =>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
          <CardDescription>
            Manage all customer testimonials and their details.
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
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
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">
                            {testimonial.position}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                            "{testimonial.message.substring(0, 80)}..."
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{testimonial.company}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {renderStars(testimonial.rating)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            testimonial.published ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm">
                            {testimonial.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {testimonial.featured ? (
                          <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(testimonial)}
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
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Add a new customer testimonial or review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Jean-Pierre Ndiaye"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="e.g., Société Générale Cameroun"
                />
                {errors.company && (
                  <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="e.g., Directeur Marketing"
                />
                {errors.position && (
                  <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <select
                  id="rating"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select rating</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                  <option value={3}>⭐⭐⭐ (3 stars)</option>
                  <option value={2}>⭐⭐ (2 stars)</option>
                  <option value={1}>⭐ (1 star)</option>
                </select>
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="message">Testimonial Message</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Share the customer's testimonial message..."
                rows={4}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Mark as featured testimonial</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
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
                {createMutation.isPending ? 'Creating...' : 'Create Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  {...register('name')}
                  placeholder="e.g., Jean-Pierre Ndiaye"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  {...register('company')}
                  placeholder="e.g., Société Générale Cameroun"
                />
                {errors.company && (
                  <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  {...register('position')}
                  placeholder="e.g., Directeur Marketing"
                />
                {errors.position && (
                  <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <select
                  id="edit-rating"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select rating</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                  <option value={3}>⭐⭐⭐ (3 stars)</option>
                  <option value={2}>⭐⭐ (2 stars)</option>
                  <option value={1}>⭐ (1 star)</option>
                </select>
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-message">Testimonial Message</Label>
              <Textarea
                id="edit-message"
                {...register('message')}
                placeholder="Share the customer's testimonial message..."
                rows={4}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  {...register('featured')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-featured">Mark as featured testimonial</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  {...register('published')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-published">Publish immediately</Label>
              </div>
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
                {updateMutation.isPending ? 'Updating...' : 'Update Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimonial from "{selectedTestimonial?.name}"? This action cannot be undone.
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
