# Remaining Admin Pages - API Integration Instructions

## Overview
The following admin pages need to be updated to use real API calls instead of mock data:
1. Blog (`admin/blog/page.tsx`)
2. Portfolio (`admin/portfolio/page.tsx`)
3. Products (`admin/products/page.tsx`)
4. Testimonials (`admin/testimonials/page.tsx`)

All API functions are already created in `Frontend/src/lib/api.ts`. You just need to replace the mock data and mutations.

---

## Pattern to Follow (Based on Services Page)

### 1. Import API Functions
```typescript
import { articlesAPI, type Article, type ArticleInput } from '@/lib/api'
```

### 2. Update Interface to Match Backend
```typescript
// Change 'id' to '_id' to match MongoDB
interface Article {
  _id: string  // ← Changed from 'id'
  // ... rest of fields
}
```

### 3. Update Query Function
```typescript
const { data: articles = [], isLoading } = useQuery({
  queryKey: ['admin-articles'],
  queryFn: async () => {
    const response = await articlesAPI.getAll()
    return response.data.articles
  },
})
```

### 4. Update Create Mutation
```typescript
const createMutation = useMutation({
  mutationFn: async (data: ArticleForm) => {
    const articleData: ArticleInput = {
      title: data.title,
      content: data.content,
      // ... map form fields to API input
      tags: data.tags.split(',').map(t => t.trim()),
    }
    const response = await articlesAPI.create(articleData)
    return response.data.article
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    setIsCreateModalOpen(false)
    reset()
    toast.success('Article created successfully!')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to create article')
  },
})
```

### 5. Update Update Mutation
```typescript
const updateMutation = useMutation({
  mutationFn: async ({ id, data }: { id: string; data: ArticleForm }) => {
    const articleData: ArticleInput = {
      // ... same mapping as create
    }
    const response = await articlesAPI.update(id, articleData)
    return response.data.article
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    setIsEditModalOpen(false)
    setSelectedArticle(null)
    reset()
    toast.success('Article updated successfully!')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to update article')
  },
})
```

### 6. Update Delete Mutation
```typescript
const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    await articlesAPI.delete(id)
    return id
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    setIsDeleteModalOpen(false)
    setSelectedArticle(null)
    toast.success('Article deleted successfully!')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to delete article')
  },
})
```

### 7. Update Handler Functions
```typescript
const handleUpdate = (data: ArticleForm) => {
  if (selectedArticle) {
    updateMutation.mutate({ id: selectedArticle._id, data })  // ← Use _id
  }
}

const handleDelete = () => {
  if (selectedArticle) {
    deleteMutation.mutate(selectedArticle._id)  // ← Use _id
  }
}
```

### 8. Update Table Key
```typescript
{filteredArticles.map((article) => (
  <motion.tr
    key={article._id}  // ← Changed from article.id
    // ...
  >
```

---

## Specific Changes for Each Page

### 1. Blog Page (`admin/blog/page.tsx`)

**Import:**
```typescript
import { articlesAPI, type Article, type ArticleInput } from '@/lib/api'
```

**Remove:** Lines 73-121 (mockBlog array)

**Update Interface:** Change `id` to `_id`, remove `thumbnail` and `readTime` (not in backend)

**Field Mapping:**
```typescript
const articleData: ArticleInput = {
  title: data.title,
  content: data.content,
  excerpt: data.excerpt,
  author: data.author,
  category: data.category,
  tags: data.tags.split(',').map(t => t.trim()),
  published: data.published,
  featured: data.featured,
}
```

---

### 2. Portfolio Page (`admin/portfolio/page.tsx`)

**Import:**
```typescript
import { realisationsAPI, type Realisation, type RealisationInput } from '@/lib/api'
```

**Remove:** Lines 80-106 (mockPortfolio array)

**Update Interface:** Change `id` to `_id`, rename to match backend (Realisation)

**Field Mapping:**
```typescript
const realisationData: RealisationInput = {
  title: data.title,
  description: data.description,
  client: data.client,
  category: data.category,  // ← Backend uses 'category' not 'date'
  tags: data.tags.split(',').map(t => t.trim()),
  link: data.link || undefined,
  featured: data.featured,
}
```

**Note:** Backend uses `category` field, not `date`. You may need to adjust the form schema.

---

### 3. Products Page (`admin/products/page.tsx`)

**Import:**
```typescript
import { productsAPI, type Product, type ProductInput } from '@/lib/api'
```

**Remove:** Lines 86-129 (mockProducts array)

**Update Interface:** Change `id` to `_id`, remove `sku` and `pdfCatalog` (not in backend)

**Field Mapping:**
```typescript
const productData: ProductInput = {
  name: data.name,
  description: data.description,
  price: data.price,
  image: '', // Handle image upload separately
  category: data.category,
  stock: data.stock,
  featured: data.featured,
}
```

**Note:** Backend requires `image` field (URL string). You'll need to handle file uploads separately or use placeholder.

---

### 4. Testimonials Page (`admin/testimonials/page.tsx`)

**Import:**
```typescript
import { testimonialsAPI, type Testimonial, type TestimonialInput } from '@/lib/api'
```

**Remove:** Lines 81-121 (mockTestimonials array)

**Update Interface:** Change `id` to `_id`, rename `position` to `role`, `message` to `content`

**Field Mapping:**
```typescript
const testimonialData: TestimonialInput = {
  name: data.name,
  content: data.message,  // ← Backend uses 'content'
  role: data.position,    // ← Backend uses 'role'
  company: data.company,
  rating: data.rating,
}
```

**Note:** Backend schema uses `content` and `role` instead of `message` and `position`. Update form fields accordingly.

---

## Quick Implementation Steps

For each page:

1. **Add import** at top
2. **Remove mock data** array
3. **Update interface** (`id` → `_id`)
4. **Replace query function** with API call
5. **Update create mutation** with API call
6. **Update update mutation** with API call
7. **Update delete mutation** with API call
8. **Fix handler functions** to use `_id`
9. **Fix table key** to use `_id`
10. **Test** CRUD operations

---

## Testing Checklist

For each admin page:
- [ ] Page loads without errors
- [ ] Data fetches from backend
- [ ] Create operation works
- [ ] Edit operation works
- [ ] Delete operation works
- [ ] Toast notifications appear
- [ ] Data persists in MongoDB
- [ ] Loading states show correctly
- [ ] Error handling works

---

## Common Issues & Solutions

### Issue: Field name mismatch
**Solution:** Check backend schema in `Backend/src/models/` and map form fields correctly

### Issue: Required fields missing
**Solution:** Check backend validation in `Backend/src/routes/` and ensure all required fields are sent

### Issue: 401 Unauthorized
**Solution:** Ensure user is logged in and token is valid

### Issue: Type errors
**Solution:** Update TypeScript interfaces to match backend response structure

---

## Estimated Time
- Blog: 15 minutes
- Portfolio: 15 minutes
- Products: 20 minutes (image handling)
- Testimonials: 15 minutes

**Total: ~1 hour**

---

## Need Help?
Refer to `Frontend/src/app/admin/services/page.tsx` as the working example.
All API functions are documented in `Frontend/src/lib/api.ts`.
