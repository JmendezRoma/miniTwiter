import { selectUserByRegistrationCodeModel } from '../../models/users/index.js';
import { updateUserActivationModel } from '../../models/users/index.js';

export const validateUserController = async (req, res, next) => {
  try {
    console.log('validateUserController');
    // Obtener el código de registro.
    const { registrationCode } = req.params;

    // Verificar si existe un usuario con ese código de registro.
    await selectUserByRegistrationCodeModel(registrationCode);
    // Activar el usuario.
    const result = await updateUserActivationModel(registrationCode);

    // Devolver una respuesta.
    res.status(201).send({
      status: 'ok',
      message: 'Usuario validado correctamente',
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};
