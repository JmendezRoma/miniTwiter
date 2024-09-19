import { imgSchema } from '../../schemas/imgSchema.js';
import { newTweetSchema } from '../../schemas/tweets/newTweetSchema.js';
import { insertTweetService } from '../../services/tweets/insertTweetService.js';
import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';

export const newTweetController = async (req, res, next) => {
  try {
    // Obtengo la id del usuario.
    const userId = req.user.id;

    // Obtener el cuerpo de la petición.
    const { text } = req.body;

    // Validar el body con el esquema newUserSchema.
    await validateSchemaUtil(newTweetSchema, { text });

    // Obtener la imagen.
    const image = req.files?.image;

    // Validar la imagen si existe con imgSchema.
    if (image) {
      await validateSchemaUtil(imgSchema, image);
    }

    // Insertar el tweet en la base de datos.
    const tweet = await insertTweetService(userId, text, image);

    // Responder al cliente.
    res.status(201).send({
      status: 'ok',
      message: 'Tweet creado',
      data: { tweet },
    });
  } catch (error) {
    next(error);
  }
};
