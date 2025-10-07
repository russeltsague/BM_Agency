# Frontend-Backend Integration Guide

## ✅ Integration Complete

This document outlines the complete integration between the Next.js 14 frontend and Express backend.

---

## 🔧 Configuration

### Backend Configuration (`Backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### Frontend Configuration (`Frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ENV=development
```

---

## 📡 API Endpoints

### Authentication
- **POST** `/api/v1/auth/login` - User login
- **POST** `/api/v1/auth/register` - User registration
- **GET** `/api/v1/auth/me` - Get current user (protected)
- **PATCH** `/api/v1/auth/update-password` - Update password (protected)

### Services
- **GET** `/api/v1/services` - Get all services (public)
- **GET** `/api/v1/services/:id` - Get service by ID (public)
- **POST** `/api/v1/services` - Create service (admin only)
- **PATCH** `/api/v1/services/:id` - Update service (admin only)
- **DELETE** `/api/v1/services/:id` - Delete service (admin only)

### Articles (Blog)
- **GET** `/api/v1/articles` - Get all articles (public)
- **GET** `/api/v1/articles/:id` - Get article by ID (public)
- **POST** `/api/v1/articles` - Create article (admin/editor)
- **PATCH** `/api/v1/articles/:id` - Update article (admin/editor)
- **DELETE** `/api/v1/articles/:id` - Delete article (admin/editor)

### Realisations (Portfolio)
- **GET** `/api/v1/realisations` - Get all realisations (public)
- **GET** `/api/v1/realisations/:id` - Get realisation by ID (public)
- **POST** `/api/v1/realisations` - Create realisation (admin only)
- **PATCH** `/api/v1/realisations/:id` - Update realisation (admin only)
- **DELETE** `/api/v1/realisations/:id` - Delete realisation (admin only)

### Testimonials
- **GET** `/api/v1/testimonials` - Get all testimonials (public)
- **GET** `/api/v1/testimonials/:id` - Get testimonial by ID (public)
- **POST** `/api/v1/testimonials` - Create testimonial (admin only)
- **PATCH** `/api/v1/testimonials/:id` - Update testimonial (admin only)
- **DELETE** `/api/v1/testimonials/:id` - Delete testimonial (admin only)

### Products
- **GET** `/api/v1/products` - Get all products (public)
- **GET** `/api/v1/products/:id` - Get product by ID (public)
- **POST** `/api/v1/products` - Create product (admin only)
- **PATCH** `/api/v1/products/:id` - Update product (admin only)
- **DELETE** `/api/v1/products/:id` - Delete product (admin only)

---

## 🔐 Authentication Flow

### Login Process
1. User submits email/password on `/admin/login`
2. Frontend calls `authAPI.login()` → `POST /api/v1/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in `localStorage` as `admin-token`
5. Frontend stores user data in `localStorage` as `admin-user`
6. User redirected to `/admin/dashboard`

### Protected Routes
- Next.js middleware (`src/middleware.ts`) checks for token in cookies
- All admin routes except `/admin/login` require authentication
- If no token, user is redirected to `/admin/login`

### API Authentication
- All protected API calls include `Authorization: Bearer <token>` header
- Token is automatically retrieved from `localStorage` by API client
- If token is invalid/expired, backend returns 401 error

---

## 🧱 Architecture

### API Client Layer (`Frontend/src/lib/api.ts`)
Centralized API client with:
- **Base URL configuration** from environment variables
- **Automatic token injection** for protected routes
- **Error handling** with try-catch
- **Type-safe interfaces** for all resources
- **Organized by resource** (auth, services, articles, etc.)

### Frontend Components Updated

#### Public Pages (Real Data)
- ✅ `ServicesSection.tsx` - Fetches from `/api/v1/services`
- ✅ `BlogSection.tsx` - Fetches from `/api/v1/articles`
- ✅ `PortfolioSection.tsx` - Fetches from `/api/v1/realisations`

#### Admin Pages (Full CRUD)
- ✅ `admin/services/page.tsx` - Full CRUD for services
- 🔄 `admin/blog/page.tsx` - Needs update for articles CRUD
- 🔄 `admin/portfolio/page.tsx` - Needs update for realisations CRUD
- 🔄 `admin/products/page.tsx` - Needs update for products CRUD
- 🔄 `admin/testimonials/page.tsx` - Needs update for testimonials CRUD

#### Auth Components
- ✅ `AuthContext.tsx` - Connected to real backend API
- ✅ `admin/login/page.tsx` - Uses AuthContext with real API
- ✅ `ProtectedRoute.tsx` - Checks token from localStorage
- ✅ `middleware.ts` - Server-side route protection

---

## 🛡️ Security Features

### Backend
- ✅ **CORS** configured for frontend origin (`http://localhost:3000`)
- ✅ **Helmet** for security headers
- ✅ **Rate limiting** on `/api` routes (100 requests per 15 min)
- ✅ **MongoDB sanitization** against NoSQL injection
- ✅ **XSS protection** with xss-clean
- ✅ **HPP protection** against parameter pollution
- ✅ **JWT authentication** with Bearer tokens
- ✅ **Role-based access control** (admin, editor roles)

### Frontend
- ✅ **Token storage** in localStorage (consider HttpOnly cookies for production)
- ✅ **Middleware protection** for admin routes
- ✅ **Automatic token injection** in API calls
- ✅ **Error handling** with user-friendly messages

---

## 🚀 Running the Application

### 1. Start Backend
```bash
cd "Backend "
npm run dev
```
Backend runs on: `http://localhost:5000`
API Docs: `http://localhost:5000/api-docs`

### 2. Start Frontend
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 3. Test the Integration

#### Test Public Pages
1. Visit `http://localhost:3000`
2. Check Services section - should load from API
3. Check Blog section - should load from API
4. Check Portfolio section - should load from API

#### Test Admin Login
1. Visit `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin/dashboard`

#### Test Admin CRUD (Services)
1. Go to `/admin/services`
2. Click "Add Service" - test create
3. Click edit icon - test update
4. Click delete icon - test delete
5. Check MongoDB to verify changes

---

## 📊 Data Models

### Service
```typescript
{
  _id: string
  title: string
  description: string
  features: string[]
  pricing?: string
  duration?: string
  caseStudy?: string
  icon?: string
  createdAt: string
  updatedAt: string
}
```

### Article
```typescript
{
  _id: string
  title: string
  content: string
  excerpt?: string
  author: string
  category?: string
  tags?: string[]
  image?: string
  published: boolean
  featured?: boolean
  readTime?: string
  createdAt: string
  updatedAt: string
}
```

### Realisation
```typescript
{
  _id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  image?: string
  link?: string
  client?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}
```

### Testimonial
```typescript
{
  _id: string
  name: string
  content: string
  role?: string
  company?: string
  image?: string
  rating?: number
  createdAt: string
  updatedAt: string
}
```

### Product
```typescript
{
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured?: boolean
  createdAt: string
  updatedAt: string
}
```

---

## 🧪 Testing Checklist

### Backend API Tests
- [ ] Test all endpoints with Postman
- [ ] Verify authentication works
- [ ] Test CRUD operations for each resource
- [ ] Check error handling
- [ ] Verify CORS headers

### Frontend Integration Tests
- [ ] Public pages load data correctly
- [ ] Login/logout flow works
- [ ] Admin routes are protected
- [ ] CRUD operations work in admin panel
- [ ] Error states display properly
- [ ] Loading states show correctly
- [ ] Toast notifications appear

### End-to-End Tests
- [ ] Create service via admin → appears on homepage
- [ ] Create article → appears in blog section
- [ ] Create realisation → appears in portfolio
- [ ] Update data → changes reflect immediately
- [ ] Delete data → removed from UI and database

---

## 🐛 Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS middleware in `Backend/src/app.ts`

### Authentication Errors
- Check JWT token in localStorage
- Verify `JWT_SECRET` in backend `.env`
- Check token expiration (default 7 days)

### API Connection Errors
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check network tab in browser DevTools

### Data Not Loading
- Check browser console for errors
- Verify MongoDB connection
- Check API response in Network tab
- Ensure data exists in database

---

## 📝 Next Steps

### Remaining Admin Pages to Update
1. **Blog Admin** (`admin/blog/page.tsx`)
   - Replace mock data with `articlesAPI`
   - Implement create/update/delete with real API

2. **Portfolio Admin** (`admin/portfolio/page.tsx`)
   - Replace mock data with `realisationsAPI`
   - Implement create/update/delete with real API

3. **Products Admin** (`admin/products/page.tsx`)
   - Replace mock data with `productsAPI`
   - Implement create/update/delete with real API

4. **Testimonials Admin** (`admin/testimonials/page.tsx`)
   - Replace mock data with `testimonialsAPI`
   - Implement create/update/delete with real API

### Production Deployment
1. Update environment variables for production
2. Use HttpOnly cookies instead of localStorage for tokens
3. Enable HTTPS
4. Update CORS origin to production domain
5. Set up proper error logging
6. Configure rate limiting for production load

---

## 🎯 Summary

✅ **Completed:**
- API client layer with full TypeScript support
- Backend CORS configuration
- Authentication integration (login/logout)
- Next.js middleware for route protection
- Public pages fetching real data (Services, Blog, Portfolio)
- Admin Services page with full CRUD operations
- Error handling and loading states
- Environment configuration

🔄 **In Progress:**
- Remaining admin pages (Blog, Portfolio, Products, Testimonials)

📦 **Ready for Testing:**
- Start both servers and test the integration end-to-end
- Verify all API calls work correctly
- Check data persistence in MongoDB
