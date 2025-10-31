const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define the User schema matching the actual model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  roles: {
    type: [String],
    enum: ['owner', 'admin', 'editor', 'author'],
    default: ['author']
  },
  permissions: {
    type: [String],
    default: []
  },
  adminPermissions: {
    services: { type: Boolean, default: false },
    portfolio: { type: Boolean, default: false },
    blog: { type: Boolean, default: false },
    team: { type: Boolean, default: false },
    testimonials: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: Date,
  passwordChangedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const sampleUsers = [
  {
    name: 'System Owner',
    email: 'owner@bmagency.com',
    password: 'Owner123!@#',
    roles: ['owner'],
    adminPermissions: {
      services: true,
      portfolio: true,
      blog: true,
      team: true,
      testimonials: true,
      users: true,
      settings: true,
      analytics: true
    }
  },
  {
    name: 'Content Editor',
    email: 'editor@bmagency.com',
    password: 'Editor123!@#',
    roles: ['editor'],
    adminPermissions: {
      services: true,
      portfolio: true,
      blog: true,
      team: true,
      testimonials: true,
      users: false,
      settings: false,
      analytics: true
    }
  },
  {
    name: 'Content Author',
    email: 'author@bmagency.com',
    password: 'Author123!@#',
    roles: ['author'],
    adminPermissions: {
      services: false,
      portfolio: false,
      blog: true,
      team: false,
      testimonials: false,
      users: false,
      settings: false,
      analytics: false
    }
  },
  {
    name: 'Marketing Manager',
    email: 'marketing@bmagency.com',
    password: 'Marketing123!@#',
    roles: ['editor'],
    adminPermissions: {
      services: true,
      portfolio: true,
      blog: true,
      team: true,
      testimonials: true,
      users: false,
      settings: false,
      analytics: true
    }
  },
  {
    name: 'Content Writer',
    email: 'writer@bmagency.com',
    password: 'Writer123!@#',
    roles: ['author'],
    adminPermissions: {
      services: false,
      portfolio: false,
      blog: true,
      team: false,
      testimonials: false,
      users: false,
      settings: false,
      analytics: false
    }
  }
];

// Role permissions mapping
const RolePermissions = {
  'owner': [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics',
    'manage_settings'
  ],
  'admin': [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics'
  ],
  'editor': [
    'manage_own_content',
    'publish_own_content',
    'edit_others_content',
    'view_analytics'
  ],
  'author': [
    'manage_own_content',
    'submit_for_approval'
  ]
};

async function createSampleUsers() {
  try {
    await connectDB();

    console.log('Creating sample users...');

    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        continue;
      }

      // Set permissions based on roles
      const permissions = userData.roles.flatMap(role => RolePermissions[role] || []);

      // Create user with proper password hashing
      const newUser = new User({
        ...userData,
        permissions
      });

      await newUser.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.roles.join(', ')}`);
    }

    console.log('\n🎉 Sample users created successfully!');
    console.log('\nLogin credentials:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.email} | ${user.password}`);
    });

    console.log('\nYou can now login with these accounts.');

  } catch (error) {
    console.error('Error creating sample users:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createSampleUsers();
