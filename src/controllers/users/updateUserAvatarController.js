import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
import { updateUserAvatarSchema } from '../../schemas/users/updateUserAvatarSchema.js';
import { updateAvatarUserService } from '../../services/users/updateAvatarUserService.js';

export const updateUserAvatarController = async (req, res, next) => {
  try {
    // Validar el body con Joi. Si files no existe devolvemos un objeto vacío.
    await validateSchemaUtil(updateUserAvatarSchema, req.files || {});

    // Obtenemos el id del usuario.
    const userId = req.user.id;

    // Guardamos el avatar en la carpeta de subida de archivos. Redimensionamos a un ancho de 100 píxeles.
    const avatarName = await updateAvatarUserService(
      userId,
      req.files.avatar,
      100
    );

    // Devolvemos el nombre del avatar.
    res.send({
      status: 'ok',
      message: 'Avatar actualizado',
      data: {
        avatar: avatarName,
      },
    });
  } catch (error) {
    next(error);
  }
};
