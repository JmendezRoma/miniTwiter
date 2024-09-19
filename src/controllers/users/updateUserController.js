import { updateUserSchema } from '../../schemas/users/updateUserSchema.js';
import { updateUserService } from '../../services/users/updateUserService.js';
import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';

export const updateUserController = async (req, res, next) => {
  try {
    // Como no vamos a editar información sensible, no vamos a pedir la contraseña.

    // Validar el body con Joi.
    await validateSchemaUtil(updateUserSchema, req.body);

    // Obtenemos el id del usuario.
    const userId = req.user.id;

    // Actualizamos el usuario en la base de datos.
    const user = await updateUserService(userId, req.body);
    // const user = await updateUserModel(userId, req.body);

    // Devolvemos el usuario actualizado.
    res.send({
      status: 'ok',
      message: 'Usuario actualizado',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
