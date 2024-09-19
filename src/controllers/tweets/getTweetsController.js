import { selectTweetsModel } from '../../models/tweets/index.js';

export const getTweetsController = async (req, res, next) => {
  try {
    // Obtener los tweets.
    const tweets = await selectTweetsModel();

    // Si no hay tweets, enviar un error.
    if (!tweets.length) {
      const error = new Error('No hay tweets');
      error.httpStatus = 404;
      error.code = 'TWEETS_NOT_FOUND';
      throw error;
    }

    // Enviar los tweets.
    res.status(200).send({
      status: 'ok',
      message: 'Tweets obtenidos',
      data: { tweets },
    });
  } catch (error) {
    next(error);
  }
};
