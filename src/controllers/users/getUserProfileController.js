import { selectUserByIdModel } from '../../models/users/index.js';

export const getUserProfileController = async (req, res, next) => {
  try {
    // Obtenemos el id del usuario de los path params.
    const { userId } = req.params;

    // Obtenemos el usuario.
    const user = await selectUserByIdModel(userId);

    // Borramos las propiedades sensibles del usuario.
    delete user.email;
    delete user.password;
    delete user.registrationCode;

    // Enviamos el usuario.
    res.status(200).send({
      status: 'ok',
      message: 'Usuario obtenido',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
