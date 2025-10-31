const mongoose = require('mongoose');
const Task = require('../src/models/Task');
const User = require('../src/models/User');
require('dotenv').config();
const sampleTasks = [
  {
    title: 'Review Article: "Getting Started with React 18"',
    description: 'Please review the article about React 18 features and provide feedback on content accuracy and clarity.',
    type: 'article',
    status: 'pending', // Editor submitted task
    createdByRole: 'editor'
  },
  {
    title: 'Create Social Media Graphics',
    description: 'Design graphics for our upcoming service launch including banners, posts, and story templates.',
    type: 'media',
    status: 'in_review', // Editor submitted, admin reviewing
    createdByRole: 'editor'
  },
  {
    title: 'Update Portfolio Case Study',
    description: 'Add the new e-commerce project to our portfolio with screenshots and project details.',
    type: 'other',
    status: 'approved', // Editor submitted, admin approved
    createdByRole: 'editor'
  },
  {
    title: 'Write Blog Post: "Modern Web Development trends"',
    description: 'Create a comprehensive blog post covering the latest trends in web development for 2024.',
    type: 'article',
    status: 'pending', // Editor submitted task
    createdByRole: 'editor'
  },
  {
    title: 'Design Landing Page Mockups',
    description: 'Create wireframes and mockups for the new client landing page project.',
    type: 'media',
    status: 'rejected', // Editor submitted, admin rejected
    createdByRole: 'editor'
  },
  {
    title: 'Server Maintenance Schedule',
    description: 'Plan and schedule routine server maintenance for the next quarter.',
    type: 'other',
    status: 'approved', // Admin created directly
    createdByRole: 'admin'
  },
  {
    title: 'Content Calendar Review',
    description: 'Review and approve the content calendar for Q1 2024.',
    type: 'article',
    status: 'completed', // Admin created and completed
    createdByRole: 'admin'
  }
];

async function createSampleTasks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bm-agency', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).lean();
    if (users.length === 0) {
      console.log('No users found. Please run create-sample-users.js first.');
      return;
    }

    // Get editor and admin users
    const editor = users.find(u => u.roles?.includes('editor')) || users[0];
    const admin = users.find(u => u.roles?.includes('admin')) || users[0];

    console.log(`Creating tasks for editor: ${editor.name} (${editor.email})`);
    console.log(`Admin user: ${admin.name} (${admin.email})`);

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Create sample tasks
    const tasksToCreate = sampleTasks.map((taskData, index) => {
      const createdBy = taskData.createdByRole === 'admin' ? admin : editor;

      let historyNote = 'Task created';
      if (taskData.createdByRole === 'admin') {
        historyNote = 'Task created by admin';
      }

      return {
        ...taskData,
        submittedBy: createdBy._id,
        history: [{
          status: taskData.status,
          changedBy: createdBy._id,
          note: historyNote
        }],
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
        updatedAt: new Date()
      };
    });

    const createdTasks = await Task.insertMany(tasksToCreate);
    console.log(`Created ${createdTasks.length} sample tasks`);

    // Update some tasks with more detailed history
    if (createdTasks.length >= 3) {
      // Update the first task (pending) to have approval history
      await Task.findByIdAndUpdate(createdTasks[0]._id, {
        status: 'in_review',
        history: [
          {
            status: 'pending',
            changedBy: editor._id,
            note: 'Task created'
          },
          {
            status: 'in_review',
            changedBy: editor._id,
            note: 'Submitted for review'
          }
        ]
      });

      // Update the second task (approved) to have full approval history
      await Task.findByIdAndUpdate(createdTasks[2]._id, {
        status: 'approved',
        history: [
          {
            status: 'pending',
            changedBy: editor._id,
            note: 'Task created'
          },
          {
            status: 'in_review',
            changedBy: editor._id,
            note: 'Submitted for review'
          },
          {
            status: 'approved',
            changedBy: admin._id,
            note: 'Approved for implementation'
          }
        ],
        completedAt: new Date()
      });

      // Update the rejected task
      await Task.findByIdAndUpdate(createdTasks[4]._id, {
        status: 'rejected',
        history: [
          {
            status: 'pending',
            changedBy: editor._id,
            note: 'Task created'
          },
          {
            status: 'in_review',
            changedBy: editor._id,
            note: 'Submitted for review'
          },
          {
            status: 'rejected',
            changedBy: admin._id,
            note: 'Rejected - needs more specific requirements'
          }
        ]
      });

      console.log('Updated task statuses and history');
    }

    console.log('Sample tasks created successfully!');
    console.log(`\nTask Summary by Status:`);
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    taskStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} tasks`);
    });

    console.log(`\nTask Summary by Creator Role:`);
    const roleStats = await Task.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'submittedBy',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: {
            $cond: [
              { $in: ['admin', 'owner', 'super-admin'] },
              'admin',
              'editor'
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    roleStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} tasks`);
    });

  } catch (error) {
    console.error('Error creating sample tasks:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createSampleTasks();
