import { selectUserByIdModel } from '../../models/users/index.js';

export const getOwnUserController = async (req, res, next) => {
  try {
    // Obtenemos la id del usuario de la request.
    const { id } = req.user;

    // Buscamos el usuario en la base de datos. Si hemos llegado hasta aquí, el usuario existe.
    const user = await selectUserByIdModel(id);

    // Devolvemos el usuario.
    res.status(200).send({
      status: 'ok',
      message: 'Usuario obtenido',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
