import joi from 'joi';
import { joiErrorMessages } from '../joiErrorMessages.js';

export const updateTweetSchema = joi.object({
  text: joi.string().min(1).max(280).required().messages(joiErrorMessages),
});
