const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Invalid name. Only letters and spaces are allowed.",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
  }),
});

module.exports = { registerSchema };
