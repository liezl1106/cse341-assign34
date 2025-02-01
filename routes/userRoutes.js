const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateUser } = require('../helpers/validate'); // Using validateUser correctly
const validate = require('../middleware/middleware');
const { isAuthenticated } = require("../middleware/authenticate");

// Routes for user operations
router.get('/', usersController.getAll); // GET all users
router.get('/:id', validate, usersController.getSingle); // GET a single user by ID
router.post('/', isAuthenticated, validateUser, validate, usersController.createUsers); // POST a new user
router.put('/:id', isAuthenticated, validateUser, validate, usersController.updateUsers); // PUT (update) a user by ID
router.delete('/:id', isAuthenticated, validate, usersController.deleteUsers); // DELETE a user by ID

module.exports = router;