# Task Management System - Role-Based Workflow

This system allows editors to submit tasks for admin approval and admins to create tasks directly without approval.

## Features

- **Role-Based Task Creation**: Editors submit tasks for approval, admins create tasks directly
- **Status Tracking**: Real-time status updates with complete history
- **Approval Workflow**: Only editor-submitted tasks need approval
- **Admin Direct Creation**: Admins can create tasks with any status immediately
- **Notification System**: Users are notified of status changes

## How It Works

### For Editors:
1. Submit tasks through the form
2. Tasks start as "pending" and require admin approval
3. Track progress and receive notifications
4. Cannot create tasks directly without approval

### For Admins:
1. Create tasks directly with any status (approved, completed, etc.)
2. Review and approve/reject editor submissions
3. View all tasks with filtering and search
4. Assign tasks to other users

## Backend Implementation

### Role-Based Task Creation Logic

```typescript
// In createTask controller
const isAdmin = userRoles.some(role =>
  ['admin', 'owner', 'super-admin'].includes(role.toLowerCase())
);

let initialStatus = TaskStatus.PENDING;
if (isAdmin) {
  initialStatus = TaskStatus.APPROVED; // Admins create approved tasks
}

// Only notify admins if editor task (needs approval)
if (!isAdmin) {
  notifyAdminsAboutNewTask(task);
}
```

### API Endpoints

#### For All Users:
- `POST /api/v1/tasks` - Create task (role-based status)
- `GET /api/v1/tasks/my-tasks` - Get user's tasks

#### For Admins Only:
- `POST /api/v1/tasks/admin-create` - Create task with custom status
- `GET /api/v1/tasks` - Get all tasks with filtering
- `PATCH /api/v1/tasks/:id/status` - Update task status

## Frontend Implementation

### Role-Based UI

The task submission form shows different options based on user role:

**For Editors:**
- Simple form with title, description, type
- Tasks automatically submitted for approval
- Clear messaging about approval process

**For Admins:**
- Advanced form with status selection
- Can set initial status (pending, approved, completed)
- Option to assign tasks to other users
- Direct task creation without approval

### Sample Data Creation

The sample script creates tasks with different creators and statuses:

```bash
node scripts/create-sample-tasks.js
```

This creates:
- 5 editor-submitted tasks (pending, in_review, approved, rejected)
- 2 admin-created tasks (approved, completed)
- Complete history tracking for each task

## Task Status Flow

### Editor Tasks:
```
Pending → In Review → Approved/Rejected
   ↓         ↓            ↓
   └─────────┴─────────── Completed
```

### Admin Tasks:
```
Created (Approved) → Completed
      ↓
   Assigned → In Progress → Completed
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install date-fns
   ```

2. **Create users and tasks:**
   ```bash
   cd Backend
   node scripts/create-sample-users.js
   node scripts/create-sample-tasks.js
   ```

3. **Start servers:**
   ```bash
   # Backend
   npm run dev

   # Frontend
   cd ../Frontend && npm run dev
   ```

4. **Access the system:**
   - Login as editor: `/tasks` or `/admin/tasks`
   - Login as admin: `/admin/tasks` (full management interface)

## Testing the Role-Based System

### As an Editor:
1. Login with editor credentials
2. Navigate to Tasks
3. Submit a new task
4. See it appears as "pending"
5. Track approval progress

### As an Admin:
1. Login with admin credentials
2. Navigate to Tasks → Create Task
3. Create task with "Approved" status
4. See it appears immediately as approved
5. Review pending editor tasks
6. Approve or reject them

## API Examples

### Editor Creates Task:
```json
POST /api/v1/tasks
{
  "title": "Write Blog Post",
  "description": "Create article about React 18",
  "type": "article"
}

Response: Status = "pending"
```

### Admin Creates Task:
```json
POST /api/v1/tasks/admin-create
{
  "title": "Server Maintenance",
  "description": "Schedule maintenance",
  "type": "other",
  "status": "approved"
}

Response: Status = "approved"
```

## Troubleshooting

### Common Issues:
1. **Role Detection**: Ensure users have correct roles in database
2. **Permission Errors**: Check authentication middleware
3. **Missing Tasks**: Verify task creation and database connection
4. **TypeScript Errors**: Ensure all functions are properly exported

### Debug Commands:
```bash
# Check user roles
mongo bm-agency --eval "db.users.find().pretty()"

# Check task statuses
mongo bm-agency --eval "db.tasks.aggregate([{\$group: {_id: '\$status', count: {\$sum: 1}}}])"
```
