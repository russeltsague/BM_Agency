'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import {
  Settings,
  User,
  Lock,
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

// Profile settings schema
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  phone: z.string().optional(),
  location: z.string().optional(),
})

// Site settings schema
const siteSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(10, 'Site description must be at least 10 characters'),
  siteKeywords: z.string().min(1, 'Keywords are required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
  facebookUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileForm = z.infer<typeof profileSchema>
type SiteForm = z.infer<typeof siteSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// Mock current user data
const mockUser = {
  name: 'Admin User',
  email: 'admin@camer-digital.cm',
  bio: 'Senior administrator for Camer Digital Agency',
  phone: '+237 222 123 456',
  location: 'Yaoundé, Cameroon',
}

// Mock site settings
const mockSiteSettings = {
  siteName: 'Camer Digital Agency',
  siteDescription: 'Agence de communication digitale 360° au Cameroun',
  siteKeywords: 'communication digitale, marketing digital, agence cameroun, Camer Digital Agency',
  contactEmail: 'contact@camer-digital.cm',
  contactPhone: '+237 222 123 456',
  address: '123 Avenue Kennedy, BP 12345 Yaoundé, Cameroun',
  facebookUrl: 'https://facebook.com/camerdigital',
  instagramUrl: 'https://instagram.com/camerdigital',
  linkedinUrl: 'https://linkedin.com/company/camerdigital',
  twitterUrl: '',
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile form
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockUser,
  })

  // Site settings form
  const siteForm = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: mockSiteSettings,
  })

  // Password form
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  // Update site settings mutation
  const updateSiteMutation = useMutation({
    mutationFn: async (data: SiteForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: () => {
      toast.success('Site settings updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update site settings')
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      return data
    },
    onSuccess: () => {
      passwordForm.reset()
      toast.success('Password changed successfully!')
    },
    onError: () => {
      toast.error('Failed to change password')
    },
  })

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data)
  }

  const onSiteSubmit = (data: SiteForm) => {
    updateSiteMutation.mutate(data)
  }

  const onPasswordSubmit = (data: PasswordForm) => {
    changePasswordMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Informations BM Agency</h2>
        <p className="text-gray-600">Manage your account and site configuration.</p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Site</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Password</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...profileForm.register('name')}
                      placeholder="Enter your full name"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      placeholder="Enter your email"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...profileForm.register('phone')}
                      placeholder="+237 222 123 456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...profileForm.register('location')}
                      placeholder="Yaoundé, Cameroon"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...profileForm.register('bio')}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  {profileForm.formState.errors.bio && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Configure your website settings and social media links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={siteForm.handleSubmit(onSiteSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      {...siteForm.register('siteName')}
                      placeholder="Camer Digital Agency"
                    />
                    {siteForm.formState.errors.siteName && (
                      <p className="text-sm text-red-600 mt-1">
                        {siteForm.formState.errors.siteName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...siteForm.register('contactEmail')}
                      placeholder="contact@camer-digital.cm"
                    />
                    {siteForm.formState.errors.contactEmail && (
                      <p className="text-sm text-red-600 mt-1">
                        {siteForm.formState.errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    {...siteForm.register('siteDescription')}
                    placeholder="Describe your agency and services..."
                    rows={3}
                  />
                  {siteForm.formState.errors.siteDescription && (
                    <p className="text-sm text-red-600 mt-1">
                      {siteForm.formState.errors.siteDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="siteKeywords">Site Keywords</Label>
                  <Input
                    id="siteKeywords"
                    {...siteForm.register('siteKeywords')}
                    placeholder="communication digitale, marketing digital, agence cameroun"
                  />
                  {siteForm.formState.errors.siteKeywords && (
                    <p className="text-sm text-red-600 mt-1">
                      {siteForm.formState.errors.siteKeywords.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      {...siteForm.register('contactPhone')}
                      placeholder="+237 222 123 456"
                    />
                    {siteForm.formState.errors.contactPhone && (
                      <p className="text-sm text-red-600 mt-1">
                        {siteForm.formState.errors.contactPhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...siteForm.register('address')}
                      placeholder="123 Avenue Kennedy, Yaoundé"
                    />
                    {siteForm.formState.errors.address && (
                      <p className="text-sm text-red-600 mt-1">
                        {siteForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Social Media Links</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebookUrl">Facebook</Label>
                      <Input
                        id="facebookUrl"
                        type="url"
                        {...siteForm.register('facebookUrl')}
                        placeholder="https://facebook.com/camerdigital"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagramUrl">Instagram</Label>
                      <Input
                        id="instagramUrl"
                        type="url"
                        {...siteForm.register('instagramUrl')}
                        placeholder="https://instagram.com/camerdigital"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        {...siteForm.register('linkedinUrl')}
                        placeholder="https://linkedin.com/company/camerdigital"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitterUrl">Twitter</Label>
                      <Input
                        id="twitterUrl"
                        type="url"
                        {...siteForm.register('twitterUrl')}
                        placeholder="https://twitter.com/camerdigital"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateSiteMutation.isPending}
                  >
                    {updateSiteMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Settings */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...passwordForm.register('currentPassword')}
                      placeholder="Enter your current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...passwordForm.register('newPassword')}
                      placeholder="Enter your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...passwordForm.register('confirmPassword')}
                      placeholder="Confirm your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your admin experience and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">
                    Receive notifications about new inquiries and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-500">
                    Get notified about important updates in real-time
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-save Forms</h4>
                  <p className="text-sm text-gray-500">
                    Automatically save form data as you type
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Compact Mode</h4>
                  <p className="text-sm text-gray-500">
                    Use a more compact layout to fit more content
                  </p>
                </div>
                <Switch />
              </div>

              <div className="pt-4 border-t">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
