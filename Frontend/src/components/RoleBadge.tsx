import { UserRole } from '@/lib/permissions'

interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-900/30 text-purple-400 border-purple-400/30'
      case 'admin':
        return 'bg-red-900/30 text-red-400 border-red-400/30'
      case 'editor':
        return 'bg-blue-900/30 text-blue-400 border-blue-400/30'
      case 'author':
        return 'bg-green-900/30 text-green-400 border-green-400/30'
      case 'moderator':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30'
      case 'viewer':
        return 'bg-gray-900/30 text-gray-400 border-gray-400/30'
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-400/30'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner'
      case 'admin':
        return 'Admin'
      case 'editor':
        return 'Editor'
      case 'author':
        return 'Author'
      case 'moderator':
        return 'Moderator'
      case 'viewer':
        return 'Viewer'
      default:
        return role
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleStyles(role)} ${className}`}>
      {getRoleDisplayName(role)}
    </span>
  )
}
