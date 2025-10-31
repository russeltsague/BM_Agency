/**
 * API Client Utilities
 * Centralized API calls with authentication and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin-token');
  }
  return null;
};

// Helper to build headers with optional auth
export const buildHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // Also set the token in cookies for routes that check there
      if (typeof document !== 'undefined') {
        document.cookie = `token=${token}; path=/; samesite=lax`;
      }
    }
  }

  return headers;
};

// Helper to refresh the access token
const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.token) {
        localStorage.setItem('admin-token', data.token);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let headers = buildHeaders(requireAuth);
  let isRefreshing = false;

  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include', // Important for cookies
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401 && requireAuth && !isRefreshing) {
      isRefreshing = true;
      const refreshed = await refreshToken();
      isRefreshing = false;
      
      if (refreshed) {
        // Update headers with new token
        headers = buildHeaders(requireAuth);
        // Retry the request
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
          credentials: 'include',
        });
      } else {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin-token');
          localStorage.removeItem('admin-user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          window.location.href = '/admin/login';
        }
        throw new Error('Session expired. Please log in again.');
      }
    }

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors specifically
      if (response.status === 401) {
        // Clear stored authentication data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin-token');
          localStorage.removeItem('admin-user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          window.location.href = '/admin/login';
        }
        throw new Error('Invalid token or session expired. Please log in again.');
      }

      // Handle permission errors (403) - don't redirect to login, just throw error
      if (response.status === 403) {
        throw new Error(data.message || 'You do not have permission to perform this action');
      }

      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);

    // For development, return mock data if backend is unavailable
    if (process.env.NODE_ENV === 'development' && error instanceof Error && error.message.includes('fetch')) {
      console.warn('Backend unavailable, using mock data for development');
      return mockApiResponse(endpoint, options.method) as T;
    }

    // Handle network errors or other issues that might indicate authentication problems
    if (error instanceof Error && (error.message.includes('token') || error.message.includes('session'))) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        window.location.href = '/admin/login';
      }
    }

    throw error;
  }
}

// Mock API responses for development
export function mockApiResponse(endpoint: string, method: string = 'GET'): any {
  if (endpoint.includes('/articles')) {
    return {
      status: 'success',
      results: 3,
      data: [
        {
          _id: '1',
          title: 'Sample Article',
          content: 'Sample content',
          excerpt: 'Sample excerpt',
          author: 'Admin User',
          category: 'Development',
          tags: ['React', 'JavaScript'],
          image: '/images/article-1.jpg',
          published: false,
          featured: false,
          readTime: '5 min',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending'
        }
      ]
    };
  }

  if (endpoint.includes('/services')) {
    return {
      status: 'success',
      results: 2,
      data: [
        {
          _id: '1',
          title: 'Web Development',
          description: 'Custom web applications',
          features: ['React', 'Node.js'],
          pricing: 'Starting from $2,500',
          duration: '2-4 weeks',
          icon: 'code',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  if (endpoint.includes('/auth/users')) {
    return {
      status: 'success',
      results: 1,
      data: {
        users: [
          {
            _id: '1',
            name: 'Admin User',
            email: 'admin@bmagency.com',
            roles: ['admin'],
            adminPermissions: {
              services: true,
              portfolio: true,
              blog: true,
              team: true,
              testimonials: true,
              users: true,
              settings: true,
              analytics: true
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    };
  }

  return {
    status: 'success',
    data: []
  };
}

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      roles: string[];
    };
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  adminPermissions?: {
    services?: boolean;
    portfolio?: boolean;
    blog?: boolean;
    team?: boolean;
    testimonials?: boolean;
    users?: boolean;
    settings?: boolean;
    analytics?: boolean;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<{ status: string; data: { user: User } }> => {
    return apiRequest('/auth/me', {}, true);
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiRequest('/auth/update-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },
};

// ============================================================================
// SERVICES API
// ============================================================================

export interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  pricing?: string;
  duration?: string;
  caseStudy?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  title: string;
  description: string;
  features: string[];
  pricing?: string;
  duration?: string;
  caseStudy?: string;
  icon?: string;
}

export const servicesAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: Service[] }> => {
    return apiRequest('/services');
  },

  getById: async (id: string): Promise<{ status: string; data: { service: Service } }> => {
    return apiRequest(`/services/${id}`);
  },

  create: async (data: ServiceInput): Promise<{ status: string; data: { service: Service } }> => {
    return apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: ServiceInput): Promise<{ status: string; data: { service: Service } }> => {
    return apiRequest(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// ARTICLES (BLOG) API
// ============================================================================

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string | { name: string; email: string };
  category?: string;
  tags?: string[];
  image?: string;
  published: boolean;
  featured?: boolean;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  rejectionReason?: string;
  stateHistory?: ArticleStateChange[];
  metadata?: {
    wordCount: number;
    readingTime: number;
    lastModifiedBy: string;
    version: number;
  };
}

export interface ArticleStateChange {
  from: Article['status'];
  to: Article['status'];
  timestamp: string;
  changedBy: string;
  reason?: string;
}

export interface ArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
  featured?: boolean;
  readTime?: string;
  status?: Article['status'];
}

export interface ArticleFilter {
  status?: Article['status'];
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  published?: boolean;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
  byCategory: Record<string, number>;
  byAuthor: Record<string, number>;
}

export const articlesAPI = {
  // Get all articles with optional filtering
  getAll: async (filters?: ArticleFilter): Promise<{ status: string; results: number; data: Article[] }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/articles${query}`);
  },

  // Get article by ID with full state history
  getById: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}`);
  },

  // Create new article
  create: async (data: ArticleInput): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  // Update existing article
  update: async (id: string, data: Partial<ArticleInput>): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  // Delete article
  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/articles/${id}`, {
      method: 'DELETE',
    }, true);
  },

  // Approve article (change status to approved)
  approve: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' }),
    }, true);
  },

  // Reject article (change status to rejected)
  reject: async (id: string, reason?: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'rejected', rejectionReason: reason }),
    }, true);
  },

  // Publish article (change status to published)
  publish: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'published', published: true }),
    }, true);
  },

  // Unpublish article (change status to draft)
  unpublish: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/unpublish`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'draft', published: false }),
    }, true);
  },

  // Submit for approval (change status to pending)
  submitForApproval: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/submit`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'pending' }),
    }, true);
  },

  // Get article state history
  getStateHistory: async (id: string): Promise<{ status: string; data: { history: ArticleStateChange[] } }> => {
    return apiRequest(`/articles/${id}/history`);
  },

  // Get article statistics
  getStats: async (): Promise<{ status: string; data: { stats: ArticleStats } }> => {
    return apiRequest('/articles/stats');
  },

  // Bulk operations
  bulkUpdateStatus: async (ids: string[], status: Article['status'], reason?: string): Promise<{ status: string; data: { updated: number } }> => {
    return apiRequest('/articles/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, status, reason }),
    }, true);
  },

  // Archive articles (soft delete)
  archive: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: true }),
    }, true);
  },

  // Restore archived articles
  restore: async (id: string): Promise<{ status: string; data: { article: Article } }> => {
    return apiRequest(`/articles/${id}/restore`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: false }),
    }, true);
  },

  // Get articles by category
  getByCategory: async (category: string): Promise<{ status: string; results: number; data: Article[] }> => {
    return apiRequest(`/articles/category/${encodeURIComponent(category)}`);
  },

  // Get articles by author
  getByAuthor: async (author: string): Promise<{ status: string; results: number; data: Article[] }> => {
    return apiRequest(`/articles/author/${encodeURIComponent(author)}`);
  },

  // Search articles
  search: async (query: string, filters?: ArticleFilter): Promise<{ status: string; results: number; data: Article[] }> => {
    const queryParams = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/articles/search?${queryParams.toString()}`);
  },

  // Auto-save draft
  autoSave: async (id: string | null, data: Partial<ArticleInput>): Promise<{ status: string; data: { article: Article } }> => {
    const endpoint = id ? `/articles/${id}/autosave` : '/articles/autosave';
    const method = id ? 'PATCH' : 'POST';

    return apiRequest(endpoint, {
      method,
      body: JSON.stringify({ ...data, status: 'draft' }),
    }, true);
  },

  // Get user's articles (for editor dashboard)
  getMyArticles: async (): Promise<{ status: string; results: number; data: Article[] }> => {
    return apiRequest('/articles/my', {}, true);
  },
};

// Utility functions for state management
export const ArticleStateUtils = {
  // Get human-readable status label
  getStatusLabel: (status: Article['status']): string => {
    const labels = {
      draft: 'Draft',
      pending: 'Pending Approval',
      approved: 'Approved',
      rejected: 'Rejected',
      published: 'Published'
    };
    return labels[status || 'draft'];
  },

  // Get status color for UI
  getStatusColor: (status: Article['status']): string => {
    const colors = {
      draft: 'gray',
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      published: 'blue'
    };
    return colors[status || 'draft'];
  },

  // Check if status transition is allowed
  canTransition: (from: Article['status'], to: Article['status']): boolean => {
    const allowedTransitions: Record<NonNullable<Article['status']>, Article['status'][]> = {
      draft: ['pending', 'published'],
      pending: ['draft', 'approved', 'rejected'],
      approved: ['published', 'draft'],
      rejected: ['draft', 'pending'],
      published: ['draft']
    };

    return allowedTransitions[from as NonNullable<Article['status']>]?.includes(to) || false;
  },

  // Get next possible states
  getNextStates: (currentStatus: Article['status']): Article['status'][] => {
    const transitions: Record<NonNullable<Article['status']>, Article['status'][]> = {
      draft: ['pending', 'published'],
      pending: ['approved', 'rejected'],
      approved: ['published'],
      rejected: ['draft', 'pending'],
      published: ['draft']
    };

    return transitions[currentStatus as NonNullable<Article['status']>] || [];
  },

  // Calculate reading time
  calculateReadingTime: (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  },

  // Calculate word count
  calculateWordCount: (content: string): number => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Generate excerpt from content
  generateExcerpt: (content: string, maxLength: number = 150): string => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) return plainText;

    const excerpt = plainText.substring(0, maxLength);
    const lastSpaceIndex = excerpt.lastIndexOf(' ');

    return lastSpaceIndex > 0
      ? excerpt.substring(0, lastSpaceIndex) + '...'
      : excerpt + '...';
  }
};

// Enhanced error handling for database operations
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Connection status tracking
export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

export const connectionAPI = {
  // Check database connection status
  checkConnection: async (): Promise<ConnectionStatus> => {
    const startTime = Date.now();

    try {
      const response = await apiRequest<{ status: string; message?: string }>('/health');
      const responseTime = Date.now() - startTime;

      const responseData = response as unknown as { status: string; message?: string };
      return {
        isConnected: responseData.status === 'success',
        lastChecked: new Date().toISOString(),
        responseTime,
        error: responseData.status === 'error' ? responseData.message : undefined
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        isConnected: false,
        lastChecked: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get database statistics
  getStats: async (): Promise<{
    status: string;
    data: {
      totalArticles: number;
      totalUsers: number;
      totalServices: number;
      totalRealisations: number;
      databaseSize: string;
      lastBackup: string;
    }
  }> => {
    return apiRequest('/admin/stats');
  }
};

// Real-time state tracking
export const stateTrackingAPI = {
  // Subscribe to article state changes
  subscribeToArticleChanges: (articleId: string, callback: (article: Article) => void): () => void => {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll implement a polling mechanism

    const pollInterval = setInterval(async () => {
      try {
        const response = await apiRequest(`/articles/${articleId}`);
        if (response.status === 'success') {
          callback(response.data.article);
        }
      } catch (error) {
        console.error('Error polling article state:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  },

  // Get state change notifications
  getNotifications: async (userId: string): Promise<{
    status: string;
    data: {
      notifications: Array<{
        id: string;
        type: 'state_change' | 'comment' | 'mention';
        title: string;
        message: string;
        timestamp: string;
        read: boolean;
        articleId?: string;
        userId: string;
      }>;
    };
  }> => {
    return apiRequest(`/notifications/${userId}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string): Promise<{ status: string }> => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true }),
    }, true);
  }
};

// Enhanced API request with retry logic and better error handling
export async function apiRequestWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<T>(endpoint, options, requireAuth);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on authentication errors or client errors (4xx)
      if (error instanceof Error && error.message.includes('401')) {
        throw error;
      }

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw new DatabaseError(
    `Failed to connect to database after ${maxRetries} attempts`,
    'CONNECTION_FAILED',
    503,
    { originalError: lastError?.message }
  );
}

export interface Realisation {
  _id: string;
  title: string;
  description: string;
  image?: string;
  client: string;
  date: string;
  category?: string;
  tags?: string[];
  link?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RealisationInput {
  title: string;
  description: string;
  image?: string;
  client: string;
  category?: string;
  tags?: string[];
  link?: string;
  featured?: boolean;
}

export const realisationsAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: Realisation[] }> => {
    return apiRequest('/realisations');
  },

  getById: async (id: string): Promise<{ status: string; data: { realisation: Realisation } }> => {
    return apiRequest(`/realisations/${id}`);
  },

  create: async (data: RealisationInput): Promise<{ status: string; data: { realisation: Realisation } }> => {
    return apiRequest('/realisations', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: RealisationInput): Promise<{ status: string; data: { realisation: Realisation } }> => {
    return apiRequest(`/realisations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/realisations/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// TESTIMONIALS API
// ============================================================================

export interface Testimonial {
  _id: string;
  name: string;
  content: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialInput {
  name: string;
  content: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
}

export const testimonialsAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: Testimonial[] }> => {
    return apiRequest('/testimonials');
  },

  getById: async (id: string): Promise<{ status: string; data: { testimonial: Testimonial } }> => {
    return apiRequest(`/testimonials/${id}`);
  },

  create: async (data: TestimonialInput): Promise<{ status: string; data: { testimonial: Testimonial } }> => {
    return apiRequest('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: TestimonialInput): Promise<{ status: string; data: { testimonial: Testimonial } }> => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// PRODUCTS API
// ============================================================================

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
}

export const productsAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: Product[] }> => {
    return apiRequest('/products');
  },

  getById: async (id: string): Promise<{ status: string; data: { product: Product } }> => {
    return apiRequest(`/products/${id}`);
  },

  create: async (data: ProductInput): Promise<{ status: string; data: { product: Product } }> => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: ProductInput): Promise<{ status: string; data: { product: Product } }> => {
    return apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// TEAM API
// ============================================================================

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberInput {
  name: string;
  role: string;
  description: string;
  image?: string;
  achievements: string[];
}

export const teamAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: TeamMember[] }> => {
    return apiRequest('/team');
  },

  getById: async (id: string): Promise<{ status: string; data: { teamMember: TeamMember } }> => {
    return apiRequest(`/team/${id}`);
  },

  create: async (data: TeamMemberInput): Promise<{ status: string; data: { teamMember: TeamMember } }> => {
    return apiRequest('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: TeamMemberInput): Promise<{ status: string; data: { teamMember: TeamMember } }> => {
    return apiRequest(`/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/team/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// TASKS API
// ============================================================================

export interface Task {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'media' | 'other';
  referenceId?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  updatedAt: string;
  completedAt?: string;
  feedback?: string;
  history: Array<{
    status: string;
    changedBy: string | {
      _id: string;
      name: string;
      email: string;
    };
    changedAt: string;
    note?: string;
  }>;
}

export interface TaskInput {
  title: string;
  description: string;
  type: 'article' | 'media' | 'other';
  referenceId?: string;
}

export interface TaskFilter {
  status?: Task['status'];
  type?: Task['type'];
  page?: number;
  limit?: number;
}

export const tasksAPI = {
  // Create task directly (admin only)
  createAdminTask: async (data: TaskInput & { status?: Task['status']; assignedTo?: string }): Promise<{ status: string; data: { task: Task } }> => {
    return apiRequest('/tasks/admin-create', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  // Get user's tasks
  getMyTasks: async (): Promise<{ status: string; results: number; data: { tasks: Task[] } }> => {
    return apiRequest('/tasks/my-tasks', {}, true);
  },

  // Get all tasks (admin only)
  getAll: async (filters?: TaskFilter): Promise<{ status: string; results: number; pagination: any; data: { tasks: Task[] } }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/tasks${query}`, {}, true);
  },

  // Update task status (admin only)
  updateStatus: async (id: string, status: Task['status'], note?: string): Promise<{ status: string; data: { task: Task } }> => {
    return apiRequest(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }, true);
  },

  // Get task by ID
  getById: async (id: string): Promise<{ status: string; data: { task: Task } }> => {
    return apiRequest(`/tasks/${id}`, {}, true);
  },

  // Delete task (admin only)
  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

// ============================================================================
// USERS API
// ============================================================================

export interface UserInput {
  name: string;
  email: string;
  password: string;
  roles?: string[];
  adminPermissions?: {
    services?: boolean;
    portfolio?: boolean;
    blog?: boolean;
    team?: boolean;
    testimonials?: boolean;
    users?: boolean;
    settings?: boolean;
    analytics?: boolean;
  };
}

export const usersAPI = {
  getAll: async (): Promise<{ status: string; results: number; data: { users: User[] } }> => {
    return apiRequest('/auth/users', {}, true);
  },

  getById: async (id: string): Promise<{ status: string; data: { user: User } }> => {
    return apiRequest(`/auth/users/${id}`, {}, true);
  },

  create: async (data: UserInput): Promise<{ status: string; data: { user: User } }> => {
    return apiRequest('/auth/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  },

  update: async (id: string, data: Partial<UserInput>): Promise<{ status: string; data: { user: User } }> => {
    return apiRequest(`/auth/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },

  delete: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/auth/users/${id}`, {
      method: 'DELETE',
    }, true);
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<{ status: string; data: { user: User } }> => {
    return apiRequest('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  },
};
