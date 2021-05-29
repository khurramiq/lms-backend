const { check, validationResult } = require("express-validator");

exports.validateCourseRequest = [
  check("survey").notEmpty().withMessage("Select survey is required"),  
  check("type").notEmpty().withMessage("Question type is required"),  
  check("name").notEmpty().withMessage("Question name is required"),  
  check("title").notEmpty().withMessage("Question title is required"),  
  check("valueName").notEmpty().withMessage("Question valueName is required"),  
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(200).json({ error: errors.array()[0].msg });
  }
  next();
};
