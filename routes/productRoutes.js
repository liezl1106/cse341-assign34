const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); // Ensure this path is correct
const { validateProduct } = require('../helpers/validate');
const validate = require('../middleware/middleware');
const { isAuthenticated } = require("../middleware/authenticate");

// Routes for products operations
router.get('/', productsController.getAll); // Make sure this function exists in productsController
router.get('/:id', validate, productsController.getSingle); 
router.post('/', isAuthenticated, validateProduct, validate, productsController.createProducts);
router.put('/:id', isAuthenticated, [validateProduct], validate, productsController.updateProducts);
router.delete('/:id', isAuthenticated, validate, productsController.deleteProducts);

module.exports = router;