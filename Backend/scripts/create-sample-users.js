const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Define a simple User schema for this script
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: [String],
  role: String,
  isActive: Boolean
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

const sampleUsers = [
  {
    name: 'System Owner',
    email: 'owner@bmagency.com',
    password: 'owner123',
    roles: ['owner'],
    role: 'owner'
  },
  {
    name: 'Content Editor',
    email: 'editor@bmagency.com',
    password: 'editor123',
    roles: ['editor'],
    role: 'editor'
  },
  {
    name: 'Content Author',
    email: 'author@bmagency.com',
    password: 'author123',
    roles: ['author'],
    role: 'author'
  },
  {
    name: 'Marketing Manager',
    email: 'marketing@bmagency.com',
    password: 'marketing123',
    roles: ['editor'],
    role: 'editor'
  },
  {
    name: 'Junior Writer',
    email: 'writer@bmagency.com',
    password: 'writer123',
    roles: ['author'],
    role: 'author'
  }
];

const createSampleUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.name} (${userData.email})`);

        // Update roles if needed
        if (!existingUser.roles.includes(userData.roles[0])) {
          existingUser.roles = userData.roles;
          await existingUser.save();
          console.log(`🔄 Updated roles for: ${userData.name} (${userData.email})`);
        }
      }
    }

    // Show summary
    console.log('\n📊 User Creation Summary:');
    for (const userData of sampleUsers) {
      const user = await User.findOne({ email: userData.email });
      console.log(`   ${userData.role.padEnd(10)} | ${userData.email.padEnd(25)} | ${userData.name}`);
    }

    console.log('\n✅ Sample users creation completed successfully!');
    console.log('\n🔑 Login Credentials:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.email} | ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample users:', error);
    process.exit(1);
  }
};

createSampleUsers();
