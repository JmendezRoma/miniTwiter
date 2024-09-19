// Importar el módulo path.
import path from 'path';

// Importar el módulo sharp.
import sharp from 'sharp';

import { saveFileError } from '../errorService.js';

import { createPathIfNotExistsUtil } from '../../utils/createPathUtil.js';

import { UPLOADS_DIR } from '../../../env.js';
import { updateUserAvatarModel } from '../../models/users/updateUserAvatarModel.js';

export const updateAvatarUserService = async (id, img, width) => {
  try {
    // Ruta donde se guardará el archivo.
    const uploadsDir = path.join(
      process.cwd(),
      UPLOADS_DIR,
      'users',
      id.toString(),
      ''
    );
    console.log('uploadsDir', uploadsDir);

    // Creamos el directorio si no existe.
    await createPathIfNotExistsUtil(uploadsDir);

    // Crear un objeto Sharp con la imagen recibida.
    const imgSharp = sharp(img.data);

    // Redimensionar la imagen.
    imgSharp.resize(width);

    // Nombre de la imagen como uuid.
    const imgName = `${crypto.randomUUID()}.jpg`;
    console.log(imgName);

    // Actualizamos el avatar del usuario.
    await updateUserAvatarModel(id, imgName);

    //  Ruta de la imagen.
    const imgPath = path.join(uploadsDir, imgName);

    // Guardar la imagen.
    try {
      await imgSharp.toFile(imgPath);
    } catch (error) {
      saveFileError();
    }

    // Devolver el nombre de la imagen.
    return imgName;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
