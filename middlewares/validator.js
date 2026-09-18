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
    .isEmail().withMessage('Please enter a valid Email Address')
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
module.exports = { validate, contactValidate };