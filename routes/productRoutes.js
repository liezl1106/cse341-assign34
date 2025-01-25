const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); // Ensure this path is correct
const { validateProduct } = require('../helpers/validate');
const validate = require('../middleware/middleware');

// Routes for products operations
router.get('/', productsController.getAll); // Make sure this function exists in productsController
router.get('/:id', validate, productsController.getSingle); 
router.post('/', validateProduct, validate, productsController.createProducts);
router.put('/:id', [validateProduct], validate, productsController.updateProducts);
router.delete('/:id', validate, productsController.deleteProducts);

module.exports = router;