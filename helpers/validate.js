const { check, validationResult } = require('express-validator');

// Validate User
const validateUser = [
  check('email').isEmail().withMessage('Enter a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate Product
const validateProduct = [
  check('name').notEmpty().withMessage('Product name is required'),
  check('description').notEmpty().withMessage('Product description is required'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  check('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Export validation middleware
module.exports = { 
    validateUser, 
    validateProduct 
};
