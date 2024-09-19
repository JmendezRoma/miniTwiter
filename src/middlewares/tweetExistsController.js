import { selectTweetByIdModel } from '../models/tweets/index.js';
import { notFoundError } from '../services/errorService.js';

export const tweetExistsController = async (req, res, next) => {
  try {
    // Obtener el id del tweet.
    const { tweetId } = req.params;

    // Comprobar si existe un tweet con el id proporcionado.
    const tweet = await selectTweetByIdModel(tweetId);

    // Si no se encuentra el tweet, lanzar un error.
    if (!tweet) {
      notFoundError('tweet');
    }

    // Pasar el control al siguiente middleware.
    next();
  } catch (error) {
    next(error);
  }
};
