// Import joi
import joi from 'joi';

// Import joiErrorMessages
import { joiErrorMessages } from '../joiErrorMessages.js';

export const loginUserSchema = joi.object({
  email: joi.string().email().required().messages(joiErrorMessages),
  password: joi.string().min(6).required().messages(joiErrorMessages),
});
