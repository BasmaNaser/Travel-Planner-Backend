const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

const contactValidate = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full Name is required')
    .matches(/^[a-zA-Z]{3,20}(( )[a-zA-Z]{3,20}){1,4}$/)
    .withMessage('Please enter a valid Full Name (at least 2 words)'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(/^[a-z]{3,20}[0-9]{0,12}(@gmail\.com)$/).withMessage('Please enter a valid Email Address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3, max: 100 }).withMessage('Subject must be between 3 and 100 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 10000 }).withMessage('Message must be at least 10 characters long')
];

validateUpdateProfile = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty().withMessage('Full Name cannot be empty'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),

  body('about')
    .optional()
    .isString().withMessage('About section must be text')
    .isLength({ max: 1000 }).withMessage('About section cannot exceed 500 characters'),

  body('userLocation')
    .optional()
    .isString().withMessage('Location must be text'),

  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid Date of Birth (YYYY-MM-DD)'),
];

validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

module.exports = { validate, contactValidate ,validateUpdateProfile,validateChangePassword};