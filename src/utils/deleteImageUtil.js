// Importar el módulo path.
import path from 'path';

// Importar el módulo fs/promises.
import fs from 'fs/promises';

export const deleteImageUtil = async (tweetsUserDir, image) => {
  try {
    // Formar la ruta de la imagen.
    const imgPath = path.join(tweetsUserDir, image);

    // Borrar la imagen.
    await fs.rm(imgPath);
    console.log('Imagen eliminada correctamente');
  } catch (error) {
    error.code = 'DELETE_IMAGE_ERROR';
    error.message = 'No se ha podido eliminar la imagen';
    throw error;
  }
};
