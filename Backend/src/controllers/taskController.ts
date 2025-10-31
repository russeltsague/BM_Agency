import { Request, Response } from 'express';
import Task, { TaskStatus, ITask } from '../models/Task';
import { User } from '../models/User';
import { logAction } from '../utils/logAction';

// Helper function to notify admins
async function notifyAdminsAboutNewTask(task: ITask) {
  try {
    const admins = await User.find({
      $or: [
        { role: 'admin' },
        { role: 'super-admin' }
      ]
    }).select('email');

    // Admins notified about new task
  } catch (error) {
    // Error notifying admins
  }
}

// Helper function to notify about task updates
async function notifyTaskUpdate(task: ITask, updatedBy: string) {
  try {
    const usersToNotify = [task.submittedBy];
    if (task.assignedTo) {
      usersToNotify.push(task.assignedTo);
    }

    const users = await User.find({
      _id: { $in: usersToNotify }
    }).select('email');

    // Users notified about task update
  } catch (error) {
    // Error notifying users
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const { title, description, type, referenceId } = req.body;
    const userRoles = req.user.roles || [];

    // Check if user is admin/owner - they can create tasks directly
    const isAdmin = userRoles.some(role =>
      ['admin', 'owner', 'super-admin'].includes(role.toLowerCase())
    );

    let initialStatus = TaskStatus.PENDING;
    let historyNote = 'Task created';

    if (isAdmin) {
      // Admins can create tasks directly as approved or completed
      initialStatus = TaskStatus.APPROVED;
      historyNote = 'Task created by admin';
    }

    const task = new Task({
      title,
      description,
      type,
      referenceId,
      submittedBy: req.user.id,
      status: initialStatus,
      history: [{
        status: initialStatus,
        changedBy: req.user.id,
        note: historyNote
      }]
    });

    await task.save();
    await logAction('Task', task._id.toString(), 'created', req.user.id, { isAdmin });

    // Only notify admins if this is an editor task (needs approval)
    if (!isAdmin) {
      notifyAdminsAboutNewTask(task);
    }

    res.status(201).json({
      status: 'success',
      data: { task },
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create task'
    });
  }
};

// Create task directly (admin only)
export const createAdminTask = async (req: Request, res: Response) => {
  try {
    const { title, description, type, referenceId, status = TaskStatus.APPROVED, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      type,
      referenceId,
      submittedBy: req.user.id,
      assignedTo,
      status,
      history: [{
        status,
        changedBy: req.user.id,
        note: 'Task created directly by admin'
      }]
    });

    await task.save();
    await logAction('Task', task._id.toString(), 'created', req.user.id, { status });

    res.status(201).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create task'
    });
  }
};
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      $or: [
        { submittedBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
    .sort('-updatedAt')
    .populate('submittedBy', 'name email')
    .populate('assignedTo', 'name email');

    res.json({
      status: 'success',
      results: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tasks'
    });
  }
};

// Update task status
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    // Add to history
    task.history.push({
      status,
      changedBy: req.user.id,
      note: note || `Status changed to ${status}`
    });

    task.status = status;
    task.updatedAt = new Date();

    if ([TaskStatus.COMPLETED, TaskStatus.APPROVED, TaskStatus.REJECTED].includes(status as TaskStatus)) {
      task.completedAt = new Date();
    }

    await task.save();
    await logAction('Task', task._id.toString(), 'status_updated', req.user.id, { status, note });

    // Notify users in the background
    notifyTaskUpdate(task, req.user.id);

    res.json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update task'
    });
  }
};

// Get all tasks (admin only)
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const tasks = await Task.find(query)
      .sort('-updatedAt')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      status: 'success',
      results: tasks.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      data: { tasks }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tasks'
    });
  }
};
