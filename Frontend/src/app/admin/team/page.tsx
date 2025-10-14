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
  Users,
  Edit,
} from 'lucide-react'
import { teamAPI } from '@/lib/api'
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

// Team form schema
const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  achievements: z.string().min(1, 'Achievements are required'),
  image: z.string().optional(),
})

type TeamForm = z.infer<typeof teamSchema>

interface TeamMember {
  _id: string
  name: string
  role: string
  description: string
  image?: string
  achievements: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminTeam() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
  })

  // Fetch team members
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      try {
        const response = await teamAPI.getAll()
        return Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Failed to fetch team members:', error)
        return []
      }
    },
  })

  // Ensure teamMembers is always an array
  const teamArray = Array.isArray(teamMembers) ? teamMembers : []

  // Filter team members based on search
  const filteredTeam = teamArray.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create team member mutation
  const createMutation = useMutation({
    mutationFn: async (data: TeamForm) => {
      const teamData = {
        name: data.name,
        role: data.role,
        description: data.description,
        achievements: data.achievements.split(',').map(a => a.trim()).filter(a => a.length > 0),
        image: data.image || 'https://via.placeholder.com/400x400/4B5563/9CA3AF?text=No+Image',
      }
      const response = await teamAPI.create(teamData)
      return response.data.teamMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] })
      setIsCreateModalOpen(false)
      reset()
      toast.success('Team member created successfully!')
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create team member')
    },
  })

  // Update team member mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TeamForm }) => {
      const teamData = {
        name: data.name,
        role: data.role,
        description: data.description,
        achievements: data.achievements.split(',').map(a => a.trim()).filter(a => a.length > 0),
        image: data.image || 'https://via.placeholder.com/400x400/4B5563/9CA3AF?text=No+Image',
      }
      const response = await teamAPI.update(id, teamData)
      return response.data.teamMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] })
      setIsEditModalOpen(false)
      setSelectedTeamMember(null)
      reset()
      toast.success('Team member updated successfully!')
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update team member')
    },
  })

  // Delete team member mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await teamAPI.delete(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] })
      setIsDeleteModalOpen(false)
      setSelectedTeamMember(null)
      toast.success('Team member deleted successfully!')
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete team member')
    },
  })

  const handleCreate = (data: TeamForm) => {
    createMutation.mutate(data)
  }

  const handleEdit = (member: TeamMember) => {
    setSelectedTeamMember(member)
    setValue('name', member.name)
    setValue('role', member.role)
    setValue('description', member.description)
    setValue('achievements', member.achievements.join(', '))
    setValue('image', member.image || 'https://via.placeholder.com/400x400/4B5563/9CA3AF?text=No+Image')
    setImagePreview(member.image || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image')
    setIsEditModalOpen(true)
  }

  const handleUpdate = (data: TeamForm) => {
    if (selectedTeamMember) {
      updateMutation.mutate({ id: selectedTeamMember._id, data })
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

  const openDeleteModal = (member: TeamMember) => {
    setSelectedTeamMember(member)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (selectedTeamMember) {
      deleteMutation.mutate(selectedTeamMember._id)
    }
  }

  const resetImagePreview = () => {
    setImagePreview('https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image')
    setValue('image', 'https://via.placeholder.com/400x400/4B5563/9CA3AF?text=No+Image')
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-slate-300 text-lg">Gérez les membres de votre équipe</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Users className="h-5 w-5" />
                <span>{filteredTeam.length} Membres</span>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un Membre
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
              placeholder="Rechercher des membres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Team Table */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Membres de l'Équipe ({filteredTeam.length})</CardTitle>
          <CardDescription className="text-slate-400">
            Gérez tous les membres de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 border-slate-700">
                    <TableHead className="text-slate-300 font-semibold">Photo</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Nom</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Rôle</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Date d'ajout</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Réalisations</TableHead>
                    <TableHead className="text-slate-300 font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTeam.map((member) => (
                      <motion.tr
                        key={member._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell className="w-20">
                          <img
                            src={member.image || 'https://via.placeholder.com/64x64/4B5563/9CA3AF?text=No+Image'}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full border border-slate-600"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          <div>
                            <div className="font-semibold text-lg">{member.name}</div>
                            <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                              {member.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{member.role}</TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.achievements?.slice(0, 2).map((achievement, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                {achievement}
                              </Badge>
                            ))}
                            {member.achievements && member.achievements.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                +{member.achievements.length - 2}
                              </Badge>
                            )}
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
                                onClick={() => handleEdit(member)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(member)}
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
            <DialogTitle className="text-white text-2xl">Add New Team Member</DialogTitle>
            <DialogDescription className="text-slate-300">
              Add a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-slate-300 text-lg font-medium">Member Photo</Label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={imagePreview || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image'}
                    alt="Member preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={resetImagePreview}
                  >
                    <Users className="h-4 w-4 text-slate-300" />
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
                    Choose Photo
                  </Label>
                  <p className="text-sm text-slate-400 mt-2">
                    Recommended: 400x400px, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-slate-300 font-medium">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Jean Dupont"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="text-slate-300 font-medium">Role/Position</Label>
                <Input
                  id="role"
                  {...register('role')}
                  placeholder="e.g., Directeur Général"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
                {errors.role && (
                  <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the team member's background and expertise..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="achievements" className="text-slate-300 font-medium">Achievements (comma-separated)</Label>
              <Input
                id="achievements"
                {...register('achievements')}
                placeholder="e.g., MBA HEC, 15 ans d'expérience, 50+ projets réussis"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
              {errors.achievements && (
                <p className="text-sm text-red-400 mt-1">{errors.achievements.message}</p>
              )}
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
              <Button type="submit" disabled={createMutation.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {createMutation.isPending ? 'Creating...' : 'Create Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Edit Team Member</DialogTitle>
            <DialogDescription className="text-slate-300">
              Update the team member information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-slate-300 text-lg font-medium">Member Photo</Label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={imagePreview || selectedTeamMember?.image || 'https://via.placeholder.com/128x128/4B5563/9CA3AF?text=No+Image'}
                    alt="Member preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={resetImagePreview}
                  >
                    <Users className="h-4 w-4 text-slate-300" />
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
                    Choose New Photo
                  </Label>
                  <p className="text-sm text-slate-400 mt-2">
                    Recommended: 400x400px, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-name" className="text-slate-300 font-medium">Full Name</Label>
                <Input
                  id="edit-name"
                  {...register('name')}
                  placeholder="e.g., Jean Dupont"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-role" className="text-slate-300 font-medium">Role/Position</Label>
                <Input
                  id="edit-role"
                  {...register('role')}
                  placeholder="e.g., Directeur Général"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
                {errors.role && (
                  <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-slate-300 font-medium">Description</Label>
              <Textarea
                id="edit-description"
                {...register('description')}
                placeholder="Describe the team member's background and expertise..."
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-achievements" className="text-slate-300 font-medium">Achievements (comma-separated)</Label>
              <Input
                id="edit-achievements"
                {...register('achievements')}
                placeholder="e.g., MBA HEC, 15 ans d'expérience, 50+ projets réussis"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
              {errors.achievements && (
                <p className="text-sm text-red-400 mt-1">{errors.achievements.message}</p>
              )}
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedTeamMember(null)
                  reset()
                  setImagePreview('')
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {updateMutation.isPending ? 'Updating...' : 'Update Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl">Delete Team Member</DialogTitle>
                <DialogDescription className="text-slate-300 mt-1">
                  This action cannot be undone. The team member will be permanently removed from your team.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-slate-700/50 rounded-lg p-4 my-4">
            <div className="flex items-center space-x-3">
              <img
                src={selectedTeamMember?.image || 'https://via.placeholder.com/48x48/4B5563/9CA3AF?text=No+Image'}
                alt={selectedTeamMember?.name}
                className="w-12 h-12 object-cover rounded-full border border-slate-600"
              />
              <div>
                <p className="text-white font-medium">{selectedTeamMember?.name}</p>
                <p className="text-slate-400 text-sm">{selectedTeamMember?.role}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Member
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
