const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); // Ensure this path is correct
const { validateUser, validateProduct } = require('../helpers/validate');
const validate = require('../middleware/middleware');

// Define routes
router.get('/', productsController.getAll); // Make sure this function exists in productsController
router.get('/:id', validateUser, validate, productsController.getSingle); 
router.post('/', validateProduct, validate, productsController.createProducts);
router.put('/:id', [validateUser, validateProduct], validate, productsController.updateProducts);
router.delete('/:id', validateUser, validate, productsController.deleteProducts);

module.exports = router;