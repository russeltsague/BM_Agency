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
  FileText,
  Upload
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

// Product form schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  featured: z.boolean(),
  published: z.boolean(),
}).transform((data) => ({
  ...data,
  featured: data.featured ?? false,
  published: data.published ?? false,
}))

type ProductForm = z.infer<typeof productSchema>

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  sku: string
  stock: number
  featured: boolean
  published: boolean
  images: string[]
  pdfCatalog?: string
  createdAt: string
  updatedAt: string
}

// Mock data - replace with real API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Stylo personnalisé BM Agency',
    description: 'Stylo à bille de haute qualité avec logo BM Agency, parfait pour les cadeaux d\'entreprise et événements professionnels.',
    price: 2500,
    category: 'Goodies',
    sku: 'PEN-BM-001',
    stock: 150,
    featured: true,
    published: true,
    images: ['/images/product-1.jpg'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'T-shirt coton bio BM Agency',
    description: 'T-shirt en coton biologique 100% avec impression du logo BM Agency, disponible en plusieurs tailles.',
    price: 15000,
    category: 'Vêtements',
    sku: 'TSHIRT-CD-002',
    stock: 75,
    featured: false,
    published: true,
    images: ['/images/product-2.jpg'],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mug céramique personnalisé',
    description: 'Mug en céramique de 350ml avec design personnalisé, idéal pour les pauses café au bureau.',
    price: 8000,
    category: 'Goodies',
    sku: 'MUG-CER-003',
    stock: 200,
    featured: true,
    published: true,
    images: ['/images/product-3.jpg'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
]

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockProducts
    },
  })

  // Ensure products is always an array
  const productsArray = Array.isArray(products) ? products : []

  // Filter products based on search
  const filteredProducts = productsArray.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newProduct
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Product created successfully!')
    },
    onError: () => {
      toast.error('Failed to create product')
    },
  })

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductForm }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      reset()
      toast.success('Product updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update product')
    },
  })

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
      toast.success('Product deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete product')
    },
  })

  const handleCreate = (data: ProductForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setValue('name', product.name)
    setValue('description', product.description)
    setValue('price', product.price)
    setValue('category', product.category)
    setValue('sku', product.sku)
    setValue('stock', product.stock)
    setValue('featured', product.featured)
    setValue('published', product.published)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: ProductForm) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data })
    }
  }

  const handleDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id)
    }
  }

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(price)
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)

    // Simulate file upload
    for (let i = 0; i < fileArray.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    toast.success(`${fileArray.length} file(s) uploaded successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage promotional products and merchandise.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage all promotional products and their inventory.
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
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            product.stock > 20 ? 'bg-green-500' :
                            product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          {product.stock} units
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            product.published ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm">
                            {product.published ? 'Published' : 'Draft'}
                          </span>
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
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(product)}
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
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new promotional product to your catalog.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Stylo personnalisé BM Agency"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  <option value="Goodies">Goodies</option>
                  <option value="Vêtements">Vêtements</option>
                  <option value="Accessoires">Accessoires</option>
                  <option value="Impression">Impression</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the product in detail..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (FCFA)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="2500"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="150"
                />
                {errors.stock && (
                  <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="PEN-BM-001"
                />
                {errors.sku && (
                  <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Mark as featured product</Label>
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

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="product-images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="product-images"
                          name="product-images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="pdf-catalog">PDF Catalog (optional)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="pdf-catalog"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload PDF</span>
                        <input
                          id="pdf-catalog"
                          name="pdf-catalog"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
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
                {createMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information and inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  {...register('name')}
                  placeholder="e.g., Stylo personnalisé BM Agency"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  <option value="Goodies">Goodies</option>
                  <option value="Vêtements">Vêtements</option>
                  <option value="Accessoires">Accessoires</option>
                  <option value="Impression">Impression</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...register('description')}
                placeholder="Describe the product in detail..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (FCFA)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="2500"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="150"
                />
                {errors.stock && (
                  <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  {...register('sku')}
                  placeholder="PEN-BM-001"
                />
                {errors.sku && (
                  <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  {...register('featured')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-featured">Mark as featured product</Label>
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
                {updateMutation.isPending ? 'Updating...' : 'Update Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? This action cannot be undone.
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
