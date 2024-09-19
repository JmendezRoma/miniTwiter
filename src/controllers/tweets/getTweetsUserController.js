import { selectTweetsByUserIdModel } from '../../models/tweets/index.js';

export const getTweetsUserController = async (req, res, next) => {
  try {
    // Obtenemos el usuario de los parámetros.
    const { userId } = req.params;

    // Obtenemos los tweets.
    const tweets = await selectTweetsByUserIdModel(userId);

    // Si no hay tweets, enviamos un error.
    if (!tweets.length) {
      const error = new Error('Aun no tiene tweets');
      error.httpStatus = 404;
      error.code = 'TWEETS_NOT_FOUND';
      throw error;
    }

    // Enviamos los tweets.
    res.status(200).send({
      status: 'Ok',
      message: 'Tweets obtenidos',
      data: { tweets },
    });
  } catch (error) {
    next(error);
  }
};
