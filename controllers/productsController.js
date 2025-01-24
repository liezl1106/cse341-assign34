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
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('products').findOne({ _id: productId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err });
  }
};

const createProducts = async (req, res, next) => {
  //#swagger.tags=['Products']
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    };
    const response = await mongodb.getDb().collection('products').insertOne(product);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error('Failed to create product');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProducts = async (req, res, next) => {
  //#swagger.tags=['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    };
    const response = await mongodb.getDb().collection('products').replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      throw new Error('Failed to update product');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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