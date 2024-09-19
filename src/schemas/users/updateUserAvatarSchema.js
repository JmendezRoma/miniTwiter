// Importar el módulo joi.
import joi from 'joi';

import { imgSchema } from '../imgSchema.js';

export const updateUserAvatarSchema = joi.object({
  avatar: imgSchema.required(),
});
