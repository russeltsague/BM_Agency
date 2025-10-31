'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2, MoreHorizontal, Users, Shield, UserCheck, UserX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { UserRole } from '@/lib/permissions'

// Import API functions and types
import { usersAPI } from '@/lib/api'

// Define the User type based on the API response
type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserInput = {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'editor' | 'content_writer' | 'moderator' | 'viewer';
  isActive?: boolean;
};

// For form compatibility
type ExtendedUser = User & {
  role?: string;
};

import { toast } from 'sonner'

// User form schema
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['super_admin', 'admin', 'editor', 'content_writer', 'moderator', 'viewer'])
})
type UserForm = z.infer<typeof userSchema>

export default function SettingsUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ExtendedUser | null>(null);
  const queryClient = useQueryClient();

  // Fetch users
  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getAll,
  });
  
  // Check if the current user is a super admin
  const isSuperAdmin = true; // Default to true for now, implement proper auth check later

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  // Filter users based on search term
  const filteredUsers = (usersData?.data?.users || []).filter((user: ExtendedUser) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.roles || []).some(role => role?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

    // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: usersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create user';
      toast.error(errorMessage);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserInput> }) =>
      usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      setEditingUser(null);
      reset();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    },
  });

  const onCreateUser = (data: UserForm) => {
    createUserMutation.mutate(data)
  }

  const onEditUser = (data: UserForm) => {
    if (editingUser) {
      const updateData: Partial<UserInput> = {
        name: data.name,
        email: data.email,
        role: data.role as UserInput['role'],
      };
      
      // Only include password if it's not empty
      if (data.password) {
        updateData.password = data.password;
      }
      
      updateUserMutation.mutate({
        id: editingUser._id,
        data: updateData,
      });
    }
  }

  const handleEditUser = (user: ExtendedUser) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    // Use the first role if available, or default to 'viewer'
    const firstRole = user.roles?.[0];
    setValue('role', (['super_admin', 'admin', 'editor', 'content_writer', 'moderator', 'viewer'].includes(firstRole) 
      ? firstRole 
      : 'viewer') as UserInput['role']
    );
    setValue('password', ''); // Don't prefill password for security
    setIsEditDialogOpen(true);
  }

  const handleDeleteUser = (user: ExtendedUser) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = () => {
    if (deletingUser) {
      deleteUserMutation.mutate(deletingUser._id);
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      case 'moderator':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="h-4 w-4" />
      case 'admin':
        return <UserCheck className="h-4 w-4" />
      case 'editor':
        return <Edit className="h-4 w-4" />
      case 'moderator':
        return <UserX className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error loading users. Please try again later.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage user accounts and permissions</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Users</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
            </div>
            <Badge variant="outline" className="border-slate-200 dark:border-slate-600">
              {filteredUsers.length} users
            </Badge>
          </div>

          {/* Users Table */}
          <div className="rounded-md border border-slate-200 dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300">User</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-slate-600 dark:text-slate-400">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: User) => (
                    <TableRow key={user._id} className="border-slate-200 dark:border-slate-700">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.roles[0])} className="flex items-center space-x-1 w-fit">
                          {getRoleIcon(user.roles[0])}
                          <span className="capitalize">{user.roles[0]?.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-400 dark:text-green-400">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Create New User</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Add a new user to the system with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <Input
                {...register('name')}
                placeholder="Enter full name"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="Enter password"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <Select onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="content_writer">Content Writer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-slate-200 dark:border-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Edit User</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditUser)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <Input
                {...register('name')}
                placeholder="Enter full name"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password (leave blank to keep current)</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="Enter new password"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <Select value={watch('role')} onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="content_writer">Content Writer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-slate-200 dark:border-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Delete User</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {deletingUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{deletingUser.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{deletingUser.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-200 dark:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
