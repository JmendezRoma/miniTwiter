import { imgSchema } from '../../schemas/imgSchema.js';
import { updateTweetSchema } from '../../schemas/tweets/updateTweetSchema.js';
import { updateTweetService } from '../../services/tweets/updateTweetService.js';
import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';

export const updateTweetController = async (req, res, next) => {
  try {
    // Obtener el id del usuario.
    const userId = req.user.id;

    // Obtener el id del tweet.
    const { tweetId } = req.params;

    // Obtener el texto del tweet.
    const { text } = req.body;

    // Validar el texto con Joi.
    await validateSchemaUtil(updateTweetSchema, { text });

    // Obtener la imagen del tweet.
    const image = req.files?.image;

    // Validar la imagen si existe con imgSchema.
    if (image) {
      await validateSchemaUtil(imgSchema, image);
    }

    // Actualizar el tweet.
    const tweet = await updateTweetService(userId, tweetId, text, image);

    // Enviar una respuesta de éxito.
    res.status(200).send({
      status: 'ok',
      message: 'Tweet actualizado',
      data: { tweet },
    });
  } catch (error) {
    next(error);
  }
};
