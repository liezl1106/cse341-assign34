const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  //#swagger.tags=['Products']
  const result = await mongodb.getDb().collection('products').find();
  result.toArray().then((products) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  });
};

const getSingle = async (req, res, next) => {
//#swagger.tags=['Products']
  const productsId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().collection('users').find({ _id: productsId });
  result.toArray().then((products) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products[0]);
  });
};

const createProducts = async (req, res, next) => {
//#swagger.tags=['Products']
  const products = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().collection('products').insertOne(products);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateProducts = async (req, res, next) => {
//#swagger.tags=['Products']
  const productsId = new ObjectId(req.params.id);
  const products = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().collection('products').replaceOne({ _id: productsId }, products);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the products.');
  }
};

const deleteProducts = async (req, res, next) => {
//#swagger.tags=['Users']
  const productsId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().collection('users').deleteOne({ _id: productsId });
  if (response.deletedCount > 0) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the products');
  }
};

module.exports = { 
  getAll,
  getSingle,
  createProducts,
  updateProducts,
  deleteProducts
};