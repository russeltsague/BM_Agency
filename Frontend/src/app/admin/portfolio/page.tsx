'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  Trash2,
  MoreHorizontal,
  Calendar,
  Image as ImageIcon,
  Edit,
} from 'lucide-react'
import { realisationsAPI } from '@/lib/api'
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

// Portfolio form schema
const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  client: z.string().min(1, 'Client name is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
}).transform((data) => ({
  ...data,
  featured: data.featured ?? false,
}))

type PortfolioForm = z.infer<typeof portfolioSchema>

interface Portfolio {
  _id: string
  title: string
  description: string
  client?: string
  category?: string
  tags?: string[]
  link?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPortfolio() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PortfolioForm>({
    resolver: zodResolver(portfolioSchema),
  })

  // Fetch portfolio
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      try {
        const response = await realisationsAPI.getAll()
        return Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Failed to fetch portfolio:', error)
        return []
      }
    },
  })

  // Ensure portfolio is always an array
  const portfolioArray = Array.isArray(portfolio) ? portfolio : []

  // Filter portfolio based on search
  const filteredPortfolio = portfolioArray.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.client && item.client.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Create portfolio mutation
  const createMutation = useMutation({
    mutationFn: async (data: PortfolioForm) => {
      const portfolioData = {
        title: data.title,
        description: data.description,
        client: data.client,
        category: data.category,
        tags: data.tags.split(',').map(t => t.trim()),
        link: data.link,
        featured: data.featured,
      }
      const response = await realisationsAPI.create(portfolioData)
      return response.data.realisation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Project created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project')
    },
  })

  // Update portfolio mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioForm }) => {
      const portfolioData = {
        title: data.title,
        description: data.description,
        client: data.client,
        category: data.category,
        tags: data.tags.split(',').map(t => t.trim()),
        link: data.link,
        featured: data.featured,
      }
      const response = await realisationsAPI.update(id, portfolioData)
      return response.data.realisation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsEditModalOpen(false)
      setSelectedPortfolio(null)
      reset()
      toast.success('Project updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update project')
    },
  })

  // Delete portfolio mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await realisationsAPI.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
      setIsDeleteModalOpen(false)
      setSelectedPortfolio(null)
      toast.success('Project deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete project')
    },
  })

  const handleCreate = (data: PortfolioForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setValue('title', portfolio.title)
    setValue('description', portfolio.description)
    setValue('client', portfolio.client || '')
    setValue('category', portfolio.category || '')
    setValue('tags', portfolio.tags?.join(', ') || '')
    setValue('link', portfolio.link || '')
    setValue('featured', portfolio.featured || false)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: PortfolioForm) => {
    if (selectedPortfolio) {
      updateMutation.mutate({ id: selectedPortfolio._id, data })
    }
  }

  const handleDelete = () => {
    if (selectedPortfolio) {
      deleteMutation.mutate(selectedPortfolio._id)
    }
  }

  const openDeleteModal = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio Management</h1>
              <p className="text-slate-300 text-lg">Présentez vos projets et études de cas</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <ImageIcon className="h-5 w-5" />
                <span>{filteredPortfolio.length} Projets</span>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un Projet
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
              placeholder="Rechercher des projets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Portfolio Table */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Projets Portfolio ({filteredPortfolio.length})</CardTitle>
          <CardDescription className="text-slate-400">
            Gérez tous vos projets portfolio et études de cas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : (
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 border-slate-700">
                    <TableHead className="text-slate-300 font-semibold">Titre</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Client</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Date</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Tags</TableHead>
                    <TableHead className="text-slate-300 font-semibold">En Vedette</TableHead>
                    <TableHead className="text-slate-300 font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredPortfolio.map((item) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          <div>
                            <div className="font-semibold text-lg">{item.title}</div>
                            <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{item.client}</TableCell>
                        <TableCell className="text-slate-300">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3 text-slate-400" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags && item.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.featured ? (
                            <Badge className="bg-green-100 text-green-800">En Vedette</Badge>
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
                                onClick={() => handleEdit(item)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(item)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new portfolio project to showcase your work.
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., E-commerce, Application Mobile, Site Web"
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
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
                {...register('link')}
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
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
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  {...register('category')}
                  placeholder="e.g., E-commerce, Application Mobile, Site Web"
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
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
                {...register('link')}
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
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
