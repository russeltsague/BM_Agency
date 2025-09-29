'use client'

import { useState } from 'react'
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
  Calendar,
  Eye,
  EyeOff,
  Clock
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
import { toast } from 'react-hot-toast'

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

// Blog form schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  featured: z.boolean(),
  published: z.boolean(),
}).transform((data) => ({
  ...data,
  featured: data.featured ?? false,
  published: data.published ?? false,
}))

type BlogForm = z.infer<typeof blogSchema>

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  thumbnail?: string
  readTime: string
  createdAt: string
  updatedAt: string
}

// Mock data - replace with real API
const mockBlog: Blog[] = [
  {
    id: '1',
    title: 'Les tendances du marketing digital au Cameroun en 2024',
    excerpt: 'Découvrez les principales tendances qui façonneront le marketing digital camerounais cette année et comment les intégrer dans votre stratégie d\'entreprise.',
    content: 'Le marketing digital au Cameroun évolue à un rythme effréné. En 2024, plusieurs tendances majeures se démarquent...',
    author: 'Marie Dubois',
    category: 'Marketing Digital',
    tags: ['Tendances', 'Marketing', 'Cameroun', '2024'],
    featured: true,
    published: true,
    thumbnail: '/images/blog-1.jpg',
    readTime: '8 min',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Comment optimiser son SEO pour les moteurs de recherche au Cameroun',
    excerpt: 'Guide complet pour améliorer le référencement de votre site web et augmenter votre visibilité sur Google et autres moteurs de recherche locaux.',
    content: 'Le SEO (Search Engine Optimization) reste un pilier fondamental du marketing digital camerounais...',
    author: 'Thomas Martin',
    category: 'SEO',
    tags: ['SEO', 'Référencement', 'Google', 'Cameroun'],
    featured: false,
    published: true,
    thumbnail: '/images/blog-2.jpg',
    readTime: '12 min',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
]

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockBlog
    },
  })

  // Filter blog based on search
  const filteredBlog = blog.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create blog mutation
  const createMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newBlog: Blog = {
        id: Date.now().toString(),
        ...data,
        tags: data.tags.split(',').map(t => t.trim()),
        thumbnail: '',
        readTime: '5 min',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newBlog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Blog post created successfully!')
    },
    onError: () => {
      toast.error('Failed to create blog post')
    },
  })

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogForm }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data, tags: data.tags.split(',').map(t => t.trim()) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      setIsEditModalOpen(false)
      setSelectedBlog(null)
      reset()
      toast.success('Blog post updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update blog post')
    },
  })

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] })
      setIsDeleteModalOpen(false)
      setSelectedBlog(null)
      toast.success('Blog post deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete blog post')
    },
  })

  const handleCreate = (data: BlogForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog)
    setValue('title', blog.title)
    setValue('excerpt', blog.excerpt)
    setValue('content', blog.content)
    setValue('author', blog.author)
    setValue('category', blog.category)
    setValue('tags', blog.tags.join(', '))
    setValue('featured', blog.featured)
    setValue('published', blog.published)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: BlogForm) => {
    if (selectedBlog) {
      updateMutation.mutate({ id: selectedBlog.id, data })
    }
  }

  const handleDelete = () => {
    if (selectedBlog) {
      deleteMutation.mutate(selectedBlog.id)
    }
  }

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog articles and content.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blog Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Articles ({filteredBlog.length})</CardTitle>
          <CardDescription>
            Manage all your blog articles and their content.
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
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Read Time</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredBlog.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {post.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            post.published ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm">
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-gray-400" />
                          {post.readTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(post)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(post)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
            <DialogDescription>
              Create a new blog article with rich text content.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Les tendances du marketing digital au Cameroun en 2024"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  {...register('author')}
                  placeholder="e.g., Marie Dubois"
                />
                {errors.author && (
                  <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., Marketing Digital"
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="e.g., Tendances, Marketing, Cameroun, 2024"
                />
                {errors.tags && (
                  <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                {...register('excerpt')}
                placeholder="Brief description of the article..."
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <div className="mt-1">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here..."
                  className="h-64"
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
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
                <Label htmlFor="featured">Mark as featured article</Label>
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
                {createMutation.isPending ? 'Creating...' : 'Create Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Update the article information and content.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Article Title</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="e.g., Les tendances du marketing digital au Cameroun en 2024"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  {...register('author')}
                  placeholder="e.g., Marie Dubois"
                />
                {errors.author && (
                  <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  {...register('category')}
                  placeholder="e.g., Marketing Digital"
                />
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  {...register('tags')}
                  placeholder="e.g., Tendances, Marketing, Cameroun, 2024"
                />
                {errors.tags && (
                  <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Input
                id="edit-excerpt"
                {...register('excerpt')}
                placeholder="Brief description of the article..."
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-content">Content</Label>
              <div className="mt-1">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => setValue('content', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here..."
                  className="h-64"
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
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
                <Label htmlFor="edit-featured">Mark as featured article</Label>
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
                {updateMutation.isPending ? 'Updating...' : 'Update Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.
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
