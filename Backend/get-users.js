require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  roles: [String],
  adminPermissions: Object
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

async function getUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('_id name email roles adminPermissions');
    
    console.log('\n=== Available Users ===\n');
    users.forEach(user => {
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Roles: ${JSON.stringify(user.roles)}`);
      console.log(`Permissions: ${JSON.stringify(user.adminPermissions || {})}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getUsers();
