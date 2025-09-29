'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Settings,
  Image,
  FileText,
  Users,
  Package,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data - replace with real API calls
const mockStats = {
  services: 8,
  portfolio: 24,
  blog: 15,
  testimonials: 12,
  products: 6,
}

const mockRecentActions = [
  {
    id: 1,
    type: 'service',
    action: 'created',
    title: 'Communication Digitale',
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    type: 'blog',
    action: 'published',
    title: 'Les tendances du marketing digital au Cameroun en 2024',
    timestamp: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    type: 'portfolio',
    action: 'updated',
    title: 'Plateforme E-commerce Mode Africaine',
    timestamp: '2024-01-13T09:15:00Z',
  },
]

const statCards = [
  {
    title: 'Services',
    value: mockStats.services,
    icon: Settings,
    href: '/admin/services',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Portfolio',
    value: mockStats.portfolio,
    icon: Image,
    href: '/admin/portfolio',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Blog Articles',
    value: mockStats.blog,
    icon: FileText,
    href: '/admin/blog',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Testimonials',
    value: mockStats.testimonials,
    icon: Users,
    href: '/admin/testimonials',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Products',
    value: mockStats.products,
    icon: Package,
    href: '/admin/products',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch dashboard data - replace with real API call
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockStats
    },
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your content.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total {stat.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Actions
            </CardTitle>
            <CardDescription>
              Latest changes to your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActions.map((action) => (
                <div key={action.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      action.type === 'service' ? 'bg-blue-500' :
                      action.type === 'blog' ? 'bg-purple-500' :
                      action.type === 'portfolio' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium capitalize">{action.action}</span>{' '}
                      <span className="font-medium">{action.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(action.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Service</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">New Article</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Image className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Project</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Add Testimonial</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>
            Summary of all your content across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {mockStats.services + mockStats.portfolio}
              </div>
              <p className="text-sm text-gray-600">Total Projects & Services</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mockStats.blog}
              </div>
              <p className="text-sm text-gray-600">Published Articles</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {mockStats.testimonials + mockStats.products}
              </div>
              <p className="text-sm text-gray-600">Reviews & Products</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
