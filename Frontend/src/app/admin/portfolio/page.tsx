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
  Image as ImageIcon,
  Calendar,
  ExternalLink
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

// Portfolio form schema
const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  client: z.string().min(1, 'Client name is required'),
  date: z.string().min(1, 'Date is required'),
  tags: z.string().min(1, 'Tags are required'),
  link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
}).transform((data) => ({
  ...data,
  featured: data.featured ?? false,
}))

type PortfolioForm = z.infer<typeof portfolioSchema>

interface Portfolio {
  id: string
  title: string
  description: string
  client: string
  date: string
  tags: string[]
  link?: string
  featured: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

// Mock data - replace with real API
const mockPortfolio: Portfolio[] = [
  {
    id: '1',
    title: 'Plateforme E-commerce Mode Africaine',
    description: 'Refonte complète d\'une plateforme e-commerce spécialisée dans la mode africaine avec optimisation UX/UI et intégration de solutions de paiement locales.',
    client: 'Maison de la Mode Africaine',
    date: '2024-01-15',
    tags: ['React', 'Node.js', 'MTN MoMo', 'SEO'],
    link: 'https://maison-mode-africaine.cm',
    featured: true,
    images: ['/images/portfolio-1.jpg'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Application Mobile Bancaire',
    description: 'Développement d\'une application mobile bancaire avec authentification biométrique et gestion des comptes en temps réel pour les clients camerounais.',
    client: 'Banque Atlantique Cameroun',
    date: '2024-01-10',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Biometric'],
    featured: true,
    images: ['/images/portfolio-2.jpg'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
]

export default function AdminPortfolio() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
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
  } = useForm<PortfolioForm>({
    resolver: zodResolver(portfolioSchema),
  })

  // Fetch portfolio items
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockPortfolio
    },
  })

  // Filter portfolio based on search
  const filteredPortfolio = portfolio.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create portfolio mutation
  const createMutation = useMutation({
    mutationFn: async (data: PortfolioForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        ...data,
        tags: data.tags.split(',').map(t => t.trim()),
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newPortfolio
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Portfolio item created successfully!')
    },
    onError: () => {
      toast.error('Failed to create portfolio item')
    },
  })

  // Update portfolio mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioForm }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data, tags: data.tags.split(',').map(t => t.trim()) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsEditModalOpen(false)
      setSelectedPortfolio(null)
      reset()
      toast.success('Portfolio item updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update portfolio item')
    },
  })

  // Delete portfolio mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsDeleteModalOpen(false)
      setSelectedPortfolio(null)
      toast.success('Portfolio item deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete portfolio item')
    },
  })

  const handleCreate = (data: PortfolioForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setValue('title', portfolio.title)
    setValue('description', portfolio.description)
    setValue('client', portfolio.client)
    setValue('date', portfolio.date)
    setValue('tags', portfolio.tags.join(', '))
    setValue('link', portfolio.link || '')
    setValue('featured', portfolio.featured)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: PortfolioForm) => {
    if (selectedPortfolio) {
      updateMutation.mutate({ id: selectedPortfolio.id, data })
    }
  }

  const handleDelete = () => {
    if (selectedPortfolio) {
      deleteMutation.mutate(selectedPortfolio.id)
    }
  }

  const openDeleteModal = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your projects and case studies.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Projects ({filteredPortfolio.length})</CardTitle>
          <CardDescription>
            Manage all your portfolio projects and case studies.
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
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredPortfolio.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-gray-400" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.featured ? (
                          <Badge className="bg-green-100 text-green-800">Featured</Badge>
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
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(item)}
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
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new portfolio project or case study.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Plateforme E-commerce Mode Africaine"
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
                placeholder="Describe the project in detail..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  {...register('client')}
                  placeholder="e.g., Maison de la Mode Africaine"
                />
                {errors.client && (
                  <p className="text-sm text-red-600 mt-1">{errors.client.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="e.g., React, Node.js, MTN MoMo, SEO"
              />
              {errors.tags && (
                <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="link">Project Link (optional)</Label>
              <Input
                id="link"
                type="url"
                {...register('link')}
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Mark as featured project</Label>
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
                {createMutation.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Project Title</Label>
              <Input
                id="edit-title"
                {...register('title')}
                placeholder="e.g., Plateforme E-commerce Mode Africaine"
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
                placeholder="Describe the project in detail..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-client">Client</Label>
                <Input
                  id="edit-client"
                  {...register('client')}
                  placeholder="e.g., Maison de la Mode Africaine"
                />
                {errors.client && (
                  <p className="text-sm text-red-600 mt-1">{errors.client.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                {...register('tags')}
                placeholder="e.g., React, Node.js, MTN MoMo, SEO"
              />
              {errors.tags && (
                <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-link">Project Link (optional)</Label>
              <Input
                id="edit-link"
                type="url"
                {...register('link')}
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                {...register('featured')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-featured">Mark as featured project</Label>
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
                {updateMutation.isPending ? 'Updating...' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPortfolio?.title}"? This action cannot be undone.
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
