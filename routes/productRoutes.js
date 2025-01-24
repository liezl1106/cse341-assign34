const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { validateProducts, validateId } = require('../helpers/validate');
const validate = require('../middleware/validate');

router.get('/', productsController.getAll); // GET all products
router.get('/:id', validateId, validate, productsController.getSingle); // GET a single contact
router.post('/', validateContact, validate, productsController.createProducts); // POST a new contact
router.put('/:id', [...validateId, ...validateContact], validate, productsController.updateProducts); // PUT (update) a contact
router.delete('/:id', validateId, validate, productsController.deleteProducts); // DELETE a contact

module.exports = router;