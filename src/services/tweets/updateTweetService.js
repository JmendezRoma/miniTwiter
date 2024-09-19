// Importar el módulo path.
import path from 'path';

// Importar el módulo sharp.
import sharp from 'sharp';

import { saveFileError } from '../errorService.js';

import { createPathIfNotExistsUtil } from '../../utils/createPathUtil.js';

import { UPLOADS_DIR } from '../../../env.js';

import {
  selectTweetByIdModel,
  updateTweetModel,
} from '../../models/tweets/index.js';
import { notAuthorizedError } from '../errorService.js';
import { deleteImageUtil } from '../../utils/deleteImageUtil.js';

export const updateTweetService = async (userId, tweetId, text, image) => {
  try {
    // Recuperar el tweet de la base de datos.
    const oldTweet = await selectTweetByIdModel(tweetId);

    // Comprobar si el userId es el mismo que el del tweet.
    if (oldTweet.userId !== userId) {
      notAuthorizedError();
    }

    // Creamos un nombre para la imagen si existe.
    let imgName = image && `${crypto.randomUUID()}.jpg`;

    // Actualizar el tweet en la base de datos.
    const tweet = await updateTweetModel(tweetId, text, imgName);

    // Si hay tweet e imagen, creamos el directorio si no existe
    if (tweet && image) {
      // Ruta donde se guardará el archivo.
      const uploadsDir = path.join(
        process.cwd(),
        UPLOADS_DIR,
        'tweets',
        userId.toString(),
        ''
      );

      await createPathIfNotExistsUtil(uploadsDir);

      // Si existe una imagen anterior, la eliminamos.
      if (oldTweet.image) await deleteImageUtil(uploadsDir, oldTweet.image);

      // Crear un objeto Sharp con la imagen recibida.
      const imgSharp = sharp(image.data);

      // Redimensionar la imagen.
      imgSharp.resize(500);

      // Ruta de la imagen.
      const imgPath = path.join(uploadsDir, imgName);

      // Guardar la imagen.
      try {
        await imgSharp.toFile(imgPath);
      } catch (error) {
        saveFileError();
      }
    }

    return tweet;
  } catch (error) {
    console.log('Error al actualizar el tweet', error);
    throw error;
  }
};
