import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
  isActive?: boolean;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isHydrated: boolean;
  adminPermissions?: {
    services?: boolean;
    portfolio?: boolean;
    blog?: boolean;
    team?: boolean;
    testimonials?: boolean;
    products?: boolean;
    users?: boolean;
    settings?: boolean;
  };
}

/**
 * Hook to access authentication state and user data
 */
export const useAuth = (): AuthState => {
  const context = useAuthContext();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * Hook to check if current user has specific role(s)
 */
export const useHasRole = (roleOrRoles: string | string[]): boolean => {
  const { user } = useAuth();

  if (!user) return false;

  // Support both old single role and new roles array
  const userRoles = user.roles || (user.role ? [user.role] : []);

  if (Array.isArray(roleOrRoles)) {
    return roleOrRoles.some(role => userRoles.includes(role));
  }

  return userRoles.includes(roleOrRoles);
};

/**
 * Hook to check if current user has specific permission
 */
export const useHasPermission = (permission: string): boolean => {
  const { user } = useAuth();

  if (!user) return false;

  // Define permissions for each role
  const rolePermissions: Record<string, string[]> = {
    owner: [
      'manage_users',
      'manage_roles',
      'manage_all_content',
      'publish_content',
      'approve_content',
      'delete_content',
      'view_analytics',
      'manage_settings'
    ],
    admin: [
      'manage_users',
      'manage_roles',
      'manage_all_content',
      'publish_content',
      'approve_content',
      'delete_content',
      'view_analytics'
    ],
    editor: [
      'manage_own_content',
      'publish_own_content',
      'edit_others_content',
      'view_analytics'
    ],
    author: [
      'manage_own_content',
      'submit_for_approval'
    ]
  };

  const userRoles = user.roles || (user.role ? [user.role] : []);
  return userRoles.some(role => rolePermissions[role]?.includes(permission));
};
