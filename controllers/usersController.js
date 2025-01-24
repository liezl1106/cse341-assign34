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
  const usersId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().collection('users').find({ _id: usersId });
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users[0]);
  });
};

const createUsers = async (req, res, next) => {
//#swagger.tags=['Users']
  const users = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().collection('users').insertOne(users);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateUsers = async (req, res, next) => {
//#swagger.tags=['Users']
  const usersId = new ObjectId(req.params.id);
  const users = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().collection('users').replaceOne({ _id: usersId }, users);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
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