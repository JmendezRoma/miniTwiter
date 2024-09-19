// Importar el módulo path.
import path from 'path';

// Importar el módulo sharp.
import sharp from 'sharp';

import { saveFileError } from '../errorService.js';

import { createPathIfNotExistsUtil } from '../../utils/createPathUtil.js';

import { insertTweetModel } from '../../models/tweets/index.js';

import { UPLOADS_DIR } from '../../../env.js';

export const insertTweetService = async (userId, text, image) => {
  try {
    // Creamos una id para el tweet.
    const tweetId = crypto.randomUUID();

    // Creamos un nombre para la imagen si existe.
    let imgName = image && `${crypto.randomUUID()}.jpg`;

    // Insertamos el tweet en la base de datos.
    const tweet = await insertTweetModel(tweetId, userId, text, imgName);

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
    console.log('Error al insertar el tweet', error);
    throw error;
  }
};
