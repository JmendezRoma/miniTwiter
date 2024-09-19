import { selectTweetByIdModel } from '../../models/tweets/index.js';
import { notFoundError } from '../../services/errorService.js';

export const getSingleTweetController = async (req, res, next) => {
  try {
    // Obtener el id del tweet.
    const { tweetId } = req.params;

    // Obtener el tweet.
    const tweet = await selectTweetByIdModel(tweetId);

    // Responder con el tweet.
    res.status(200).send({
      status: 'Ok',
      message: 'Tweet obtenido.',
      data: { tweet },
    });
  } catch (error) {
    next(error);
  }
};
