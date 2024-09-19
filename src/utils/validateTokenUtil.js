// Importar jwt
import jwt from 'jsonwebtoken';

// Importar el error personalizado.
import { invalidCredentialsError } from '../services/errorService.js';

// Importar la clave secreta.
import { SECRET } from '../../env.js';

export const validateTokenUtil = async (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    invalidCredentialsError();
  }
};
