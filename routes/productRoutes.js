const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); // Ensure this path is correct
const { validateProduct, validateId } = require('../helpers/validate');
const validate = require('../middleware/middleware');

// Define routes
router.get('/', productsController.getAll); // Make sure this function exists in productsController
router.get('/:id', validateId, validate, productsController.getSingle); 
router.post('/', validateProduct, validate, productsController.createProducts);
router.put('/:id', [validateId, validateProduct], validate, productsController.updateProducts);
router.delete('/:id', validateId, validate, productsController.deleteProducts);

module.exports = router;