// Importamos las dependencias.
import express from 'express';

// Importamos los controladores.
import {
  deleteTweetController,
  getSingleTweetController,
  getTweetsController,
  getTweetsUserController,
  newTweetController,
  updateTweetController,
} from '../controllers/tweets/index.js';

// Importamos los middlewares.
import {
  authUserController,
  tweetExistsController,
  userExistsController,
} from '../middlewares/index.js';

// Creamos un router.
export const tweetRouter = express.Router();

// Crear un tweet.
tweetRouter.post('/tweets', authUserController, newTweetController);

// Obtener todos los tweets.
tweetRouter.get('/tweets', getTweetsController);

// Obtener los tweets de un usuario.
tweetRouter.get(
  '/tweets/user/:userId',
  userExistsController,
  getTweetsUserController
);

// Obtener un tweet en particular.
tweetRouter.get(
  '/tweets/:tweetId',
  tweetExistsController,
  getSingleTweetController
);

// Editar un tweet.
tweetRouter.put(
  '/tweets/:tweetId',
  authUserController,
  tweetExistsController,
  updateTweetController
);

// Borrar un tweet.
tweetRouter.delete(
  '/tweets/:tweetId',
  authUserController,
  tweetExistsController,
  deleteTweetController
);
