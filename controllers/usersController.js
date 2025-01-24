const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  //#swagger.tags=['Users']
  const result = await mongodb.getDb().collection('users').find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  });
};

const getSingle = async (req, res, next) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('users').findOne({ _id: userId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
};

const createUsers = async (req, res, next) => {
  //#swagger.tags=['Users']
  try {
    const user = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    };
    const response = await mongodb.getDb().collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error('Failed to create user');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUsers = async (req, res, next) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    };
    const response = await mongodb.getDb().collection('users').replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      throw new Error('Failed to update user');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUsers = async (req, res, next) => {
//#swagger.tags=['Users']
  const usersId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().collection('users').deleteOne({ _id: usersId });
  if (response.deletedCount > 0) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user');
  }
};

module.exports = { 
  getAll,
  getSingle,
  createUsers,
  updateUsers,
  deleteUsers
};