const User = require('../models/User');
const mongodb = require('../db/connect');

const getAllUsers = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    // Fetch users from the database
    const db = mongodb.getDb();
    const users = await db.collection('users').find().toArray();

    // Respond with the user data
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);

    // Respond with an error message
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

module.exports = { 
  getAllUsers 
};