import joi from 'joi';
import { joiErrorMessages } from '../joiErrorMessages.js';

export const updateUserSchema = joi.object({
  username: joi.string().min(3).max(30).required().messages(joiErrorMessages),
  email: joi.string().email().required().messages(joiErrorMessages),
  bio: joi.string().min(0).max(150).messages(joiErrorMessages),
  hobbies: joi.string().min(0).max(100).messages(joiErrorMessages),
});
