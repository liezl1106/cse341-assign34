const { body, param } = require('express-validator');

const validateUsers = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('favoriteColor').optional().isString().withMessage('Favorite color must be a string'),
  body('birthday')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid contact ID'),
];

module.exports = {
  validateUsers,
  validateId,
};