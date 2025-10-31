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
  ImageIcon,
  Edit,
} from 'lucide-react'
import { realisationsAPI } from '@/lib/api'
import Image from 'next/image'
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
  image: z.string().optional(),
  link: z.string().optional(),
  featured: z.boolean().optional(),
})

type PortfolioForm = z.infer<typeof portfolioSchema>

interface Portfolio {
  _id: string
  title: string
  description: string
  client?: string
  category?: string
  tags?: string[]
  image?: string
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
  const [imagePreview, setImagePreview] = useState<string>('')
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
        tags: data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        image: data.image || 'https://via.placeholder.com/800x600/4B5563/9CA3AF?text=No+Image',
        link: data.link || undefined,
        featured: data.featured ?? false,
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
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
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
        tags: data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        image: data.image || 'https://via.placeholder.com/800x600/4B5563/9CA3AF?text=No+Image',
        link: data.link || undefined,
        featured: data.featured ?? false,
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
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update project')
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
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete project')
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
    setValue('image', portfolio.image || 'https://via.placeholder.com/800x600/4B5563/9CA3AF?text=No+Image')
    setValue('link', portfolio.link || '')
    setValue('featured', portfolio.featured || false)
    setImagePreview(portfolio.image || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image')
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: PortfolioForm) => {
    if (selectedPortfolio) {
      updateMutation.mutate({ id: selectedPortfolio._id, data })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setValue('image', result)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      toast.error('File size too large. Please select an image smaller than 5MB.')
    }
  }

  const openDeleteModal = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (selectedPortfolio) {
      deleteMutation.mutate(selectedPortfolio._id)
    }
  }

  const resetImagePreview = () => {
    setImagePreview('https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image')
    setValue('image', 'https://via.placeholder.com/800x600/4B5563/9CA3AF?text=No+Image')
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
                    <TableHead className="text-slate-300 font-semibold">Image</TableHead>
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
                        <TableCell className="w-20">
                          <Image
                            src={item.image || 'https://via.placeholder.com/64x64/4B5563/9CA3AF?text=No+Image'}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg border border-slate-600"
                          />
                        </TableCell>
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
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Add New Project</DialogTitle>
            <DialogDescription className="text-slate-300">
              Create a new portfolio project to showcase your work.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-slate-300 text-lg font-medium">Project Image</Label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={imagePreview || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image'}
                    alt="Project preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={resetImagePreview}
                  >
                    <ImageIcon className="h-4 w-4 text-slate-300" />
                  </Button>
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Choose Image
                  </Label>
                  <p className="text-sm text-slate-400 mt-2">
                    Recommended: 800x600px, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-slate-300 font-medium">Project Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Plateforme E-commerce Mode Africaine"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="client" className="text-slate-300 font-medium">Client</Label>
                <Input
                  id="client"
                  {...register('client')}
                  placeholder="e.g., Maison de la Mode Africaine"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.client && (
                  <p className="text-sm text-red-400 mt-1">{errors.client.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the project in detail..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="text-slate-300 font-medium">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., E-commerce, Application Mobile, Site Web"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.category && (
                  <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tags" className="text-slate-300 font-medium">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="e.g., React, Node.js, MTN MoMo, SEO"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.tags && (
                  <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="link" className="text-slate-300 font-medium">Project Link (optional)</Label>
                <Input
                  id="link"
                  {...register('link')}
                  placeholder="https://example.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.link && (
                  <p className="text-sm text-red-400 mt-1">{errors.link.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                />
                <Label htmlFor="featured" className="text-slate-300 font-medium">
                  Featured Project
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  reset()
                  setImagePreview('')
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                {createMutation.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Edit Project</DialogTitle>
            <DialogDescription className="text-slate-300">
              Update the project information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-slate-300 text-lg font-medium">Project Image</Label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={imagePreview || selectedPortfolio?.image || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image'}
                    alt="Project preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={resetImagePreview}
                  >
                    <ImageIcon className="h-4 w-4 text-slate-300" />
                  </Button>
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <Label
                    htmlFor="edit-image-upload"
                    className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Choose New Image
                  </Label>
                  <p className="text-sm text-slate-400 mt-2">
                    Recommended: 800x600px, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-title" className="text-slate-300 font-medium">Project Title</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="e.g., Plateforme E-commerce Mode Africaine"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-client" className="text-slate-300 font-medium">Client</Label>
                <Input
                  id="edit-client"
                  {...register('client')}
                  placeholder="e.g., Maison de la Mode Africaine"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.client && (
                  <p className="text-sm text-red-400 mt-1">{errors.client.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-slate-300 font-medium">Description</Label>
              <Textarea
                id="edit-description"
                {...register('description')}
                placeholder="Describe the project in detail..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-category" className="text-slate-300 font-medium">Category</Label>
                <Input
                  id="edit-category"
                  {...register('category')}
                  placeholder="e.g., E-commerce, Application Mobile, Site Web"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.category && (
                  <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-tags" className="text-slate-300 font-medium">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  {...register('tags')}
                  placeholder="e.g., React, Node.js, MTN MoMo, SEO"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.tags && (
                  <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-link" className="text-slate-300 font-medium">Project Link (optional)</Label>
                <Input
                  id="edit-link"
                  {...register('link')}
                  placeholder="https://example.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400"
                />
                {errors.link && (
                  <p className="text-sm text-red-400 mt-1">{errors.link.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="edit-featured"
                  {...register('featured')}
                  className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                />
                <Label htmlFor="edit-featured" className="text-slate-300 font-medium">
                  Featured Project
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedPortfolio(null)
                  reset()
                  setImagePreview('')
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                {updateMutation.isPending ? 'Updating...' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to delete &quot;{selectedPortfolio?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
