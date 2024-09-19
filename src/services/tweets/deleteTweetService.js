import {
  deleteTweetModel,
  selectTweetByIdModel,
} from '../../models/tweets/index.js';
import { notAuthorizedError } from '../errorService.js';

export const deleteTweetService = async (userId, tweetId) => {
  try {
    // Recuperar el tweet de la base de datos.
    const tweet = await selectTweetByIdModel(tweetId);

    // Comprobar si el userId es el mismo que el del tweet.
    if (tweet.userId !== userId) {
      notAuthorizedError();
    }

    // Eliminar el tweet de la base de datos.
    await deleteTweetModel(tweetId);

    return;
  } catch (error) {
    console.log('Error al eliminar el tweet', error);
    throw error;
  }
};
