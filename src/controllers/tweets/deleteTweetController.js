import { deleteTweetService } from '../../services/tweets/deleteTweetService.js';

export const deleteTweetController = async (req, res, next) => {
  try {
    // Obtener el id del usuario.
    const userId = req.user.id;

    // Obtener el id del tweet.
    const { tweetId } = req.params;

    // Eliminar el tweet.
    await deleteTweetService(userId, tweetId);

    res.status(200).send({
      status: 'ok',
      message: 'Tweet eliminado',
    });
  } catch (error) {
    next(error);
  }
};
