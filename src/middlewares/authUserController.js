// importar los errores personalizados.
import { notAuthenticatedError } from '../services/errorService.js';

// importar las utilidades.
import { validateTokenUtil } from '../utils/validateTokenUtil.js';

export const authUserController = async (req, res, next) => {
  try {
    // Siempre debemos enviar el token a través de la propiedad "Authorization" de los headers.
    // Aunque la propiedad "Authorization" se escriba con "A" mayúscula, en node la recibimos
    // con la "a" minúscula.
    const { authorization } = req.headers;

    // Si no se envía el token, lanzamos un error.
    if (!authorization) {
      notAuthenticatedError();
    }

    // Variable que almacena la info del token.
    const tokenInfo = await validateTokenUtil(authorization);

    // Añadimos la info del token a la request en la propiedad "user".
    req.user = tokenInfo;

    // Pasamos el control al siguiente middleware.
    next();
  } catch (error) {
    next(error);
  }
};
