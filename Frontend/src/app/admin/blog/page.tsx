'use client'

import { useState } from 'react'
import { Author } from '@/types/article'
import type { Article } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  FileText,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { articlesAPI } from '@/lib/api'
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
import { toast } from 'sonner'

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

// Blog form schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  featured: z.boolean(),
  published: z.boolean(),
})

type BlogForm = z.infer<typeof blogSchema>

interface Blog extends Omit<Article, 'stateHistory'> {
  // Define stateHistory with the expected type
  stateHistory?: Array<{
    from: string;
    to: string;
    timestamp: string;
    changedBy: string;
    reason?: string;
  }>;
}

export default function AdminBlog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
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
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  })

  // Watch content field for React Quill
  const content = watch('content')

  // Fetch blog posts
  const { data: blog = [], isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const response = await articlesAPI.getAll()
      return response?.data || []
    },
  })

  // Filter blog based on search
  const filteredBlog = blog.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author && typeof post.author === 'object' && 'name' in post.author
      ? (post.author as { name: string }).name
      : String(post.author)
    ).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Create blog mutation
  const createMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      try {
        const articleData = {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || undefined,
          category: data.category,
          tags: data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
          featured: data.featured,
          published: data.published,
        }
        const response = await articlesAPI.create(articleData)
        return response.data.article
      } catch (error: unknown) {
        console.error('Create blog error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to create blog post')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      setIsCreateModalOpen(false)
      resetForm()
      toast.success('Blog post created successfully!')
    },
    onError: (error: unknown) => {
      console.error('Create blog mutation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create blog post')
    },
  })

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogForm }) => {
      try {
        const articleData = {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || undefined,
          category: data.category,
          tags: data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
          featured: data.featured,
          published: data.published,
        }
        const response = await articlesAPI.update(id, articleData)
        return response.data.article
      } catch (error: unknown) {
        console.error('Update blog error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to update blog post')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      setIsEditModalOpen(false)
      resetForm()
      toast.success('Blog post updated successfully!')
    },
    onError: (error: unknown) => {
      console.error('Update blog mutation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update blog post')
    },
  })

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await articlesAPI.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      closeDeleteModal()
      toast.success('Blog post deleted successfully!')
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post')
    },
  })

  const handleCreate = (data: BlogForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (blog: Article) => {
    // Convert Article to Blog by ensuring stateHistory has the correct type
    const blogData: Blog = {
      ...blog,
      stateHistory: blog.stateHistory?.map(item => ({
        from: item.from || '',
        to: item.to || '',
        timestamp: item.timestamp,
        changedBy: item.changedBy,
        reason: item.reason
      })),
      author: typeof blog.author === 'string' ? blog.author : {
        name: blog.author?.name || '',
        email: blog.author?.email || ''
      },
      published: blog.published || false,
      featured: blog.featured || false,
      tags: blog.tags || [],
      category: blog.category || ''
    };
    
    setSelectedBlog(blogData);
    setValue('title', blog.title)
    setValue('excerpt', blog.excerpt || '')
    setValue('content', blog.content)
    setValue('category', blog.category || '')
    setValue('tags', blog.tags?.join(', ') || '')
    setValue('featured', blog.featured || false)
    setValue('published', blog.published || false)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: BlogForm) => {
    if (selectedBlog) {
      updateMutation.mutate({ id: selectedBlog._id, data })
    }
  }

  const handleDelete = () => {
    if (selectedBlog) {
      deleteMutation.mutate(selectedBlog._id)
    }
  }

  const openDeleteModal = (blog: Article) => {
    // Convert Article to Blog type
    const blogData: Blog = {
      ...blog,
      stateHistory: blog.stateHistory?.map(item => ({
        from: item.from || '',
        to: item.to || '',
        timestamp: item.timestamp,
        changedBy: item.changedBy,
        reason: item.reason
      })),
      author: typeof blog.author === 'string' ? blog.author : {
        name: blog.author?.name || '',
        email: blog.author?.email || ''
      },
      published: blog.published || false,
      featured: blog.featured || false,
      tags: blog.tags || [],
      category: blog.category || ''
    };
    setSelectedBlog(blogData);
    setIsDeleteModalOpen(true);
  }

  // Reset form and close modals
  const resetForm = () => {
    reset()
    setSelectedBlog(null)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    resetForm()
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    resetForm()
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedBlog(null)
  }

  // React Quill modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image'
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-slate-800 to-pink-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Blog Management</h1>
              <p className="text-slate-300 text-lg">Create and manage your blog content</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <FileText className="h-5 w-5" />
                <span>{filteredBlog.length} Articles</span>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-5 w-5" />
                New Article
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
              placeholder="Rechercher des articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Blog Table */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Articles de Blog ({filteredBlog.length})</CardTitle>
          <CardDescription className="text-slate-400">
            Gérez tous vos articles de blog et leur contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 border-slate-700">
                    <TableHead className="text-slate-300 font-semibold">Titre</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Auteur</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Catégorie</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Statut</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Temps de Lecture</TableHead>
                    <TableHead className="text-slate-300 font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredBlog.map((post) => (
                      <motion.tr
                        key={post._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          <div>
                            <div className="font-semibold text-lg">{post.title}</div>
                            <div className="text-sm text-slate-400 line-clamp-2">
                              {post.excerpt || 'No excerpt provided'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {post.author && typeof post.author === 'object' && 'name' in post.author
                            ? (post.author as { name: string }).name
                            : String(post.author)
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              post.published ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <span className="text-sm text-slate-300">
                              {post.published ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-slate-400" />
                            <span className="text-sm text-slate-300">{post.readTime}</span>
                          </div>
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
                                onClick={() => handleEdit(post)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(post)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Créer un Nouvel Article</DialogTitle>
            <DialogDescription className="text-slate-300">
              Créez un nouvel article de blog avec du contenu riche.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">Titre de l&apos;Article</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="ex: Les tendances du marketing digital au Cameroun en 2024"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category" className="text-slate-300">Catégorie</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="ex: Marketing Digital"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
                {errors.category && (
                  <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-slate-300">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="ex: Tendances, Marketing, Cameroun, 2024"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              {errors.tags && (
                <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-slate-300">Extrait</Label>
              <Input
                id="excerpt"
                {...register('excerpt')}
                placeholder="Brève description de l'article..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-400 mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">Contenu</Label>
              <div className="mt-1">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Écrivez le contenu de votre article ici..."
                  className="blog-editor"
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-400 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-6 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="featured" className="text-slate-300">Marquer comme article en vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="published" className="text-slate-300">Publier immédiatement</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateModal}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                {createMutation.isPending ? 'Création...' : 'Créer l&apos;Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l&apos;Article</DialogTitle>
            <DialogDescription className="text-slate-300">
              Mettez à jour les informations de l&apos;article et son contenu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title" className="text-slate-300">Titre de l&apos;Article</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="ex: Les tendances du marketing digital au Cameroun en 2024"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-category" className="text-slate-300">Catégorie</Label>
                <Input
                  id="edit-category"
                  {...register('category')}
                  placeholder="ex: Marketing Digital"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
                {errors.category && (
                  <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tags" className="text-slate-300">Tags (séparés par des virgules)</Label>
              <Input
                id="edit-tags"
                {...register('tags')}
                placeholder="ex: Tendances, Marketing, Cameroun, 2024"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              {errors.tags && (
                <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-excerpt" className="text-slate-300">Extrait</Label>
              <Input
                id="edit-excerpt"
                {...register('excerpt')}
                placeholder="Brève description de l'article..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-400 mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">Contenu</Label>
              <div className="mt-1">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Écrivez le contenu de votre article ici..."
                  className="blog-editor"
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-400 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-6 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  {...register('featured')}
                  className="rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="edit-featured" className="text-slate-300">Marquer comme article en vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  {...register('published')}
                  className="rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="edit-published" className="text-slate-300">Publier immédiatement</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditModal}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
            <DialogTitle className="text-white">Supprimer l&apos;Article</DialogTitle>
            <DialogDescription className="text-slate-300">
              Êtes-vous sûr de vouloir supprimer &quot;{selectedBlog?.title}&quot; ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
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
