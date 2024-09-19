import { selectUserByIdModel } from '../models/users/index.js';
import { notFoundError } from '../services/errorService.js';

export const userExistsController = async (req, res, next) => {
  try {
    // Obtener el id del usuario. Ya sea desde el token o desde los parámetros de la URL.
    const userId = req.user?.id || req.params.userId;

    // Comprobar si existe un usuario con el id proporcionado.
    const user = await selectUserByIdModel(userId);

    // Si no se encuentra el usuario, lanzar un error.
    if (!user) {
      notFoundError('usuario');
    }

    // Pasar el control al siguiente middleware.
    next();
  } catch (error) {
    next(error);
  }
};
