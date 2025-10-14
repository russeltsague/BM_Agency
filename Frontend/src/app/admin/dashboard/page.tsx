'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Settings,
  Image,
  FileText,
  Users,
  ChevronRight,
  Activity,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch dashboard data from real APIs
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/services`)
      if (!response.ok) throw new Error('Failed to fetch services')
      return response.json()
    },
  })

  const { data: realisationsData, isLoading: realisationsLoading } = useQuery({
    queryKey: ['admin-realisations'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/realisations`)
      if (!response.ok) throw new Error('Failed to fetch realisations')
      return response.json()
    },
  })

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/articles`)
      if (!response.ok) throw new Error('Failed to fetch articles')
      return response.json()
    },
  })

  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/testimonials`)
      if (!response.ok) throw new Error('Failed to fetch testimonials')
      return response.json()
    },
  })

  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/team`)
      if (!response.ok) throw new Error('Failed to fetch team')
      return response.json()
    },
  })

  const isLoading = servicesLoading || realisationsLoading || articlesLoading || testimonialsLoading || teamLoading

  // Update stats with real data
  const realStats = {
    services: servicesData?.results || 0,
    portfolio: realisationsData?.results || 0,
    blog: articlesData?.results || 0,
    testimonials: testimonialsData?.results || 0,
    team: teamData?.results || 0,
  }

  const statCards = [
    {
      title: 'Services',
      value: realStats.services,
      icon: Settings,
      href: '/admin/services',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      description: 'Manage your services',
      gradient: 'from-blue-500/20 to-purple-500/20'
    },
    {
      title: 'Portfolio',
      value: realStats.portfolio,
      icon: Image,
      href: '/admin/portfolio',
      color: 'text-green-400',
      bgColor: 'bg-green-900/30',
      description: 'Showcase your work',
      gradient: 'from-green-500/20 to-teal-500/20'
    },
    {
      title: 'Blog Articles',
      value: realStats.blog,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30',
      description: 'Share your insights',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Testimonials',
      value: realStats.testimonials,
      icon: Users,
      href: '/admin/testimonials',
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/30',
      description: 'Client feedback',
      gradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      title: 'Team Management',
      value: realStats.team,
      icon: Users,
      href: '/admin/team',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-900/30',
      description: 'Manage your team',
      gradient: 'from-indigo-500/20 to-blue-500/20'
    },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-300 text-lg">Welcome back! Here&apos;s an overview of your content management system.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Activity className="h-4 w-4" />
                <span>System Status: Active</span>
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon

          return (
            <Link key={stat.title} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-slate-700 hover:border-slate-600 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-3xl font-bold text-white mb-2">
                      {isLoading ? (
                        <div className="animate-pulse bg-slate-700 h-8 w-16 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      {stat.description}
                    </p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {/* Content Overview */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl">
            <Database className="mr-3 h-6 w-6 text-blue-400" />
            Content Overview
          </CardTitle>
          <CardDescription className="text-slate-400">
            Summary of all your content across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {realStats.services + realStats.portfolio}
              </div>
              <p className="text-sm text-slate-300 font-medium">Total Projects & Services</p>
              <p className="text-xs text-slate-500 mt-1">Combined content items</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {realStats.blog}
              </div>
              <p className="text-sm text-slate-300 font-medium">Published Articles</p>
              <p className="text-xs text-slate-500 mt-1">Knowledge base content</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-slate-700">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {realStats.testimonials + realStats.team}
              </div>
              <p className="text-sm text-slate-300 font-medium">Reviews & Team</p>
              <p className="text-xs text-slate-500 mt-1">Customer engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
