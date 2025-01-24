const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateUsers, validateId } = require('../helpers/validate');
const validate = require('../middleware/validate');

router.get('/', usersController.getAll); // GET all users
router.get('/:id', validateId, validate, usersController.getSingle); // GET a single contact
router.post('/', validateContact, validate, usersController.createUsers); // POST a new contact
router.put('/:id', [...validateId, ...validateContact], validate, usersController.updateUsers); // PUT (update) a contact
router.delete('/:id', validateId, validate, usersController.deleteUsers); // DELETE a contact

module.exports = router;