// Role-based permissions and UI configurations
export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Define permissions for each role (matching backend)
export const RolePermissions = {
  [UserRole.OWNER]: [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics',
    'manage_settings'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics'
  ],
  [UserRole.EDITOR]: [
    'manage_own_content',
    'publish_own_content',
    'edit_others_content',
    'manage_portfolio',
    'manage_testimonials',
    'view_analytics'
  ],
  [UserRole.AUTHOR]: [
    'manage_own_content',
    'submit_for_approval'
  ],
  [UserRole.MODERATOR]: [
    'manage_own_content',
    'approve_content',
    'edit_others_content'
  ],
  [UserRole.VIEWER]: [
    'view_content'
  ]
} as const;

// Define which sidebar items each role can see
export const RoleSidebarItems = {
  [UserRole.OWNER]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_analytics' },
    { title: 'Services', href: '/admin/services', icon: 'Settings', permission: 'manage_all_content' },
    { title: 'Portfolio', href: '/admin/portfolio', icon: 'ImageIcon', permission: 'manage_all_content' },
    { title: 'Blog', href: '/admin/blog', icon: 'FileText', permission: 'manage_all_content' },
    { title: 'Team', href: '/admin/team', icon: 'Users', permission: 'manage_all_content' },
    { title: 'Testimonials', href: '/admin/testimonials', icon: 'Users', permission: 'manage_all_content' },
    { title: 'Users', href: '/admin/settings/users', icon: 'Users', permission: 'manage_users' },
    { title: 'Settings', href: '/admin/settings', icon: 'Settings', permission: 'manage_settings' },
  ],
  [UserRole.ADMIN]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_analytics' },
    { title: 'Services', href: '/admin/services', icon: 'Settings', permission: 'manage_all_content' },
    { title: 'Portfolio', href: '/admin/portfolio', icon: 'ImageIcon', permission: 'manage_all_content' },
    { title: 'Blog', href: '/admin/blog', icon: 'FileText', permission: 'manage_all_content' },
    { title: 'Team', href: '/admin/team', icon: 'Users', permission: 'manage_all_content' },
    { title: 'Testimonials', href: '/admin/testimonials', icon: 'Users', permission: 'manage_all_content' },
    { title: 'Users', href: '/admin/settings/users', icon: 'Users', permission: 'manage_users' },
  ],
  [UserRole.EDITOR]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_analytics' },
    { title: 'Portfolio', href: '/admin/portfolio', icon: 'ImageIcon', permission: 'manage_portfolio' },
    { title: 'Blog', href: '/admin/blog', icon: 'FileText', permission: 'edit_others_content' },
    { title: 'Testimonials', href: '/admin/testimonials', icon: 'Users', permission: 'manage_testimonials' },
    { title: 'My Articles', href: '/admin/articles/my-articles', icon: 'FileText', permission: 'manage_own_content' },
  ],
  [UserRole.AUTHOR]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_content' },
    { title: 'My Articles', href: '/admin/articles/my-articles', icon: 'FileText', permission: 'manage_own_content' },
    { title: 'Pending Approval', href: '/admin/dashboard/pending', icon: 'Clock', permission: 'submit_for_approval' },
  ],
  [UserRole.MODERATOR]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_content' },
    { title: 'Blog', href: '/admin/blog', icon: 'FileText', permission: 'edit_others_content' },
    { title: 'Pending Approval', href: '/admin/dashboard/pending', icon: 'Clock', permission: 'approve_content' },
  ],
  [UserRole.VIEWER]: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view_content' },
  ]
};

// Define quick actions for each role
export const RoleQuickActions = {
  [UserRole.OWNER]: [
    // Removed unwanted quick actions - these should appear as sidebar items instead
  ],
  [UserRole.ADMIN]: [
    // Removed unwanted quick actions - these should appear as sidebar items instead
  ],
  [UserRole.EDITOR]: [
    { title: 'New Article', href: '/admin/articles/create', icon: 'FileText' },
    { title: 'Add Project', href: '/admin/portfolio/create', icon: 'ImageIcon' },
    { title: 'Add Testimonial', href: '/admin/testimonials/create', icon: 'Users' },
    { title: 'My Articles', href: '/admin/articles/my-articles', icon: 'FileText' },
  ],
  [UserRole.AUTHOR]: [
    { title: 'New Article', href: '/admin/articles/create', icon: 'FileText' },
    { title: 'My Articles', href: '/admin/articles/my-articles', icon: 'FileText' },
  ],
  [UserRole.MODERATOR]: [
    { title: 'Review Articles', href: '/admin/dashboard/pending', icon: 'Clock' },
    { title: 'New Article', href: '/admin/articles/create', icon: 'FileText' },
  ],
  [UserRole.VIEWER]: []
};

// Helper function to check if user has permission
export function hasPermission(userRole: string, permission: string): boolean {
  // @ts-ignore - TypeScript inference issue with const assertion
  return RolePermissions[userRole as keyof typeof RolePermissions]?.includes(permission) || false;
}

// Helper function to check if user has admin permission for a specific feature
export function hasAdminPermission(user: { role: string; adminPermissions?: any }, feature: string): boolean {
  // First check if user has the basic role permission for admin features
  if (!hasPermission(user.role, 'manage_all_content') && !hasPermission(user.role, 'manage_users')) {
    return false;
  }

  // If user has granular admin permissions, check those
  if (user.adminPermissions && user.adminPermissions[feature] !== undefined) {
    return user.adminPermissions[feature] === true;
  }

  // For admin/super_admin roles, default to true for all features if no granular permissions set
  if (user.role === 'admin' || user.role === 'super_admin') {
    return true;
  }

  return false;
}

// Helper function to get allowed sidebar items for a role (with granular permissions)
export function getAllowedSidebarItems(user: { role: string; adminPermissions?: any }) {
  // @ts-ignore - TypeScript inference issue with const assertion
  const allItems = RoleSidebarItems[user.role as keyof typeof RoleSidebarItems] || [];

  return allItems.filter(item => {
    // Check basic role permission first
    if (!hasPermission(user.role, item.permission)) {
      return false;
    }

    // If this is an admin feature and user has granular permissions, check those
    if (user.adminPermissions && (item.href.includes('/admin/services') && item.href.includes('manage_all_content'))) {
      return hasAdminPermission(user, 'services');
    }
    if (user.adminPermissions && (item.href.includes('/admin/portfolio') && item.href.includes('manage_all_content'))) {
      return hasAdminPermission(user, 'portfolio');
    }
    if (user.adminPermissions && (item.href.includes('/admin/blog') && item.href.includes('manage_all_content'))) {
      return hasAdminPermission(user, 'blog');
    }
    if (user.adminPermissions && (item.href.includes('/admin/team') && item.href.includes('manage_all_content'))) {
      return hasAdminPermission(user, 'team');
    }
    if (user.adminPermissions && (item.href.includes('/admin/testimonials') && item.href.includes('manage_all_content'))) {
      return hasAdminPermission(user, 'testimonials');
    }
    if (user.adminPermissions && (item.href.includes('/admin/settings/users') && item.href.includes('manage_users'))) {
      return hasAdminPermission(user, 'users');
    }
    if (user.adminPermissions && (item.href.includes('/admin/settings') && item.href.includes('manage_settings'))) {
      return hasAdminPermission(user, 'settings');
    }

    return true;
  });
}

// Helper function to get quick actions for a role
export function getQuickActions(userRole: string) {
  // @ts-ignore - TypeScript inference issue with const assertion
  return RoleQuickActions[userRole as keyof typeof RoleQuickActions] || [];
}
